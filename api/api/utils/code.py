import random
import string

def generate_code(length=8) -> str:
    letters = string.ascii_lowercase + string.digits
    result = ''.join(random.choice(letters) for i in range(length))
    return result