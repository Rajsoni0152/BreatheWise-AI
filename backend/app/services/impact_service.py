from typing import Dict, Any, List
from app.models.schemas import LogActionRequest, LogActionResponse

ACTION_DATABASE = {
    "public_transit": {
        "title": "Took Metro or Electric Transit",
        "co2_saved": 2.4, # kg CO2 avoided per average 15km trip vs single petrol car
        "points": 50,
        "feedback": "Outstanding! Taking public transit cuts vehicular nitrogen dioxide and traffic gridlock.",
        "assumption": "Calculated by comparing average 15 km metro commute (0.27 kg CO2) against solo passenger car (2.88 kg CO2)."
    },
    "carpool": {
        "title": "Shared Commute / Carpooled",
        "co2_saved": 1.8,
        "points": 40,
        "feedback": "Great initiative! Carpooling removes vehicles from morning smog congestion.",
        "assumption": "Based on sharing a 15 km ride among 3 commuters, dividing tailpipe emissions by 3."
    },
    "hepa_smart_mode": {
        "title": "Smart HEPA Air Purifier Optimization",
        "co2_saved": 0.35,
        "points": 25,
        "feedback": "Smart energy use! Auto-modulating your air purifier saves electricity while keeping PM2.5 low.",
        "assumption": "Saves ~0.45 kWh per day through sensor-based speed regulation on 50W purifier."
    },
    "low_emission_cooking": {
        "title": "Low-Emission Cookware & Kitchen Ventilation",
        "co2_saved": 0.45,
        "points": 30,
        "feedback": "Cleaner kitchen air! Using lids and proper ventilation cuts indoor VOCs and gas consumption.",
        "assumption": "Covers reduce thermal loss by 40%, saving ~0.15 cubic meters of natural gas / LPG per meal."
    },
    "plant_care": {
        "title": "Maintained Indoor Air-Filtering Houseplants",
        "co2_saved": 0.12,
        "points": 20,
        "feedback": "Living air filters! Plants like Snake Plants release oxygen at night and stabilize indoor moisture.",
        "assumption": "Estimated biogenic sequestration and natural indoor volatile organic compound absorption."
    },
    "telecommute": {
        "title": "Remote Work / Avoided Smog Commute",
        "co2_saved": 4.6,
        "points": 75,
        "feedback": "Super green! Working remotely on smog red-alert days entirely eliminates transit emissions.",
        "assumption": "Eliminates a 25 km round-trip commute and office space auxiliary HVAC overhead."
    },
    "mask_care": {
        "title": "Maintained Reusable N95 Respirator",
        "co2_saved": 0.08,
        "points": 15,
        "feedback": "Zero waste! Rotating and preserving respirators in paper bags prevents single-use microplastic waste.",
        "assumption": "Prevents disposal of polypropylene meltblown polymer masks into municipal landfills."
    }
}

def log_sustainable_action(req: LogActionRequest) -> LogActionResponse:
    action_key = req.action_type
    info = ACTION_DATABASE.get(action_key, {
        "title": "Sustainable Community Action",
        "co2_saved": 1.0,
        "points": 20,
        "feedback": "Thank you for taking positive action for cleaner urban air!",
        "assumption": "Estimated average urban emission mitigation metric."
    })

    return LogActionResponse(
        success=True,
        action_type=action_key,
        co2_avoided_kg=info["co2_saved"],
        points_earned=info["points"],
        streak_count=5, # Active user streak
        feedback_message=info["feedback"],
        assumptions_explanation=info["assumption"]
    )

def get_indoor_advisor_tips() -> Dict[str, Any]:
    return {
        "title": "Comprehensive Indoor Air Quality (IAQ) Masterplan",
        "rooms": [
            {
                "room": "Bedroom & Sleeping Sanctuary",
                "icon": "Bed",
                "risk_level": "High (8 hours continuous exposure)",
                "key_rules": [
                    "Keep bedroom doors and windows shut throughout the nocturnal temperature inversion (10 PM - 8 AM).",
                    "Place a True HEPA purifier 1.5 meters away from head of the bed on quiet whisper mode.",
                    "Use hypoallergenic, tightly woven pillow encasings to block fine dust mite allergens.",
                    "Add a Snake Plant (Sansevieria)—unlike most plants, it converts CO2 to Oxygen at night (CAM photosynthesis)."
                ]
            },
            {
                "room": "Kitchen & Cooking Zone",
                "icon": "Flame",
                "risk_level": "Critical (Combustion emissions)",
                "key_rules": [
                    "Always activate the kitchen range exhaust 2 minutes BEFORE igniting the gas burner.",
                    "Cook with tight-fitting lids: cuts cooking time by 30% and traps oil aerosols.",
                    "Avoid deep-frying and high-smoke charring during severe smog alerts.",
                    "Consider transitioning to an electric induction plate to eliminate indoor nitrogen dioxide (NO2)."
                ]
            },
            {
                "room": "Living Room & Entryway",
                "icon": "Home",
                "risk_level": "Moderate (Frequent door openings)",
                "key_rules": [
                    "Place double rubber weather-strips or draft stoppers under the main entrance door.",
                    "Establish a clean-entry threshold: remove outdoor shoes and jackets at the door to prevent tracking street soot.",
                    "Damp mop hard floors with water and mild soap; never dry-sweep or use harsh aerosol spray air fresheners.",
                    "Maintain indoor humidity between 40% and 50% using a clean ultrasonic humidifier."
                ]
            },
            {
                "room": "Home Office & Study",
                "icon": "Monitor",
                "risk_level": "Moderate",
                "key_rules": [
                    "Monitor CO2 levels: if CO2 exceeds 1000 ppm, open an interior hallway door rather than outside windows.",
                    "Position desk away from window draft drafts.",
                    "Keep indoor humidity optimal to soothe dry airways caused by winter heating."
                ]
            }
        ],
        "top_purifying_plants": [
            {"name": "Snake Plant (Sansevieria)", "benefit": "Releases nighttime oxygen, filters formaldehyde & benzene"},
            {"name": "Spider Plant (Chlorophytum)", "benefit": "Removes carbon monoxide & xylene, pet safe"},
            {"name": "Peace Lily (Spathiphyllum)", "benefit": "Traps mold spores & acetone, thrives in low light"},
            {"name": "Areca Palm (Dypsis lutescens)", "benefit": "Natural winter humidifier and general air purifier"}
        ]
    }
