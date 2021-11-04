import datetime
from flask import request

from api import db
from api.rate import rate as bp
from api.rate.dto import CommentDTO, DeleteCommentDTO, GetCourseCommentDTO, GetRateDTO, RatingDTO
from api.rate.models import Rate, Comment
from api.utils.middlewares import token_require, valid_role, validate_request

from api.course.models import Course
from api.pay.models import Transaction
from sqlalchemy import desc, asc

@bp.route('/', methods=['POST'])
@token_require
@validate_request(RatingDTO)
def rating(user, data):
    course = Course.query.filter_by(id=data['course_id']).first()
    transaction = Transaction.query.filter_by(course_id=data['course_id'], user_id=user.id).first()
    if not course or not transaction:
        return {'error': 'Course does not exist'}, 400
    if data['value'] < 1 and data['value'] > 5:
        return {'error': 'Invalid rate value'}, 400
    rate = Rate.query.filter_by(course_id=data['course_id'], user_id=user.id).first()
    if rate:
        rate.value = data['value']
        db.session.commit()
        return {'message': 'Update rate successful'}, 200
    else:
        rate = Rate()
        rate.course_id = data['course_id']
        rate.user_id = user.id
        rate.create_at = datetime.datetime.now()
        rate.value = data['value']
        db.session.add(rate)
        db.session.commit()
        return {'message': 'Create rate successful'}, 200

@bp.route('/get-user-rate', methods=['POST'])
@token_require
@validate_request(GetRateDTO)
def get_user_rate(user, data):
    rate = Rate.query.filter_by(course_id=data['course_id'], user_id=user.id).first()
    if not rate:
        return {'value': 0}
    return {'value': rate.value}
    
@bp.route('/comment', methods=['POST'])
@token_require
@validate_request(CommentDTO)
def comment(user, data):
    course = Course.query.filter_by(id=data['course_id']).first()
    transaction = Transaction.query.filter_by(course_id=data['course_id'], user_id=user.id).first()
    if not course or not transaction:
        return {'error': 'Course does not exist'}, 400
    comment = Comment()
    comment.course_id = course.id
    comment.user_id = user.id
    comment.create_at = datetime.datetime.now()
    comment.content = data['content']
    db.session.add(comment)
    db.session.commit()
    return {'comment': comment.serilize}, 201

@bp.route('/course-comment', methods=['POST'])
@validate_request(GetCourseCommentDTO)
def get_course_comment(data):
    per_page = 10
    page = request.get_json().get('page', 1)
    comments = Comment.query.filter_by(course_id=data['course_id']).order_by(desc(Comment.create_at))
    comments = comments.paginate(page, per_page)
    return {'comments': [comment.serilize for comment in comments.items], 'current_page': comments.page, 'has_next': comments.has_next}

@bp.route('/delete-comment', methods=['POST'])
@token_require
@validate_request(DeleteCommentDTO)
def delete_comment(user, data):
    comment = Comment.query.filter_by(id=data['comment_id'], user_id=user.id).first()
    if not comment:
        return {'error': 'Comment does not exist'}, 400
    db.session.delete(comment)
    db.session.commit()
    return {'message': 'success'}, 200