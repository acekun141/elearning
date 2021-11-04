from marshmallow import Schema, fields

class CreateCourseDTO(Schema):
    name = fields.Str(required=True, allow_none=False)
    course_type = fields.Str(required=True, allow_none=False)
    base64 = fields.Str(required=True, allow_none=False)

class CourseDetailDTO(Schema):
    id = fields.Number(required=True, allow_none=False)

class EditCourseDTO(Schema):
    id = fields.Number(requested=True, allow_none=False)
    discount = fields.Number(requested=True, allow_none=False)
    price = fields.Number(requested=True, allow_none=False)
    name = fields.Str(required=True, allow_none=False)
    course_type = fields.Str(required=True, allow_none=False)
    base64 = fields.Str()
    describe = fields.Str(required=False)

class ChangeStatusDTO(Schema):
    id = fields.Number(required=True, allow_none=False)
    status = fields.Boolean(required=True, allow_none=False)