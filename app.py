
from flask import Flask, request, jsonify, make_response   
from flask_sqlalchemy import SQLAlchemy
# from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid 
import jwt
import datetime
from functools import wraps
from sqlalchemy.sql import exists
from sqlalchemy.exc import SQLAlchemyError  

app = Flask(__name__) 

app.config['SECRET_KEY']='Th1s1ss3cr3t'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://phpmyadmin:Root!123@127.0.0.1/foodapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True 

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
        # checkIfUser = User.query.filter_by(email=data['email']).count()
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

    return jsonify({'message': 'Registration successfully','token':token,'code':200})


@app.route('/login', methods=['GET', 'POST'])  
def login_user():
   
   auth = request.get_json()   

   if not auth or not auth['email'] or not auth['password']:  
      return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})    

   user = Users.query.filter_by(email=auth['email']).first()   
   if check_password_hash(user.password, auth['password']):  
      token = jwt.encode({'public_id': user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=300)}, app.config['SECRET_KEY'], algorithm="HS256")  
    
      return jsonify({'token' : token}) 
   #   return jsonify({'token' : token})

   return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})

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
        order.givenPaymen = data['givenPaymen']
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        
        return jsonify({'message':error,'code':403})

    return jsonify({'message': 'Notification send to user.','code':200})



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


    

if  __name__ == '__app__':  
     app.run(debug=True) 
    