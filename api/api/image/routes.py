import os
from flask import send_from_directory
from api.image import image as bp
from config import BASE_DIR

@bp.route('/<filename>')
def get_image(filename):
    path = os.path.join(BASE_DIR, 'images')
    return send_from_directory(path, filename, as_attachment=True)