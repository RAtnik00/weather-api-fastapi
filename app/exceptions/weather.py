class WeatherError(Exception):
    """Base domain error for weather module"""

class CityNotFoundError(WeatherError):
    """City not found"""

class WeatherAuthError(WeatherError):
    """Weather auth error"""

class WeatherRateLimitError(WeatherError):
    """Weather rate limit error"""

class WeatherUpstreamError(WeatherError):
    """Weather upatream error"""