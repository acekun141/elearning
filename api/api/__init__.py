from flask import Flask
from config import Config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
migrate = Migrate(compare_type=True)
mail = Mail()
marshmallow = Marshmallow();

def create_app(debug=False):
    app = Flask(__name__)
    app.debug = debug
    app.config.from_object(Config)
    app.config['MAX_CONTENT_LENGTH'] = 1024*1024*2000

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    marshmallow.init_app(app)

    from api.user import user as user_blueprint
    app.register_blueprint(user_blueprint)

    from api.auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from api.image import image as image_blueprint
    app.register_blueprint(image_blueprint)

    from api.course import course as course_blueprint
    app.register_blueprint(course_blueprint)

    from api.chapter import chapter as chapter_blueprint
    app.register_blueprint(chapter_blueprint)

    from api.pay import pay as pay_blueprint
    app.register_blueprint(pay_blueprint)

    from api.rate import rate as rate_blueprint
    app.register_blueprint(rate_blueprint)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()

    return app