from api.user.models import UserInfo
from api.utils.token import check_token
from flask import request, jsonify
from functools import wraps
from marshmallow.exceptions import ValidationError


def validate_request(DTO):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            json_data = request.get_json()
            try:
                data = DTO().load(json_data)
            except ValidationError as err:
                print(err)
                return jsonify({ 'error': 'Invalid request' }), 400
            return func(*args, **kwargs, data=data)
        return wrapper
    return decorator


def token_require(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            payload, error = check_token(token)
            if error:
                print("co error", error)
                return "co error", 401
            try:
                user = UserInfo.query.filter_by(id=payload['user_id']).first()
                if not user:
                    print("khong thay user")
                    return "khong thay user", 401
                if user.deactivate:
                    print("Deactivate roi")
                    return "Deactivate roi", 401
                return func(user=user, *args, **kwargs)
            except Exception as err:
                print("Exception", err)
                return "Exception", 401
        return "ko co token", 401
    return wrapper

def valid_role(list_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user')
            if not user.role in list_role:
                return "", 401
            return func(*args, **kwargs)
        return wrapper
    return decorator

def error_response(msg, status=400):
    return jsonify({ 'error': msg }), status

def success_response(msg, status=200):
    return jsonify({ 'message': msg }), status