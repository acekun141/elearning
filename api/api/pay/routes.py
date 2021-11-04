import datetime
import sqlalchemy, functools
from sqlalchemy import desc, func
from api import db
from flask import current_app
from api.pay.dto import ConfirmPaymentDTO, PayDTO, TransactionDTO, TransactionsDTO
from api.pay.models import Transaction
from api.course.models import Course
from api.pay import pay as bp
from api.user.models import UserDetail, UserInfo
from api.utils.middlewares import token_require, valid_role, validate_request
import stripe

@bp.route('/', methods=['POST'])
@token_require
@validate_request(PayDTO)
def pay(user, data):
    print('key', current_app.config['STRIPE_API_KEY'])
    stripe.api_key = current_app.config['STRIPE_API_KEY']
    course = Course.query.filter_by(id=data['course_id']).first()
    if not course:
        return "Not Found", 400
    amount = course.price - course.discount
    if amount < 0:
        return "Invalid", 400
    intent = stripe.PaymentIntent.create(amount=amount, currency='vnd', receipt_email=data['email'])
    return {"client_secret": intent["client_secret"]}, 200

@bp.route('/confirm', methods=['POST'])
@token_require
@validate_request(ConfirmPaymentDTO)
def confirm_payment(user, data):
    course = Course.query.filter_by(id=data['course_id']).first()
    if course:
        transaction = Transaction()
        transaction.user_id = user.id
        transaction.course_id = course.id
        transaction.amount = course.price - course.discount
        transaction.create_at = datetime.datetime.now()
        db.session.add(transaction)
        db.session.commit();
        return {'message': 'successfully'}, 200
    return "Not Found", 400


@bp.route('/history', methods=['POST'])
@token_require
def pay_history(user):
    return {'history': [transaction.serilize for transaction in user.transactions ]}, 200


@bp.route('/transaction', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(TransactionDTO)
def transaction(user, data):
    year = sqlalchemy.extract('year', Transaction.create_at)
    month = sqlalchemy.extract('month', Transaction.create_at)
    result = dict()
    for i in range(1,13):
        transactions = Transaction.query.filter(year == data['year'], month == i).all()
        amount = functools.reduce(lambda a, b: a + b.amount, transactions, 0)
        result[i] = amount
    return result

@bp.route('/teacher-income', methods=['POST'])
@token_require
@valid_role(['teacher'])
@validate_request(TransactionDTO)
def teacher_income(user, data):
    year = sqlalchemy.extract('year', Transaction.create_at)
    month = sqlalchemy.extract('month', Transaction.create_at)
    result = dict()
    for i in range(1,13):
        # transactions = Transaction.query.filter(year == data['year'], month == i).all()
        transaction = db.session.query(Transaction.course_id, func.sum(Transaction.amount).label("total"))\
                            .filter(year == data['year'], month == i)\
                            .group_by(Transaction.course_id).subquery()
        own_transactions = db.session.query(Course, transaction).filter(Course.id == transaction.c.course_id).filter(Course.create_by == user.id).all()
        amount = functools.reduce(lambda a, b: a + int(b.total), own_transactions, 0)
        result[i] = amount

    return result

@bp.route('/teacher-course-income', methods=['POST'])
@token_require
@valid_role(['teacher'])
def teacher_course_income(user):
    transaction = db.session.query(Transaction.course_id, func.sum(Transaction.amount).label("total"))\
                         .group_by(Transaction.course_id).subquery()
    own_transactions = db.session.query(Course, transaction).filter(Course.id == transaction.c.course_id).filter(Course.create_by == user.id).all()

    print(own_transactions)

    return {"courses": [
        {
            "course_id": course.Course.id,
            "name": course.Course.name,
            "course_type": course.Course.course_type,
            "total": int(course.total)
        } for course in own_transactions]}, 200

@bp.route('/income', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def income(user):
    year = sqlalchemy.extract('year', Transaction.create_at)
    month = sqlalchemy.extract('month', Transaction.create_at)
    all_transaction = Transaction.query.all()
    all_time_income = functools.reduce(lambda a, b: a + b.amount, all_transaction, 0)
    year_transaction = Transaction.query.filter(year == datetime.date.today().year).all()
    year_income = functools.reduce(lambda a, b: a + b.amount, year_transaction, 0)
    month_transaction = Transaction.query.filter(month == datetime.date.today().month).all()
    month_income = functools.reduce(lambda a, b: a + b.amount, month_transaction, 0)
    return {'all_time': all_time_income, 'year': year_income, 'month': month_income}

@bp.route('/transactions', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(TransactionsDTO)
def transactions(user, data):
    per_page = 10
    page = data['page']
    transactions = Transaction.query.filter().order_by(desc(Transaction.create_at))
    transactions = transactions.paginate(page, per_page)
    return {'transactions': [transaction.serilize for transaction in transactions.items], 'has_next': transactions.has_next, 'page': transactions.page}


@bp.route('/income-analyze', methods=['POST'])
def income_analyze():
    year = sqlalchemy.extract('year', Transaction.create_at)
    month = sqlalchemy.extract('month', Transaction.create_at)
    total = db.func.sum(Transaction.amount).label('total')
    transaction_year = db.session.query(UserInfo.id, Course.id, Transaction.course_id, total)\
        .filter(year == datetime.date.today().year)\
        .outerjoin(Course, Transaction.course_id == Course.id)\
        .outerjoin(UserInfo, Course.create_by == UserInfo.id)\
        .group_by(Transaction.course_id)\
        .subquery()
    result = db.session.query(transaction_year.c.id, db.func.sum(transaction_year.c.total).label("income"))\
        .group_by(transaction_year.c.id)\
        .order_by(desc(db.func.sum(transaction_year.c.total))).subquery()

    result_2 = db.session.query(UserDetail, result.c.income).outerjoin(UserDetail, UserDetail.user_id == result.c.id).all()
    print(result_2)


    return {}
