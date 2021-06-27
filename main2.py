from flask import Flask, request, jsonify, make_response, request, render_template, session, flash
import jwt
from datetime import datetime, timedelta
from functools import wraps


app = Flask(__name__)


app.config['SECRET_KEY'] = 'YOU_SECRET_KEY'
# how to get a secret key
# In your command line >>> access Python >>> then type:

# OS Approach
# import os
# os.urandom(14)

# UUID Approach
# import uuid
# uuid.uuid4().hex

# Secrets [ only for Python 3.6 + ]
#import secrets
# secrets.token_urlsafe(14)


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
            token2 = token
            # current_user = Users.query.filter_by(public_id=data['public_id']).first() 
          
        except:
            return jsonify({'message': 'token is invalid'})  

        return f(data,token2, *args,  **kwargs)  
    return decorated_function


@app.route('/')
def home():
    if not session.get('logged_in'):
        return render_template('login.html')
    else:
        return 'logged in currently'

# Just to show you that a public route is available for everyone


@app.route('/public')
def public():
    return 'For Public'

# auth only if you copy your token and paste it after /auth?query=XXXXXYour TokenXXXXX
# Hit enter and you will get the message below.


@app.route('/auth')
@token_required
def auth(data,token2):
    return jsonify({'token': data,'token2':token2})

# Login page


@app.route('/login2', methods=['POST'])
def login():
    auth = request.authorization
    if auth.username and auth.password:
        session['logged_in'] = True

        token = jwt.encode({
            'user': auth.username,
            # don't foget to wrap it in str function, otherwise it won't work [ i struggled with this one! ]
            'expiration': str(datetime.utcnow() + timedelta(seconds=3660))
        },
            app.config['SECRET_KEY'],algorithm="HS256")
        return jsonify({'token': token})
    else:
        return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "Authentication Failed "'})




if __name__ == "__main__":
    app.run(debug=True)