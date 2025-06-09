from datetime import datetime

from flask import Blueprint, request

from src.commons.security.token_required import bearer_token_required
from src.payloads.responses.response_handler import ResponseHandler
from src.services.middle_service import handler_request, enable_middleware_service, \
    disable_middleware_service, get_state_middleware_service

base_api_url_middle = Blueprint('base_api_url_middle', __name__)


@base_api_url_middle.route('/<api_id>/<path:endpoint>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
def filtering(api_id, endpoint):
    full_request = {
        "method": request.method,
        "headers": dict(request.headers),
        "query_params": request.args.to_dict(),
        "body": request.get_json() if request.is_json else request.form.to_dict(),
        "files": request.files.to_dict(),
        "full_url": request.url
    }

    data = None
    if request.method in ['POST', 'PUT', 'PATCH'] and request.is_json:
        data = request.get_json()
    elif request.method in ['POST', 'PUT', 'PATCH']:
        data = request.form.to_dict()

    query_string = request.query_string.decode('utf-8')

    if query_string:
        endpoint_full = f"{endpoint}?{query_string}"
    else:
        endpoint_full = endpoint

    try:
        msg = handler_request(api_id, endpoint_full, data, request.method, full_request)
        return msg
    except Exception as e:
        return {
            "data": None,
            "message": str(e),
            "metadata": {
                "timestamp": datetime.now().isoformat()
            },
            "status": "ERROR"
        }, 500

@base_api_url_middle.route('/enable', methods=['POST'])
@bearer_token_required
def enable_middleware():
    data = request.json

    return ResponseHandler.success_without_message(enable_middleware_service(data))


@base_api_url_middle.route('/disable', methods=['POST'])
@bearer_token_required
def disable_middleware():
    data = request.json

    return ResponseHandler.success_without_message(disable_middleware_service(data))

@base_api_url_middle.route('/state', methods=['POST'])
@bearer_token_required
def get_state_middleware():
    data = request.json

    return ResponseHandler.success_without_message(get_state_middleware_service(data))
