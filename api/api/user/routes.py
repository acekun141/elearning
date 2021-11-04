from sqlalchemy.sql.selectable import subquery
from api.utils.image import save_image
from api.user.dto import ChangePasswordDTO, ChangeRoleDTO, EditUserDTO, GetTeacherInfoDTO, UpdateInfoDTO, UploadAvatarDTO
from flask import jsonify, request
from sqlalchemy import func, desc, asc
from werkzeug.utils import validate_arguments

from api import db

from api.user import user as bp
from api.user.models import UserInfo
from api.pay.models import Transaction
from api.course.models import Course

from api.utils.middlewares import error_response, success_response, token_require, valid_role, validate_request


@bp.route('/info', methods=['POST'])
@token_require
def get_user_info(user):
    detail = user.detail
    response = {}
    response['email'] = user.email
    response['id'] = user.id
    response['role'] = user.role
    response['first_name'] = detail.first_name
    response['last_name'] = detail.last_name
    response['date_of_birth'] = detail.date_of_birth
    response['phone_number'] = detail.phone_number
    response['avatar'] = detail.avatar
    response['describe'] = detail.describe
    response['courses'] = [transaction.serilize for transaction in user.transactions]
    return jsonify(response)

@bp.route('/update-info', methods=['POST'])
@token_require
@validate_request(UpdateInfoDTO)
def upload_info(user, data):
    user.detail.first_name = data['first_name']
    user.detail.last_name = data['last_name']
    user.detail.phone_number = data['phone_number']
    if data['describe']:
        print(data['describe'])
        user.detail.describe = data['describe']
    db.session.commit()
    return "", 200


@bp.route('/change-password', methods=['POST'])
@token_require
@validate_request(ChangePasswordDTO)
def change_password(user, data):
    is_valid_password = user.check_password(data['current_password'])
    if not is_valid_password:
        return error_response('Password incorrect')
    is_same_password = user.check_password(data['new_password'])
    if is_same_password:
        return error_response('New password must be different from the old password')
    user.set_password(data['new_password'])
    db.session.commit()
    return success_response('Successfully')

@bp.route('/upload-avatar', methods=['POST'])
@token_require
@validate_request(UploadAvatarDTO)
def upload_avatar(user, data):
    filename = save_image(data['avatar'])
    user.detail.avatar = filename
    db.session.commit()
    return "", 200

@bp.route('/teacher-info', methods=['POST'])
@validate_request(GetTeacherInfoDTO)
def teacher_info(data):
    user = UserInfo.query.filter_by(id=data['id']).first()
    detail = user.detail
    response = {}
    response['id'] = user.id
    response['first_name'] = detail.first_name
    response['last_name'] = detail.last_name
    response['avatar'] = detail.avatar
    response['describe'] = detail.describe
    return jsonify(response)

@bp.route('/courses', methods=['POST'])
@token_require
def get_user_course(user):
    return {'courses': [transaction.course.serilize for transaction in user.transactions]}, 200


@bp.route('/dashboard', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def dashboard(user):
    users = len(UserInfo.query.all())
    admins = len(UserInfo.query.filter_by(role='admin').all())
    return {'users': users, 'admins': admins}


@bp.route('/list-user', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def list_user(user):
    data = request.get_json()
    page = data.get('page', 1)
    per_page = 10
    users = UserInfo.query.paginate(page, per_page)
    return jsonify({'users': [user.detail.serilize for user in users.items], 'current_page': page, 'has_next': users.has_next})

@bp.route('/change-role', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(ChangeRoleDTO)
def change_role(user, data):
    user = UserInfo.query.filter_by(id=data['user_id']).first()
    if user:
        user.role = data['role']
        db.session.commit()
    else:
        return {"error": "Not found"}, 404

@bp.route('/edit-user', methods=['POST'])
@token_require
@valid_role(['admin'])
@validate_request(EditUserDTO)
def edit_user(user, data):
    user_edit = UserInfo.query.filter_by(id=data['user_id']).first()
    if user_edit and user_edit.id != user.id:
        user_edit.role = data['role']
        user_edit.deactivate = data['deactivate']
        db.session.commit()
        return {"message": "successful"}, 200
    else:
        return {"error": "Invalid Request"}, 404

@bp.route('/top-teacher', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def top_teacher(user):
    group_by = db.session.query(Transaction.course_id, func.sum(Transaction.amount).label("total"))\
                         .group_by(Transaction.course_id).subquery()
    course = db.session.query(Course, group_by).filter(group_by.c.course_id == Course.id).subquery()
    teachers = db.session.query(UserInfo, func.sum(course.c.total).label('total'))\
                        .filter(UserInfo.id == course.c.create_by)\
                        .group_by(UserInfo.id).order_by(func.sum(course.c.total).desc()).limit(5).all()
    list_detail = []
    for teacher in teachers:
        detail = teacher.UserInfo.detail.serilize
        detail['total'] = int(teacher.total)
        list_detail.append(detail)
    return {'teacher': [detail for detail in list_detail]}

@bp.route('/top-user', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def top_user(user):
    transaction = db.session.query(Transaction.user_id, func.sum(Transaction.amount).label("total"))\
                         .group_by(Transaction.user_id).subquery()
    users = db.session.query(UserInfo, func.sum(transaction.c.total).label('total'))\
                        .filter(UserInfo.id == transaction.c.user_id)\
                        .group_by(UserInfo.id).order_by(func.sum(transaction.c.total).desc()).limit(5).all()
    list_detail = []
    for user in users:
        detail = user.UserInfo.detail.serilize
        detail['total'] = int(user.total)
        list_detail.append(detail)
    return {'user': [detail for detail in list_detail]}