from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from endpoints import open_endpoints

app.run(debug=True, port=5001, host='0.0.0.0')