import base64, os
from io import BytesIO
from PIL import Image
from uuid import uuid4
from config import BASE_DIR

def save_image(base_64):
    filename = '{}.jpg'.format(uuid4())
    starter = base_64.find(',')
    image_data = base_64[starter+1:]
    image_data = bytes(image_data, encoding='ascii')
    im = Image.open(BytesIO(base64.b64decode(image_data)))

    im.save(os.path.join(BASE_DIR, 'images', filename))
    return filename