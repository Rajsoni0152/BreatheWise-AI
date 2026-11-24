from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CityGeo(BaseModel):
    name: str
    country: str
    latitude: float
    longitude: float
    admin1: Optional[str] = None

class PollutantData(BaseModel):
    pm2_5: float = Field(..., description="PM2.5 concentration in µg/m³")
    pm10: float = Field(..., description="PM10 concentration in µg/m³")
    no2: Optional[float] = Field(None, description="NO2 concentration in µg/m³")
    so2: Optional[float] = Field(None, description="SO2 concentration in µg/m³")
    co: Optional[float] = Field(None, description="CO concentration in µg/m³")
    ozone: Optional[float] = Field(None, description="O3 concentration in µg/m³")
    us_aqi: int = Field(..., description="US Air Quality Index")
    category: str = Field(..., description="AQI category: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous")
    category_color: str
    health_recommendations: List[str]

class HourlyForecastPoint(BaseModel):
    time: str
    us_aqi: int
    pm2_5: float
    pm10: float

class AirQualityResponse(BaseModel):
    city: str
    country: str
    latitude: float
    longitude: float
    current: PollutantData
    hourly_trend: List[HourlyForecastPoint]
    source: str = "Open-Meteo Global Air Quality API (Copernicus CAMS & NOAA GFS)"
    last_updated: str
    is_live: bool = True

class ChatMessage(BaseModel):
    role: str # "user" or "assistant" or "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    city: Optional[str] = "Delhi"
    current_aqi: Optional[int] = 180
    pm2_5: Optional[float] = 110.0
    persona: Optional[str] = "general"

class ChatResponse(BaseModel):
    reply: str
    model_used: str
    provider: Optional[str] = "Google Gemini Live API"
    is_fallback: Optional[bool] = False
    error_detail: Optional[str] = None
    suggested_actions: Optional[List[str]] = []
    safety_level: Optional[str] = "moderate"

class RoutineRequest(BaseModel):
    city: str = "Delhi"
    aqi: int = 220
    pm2_5: float = 140.0
    lifestyle: str = Field("office_worker", description="student, office_worker, outdoor_worker, parent_with_child, senior_asthma")
    exercise_preference: str = Field("morning_jog", description="morning_jog, evening_walk, indoor_gym, no_exercise")
    commute_mode: str = Field("metro_transit", description="walk_cycle, bike_scooter, carpool_car, metro_transit")

class RoutineSlot(BaseModel):
    time_window: str
    activity: str
    air_quality_risk: str # Low, Moderate, High, Severe
    recommendation: str
    protective_action: str

class RoutineResponse(BaseModel):
    summary: str
    overall_guidance: str
    hourly_schedule: List[RoutineSlot]
    key_indoor_habits: List[str]
    peak_pollution_window: str
    best_outdoor_window: str

class TravelPlanRequest(BaseModel):
    city: str
    distance_km: float = Field(..., gt=0)
    current_aqi: int = 150
    user_vehicle: Optional[str] = "petrol_car" # petrol_car, diesel_suv, ev, motorbike

class TravelOption(BaseModel):
    mode: str
    icon: str
    duration_minutes: int
    co2_kg: float
    pm2_5_inhalation_risk: str # Low, Moderate, High, Critical
    cost_estimate: str
    is_recommended: bool
    explanation: str

class TravelPlanResponse(BaseModel):
    distance_km: float
    current_aqi: int
    options: List[TravelOption]
    greenest_option: str
    healthiest_option: str
    co2_savings_potential_kg: float
    assumptions_note: str

class LogActionRequest(BaseModel):
    action_type: str
    details: Optional[Dict[str, Any]] = {}

class LogActionResponse(BaseModel):
    success: bool
    action_type: str
    co2_avoided_kg: float
    points_earned: int
    streak_count: int
    feedback_message: str
    assumptions_explanation: str
