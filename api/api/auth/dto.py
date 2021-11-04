from marshmallow import Schema, fields

class AuthDTO(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class SignUpDTO(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)

class VerifyMailDTO(Schema):
    code = fields.Str(required=True)
