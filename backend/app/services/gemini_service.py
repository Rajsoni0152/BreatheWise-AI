import logging
import httpx
from typing import List, Dict, Any, Optional
from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.models.schemas import ChatMessage, ChatResponse

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_INSTRUCTION = """
You are BreatheWise AI, the world's leading smart urban air quality assistant, environmental epidemiologist, and sustainable living coach.
Your mission is to help families, professionals, children, athletes, and vulnerable communities navigate severe winter smog and urban air pollution safely while reducing their carbon and particulate footprint.

Guiding Principles:
1. Explain atmospheric science and health impacts in clear, empathetic, scientifically accurate terms.
2. Emphasize the dangers of fine particulate matter (PM2.5) which enters the bloodstream and deep lung alveoli, causing vascular inflammation and respiratory stress.
3. Explain the Winter Inversion phenomenon: cold air traps particulate matter near the surface beneath a layer of warm air, worsening ground-level pollution between dusk and dawn.
4. Give concrete, practical mitigation advice (N95/FFP2 masks, true HEPA filtration, sealing door gaps, wet mopping instead of dry dusting, cooking with lids and exhaust on).
5. Always offer constructive, low-emission travel and routine alternatives.
6. Format your answers with clear markdown bullet points, bold highlights, and friendly section headers.
"""

# High-quality fallback answers for common air quality inquiries if live API is unavailable
FALLBACK_KNOWLEDGE_BASE = [
    {
        "keywords": ["mask", "n95", "cloth", "surgical", "protection"],
        "reply": """### 😷 Respiratory Protection Against Severe Smog

**Why Cloth and Surgical Masks Fail for PM2.5:**
* Standard surgical and cloth masks only filter particles larger than 3 to 10 micrometers. Fine smog particles (PM2.5) measure **2.5 micrometers or smaller**—about 1/30th the width of human hair—and slip easily through gaps and loose weave.

**Recommended Standards:**
1. **N95 / FFP2 / KN95 Respirators:** Filter at least 95% of airborne particles down to 0.3 microns when worn with a tight seal around the bridge of your nose and chin.
2. **N99 / FFP3 Respirators:** Recommended for hazardous red-alert days (AQI > 300) or extended outdoor shifts.
3. **Fit Test is Key:** Ensure the metal nose clip is molded to your nose bridge. Facial hair can break the seal and reduce filtration efficiency by up to 60%.

**Reusability Tip:** Rotate 3 to 4 masks across consecutive days in breathable paper bags to allow moisture to evaporate cleanly."""
    },
    {
        "keywords": ["indoor", "purifier", "room", "window", "ventilation", "house"],
        "reply": """### 🏡 Indoor Air Quality Strategy During Smog Episodes

When outdoor AQI spikes above 150, indoor air can become equally toxic without active management:

1. **Keep Windows Closed During Inversion Peaks:** Keep exterior doors and windows firmly shut between **5:00 AM – 10:00 AM** and **7:00 PM – midnight**, when ground-level temperature inversions trap pollutants.
2. **Targeted Ventilation Window:** If outdoor AQI drops slightly during peak sunshine (1:00 PM – 3:30 PM), perform a brief 10-minute cross-ventilation, then immediately re-seal.
3. **True HEPA Filtration:** Position your air purifier in the center of the room at least 30 cm away from walls for unobstructed airflow. Run on medium-high for the first 30 minutes, then auto mode.
4. **Wet Mopping Over Sweeping:** Dry sweeping stirs settled toxic particles back into the breathing zone. Use a damp microfiber mop.
5. **Kitchen Ventilation:** Always turn on your kitchen exhaust hood before igniting the burner, and use tight lids on cookware to reduce indoor volatile organic compounds (VOCs)."""
    },
    {
        "keywords": ["exercise", "jog", "walk", "running", "gym", "outdoor"],
        "reply": """### 🏃‍♂️ Safe Exercise Guidelines Based on Current Air Quality

When you exercise vigorously, your ventilation rate increases from 6-8 liters of air per minute up to **50-80 liters per minute**, causing you to inhale up to 10 times more particulate matter directly into your lung tissue.

* **AQI 0 - 50 (Good):** Perfect for all outdoor runs, cycling, and sports.
* **AQI 51 - 100 (Moderate):** Safe for most; highly sensitive individuals should monitor throat irritation.
* **AQI 101 - 150 (Sensitive Alert):** Shift high-intensity cardio indoors. Gentle outdoor walks acceptable in the afternoon.
* **AQI 151 - 200 (Unhealthy):** Cancel all outdoor running, football, and cycling. Opt for indoor strength training, yoga, or treadmill workouts in a filtered room.
* **AQI 201+ (Hazardous):** Strictly remain indoors for physical activity. Even walking outdoors with an N95 mask requires caution."""
    },
    {
        "keywords": ["inversion", "winter", "smog", "fog", "why", "cold"],
        "reply": """### 🌫️ The Winter Inversion Effect Explained

Many people wonder: *Why does smog get so much worse in winter?*

* **Normal Atmosphere:** Normally, air near the earth's surface is warm and rises into cooler upper air, carrying vehicle emissions and industrial dust upward and dispersing them.
* **Winter Thermal Inversion:** During clear, cold winter nights, the ground cools rapidly through radiation. A layer of cold, dense air gets trapped close to the ground beneath a cap of warmer air.
* **The Smog Bowl:** This warm cap acts like a giant lid on top of the city. Vehicular exhaust, construction dust, and biomass smoke cannot escape vertically. Without strong horizontal winds, pollutants accumulate hour after hour until daytime solar heating breaks the inversion layer."""
    }
]

async def ask_gemini(message: str, history: List[ChatMessage] = [], city: str = "Delhi", aqi: int = 180, pm2_5: float = 110.0) -> ChatResponse:
    # Context enhancement
    context_prefix = (
        f"[Context: User is inquiring from {city}. Current Real-time AQI: {aqi}, PM2.5: {pm2_5} µg/m³. "
        f"Air Quality status is {_get_status_label(aqi)}.]\n\n"
    )

    last_error: Optional[str] = None
    has_configured_key = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")

    if has_configured_key:
        # Priority list of models starting with configured GEMINI_MODEL (e.g. gemini-2.5-flash)
        # followed by active operational flash models
        models_to_try = [GEMINI_MODEL]
        candidate_models = [
            "gemini-2.5-flash",
            "gemini-3.5-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.8-flash",
            "gemini-flash-latest"
        ]
        for m in candidate_models:
            if m not in models_to_try:
                models_to_try.append(m)

        # Format history for Gemini API
        contents = []
        for h in history[-6:]: # Include last 6 conversational turns
            role = "user" if h.role == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": h.content}]
            })
        
        # Add latest message with system context
        contents.append({
            "role": "user",
            "parts": [{"text": context_prefix + message}]
        })

        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": SYSTEM_INSTRUCTION}]
            },
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 900,
                "topP": 0.95
            }
        }

        for model_name in models_to_try:
            try:
                url = f"{GEMINI_API_URL.format(model=model_name)}?key={GEMINI_API_KEY}"
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            if text:
                                return ChatResponse(
                                    reply=text,
                                    model_used=f"Google Gemini ({model_name})",
                                    provider="Google Gemini Live API",
                                    is_fallback=False,
                                    error_detail=None,
                                    suggested_actions=_generate_quick_actions(aqi),
                                    safety_level=_get_safety_level(aqi)
                                )
                    else:
                        err_text = ""
                        try:
                            err_data = response.json()
                            err_text = err_data.get("error", {}).get("message", response.text[:200])
                        except Exception:
                            err_text = response.text[:200]
                        last_error = f"{model_name} HTTP {response.status_code}: {err_text}"
                        logger.warning(f"Gemini API attempt failed for {model_name}: {last_error}")
                        # Continue to next model in priority order
                        continue
            except Exception as e:
                last_error = f"{model_name} {type(e).__name__}: {str(e)}"
                logger.warning(f"Gemini API connection error for {model_name}: {last_error}")
                continue

    # --- Fallback Handling (Knowledge Base or Diurnal Advice) ---
    message_lower = message.lower()
    for item in FALLBACK_KNOWLEDGE_BASE:
        if any(kw in message_lower for kw in item["keywords"]):
            return ChatResponse(
                reply=item["reply"],
                model_used="BreatheWise Environmental Engine (Autonomous Mode)",
                provider="Autonomous Knowledge Base (Offline Fallback)" if has_configured_key else "Autonomous Knowledge Base (No API Key)",
                is_fallback=True,
                error_detail=last_error,
                suggested_actions=_generate_quick_actions(aqi),
                safety_level=_get_safety_level(aqi)
            )

    # General fallback response
    if has_configured_key:
        error_context_note = (
            f"\n\n*(Note: Live Google Gemini query was temporarily unreachable ({last_error or 'Network Timeout'}). "
            f"Displaying verified scientific advisory from BreatheWise Autonomous Environmental Engine.)*"
        )
    else:
        error_context_note = (
            f"\n\n*(Tip: Add your Google Gemini API key to `.env` to unlock open-domain GenAI conversations!)*"
        )

    default_reply = (
        f"### 🌿 BreatheWise AI Guidance for {city}\n\n"
        f"At your current **AQI of {aqi}** (PM2.5: **{pm2_5} µg/m³**), the atmosphere is classified as **{_get_status_label(aqi)}**.\n\n"
        f"**Immediate Protection Recommendations:**\n"
        f"• **Commute Safely:** Wear a certified **N95 respirator** whenever you are outdoors or on public transit.\n"
        f"• **Optimize Indoor Spaces:** Keep doors and windows closed during early morning temperature inversion peaks.\n"
        f"• **Low-Emission Commute:** Choose metro transit or carpooling over single-occupancy petrol vehicles to cut personal carbon and NOx output.\n"
        f"• **Hydration & Saline Rinse:** Drink warm fluids and use a mild saline nasal rinse after returning from outdoors to clear particulate residue from your upper respiratory tract."
        f"{error_context_note}"
    )

    return ChatResponse(
        reply=default_reply,
        model_used="BreatheWise Environmental Engine (Autonomous Mode)",
        provider="Autonomous Knowledge Base (Offline Fallback)" if has_configured_key else "Autonomous Knowledge Base (No API Key)",
        is_fallback=True,
        error_detail=last_error,
        suggested_actions=_generate_quick_actions(aqi),
        safety_level=_get_safety_level(aqi)
    )

def _get_status_label(aqi: int) -> str:
    if aqi <= 50: return "Good"
    if aqi <= 100: return "Moderate"
    if aqi <= 150: return "Unhealthy for Sensitive Groups"
    if aqi <= 200: return "Unhealthy"
    if aqi <= 300: return "Very Unhealthy"
    return "Hazardous"

def _get_safety_level(aqi: int) -> str:
    if aqi <= 50: return "safe"
    if aqi <= 100: return "moderate"
    if aqi <= 200: return "caution"
    return "danger"

def _generate_quick_actions(aqi: int) -> List[str]:
    if aqi > 200:
        return [
            "Wear N95/N99 Mask Outdoors",
            "Turn On Indoor HEPA Purifier",
            "Avoid Morning Outdoor Jogging",
            "Use Metro / Closed Transit"
        ]
    elif aqi > 100:
        return [
            "Limit Strenuous Outdoor Cardio",
            "Wear Mask Near Traffic Corridors",
            "Ventilate at Midday (1-3 PM)",
            "Carpool or Use Electric Bus"
        ]
    else:
        return [
            "Enjoy Outdoor Activities",
            "Open Windows for Fresh Air",
            "Walk or Cycle for Short Trips",
            "Maintain Indoor Houseplants"
        ]
