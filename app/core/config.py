import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("DEBUG", "false").strip().lower() in {"1", "true", "yes", "on"}
OPENWEATHER_BASE_URL = os.getenv("OPENWEATHER_BASE_URL")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")