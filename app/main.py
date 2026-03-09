from fastapi import FastAPI

from app.api.exception_handlers import register_exception_handlers
from app.api.weather import router as weather_router

app = FastAPI()
register_exception_handlers(app)
app.include_router(weather_router)
