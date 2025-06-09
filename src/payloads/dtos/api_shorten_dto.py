from datetime import datetime


class ApiShortenDto:
    def __init__(self, data):
        self.api_id = data.get('api_id', None)
        self.api_name = data.get('api_name', None)
        self.api_type = data.get('api_type', None)

    def to_dict(self):
        return {
            "api_id": self.api_id,
            "api_name": self.api_name,
            "api_type": self.api_type,
        }
