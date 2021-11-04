from api import db

class Course(db.Model):
    __tablename__ = 'Course'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    create_at = db.Column(db.DateTime(), nullable=False)
    create_by = db.Column(db.Integer, db.ForeignKey('UserInfo.id'))
    course_type = db.Column(db.String(120), nullable=False)
    price = db.Column(db.BigInteger, default=0)
    discount = db.Column(db.BigInteger, default=0)
    describe = db.Column(db.Text)
    active = db.Column(db.Boolean, default=False)
    cover = db.Column(db.Text)
    preview = db.Column(db.Text)
    chapters = db.relationship('Chapter', backref='course', lazy=True)
    transactions = db.relationship('Transaction', backref='course', lazy=True)
    rates = db.relationship('Rate', backref='course', lazy=True)
    comments = db.relationship('Comment', backref='course', lazy=True)

    def __repr__(self):
        return '<Course {} - {}>'.format(self.id, self.name)

    @property
    def total_rate(self):
        rates = self.rates
        if len(rates) == 0:
            return 0
        total = 0
        for rate in rates:
            total += rate.value
        return total / len(rates)
    
    @property
    def rate_detail(self):
        rates = self.rates
        return {
            'total': len(rates),
            '1_star': len([rate for rate in rates if rate.value == 1]),
            '2_star': len([rate for rate in rates if rate.value == 2]),
            '3_star': len([rate for rate in rates if rate.value == 3]),
            '4_star': len([rate for rate in rates if rate.value == 4]),
            '5_star': len([rate for rate in rates if rate.value == 5]),
        }

    @property
    def basic_info(self):
        return {
            'id': self.id,
            'name': self.name,
            'create_by': '{} {}'.format(self.user.detail.first_name, self.user.detail.last_name),
            'create_at': self.create_at.strftime("%m-%d-%Y %H:%M"),
        }
    
    @property
    def serilize(self):
        return {
            'id': self.id,
            'name': self.name,
            'create_at': self.create_at.strftime("%m-%d-%Y %H:%M"),
            'create_by': '{} {}'.format(self.user.detail.first_name, self.user.detail.last_name),
            'create_by_id': self.create_by,
            'course_type': self.course_type,
            'price': self.price,
            'discount': self.discount,
            'active': self.active,
            'cover': self.cover,
            'user_avatar': self.user.detail.avatar,
            'describe': self.describe,
            'chapters': [{'name': chapter.name, 'id': chapter.id, 'order': chapter.order, 'videos': [video.serilize for video in chapter.videos]} for chapter in self.chapters],
            'user_describe': self.user.detail.describe,
            'total_rate': self.total_rate,
            'rate_detail': self.rate_detail,
            'preview': self.preview
        }
