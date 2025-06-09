from flask import Blueprint, render_template, request

from src.commons.security.token_required import bearer_token_required
from src.repositories.api_repository import get_api_by_api_id

base_component_url = Blueprint('base_component_url', __name__)


@base_component_url.route('/content/api-input', methods=['GET'])
@bearer_token_required
def component_content_api_input():
    aid = request.args.get('aid')

    api = get_api_by_api_id(aid).to_dict()

    return render_template(
        'pages/api-preview.html',
        format_api=api['api_id'],
        apiId=api['api_id'],
        isGet=api['api_type'] == 'GET',
        isPost=api['api_type'] == 'POST',
        isPut=api['api_type'] == 'PUT',
        isDelete=api['api_type'] == 'DELETE',
        isPatch=api['api_type'] == 'PATCH',
        endpoint=api['endpoint'],
        content=api['api_name'],
        format=api['format_api'],
    )
