from marshmallow import Schema, fields

class ChangePasswordDTO(Schema):
    current_password = fields.Str(required=True, allow_none=False)
    new_password = fields.Str(required=True, allow_none=False)

class UploadAvatarDTO(Schema):
    avatar = fields.Str(required=True, allow_none=False)

class UpdateInfoDTO(Schema):
    first_name = fields.Str(required=True, allow_none=False)
    last_name = fields.Str(required=True, allow_none=False)
    phone_number = fields.Str(required=True, allow_none=False)
    describe = fields.Str()
    # first_name = fields.Str(required=True, allow_none=False)


class GetTeacherInfoDTO(Schema):
    id = fields.Number(required=True, allow_none=False)


class ChangeRoleDTO(Schema):
    user_id = fields.Number(required=True, allow_none=False)
    role = fields.Str(required=True, allow_none=False)

class EditUserDTO(Schema):
    user_id = fields.Number(required=True, allow_none=False)
    role = fields.Str(required=True, allow_none=False)
    deactivate = fields.Boolean()