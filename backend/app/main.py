from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import Optional, List, Dict, Any

from app.config import ALLOWED_ORIGINS, GEMINI_API_KEY, GEMINI_MODEL
from app.models.schemas import (
    AirQualityResponse, CityGeo,
    ChatRequest, ChatResponse,
    RoutineRequest, RoutineResponse,
    TravelPlanRequest, TravelPlanResponse,
    LogActionRequest, LogActionResponse
)
from app.services.air_quality_service import (
    fetch_air_quality, search_city_geocoding, get_default_cities
)
from app.services.gemini_service import ask_gemini
from app.services.routine_service import generate_smart_routine
from app.services.travel_service import plan_eco_travel
from app.services.impact_service import (
    log_sustainable_action, get_indoor_advisor_tips
)

app = FastAPI(
    title="BreatheWise AI – Urban Air Quality Assistant",
    description="GenAI-powered assistant for winter smog defense, sustainable daily routines, and eco-impact tracking.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")
    return {
        "status": "healthy",
        "service": "BreatheWise AI Backend",
        "version": "1.0.0",
        "gemini_api_configured": has_gemini,
        "gemini_model": GEMINI_MODEL if has_gemini else "Fallback Autonomous Engine",
        "data_provider": "Open-Meteo Global Air Quality API (Copernicus CAMS)"
    }

@app.get("/api/cities", response_model=List[Dict[str, Any]])
async def get_popular_cities():
    """Returns curated smog hotspots and global cities."""
    return get_default_cities()

@app.get("/api/geocoding", response_model=List[CityGeo])
async def search_cities(query: str = Query(..., min_length=1, description="City name to search")):
    """Searches global cities using Open-Meteo Geocoding API with local cache."""
    return await search_city_geocoding(query)

@app.get("/api/air-quality", response_model=AirQualityResponse)
async def get_city_air_quality(
    city: str = Query("Delhi"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    country: Optional[str] = Query("")
):
    """
    Fetches real-time AQI, PM2.5, PM10, trace gases, and 24h trend data.
    If lat/lon not provided, geocodes the city name automatically.
    """
    target_lat = lat
    target_lon = lon
    target_country = country or ""

    if target_lat is None or target_lon is None:
        matches = await search_city_geocoding(city)
        if matches:
            target_lat = matches[0].latitude
            target_lon = matches[0].longitude
            target_country = matches[0].country
        else:
            # Default to Delhi coordinates
            target_lat = 28.6139
            target_lon = 77.2090
            target_country = "India"

    return await fetch_air_quality(
        city_name=city,
        lat=target_lat,
        lon=target_lon,
        country=target_country
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    """
    Intelligent environmental assistant powered by Google Gemini (with autonomous fallback).
    """
    return await ask_gemini(
        message=req.message,
        history=req.history or [],
        city=req.city or "Delhi",
        aqi=req.current_aqi or 180,
        pm2_5=req.pm2_5 or 110.0
    )

@app.post("/api/routine", response_model=RoutineResponse)
async def create_smart_routine(req: RoutineRequest):
    """
    Generates personalized daily routine mitigating peak winter smog exposure.
    """
    return generate_smart_routine(req)

@app.post("/api/travel", response_model=TravelPlanResponse)
async def plan_travel(req: TravelPlanRequest):
    """
    Evaluates travel modes by carbon emissions and particulate inhalation dosage.
    """
    return plan_eco_travel(req)

@app.post("/api/impact/log", response_model=LogActionResponse)
async def log_impact_action(req: LogActionRequest):
    """
    Logs sustainable actions (public transit, smart HEPA, telecommute, etc.)
    and provides verified avoided CO2 estimates.
    """
    return log_sustainable_action(req)

@app.get("/api/indoor-advisor")
async def get_indoor_advice():
    """
    Provides comprehensive room-by-room Indoor Air Quality (IAQ) masterplan.
    """
    return get_indoor_advisor_tips()

# Mount frontend build static files if present, or fallback to backend embedded static app
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
static_dir = Path(__file__).resolve().parent / "static"

if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}", response_class=FileResponse)
    async def serve_spa(full_path: str):
        target_file = frontend_dist / full_path
        if target_file.is_file():
            return FileResponse(target_file)
        return FileResponse(frontend_dist / "index.html")
elif static_dir.exists() and (static_dir / "index.html").exists():
    @app.get("/", response_class=FileResponse)
    async def serve_embedded_app():
        return FileResponse(static_dir / "index.html")
else:
    @app.get("/", response_class=HTMLResponse)
    async def root_preview():
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>BreatheWise AI – API Service</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; text-align: center; }
            .card { max-width: 600px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
            h1 { color: #10b981; margin-bottom: 8px; }
            p { color: #94a3b8; line-height: 1.6; }
            a.btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #10b981; color: #0f172a; font-weight: bold; text-decoration: none; border-radius: 8px; }
            a.btn:hover { background: #34d399; }
            .badge { display: inline-block; background: #064e3b; color: #6ee7b7; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">🌿 BreatheWise AI Engine Active</span>
            <h1>BreatheWise AI Backend</h1>
            <p>Your Smart Urban Air Quality Assistant API is operational and serving real-time air quality forecasts, Google Gemini AI responses, and eco-travel plans.</p>
            <a class="btn" href="/docs">Explore Interactive Swagger API Docs</a>
          </div>
        </body>
        </html>
        """
