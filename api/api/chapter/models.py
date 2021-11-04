from api import db

class Chapter(db.Model):
    __tablename__ = 'Chapter'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('Course.id'))
    videos = db.relationship('Video', backref='chapter', lazy=True)

    def __repr__(self):
        return '<Chapter {}-{}>'.format(self.order, self.name)

    @property
    def serilize(self):
        return {
            'id': self.id,
            'name': self.name,
            'order': self.order,
        }
    
class Video(db.Model):
    __tablename__ = 'Video'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    filename = db.Column(db.String(120), nullable=False)
    duration = db.Column(db.Float, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('Chapter.id'))

    def __repr__(self):
        return '<Video {}-{}>'.format(self.order, self.name);

    @property
    def serilize(self):
        return {
            'id': self.id,
            'name': self.name,
            'order': self.order,
            'filename': self.filename,
            'duration': self.duration,
            'chapter': self.chapter.serilize
        }