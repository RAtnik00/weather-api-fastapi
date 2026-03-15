import json
from urllib.parse import quote, unquote

from fastapi import Request, Response


class CookiesService:
    HISTORY_KEY = "weather_history"
    FAVORITES_KEY = "weather_favorites"
    CONSENT_HEADER = "x-cookie-consent"

    COOKIE_OPTIONS = {
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "path": "/",
    }

    def _decode_cookie_list(self, raw: str | None) -> list[str]:
        if not raw:
            return []

        try:
            decoded = unquote(raw)
            data = json.loads(decoded)
        except (json.JSONDecodeError, TypeError, ValueError):
            return []

        if not isinstance(data, list):
            return []

        return [str(item).strip() for item in data if str(item).strip()]

    def _encode_cookie_list(self, values: list[str]) -> str:
        normalized = [str(value).strip() for value in values if str(value).strip()]
        return quote(json.dumps(normalized, ensure_ascii=False), safe="")

    def has_cookie_consent(self, request: Request) -> bool:
        consent = request.headers.get(self.CONSENT_HEADER, "unset").strip().lower()
        return consent == "accepted"

    def clear_weather_cookies(self, response: Response) -> None:
        response.delete_cookie(
            key=self.HISTORY_KEY,
            path="/",
            secure=True,
            samesite="none",
        )
        response.delete_cookie(
            key=self.FAVORITES_KEY,
            path="/",
            secure=True,
            samesite="none",
        )

    def get_history(self, cookies: dict[str, str]) -> list[str]:
        raw = cookies.get(self.HISTORY_KEY)
        return self._decode_cookie_list(raw)

    def add_to_history(self, history: list[str], location: str) -> list[str]:
        location = location.strip()
        if not location:
            return history[:10]

        seen = set()
        new_history: list[str] = []

        for item in [location] + history:
            normalized = item.strip()
            key = normalized.lower()
            if not key or key in seen:
                continue
            seen.add(key)
            new_history.append(normalized)

        return new_history[:10]

    def get_favorites(self, cookies: dict[str, str]) -> list[str]:
        raw = cookies.get(self.FAVORITES_KEY)
        return self._decode_cookie_list(raw)

    def add_favorite(self, favorites: list[str], location: str) -> list[str]:
        location = location.strip()
        if not location:
            return favorites[:50]

        seen = set()
        new_favorites: list[str] = []

        for item in [location] + favorites:
            normalized = item.strip()
            key = normalized.lower()
            if not key or key in seen:
                continue
            seen.add(key)
            new_favorites.append(normalized)

        return new_favorites[:50]

    def remove_favorite(self, favorites: list[str], location: str) -> list[str]:
        location_key = location.strip().lower()
        return [item for item in favorites if item.strip().lower() != location_key]

    def encode_history(self, history: list[str]) -> str:
        return self._encode_cookie_list(history)

    def encode_favorites(self, favorites: list[str]) -> str:
        return self._encode_cookie_list(favorites)