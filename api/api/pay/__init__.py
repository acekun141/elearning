from flask import Blueprint

pay = Blueprint('pay', __name__, url_prefix='/pay')

from api.pay import routes, models
