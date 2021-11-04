import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    STRIPE_API_KEY = 'sk_test_51HFaFdDo1P0sBmDSfrqneAXKqQgIl8pc8owO26U9M4xLaAyLKVRHKQnACnNvEX44s92wcRYi3PknSdiqbMKTSY6Y00sOKKtC0j'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:tzznos@mysql:3306/elearning'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
         'sqlite:///{}'.format(os.path.join(BASE_DIR, 'app.db')))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'hungstorage1712@gmail.com'
    MAIL_PASSWORD = 'lemannhi3009'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
