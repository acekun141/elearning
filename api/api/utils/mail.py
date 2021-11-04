from api import mail
from flask_mail import Message


def send_mail(code, recepient):
    msg = Message('Elearning: Verify mail address',
                  sender="hung@mailtrap.io", recipients=[recepient])
    msg.body = 'You code is {}. Your code will expire in 5 minutes'.format(
        code)
    mail.send(msg)
