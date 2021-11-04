from marshmallow import fields, Schema

class RatingDTO(Schema):
    course_id = fields.Number(required=True, allow_none=False)
    value = fields.Number(required=True, allow_none=False)

class GetRateDTO(Schema):
    course_id = fields.Number(required=True, allow_none=False)

class CommentDTO(Schema):
    course_id = fields.Number(required=True, allow_none=False)
    content = fields.Str(required=True, allow_none=False)

class DeleteCommentDTO(Schema):
    comment_id = fields.Number(required=True, allow_none=False)

class GetCourseCommentDTO(Schema):
    page = fields.Number(required=False)
    course_id = fields.Number(required=True, allow_none=False)