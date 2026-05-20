# Weather Dashboard ☀️🌧️

A full‑stack weather application that allows users to check the current
weather, view forecasts, and manage favorite locations.

This project consists of:

-   FastAPI backend
-   React frontend (Vite)
-   Integration with OpenWeather API
-   Production deployment

Backend and frontend are deployed separately:

-   Backend: Render
-   Frontend: Vercel

------------------------------------------------------------------------

# Live Architecture

Frontend (React / Vercel) ↓ REST API ↓ Backend (FastAPI / Render) ↓
OpenWeather API

------------------------------------------------------------------------

# Features

Users can:

-   Search weather by city
-   Get weather using current geolocation
-   View multi‑day forecast
-   Save cities to Favorites
-   View Search History
-   Clear Search History
-   Receive city suggestions while typing
-   Refresh weather data with visual feedback
-   Switch between System, Dark, and Light blue themes
-   Keep the selected theme after page reload
-   Use an optimized mobile layout

Favorites and history are stored locally in the browser.

------------------------------------------------------------------------

# Latest Update

The project has received several frontend updates focused on startup speed,
theme experience, mobile usability, and local browser data controls.

## General completed work

-   Default city weather now loads immediately on first render
-   Geolocation no longer blocks the initial dashboard load
-   Generated Python cache files are ignored and removed from git tracking

## Theme update

-   System / Dark / Light theme selector
-   System theme mode follows the device color scheme
-   Smooth animated transition between dark blue and light blue themes
-   Sliding segmented control for theme selection
-   Theme preference is saved in localStorage

## Mobile update

-   Header controls are optimized for small screens
-   Theme selector and search input fit mobile widths
-   Weather cards use tighter spacing on phones
-   Forecast rows become compact mobile cards instead of a wide table
-   Forecast descriptions no longer overflow on narrow screens

## History and refresh update

-   Clear History action was added
-   Search history stays cleared after page reload
-   Automatic weather loads no longer repopulate history
-   History is saved only after explicit city search or city selection
-   Refresh button shows a loading state while data is refetching
-   Current weather and forecast cards show lightweight updating indicators

------------------------------------------------------------------------

# Tech Stack

Backend

-   FastAPI
-   Pydantic
-   HTTPX
-   Pytest

Frontend

-   React
-   Vite
-   React Query
-   CSS variables for theme styling
-   prefers-color-scheme support

Infrastructure

-   Render --- backend hosting
-   Vercel --- frontend hosting

------------------------------------------------------------------------

# Project Structure

    weather-api-fastapi
    │
    ├── app/
    │   ├── api/
    │   ├── clients/
    │   ├── services/
    │   ├── schemas/
    │   ├── mappers/
    │   └── dependencies/
    │
    ├── weather-frontend/
    │
    ├── tests/
    │
    └── pyproject.toml

------------------------------------------------------------------------

# Production Deployment

The application is deployed as a split full‑stack architecture.

Backend hosted on Render.

Frontend hosted on Vercel.

Cross‑site cookies are enabled using:

SameSite=None\
Secure=True

This allows the frontend to store cookies from the backend for:

-   search history
-   favorite cities

------------------------------------------------------------------------

# API Endpoints

Current Weather

GET /weather/current?location=Warsaw

Forecast

GET /weather/forecast?location=Warsaw

Weather by Coordinates

GET /weather/current/by-coords?lat=52.23&lon=21.01

Forecast by Coordinates

GET /weather/forecast/by-coords?lat=52.23&lon=21.01

Search History

GET /history

Favorites

GET /favorites\
POST /favorites/{city}\
DELETE /favorites/{city}

City Suggestions

GET /weather/cities?q=war

------------------------------------------------------------------------

# Environment Variables

The .env file is not included in the repository.

Example:

OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

OPENWEATHER_API_KEY=your_api_key

------------------------------------------------------------------------

# Local Backend Setup

Install dependencies:

pip install -r requirements.txt

Run the server:

uvicorn app.main:app --reload

Server will run on:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs

------------------------------------------------------------------------

# Local Frontend Setup

Navigate to the frontend folder:

cd weather-frontend

Install dependencies:

npm install

Run development server:

npm run dev

Frontend will run on:

http://localhost:5173

------------------------------------------------------------------------

# Running Tests

Backend tests use pytest.

Run:

pytest

------------------------------------------------------------------------

# Future Improvements

Possible improvements:

-   User authentication
-   Database storage for favorites
-   Weather API caching
-   Liquid glass inspired UI styling
-   Docker containerization
-   CI/CD pipeline

------------------------------------------------------------------------

# Author

Dmytro Yaremenko

This project was fully designed and developed independently as a
full‑stack practice project using:

-   FastAPI
-   React
-   REST API architecture
-   External API integration
-   Production deployment
