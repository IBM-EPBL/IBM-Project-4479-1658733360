from distutils.log import Log
from flask import Flask
from flask_cors import CORS
from flask_restful import Api, reqparse

parser = reqparse.RequestParser()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    api = Api(app)
    CORS(app)

    from .controllers.auth import Register, Login, Logout, EmailVerification
    api.add_resource(Register, '/api/personal expense tracker application/register')
    api.add_resource(Login, '/api/personal expense tracker application/login')
    api.add_resource(EmailVerification, '/api/personal expense tracker application/verify')
    api.add_resource(Logout, '/api/personal expense tracker application/logout')

    @app.route('/hello')
    def hello():
        return 'Hello, World'

    @app.after_request
    def after_request(res):
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        res.headers['Access-Control-Expose-Headers'] = 'true'
        res.headers['Access-Control-Allow-Credentials'] = 'true'
        return res
        
    return app