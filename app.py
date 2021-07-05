
from flask import Flask, request, jsonify, make_response   
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin
# from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid 
import jwt
import datetime
from functools import wraps
from sqlalchemy.sql import exists
from sqlalchemy.exc import SQLAlchemyError  
import werkzeug
from base64 import b64encode
from flask_socketio import SocketIO
import json
app = Flask(__name__) 

app.config['SECRET_KEY']='Th1s1ss3cr3t'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://phpmyadmin:Root!123@127.0.0.1/foodapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True 
cors = CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)   

class Roles(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255))

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    public_id = db.Column(db.String(255)) 
    user_name = db.Column(db.String(50), unique=False, nullable=False)  
    email = db.Column(db.String(50), unique=True, nullable=False) 
    contact = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255))
    

    role_id = db.Column(db.Integer(), db.ForeignKey('roles.id'))
    role = db.relationship("Roles", backref=db.backref("roles", uselist=False)) 
    orders = db.relationship('Orders',backref='creater')


class Menues(db.Model):
    __tablename__ = 'menues'
    id = db.Column(db.Integer(), primary_key=True)
    menue = db.Column(db.String(100)) 
    description = db.Column(db.String(250))
    price = db.Column(db.Float())
    qty = db.Column(db.Integer())




class Orders(db.Model):
    __tablename__ = 'orders'  
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Text(), unique=False, nullable=False)   
    isNoted = db.Column(db.Integer(),nullable=False,default=0) 
    isBooked = db.Column(db.Integer(),nullable=False,default=0)
    total = db.Column(db.Integer(),nullable=False,default=0)
    givenPayment = db.Column(db.Integer(),nullable=False,default=0) 
    role_id = db.Column(db.Integer(), db.ForeignKey('roles.id'))
    creater_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    date = db.Column(db.DateTime(), nullable=True)
    users = db.relationship("Users", backref=db.backref("users", uselist=False))
   

def token_required(f):
   @wraps(f)  
   def decorated_function(*args, **kwargs):

      token = None 

      if 'x-access-tokens' in request.headers:
         token = request.headers['x-access-tokens'] 


      if not token:
         return jsonify({'message': 'a valid token is missing'})   


      try:
         data = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256") 
         current_user = Users.query.filter_by(public_id=data['public_id']).first() 
          
      except:
         return jsonify({'message': 'token is invalid'})  

   
      return f(current_user, *args,  **kwargs)  
   return decorated_function


def onlyChef(f):
    @wraps(f)  
    def decorated_function(*args, **kwargs):

        token = None 

        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens'] 


        if not token:
            return jsonify({'message': 'a valid token is missing'})   


        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256") 
            current_user = Users.query.filter_by(public_id=data['public_id']).first() 

        except:
            return jsonify({'message': 'token is invalid'})  
        if(current_user.role.name=='chef'):
            return f(current_user, *args,  **kwargs) 
        else:
            return jsonify({'message': 'Your are not a chef'})
    return decorated_function 

@app.route('/register', methods=['POST'])
def signup_user():

      
    if request.method == 'POST':
        data = request.get_json()
        checkIfUser = Users.query.filter_by(email=data['email']).first()
        role = Roles.query.filter_by(id=data['role']).first()

        
            
        if checkIfUser == None:
            hashed_password = generate_password_hash(data['password'], method='sha256')
            print(hashed_password)
            public_uuid = str(uuid.uuid4())
            try:
                new_user = Users(public_id=public_uuid, user_name=data['username'], password=hashed_password, email=data['email'],contact=data['contact'],role_id=data['role']) 
                db.session.add(new_user)  
                db.session.commit()


            except SQLAlchemyError as e:

                error = str(e.__dict__['orig'])
            
                return jsonify({'message':error,'code':403})
            
            token = jwt.encode({'public_id': public_uuid, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=300)}, app.config['SECRET_KEY'], algorithm="HS256")   
            return jsonify({'message': 'Registration successfully','token':token,'user_token':role.name,'code':200})
        return make_response('Email Already Exist',  304, {'WWW.Authentication': 'Basic realm: "login required"'})


@app.route('/login', methods=['GET', 'POST'])  
def login_user():
   
   auth = request.get_json()   

   if not auth or not auth['email'] or not auth['password']:  
      return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})    

   user = Users.query.filter_by(email=auth['email']).first()   
   if user != None:
       if check_password_hash(user.password, auth['password']):
            token = jwt.encode({'public_id': user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=300)}, app.config['SECRET_KEY'], algorithm="HS256")  
            role = user.role.name
            return jsonify({'token' : token,'user_token':role,'code':200})
        
 
   #   return jsonify({'token' : token})

       return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})
   return make_response('User not Found',  401, {'WWW.Authentication': 'Basic realm: "login required"'})
@app.route('/checkOrders', methods=['GET', 'POST']) 
@onlyChef
def checkOrders(current_user):
    orders = Orders.query.filter_by(isNoted=0).all()  

    output = [] 

    for order in orders:
        order_data = {}  
        order_data['order'] = order.order 
        order_data['isNoted'] = order.isNoted 
        order_data['isBooked'] = order.isBooked  
        order_data['total'] = order.total
        order_data['givenPayment'] = order.givenPayment
        # order_data['orderBy'] = order.role.name
        order_data['userName'] = order.users.user_name
        order_data['date'] = order.date
        output.append(order_data)  
    return jsonify({'list_of_orders' : output})


@app.route('/orderBook', methods=['GET', 'POST']) 
@onlyChef
def orderBook(current_user):
    data = request.get_json()
    try:
        order = Orders.query.filter_by(id=data['order_id']).first()
        order.isNoted = data['isNoted']
        order.isBooked = data['isBooked']
        order.total = data['total']
        # socketio.emit('getDoctorListSocket', {'room_list': room_list})
        order.givenPaymen = data['givenPaymen']
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        
        return jsonify({'message':error,'code':403})

    return jsonify({'message': 'Notification send to user.','code':200})



@app.route('/createMenue', methods=['GET', 'POST']) 
@onlyChef
def createMenue(current_user):
    data = request.get_json()
    try:
        create_menues = Menues(menue=data['menue'],description=data['description'],qty=data['qty'],price=data['price'])
        db.session.add(create_menues)  
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        
        return jsonify({'message':error,'code':403})
    return jsonify({'message': 'Menue Created successfully','code':200})



@app.route('/bookOrder', methods=['GET', 'POST']) 
@token_required
def bookOrder(current_user):
    data = request.get_json()
    try:
        create_order = Orders(order=data['order'],isNoted=0,isBooked=0,total=0,givenPayment=0,role_id=current_user.role_id,creater_id=current_user.id,date='2021-06-21')
        db.session.add(create_order)  
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        
        return jsonify({'message':error,'code':403})
    return jsonify({'message': 'Order Created successfully','code':200})

@app.route('/getMenuesList', methods=['GET', 'POST']) 
@token_required
def getMenuesList(current_user):
    menues = Menues.query.all()  

    output = [] 

    for menue in menues:
        menue_data = {}  
        menue_data['menue'] = menue.menue 
        menue_data['id'] = menue.id 
        menue_data['price'] = menue.price  
        menue_data['description'] = menue.description
        
        output.append(menue_data)  
    return jsonify({'list_of_menues' : output})
    

if  __name__ == '__app__':  
     app.run(debug=True) 
    
