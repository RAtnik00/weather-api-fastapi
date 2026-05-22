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
-   View condition-based weather visuals
-   View multi‑day forecast
-   Save cities to Favorites
-   View Search History
-   Clear Search History
-   Receive city suggestions while typing
-   Refresh weather data with visual feedback
-   Switch between System, Dark, and Light blue themes
-   Receive theme change toast feedback
-   Keep the selected theme after page reload
-   Enable optional Liquid Glass visual mode
-   Use an optimized mobile layout

Favorites, history, selected theme, and visual mode are stored locally in the
browser.

------------------------------------------------------------------------

# Latest Update

The project has received several updates focused on startup speed, weather
visuals, theme experience, mobile usability, local browser data controls,
dependency cleanup, and optional Liquid Glass styling.

## General completed work

-   Default city weather now loads immediately on first render
-   Geolocation no longer blocks the initial dashboard load
-   Generated Python cache files are ignored and removed from git tracking
-   Backend dependency declarations were cleaned up for Poetry installs
-   The unused skip package was removed
-   cachetools was added as an explicit backend dependency
-   Python support was relaxed to >=3.12,<3.15

## Weather visuals update

-   Weather condition visuals were added to the Current card
-   Forecast rows now show compact weather icons
-   Weather visuals support clear, cloudy, rainy, snowy, stormy, and foggy states
-   Weather icon styling follows the active theme and Liquid Glass mode

## Theme update

-   System / Dark / Light theme selector
-   System theme mode follows the device color scheme
-   Smooth animated transition between dark blue and light blue themes
-   Sliding segmented control for theme selection
-   Theme preference is saved in localStorage
-   Optional Liquid Glass mode can be enabled for stronger devices
-   Liquid Glass preference is saved in localStorage
-   Glass surfaces use blur, transparency, soft borders, and layered shadows
-   Glass mode includes fallbacks for unsupported backdrop-filter browsers
-   Reduced-motion users receive lighter glass effects without extra motion
-   Buttons share consistent hover and active motion
-   Liquid Glass toggle was redesigned as a compact square icon button
-   Theme changes now show an accessible toast notification

## Mobile update

-   Header controls are optimized for small screens
-   Theme selector and search input fit mobile widths
-   Weather cards use tighter spacing on phones
-   Forecast rows become compact mobile cards instead of a wide table
-   Forecast descriptions no longer overflow on narrow screens
-   Theme, Glass, and Search controls use a stable mobile grid
-   Search input and button keep consistent height on phones
-   History and Favorites rows are easier to tap on narrow screens
-   Theme toast adapts to mobile widths

## History and refresh update

-   Clear History action was added
-   Clear all Favorites action was added
-   History and Favorites clear actions are placed in card headers
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
-   Cachetools
-   Pytest

Frontend

-   React
-   Vite
-   React Query
-   CSS variables for theme styling
-   prefers-color-scheme support
-   backdrop-filter based Liquid Glass styling

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

The backend provides weather, forecast, and city suggestion endpoints.

Search history, favorite cities, selected theme, and visual mode are stored
locally in the browser.

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
-   Advanced Liquid Glass performance presets
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
