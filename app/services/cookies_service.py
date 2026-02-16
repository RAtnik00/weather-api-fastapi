class CookiesService:
    HISTORY_KEY = "weather_history"
    FAVORITES_KEY = "weather_favorites"

    def get_history(self, cookies: dict[str, str]) -> list[str]:
        pass

    def add_to_history(self, history: list[str], location: str) -> list[str]:
        pass

    def get_favorites(self, cookies: dict[str, str]) -> list[str]:
        pass

    def add_favorite(self, favorites: list[str], location: str) -> list[str]:
        pass

    def remove_favorite(self, favorites: list[str], location: str) -> list[str]:
        pass

    def encode_history(self, history: list[str]) -> str:
        pass

    def encode_favorites(self, favorites: list[str]) -> str:
        pass