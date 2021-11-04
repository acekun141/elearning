from flask import Blueprint

chapter = Blueprint('chapter', __name__, url_prefix='/chapter')

from api.chapter import routes, models