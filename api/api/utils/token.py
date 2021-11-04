import jwt
import os
import datetime


def generate_token(user_id):
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=30)
    jwt_token = jwt.encode({'user_id': user_id, 'exp': expire}, os.environ.get(
        'SECRET_KEY', 'dev'))
    return jwt_token

def check_token(token):
    try:
        data = jwt.decode(token, os.environ.get('SECRET_KEY', 'dev'), algorithms=["HS256"])
    except Exception as err:
        return None, err
    return data, None
    

