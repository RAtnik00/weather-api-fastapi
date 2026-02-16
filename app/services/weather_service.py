class WeatherService:
    def __init__(self, client):
        self.client = client

    def get_current_weather(self, location):
        return self.client.get_current_weather(location)

    def get_forecast(self, location):
        return self.client.get_forecast(location)

    def get_yesterday_weather(self, location):
        return self.client.get_yesterday_weather(location)
