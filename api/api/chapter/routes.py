import os, requests, pathlib, ffmpeg_streaming
from api import db
from api.pay.models import Transaction
from api.course.models import Course
from api.chapter.models import Chapter, Video
from api.chapter.dto import CreateChapterDTO, DeleteVideoDTO, EditChapterDTO, GetAllChapterDTO, GetListVideoDTO, RemoveChapterDTO, ViewVideoDTO
from flask.json import jsonify
from flask import request, send_file 
from api.chapter import chapter as bp
from api.utils.middlewares import error_response, token_require, valid_role, validate_request
from werkzeug.utils import secure_filename
from config import BASE_DIR
from uuid import uuid4

@bp.route('/all', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(GetAllChapterDTO)
def all(user, data):
    course = Course.query.filter_by(id=data['course_id']).first()
    if course:
        return jsonify({'chapters': [chapter.serilize for chapter in course.chapters]});
    return error_response('Couse Not Found')


@bp.route('/create', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(CreateChapterDTO)
def create_chapter(user, data):
    course = Course.query.filter_by(id=data['course_id']).first()
    if course:
        chapters = course.chapters
        new_chapter = Chapter()
        new_chapter.course_id = course.id
        new_chapter.order = len(chapters) + 1
        new_chapter.name = data['name']
        db.session.add(new_chapter)
        db.session.commit()
        return jsonify({'message': 'Successfully'})
    return error_response('Course not found')


@bp.route('/remove', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(RemoveChapterDTO)
def remove_chapter(user, data):
    deleted_chapter = Chapter.query.filter_by(id=data['id']).first()
    if deleted_chapter:
        for chapter in deleted_chapter.course.chapters:
            if chapter.order > deleted_chapter.order:
                chapter.order = chapter.order - 1
        db.session.delete(deleted_chapter)
        db.session.commit()
        return jsonify({'message': 'Successfully'})
    return error_response('Chapter not found')


@bp.route('/move-up', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(RemoveChapterDTO)
def move_up_chapter(user, data):
    moved_chapter = Chapter.query.filter_by(id=data['id']).first()
    if moved_chapter:
        before_chapter = Chapter.query.filter_by(course_id=moved_chapter.course_id, order=moved_chapter.order-1).first()
        if before_chapter:
            before_chapter.order = before_chapter.order + 1
            moved_chapter.order = moved_chapter.order - 1
            db.session.commit()
            return jsonify({'message': 'Successfully'})
        return error_response('Invalid Request')
    return error_response('Chapter Not Found')


@bp.route('/move-down', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(RemoveChapterDTO)
def move_down_chapter(user, data):
    moved_chapter = Chapter.query.filter_by(id=data['id']).first()
    if moved_chapter:
        after_chapter = Chapter.query.filter_by(course_id=moved_chapter.course_id, order=moved_chapter.order+1).first()
        if after_chapter:
            after_chapter.order = after_chapter.order - 1
            moved_chapter.order = moved_chapter.order + 1
            db.session.commit()
            return jsonify({'message': 'Successfully'})
        return error_response('Invalid Request')
    return error_response('Chapter Not Found')


@bp.route('/edit', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(EditChapterDTO)
def edit_chapter(user, data):
    chapter = Chapter.query.filter_by(id=data['id']).first()
    if chapter:
        chapter.name = data['name']
        db.session.commit()
        return jsonify({'message': 'Successfully'})
    return error_response('Chapter Not Found')


@bp.route('/upload-video', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
def upload_video(user):
    data = request.form
    chapter_id = data.get('chapter_id', None) 
    video_name = data.get('video_name', None) 
    duration = data.get('duration', None) 
    if 'file' not in request.files and not chapter_id and not video_name and not duration:
        return error_response('Invalid Request')
    chapter = Chapter.query.filter_by(id=chapter_id).first()
    if not chapter:
        return error_response('Invalid Request')
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
    videos = chapter.videos
    video = Video() 
    video.chapter_id = chapter.id
    video.name = video_name
    video.duration = duration
    video.filename = id
    video.order = len(videos) + 1
    db.session.add(video)
    db.session.commit()
    return "", 201

@bp.route('/videos', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(GetListVideoDTO)
def get_list_video(user, data):
    chapter = Chapter.query.filter_by(id=data['chapter_id']).first()
    if chapter:
        return jsonify({'videos': [video.serilize for video in chapter.videos]})
    return error_response('Not Found')

@bp.route('/delete-video', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(DeleteVideoDTO)
def delete_video(user, data):
    delete_video = Video.query.filter_by(id=data['video_id']).first()
    if delete_video:
        for video in delete_video.chapter.videos:
            if video.order > delete_video.order:
                video.order = video.order - 1
        db.session.delete(delete_video)
        db.session.commit()
        return jsonify({'message': 'Successfully'})
    return error_response('Not Found')


@bp.route('/move-video-up', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(DeleteVideoDTO)
def move_video_up(user, data):
    moved_video = Video.query.filter_by(id=data['video_id']).first()
    if moved_video:
        before_video = Video.query.filter_by(chapter_id=moved_video.chapter_id, order=moved_video.order-1).first()
        if before_video:
            before_video.order = before_video.order + 1
            moved_video.order = moved_video.order - 1
            db.session.commit()
            return jsonify({'message': 'Successfully'})
        return error_response('Invalid Request')
    return error_response('Not Found')

@bp.route('/move-video-down', methods=['POST'])
@token_require
@valid_role(['admin', 'teacher'])
@validate_request(DeleteVideoDTO)
def move_video_down(user, data):
    moved_video = Video.query.filter_by(id=data['video_id']).first()
    if moved_video:
        after_video = Video.query.filter_by(chapter_id=moved_video.chapter_id, order=moved_video.order+1).first()
        if after_video:
            after_video.order = after_video.order - 1
            moved_video.order = moved_video.order + 1
            db.session.commit()
            return jsonify({'message': 'Successfully'})
        return error_response('Invalid Request')
    return error_response('Not Found')

@bp.route('/view-preview/<preview_id>')
def view_preview_video(preview_id):
    course = Course.query.filter_by(preview=preview_id).first()
    if course:
        path = os.path.join(BASE_DIR, 'videos', course.preview, 'dash.mpd')
        return send_file(path)
    param_id = request.args.get('videoid', None)
    if param_id:
        course = Course.query.filter_by(preview=param_id).first()
        path = os.path.join(BASE_DIR, 'videos', course.preview, preview_id)
        return send_file(path)
    return {'error': 'Not Found'}, 400

@bp.route('/view-video/<video_id>')
@token_require
# def view_video(user, video_id):
def view_video(user, video_id):
    video = Video.query.filter_by(id=video_id).first()
    if video:
        transaction = Transaction.query.filter_by(user_id=user.id, course_id=video.course_id).first()
        if not transaction:
            return {"error": "Not found"}, 400
        path = os.path.join(BASE_DIR, 'videos', video.filename, 'dash.mpd')
        return send_file(path)
    param_id = request.args.get('videoid', None)
    if param_id:
        video = Video.query.filter_by(id=param_id).first()
        transaction = Transaction.query.filter_by(user_id=user.id, course_id=video.chapter.course_id).first()
        if not transaction:
            return {"error": "Not found"}, 400
        path = os.path.join(BASE_DIR, 'videos', video.filename, video_id)
        return send_file(path)
    return {'error': 'Not Found'}, 400

@bp.route('/view-admin-video/<video_id>')
@token_require
@valid_role(['admin', 'teacher'])
def view_admin_video(user, video_id):
    video = Video.query.filter_by(id=video_id).first()
    if video:
        path = os.path.join(BASE_DIR, 'videos', video.filename, 'dash.mpd')
        return send_file(path)
    param_id = request.args.get('videoid', None)
    if param_id:
        video = Video.query.filter_by(id=param_id).first()
        path = os.path.join(BASE_DIR, 'videos', video.filename, video_id)
        return send_file(path)
    return {'error': 'Not Found'}, 400
