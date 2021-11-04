from api import db

class Rate(db.Model):
    __tablename__ = 'Rate'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('UserInfo.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('Course.id'))
    create_at = db.Column(db.DateTime(), nullable=False)
    value = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Rate {}-{}: {}>'.format(self.user_id, self.course_id, self.value)
    
    @property
    def serilize(self):
        return {
            'id': self.id,
            'user': self.user.detail.basic_info,
            'course': self.course.basic_info,
            'create_at': self.create_at.strftime("%m-%d-%Y %H:%M"),
            'value': self.value,
        }

class Comment(db.Model):
    __tablename__ = 'Comment'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('UserInfo.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('Course.id'))
    create_at = db.Column(db.DateTime(), nullable=False)
    content = db.Column(db.String(300), nullable=False)

    def __repr__(self):
        return '<Comment {}-{}: {}>'.format(self.user_id, self.course_id, self.value)

    @property
    def serilize(self):
        return {
            'id': self.id,
            'user': self.user.detail.basic_info,
            'course': self.course.basic_info,
            'create_at': self.create_at.strftime("%m-%d-%Y %H:%M"),
            'content': self.content,
        }
