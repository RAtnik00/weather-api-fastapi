from app.services.cookies_service import CookiesService

def get_cookies_service() -> CookiesService:
    return CookiesService()