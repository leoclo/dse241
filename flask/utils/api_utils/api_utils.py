import json
from src.settings import settings as ST
from functools import wraps


def get_default_res():
    return {
        ST.PAYLOAD: {},
        ST.HTTP_STATUS: 500
    }


def build_response(res):
    return json.dumps(res[ST.PAYLOAD]), res[ST.HTTP_STATUS], {'ContentType':'json'}


def endpoint_handler(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            res = {**get_default_res(), **f(*args, **kwargs)}
            return build_response(res)
        except Exception as e:
            print(e)
            print(type(e).__name__)
            res = get_default_res()
            return build_response(res)

    return decorated_function