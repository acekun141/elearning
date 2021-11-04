from marshmallow import Schema, fields

class CreateChapterDTO(Schema):
    course_id = fields.Number(required=True, allow_none=False)
    name = fields.Str(required=True, allow_none=False)

class RemoveChapterDTO(Schema):
    id = fields.Number(required=True, allow_none=False)

class GetAllChapterDTO(Schema):
    course_id = fields.Number(required=True, allow_none=False)

class EditChapterDTO(Schema):
    id = fields.Number(required=True, allow_none=False)
    name = fields.Str(required=True, allow_none=False)

class DeleteVideoDTO(Schema):
    video_id = fields.Number(required=True, allow_none=False)

class GetListVideoDTO(Schema):
    chapter_id = fields.Number(required=True, allow_none=False)

class ViewVideoDTO(Schema):
    filename = fields.Str(required=True, allow_none=None)