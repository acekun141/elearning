from marshmallow import Schema, fields

class PayDTO(Schema):
    email = fields.Email(required=True)
    course_id = fields.Number(required=True)

class ConfirmPaymentDTO(Schema):
    course_id = fields.Number(required=True)

class TransactionDTO(Schema):
    year = fields.Str(required=True)

class TransactionsDTO(Schema):
    page = fields.Number(required=True)