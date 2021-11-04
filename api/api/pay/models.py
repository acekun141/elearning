from api import db

class Transaction(db.Model):
    __tablename__ = 'Transaction'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('UserInfo.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('Course.id'))
    create_at = db.Column(db.DateTime(), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Transaction {}-{}: {}>'.format(self.user_id, self.course_id, self.amount)
    
    @property
    def serilize(self):
        return {
            'id': self.id,
            'course': self.course.basic_info,
            'create_at': self.create_at.strftime("%m-%d-%Y %H:%M"),
            'amount': self.amount,
            'user': self.user.detail.basic_info
        }
