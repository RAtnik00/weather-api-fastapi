class OpenWeatherClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def get_current_weather(self, location: str) -> dict:
        return {}

    def get_forecast(self, location: str) -> dict:
        return {}

    def get_yesterday_weather(self, location: str) -> dict:
        return {}