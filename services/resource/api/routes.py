from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, make_response

load_dotenv()

app = Flask(__name__)

blueprint = Blueprint('root', __name__)


@blueprint.route("/health", methods=['GET'])
def health():
    return make_response(jsonify({'message': 'Resource API is alive :)'}), 200)


app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(debug=True)
