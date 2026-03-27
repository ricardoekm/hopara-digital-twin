import os
from functools import wraps

import jwt
from flask import jsonify, request
from jwt import PyJWKClient

AUTH_ENABLED = os.environ.get('AUTH_ENABLED', False) != False

def get_public_key(uri):
    jwks_client = PyJWKClient(uri)
    return jwks_client.get_signing_keys()[0]


def verify_token(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        if not AUTH_ENABLED:
            return f(*args, **kwargs)

        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'message': 'Invalid token'}), 401

        jwks_uri = os.getenv('AUTH_JWKS_URI', 'http://localhost:8088/.well-known/dev.json')
        signing_key = get_public_key(jwks_uri)
        payload = jwt.decode(token, signing_key.key, algorithms=['RS256'])
        tenant = kwargs.get('tenant', None)
        if not tenant:
            return jsonify({'message': 'Invalid tenant'}), 403
        tenants = payload['tenants']
        if tenant not in tenants:
            return jsonify({'message': 'Forbidden'}), 403
        # if 'resource:write' not in payload['scope']:
        #     return jsonify({'message': 'Must have write permission'}), 403

        return f(*args, **kwargs)

    return decorator
