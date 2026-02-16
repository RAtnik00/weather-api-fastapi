import json

class CookiesService:
    HISTORY_KEY = "weather_history"
    FAVORITES_KEY = "weather_favorites"

    def get_history(self, cookies: dict[str, str]) -> list[str]:
        raw = cookies.get(self.HISTORY_KEY)
        if not raw:
            return []
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return []
        return data if isinstance(data, list) else []

    def add_to_history(self, history: list[str], location: str) -> list[str]:
        location = location.strip()
        if not location:
            return history[:10]

        seen = set()
        new_history: list[str] = []
        for item in [location] + history:
            key = item.strip().lower()
            if not key or key in seen:
                continue
            seen.add(key)
            new_history.append(item.strip())
        return new_history[:10]

    def get_favorites(self, cookies: dict[str, str]) -> list[str]:
        pass

    def add_favorite(self, favorites: list[str], location: str) -> list[str]:
        pass

    def remove_favorite(self, favorites: list[str], location: str) -> list[str]:
        pass

    def encode_history(self, history: list[str]) -> str:
        return json.dumps(history, ensure_ascii=False)

    def encode_favorites(self, favorites: list[str]) -> str:
        pass