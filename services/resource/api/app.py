import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_swagger import swagger

from api.container import Container
from api.icon.icon_routes import blueprint as icon_blueprint
from api.image.image_routes import blueprint as image_blueprint
from api.model.model_routes import blueprint as model_blueprint
# TODO: tem como achar os arquivos icon_routes.py e fazer isso automatico?
from api.routes import blueprint as root_blueprint
from common.server_util import handle_exception


def create_app():
    app = Flask(__name__)
    app.container = Container()
    app.register_blueprint(root_blueprint)
    app.register_blueprint(model_blueprint)
    app.register_blueprint(icon_blueprint)
    app.register_blueprint(image_blueprint)
    app.register_error_handler(Exception, handle_exception)
    CORS(app)

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        response = {
            "error": "Bad Request",
            "message": str(error)
        }
        return jsonify(response), 400

    @app.errorhandler(FileNotFoundError)
    def handle_file_not_found_error(error):
        response = {
            "error": "Not Found",
            "message": str(error)
        }
        return jsonify(response), 404

    @app.route("/spec")
    def swagger_spec():
        swag = swagger(app)
        swag['info'] = {
            "title": "Resource Service",
            "version": "1.0.0"
        }
        swag["openapi"] = "3.0.0"
        swag["servers"] = [{
            "url": f'https://{os.getenv("PUBLIC_HOST")}'
        }]
        swag.pop('swagger', None)
        return jsonify(swag)
    return app



if __name__ == "__main__":
    create_app().run(debug=False, port=2022)
