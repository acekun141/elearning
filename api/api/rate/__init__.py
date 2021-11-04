from flask import Blueprint

rate = Blueprint('rate', __name__, url_prefix='/rate')

from api.rate import routes, models
