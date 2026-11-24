from typing import List
from app.models.schemas import RoutineRequest, RoutineResponse, RoutineSlot

PERSONA_GUIDES = {
    "student": {
        "title": "Student & Young Scholar",
        "focus": "Classroom air safety, campus transit, study hours air optimization"
    },
    "office_worker": {
        "title": "Corporate & Remote Professional",
        "focus": "Commute window timing, indoor office air, midday movement"
    },
    "outdoor_worker": {
        "title": "Essential Field & Outdoor Worker",
        "focus": "Respirator seal duration, hydration, shift-rotation dust shielding"
    },
    "parent_with_child": {
        "title": "Parent with Infant or Toddler",
        "focus": "Stroller covers, nursery HEPA air cleaning, safe outdoor play windows"
    },
    "senior_asthma": {
        "title": "Senior or Respiratory / Cardiac Care",
        "focus": "Strict zero-inversion exposure, bronchodilator readiness, micro-filtered breathing zone"
    }
}

def generate_smart_routine(req: RoutineRequest) -> RoutineResponse:
    city = req.city
    aqi = req.aqi
    lifestyle = req.lifestyle
    exercise = req.exercise_preference
    commute = req.commute_mode

    persona_info = PERSONA_GUIDES.get(lifestyle, PERSONA_GUIDES["office_worker"])

    # Determine peak pollution vs best window based on atmospheric diurnal cycle
    peak_window = "06:30 AM – 09:30 AM (Morning Inversion Peak)"
    best_outdoor_window = "01:00 PM – 03:30 PM (Solar Convection Peak)"

    # Build hour-by-hour smart schedule
    schedule: List[RoutineSlot] = []

    # Slot 1: Early Morning (06:00 - 08:30)
    if aqi > 200:
        morning_risk = "Severe"
        morning_rec = (
            "Avoid outdoor running or walking. Ground thermal inversion traps diesel and particulate matter at breathing height."
        )
        morning_action = "Do 25-min indoor bodyweight or yoga in a HEPA-purified room. Keep all exterior windows sealed."
    elif aqi > 100:
        morning_risk = "High"
        morning_rec = "Shift heavy aerobic exercise indoors. Light stretching only."
        morning_action = "N95 mask required if stepping out for early errands."
    else:
        morning_risk = "Low"
        morning_rec = "Safe for outdoor morning jog or walk. Fresh crisp air."
        morning_action = "Enjoy outdoor morning sunshine."

    schedule.append(RoutineSlot(
        time_window="06:30 AM – 08:00 AM",
        activity="Morning Routine & Exercise",
        air_quality_risk=morning_risk,
        recommendation=morning_rec,
        protective_action=morning_action
    ))

    # Slot 2: Morning Commute (08:30 - 09:45)
    commute_risk = "Severe" if aqi > 200 else ("High" if aqi > 100 else "Moderate")
    if commute == "walk_cycle" and aqi > 150:
        commute_rec = "High hyperventilation risk: cycling or walking in AQI > 150 increases lung particulate uptake 500%."
        commute_action = "Switch to Metro or carpool today. If walking is mandatory, wear a snug-fitting N95."
    elif commute == "metro_transit":
        commute_rec = "Optimal green choice: underground and modern train cars feature heavy particulate filtration."
        commute_action = "Wear N95 on the platform; remove or keep relaxed inside filtered train coach."
    else:
        commute_rec = "Keep vehicle windows rolled up and switch AC to internal air recirculation mode."
        commute_action = "Check cabin pollen/PM2.5 filter status."

    schedule.append(RoutineSlot(
        time_window="08:30 AM – 09:45 AM",
        activity="Morning Transit & Commute",
        air_quality_risk=commute_risk,
        recommendation=commute_rec,
        protective_action=commute_action
    ))

    # Slot 3: Midday Work & Ventilation (12:00 - 15:00)
    schedule.append(RoutineSlot(
        time_window="01:00 PM – 03:00 PM",
        activity="Midday Window & Lunch",
        air_quality_risk="Moderate" if aqi > 200 else "Low",
        recommendation="Solar heating reaches maximum height, lifting the inversion layer and slightly dispersing surface PM2.5.",
        protective_action="Best time for a 10-minute fresh air pulse ventilation indoors. Great slot for outdoor lunchtime walk."
    ))

    # Slot 4: Evening Commute & Dusk (17:30 - 19:30)
    schedule.append(RoutineSlot(
        time_window="05:30 PM – 07:30 PM",
        activity="Evening Commute & Return Home",
        air_quality_risk="High" if aqi > 150 else "Moderate",
        recommendation="Evening rush hour emissions combine with falling ambient temperatures as the inversion layer reforms.",
        protective_action="Wear N95 respirator. Close vehicle vents. Transition straight indoors upon arrival."
    ))

    # Slot 5: Dinner & Indoor Air Shield (19:30 - 22:30)
    schedule.append(RoutineSlot(
        time_window="08:00 PM – 10:30 PM",
        activity="Dinner & Sleep Preparation",
        air_quality_risk="Severe" if aqi > 200 else "Moderate",
        recommendation="Outdoor pollution climbs to secondary diurnal peak due to cold nocturnal air and stagnant winds.",
        protective_action="Run kitchen exhaust hood while cooking. Turn bedroom air purifier to Sleep/Quiet mode 30 min before bed."
    ))

    overall_guidance = (
        f"Smart plan customized for {persona_info['title']} in {city} (AQI: {aqi}). "
        f"Your highest risk window is the morning thermal inversion between 6:30 AM - 9:30 AM. "
        f"Prioritize clean indoor breathing zones and timing your outdoor transit during peak solar dispersal."
    )

    key_indoor_habits = [
        "Seal door thresholds with draft stoppers to block hallway and street smog infiltration.",
        "Use induction cooktops or tight lids with kitchen exhaust fans running on high.",
        "Damp mop hard floors daily rather than dry vacuuming or sweeping.",
        "Keep bedside HEPA purifier running at clean whisper mode continuously throughout sleep.",
        "Place purifying plants (Snake Plant, Spider Plant) in living areas for humidity stabilization."
    ]

    return RoutineResponse(
        summary=f"Personalized Low-Emission Daily Routine for {city}",
        overall_guidance=overall_guidance,
        hourly_schedule=schedule,
        key_indoor_habits=key_indoor_habits,
        peak_pollution_window=peak_window,
        best_outdoor_window=best_outdoor_window
    )
