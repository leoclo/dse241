from __main__ import app
from flask import request
import json
from utils.api_utils.api_utils import endpoint_handler
from src.settings import settings as ST

@app.route("/health")
@endpoint_handler
def hello_world():
    
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: {ST.MSG: 'Aloha', ST.SUCCESS: True}}
