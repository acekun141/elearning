from flask import Blueprint

image = Blueprint('image', __name__, url_prefix='/image')

from api.image import routes
