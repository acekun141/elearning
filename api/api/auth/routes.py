import datetime
import redis

from flask import jsonify

from api import db

from api.auth import auth as bp
from api.auth.dto import AuthDTO, VerifyMailDTO, SignUpDTO
from api.user.models import UserDetail, UserInfo

from api.utils.code import generate_code
from api.utils.mail import send_mail
from api.utils.middlewares import error_response, validate_request
from api.utils.token import generate_token


@bp.route('/signin', methods=['POST'])
@validate_request(AuthDTO)
def signin(data):
    user = UserInfo.query.filter_by(email=data['email']).first()
    if not user:
        return error_response('Email or Password is incorrect') 
    if not user.check_password(data['password']):
        return error_response('Email or Password is incorrect') 
    if user.deactivate:
        return "", 401

    token = generate_token(user.id)
    return jsonify({ 'access_token': token })


@bp.route('/signup', methods=['POST'])
@validate_request(SignUpDTO)
def signup(data):
    user = UserInfo.query.filter_by(email=data['email']).first()
    if user:
        return error_response('User has already existed')
    code = generate_code()
    redis_server = redis.Redis(host="redis", port=6379)
    redis_server.hmset(
        code, {'email': data['email'], 'password': data['password'], 'first_name': data['first_name'], 'last_name': data['last_name']})
    redis_server.expire(code, 60*5)
    send_mail(code, data['email'])
    return "", 201

@bp.route('/verify', methods=['POST'])
@validate_request(VerifyMailDTO)
def verify_mail(data):
    redis_server = redis.Redis(host="redis", port=6379)
    email = redis_server.hget(data['code'], 'email')
    password = redis_server.hget(data['code'], 'password')
    first_name = redis_server.hget(data['code'], 'first_name')
    last_name = redis_server.hget(data['code'], 'last_name')
    if not email or not password or not first_name or not last_name:
        return error_response('Verify code is incorrect')
    if UserInfo.query.filter_by(email=email).first():
        return "", 400
    user = UserInfo()
    user.email = email.decode('utf-8')
    user.set_password(password.decode('utf-8'))
    user.create_at = datetime.datetime.now()
    user.role = 'user'
    db.session.add(user)
    db.session.commit()
    user_detail = UserDetail()
    user_detail.first_name = first_name
    user_detail.last_name = last_name
    user = UserInfo.query.filter_by(email=email).first()
    user_detail.user_id = user.id
    db.session.add(user_detail)
    db.session.commit()
    redis_server.delete(data['code'])
    return "", 200
