import os, pathlib, ffmpeg_streaming
from api.utils.image import save_image
import datetime
from flask import jsonify, request
from api import db
from api.course.models import Course
from api.course.dto import ChangeStatusDTO, CourseDetailDTO, CreateCourseDTO, EditCourseDTO
from api.utils.middlewares import error_response, token_require, valid_role, validate_request
from api.course import course as bp
from api.pay.models import Transaction
from sqlalchemy import desc, asc
from werkzeug.utils import secure_filename
from uuid import uuid4
from config import BASE_DIR

@bp.route('/create', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(CreateCourseDTO)
def create_course(user, data):
    new_course = Course()
    new_course.name = data['name']
    new_course.course_type = data['course_type']
    new_course.cover = save_image(data['base64'])
    new_course.create_by = user.id
    new_course.create_at = datetime.datetime.now()
    db.session.add(new_course)
    db.session.commit()
    return jsonify({ 'messsage': 'Successfully' }), 201

@bp.route('/all', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def get_list(user):
    data = request.get_json()
    category = data.get('category', None)
    search = data.get('search', '')
    courses = Course.query.filter(Course.name.ilike('%{}%'.format(search)))
    if category:
        courses = courses.filter_by(course_type=category)
    return jsonify({ 'courses': [course.serilize for course in courses.all()] })

@bp.route('/detail', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(CourseDetailDTO)
def get_course(user, data):
    owner = False
    course = Course.query.filter_by(id=data['id']).first()
    if course.create_by == user.id:
        owner = True
    if course:
        return jsonify({ 'course': course.serilize, 'owner': owner })
    return error_response("Not found")

@bp.route('/public-detail', methods=['POST'])
@validate_request(CourseDetailDTO)
def get_public_course(data):
    course = Course.query.filter_by(id=data['id'], active=True).first()
    if course:
        return jsonify({ 'course': course.serilize })
    return error_response("Not found")

@bp.route('/learn', methods=['POST'])
@token_require
@validate_request(CourseDetailDTO)
def get_learn_course(user, data):
    course = Course.query.filter_by(id=data['id'], active=True).first()
    transaction = Transaction.query.filter_by(user_id=user.id, course_id=data['id']).first()
    if course and transaction:
        return jsonify({ 'course': course.serilize })
    return error_response("Not found")

@bp.route('/edit', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(EditCourseDTO)
def edit_course(user, data):
    json_data = request.get_json()
    course = Course.query.filter_by(id=data['id']).first()
    owner = user.id == course.create_by
    if not owner:
        return {'error': 'permission denied'}, 404
    if course:
        course.name = data['name']
        course.course_type = data['course_type']
        course.discount = data['discount']
        course.price = data['price']
        if json_data.get('describe', None):
            course.describe = data['describe']
        if json_data.get('base64', None):
            course.cover = save_image(data['base64'])
        db.session.commit()
        return jsonify({ "messsage": "Success" })
    return error_response("Not Found")

@bp.route('/upload-preview', methods=['POST'])
@token_require
@valid_role(['teacher'])
def upload_preview(user):
    data = request.form
    course_id = data.get('course_id', None) 
    duration = data.get('duration', None) 
    if 'file' not in request.files and not duration:
        return error_response('Invalid Request')
    course = Course.query.filter_by(id=course_id).first()
    if not course:
        return error_response('Course Not Found')
    # get file
    file = request.files['file']
    filename = secure_filename(file.filename)
    filetype = filename.split('.')[-1]
    # create folder name
    id = str(uuid4())
    new_filename = '{}.{}'.format('video', filetype)
    pathlib.Path(os.path.join(BASE_DIR, 'videos'), id).mkdir(exist_ok=True)
    # save file
    file.save(os.path.join(BASE_DIR, 'videos', id, new_filename))
    # generate dash manifest
    dash_video = ffmpeg_streaming.input(os.path.join(BASE_DIR, 'videos', id, new_filename))
    dash = dash_video.dash(ffmpeg_streaming.Formats.h264())
    dash.auto_generate_representations()
    dash.output(os.path.join(BASE_DIR, 'videos', id, 'dash.mpd'))
    # save new video to database
    course.preview = id
    db.session.commit()
    return "", 201

@bp.route('/delete', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(CourseDetailDTO)
def delete_course(user, data):
    course = Course.query.filter_by(id=data['id']).first()
    owner = user.user_id == course.create_by
    if not owner and user.role != 'admin':
        return {'error': 'permission denied'}, 404
    if course:
        db.session.delete(course)
        db.session.commit()
        return jsonify({ "messsage": "Success" })
    return error_response("Not Found")


@bp.route('/status', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(ChangeStatusDTO)
def change_course_status(user, data):
    course = Course.query.filter_by(id=data['id']).first()
    if course:
        print(data['status'])
        course.active = data['status']
        db.session.commit()
        return jsonify({ "messsage": "Success" })
    return error_response("Not Found")


@bp.route('/landing', methods=['POST'])
def get_landing_course():
    try:
        new_course = Course.query.filter().filter_by(active=True).order_by(desc(Course.create_at)).limit(10).all()
        sale_course = Course.query.filter(Course.discount > 0).filter_by(active=True).order_by(Course.create_at).limit(10).all()
        free_course = Course.query.filter(Course.discount == Course.price).filter_by(active=True).order_by(Course.create_at).limit(10).all()
        return jsonify({
            'new_course': [course.serilize for course in new_course],
            'sale_course': [course.serilize for course in sale_course],
            'free_course': [course.serilize for course in free_course]})
    except Exception as err:
        print(err)
        return error_response("Not Found")


@bp.route('/list', methods=['POST'])
def course_filter():
    per_page = 2
    data = request.get_json()
    page = data.get('page', 1)
    category = data.get('category', None)
    search = data.get('search', '')
    order_by_price = data.get('order_by_price', None)
    order_by_date = data.get('order_by_date', None)
    teacher = data.get('teacher', None)
    try:
        courses = Course.query.filter(Course.name.ilike('%{}%'.format(search))).filter_by(active=True)
        if teacher:
            courses = courses.filter_by(create_by=teacher)
        if category:
            courses = courses.filter_by(course_type=category)
        if order_by_date:
            courses = courses.order_by(asc(Course.id))
        if order_by_price is not None:
            if order_by_price:
                courses = courses.order_by(asc(Course.price))
            else:
                courses = courses.order_by(desc(Course.price))
        if not order_by_date and not order_by_price:
            courses = courses.order_by(desc(Course.id))
        courses = courses.paginate(page, per_page)
        return jsonify({'courses': [course.serilize for course in courses.items], 'has_next': courses.has_next, 'current_page': courses.page})
    except Exception as err:
        print(err)
        return error_response('Not Found')
