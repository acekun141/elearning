from api import db
from werkzeug.security import check_password_hash, generate_password_hash

class UserInfo(db.Model):
    __tablename__ = 'UserInfo'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    create_at = db.Column(db.DateTime(), nullable=False)
    role = db.Column(db.String(10), nullable=False)
    hash_password = db.Column(db.String(120), nullable=False)
    deactivate = db.Column(db.Boolean, nullable=False, default=False)

    detail = db.relationship("UserDetail", backref="info", lazy=True, uselist=False)
    courses = db.relationship('Course', backref='user', lazy=True)
    transactions = db.relationship('Transaction', backref='user', lazy=True)
    rates = db.relationship('Rate', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    def __repr__(self):
        return '<User {} - Role {}>'.format(self.email, self.role)

    def set_password(self, password: str) -> any:
        self.hash_password = generate_password_hash(password)

    def check_password(self, password: str) -> any:
        return check_password_hash(self.hash_password, password)


class UserDetail(db.Model):
    __tablename__ = 'UserDetail'
    id = db.Column(db.Integer, primary_key=True)
    avatar = db.Column(db.Text)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    date_of_birth = db.Column(db.String(10))
    phone_number = db.Column(db.String(11))
    user_id = db.Column(db.Integer, db.ForeignKey('UserInfo.id'))
    describe = db.Column(db.Text)

    def __repr__(self):
        return '<UserDetail {}-{} {}>'.format(self.first_name, self.last_name, self.info.id)
    
    @property
    def basic_info(self):
        return {
            'id': self.id,
            'avatar': self.avatar,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': '{} {}'.format(self.first_name, self.last_name)
        }

    @property
    def serilize(self):
        return {
            'id': self.id,
            'avatar': self.avatar,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': '{} {}'.format(self.first_name, self.last_name),
            'role': self.info.role,
            'deactivate': self.info.deactivate
        }
