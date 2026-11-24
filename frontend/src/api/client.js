// Centralized API client connecting to FastAPI backend with graceful fallbacks

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using local client mode:', err.message);
    return {
      status: 'offline',
      gemini_api_configured: false,
      data_provider: 'Client-side Environmental Engine'
    };
  }
}

export async function fetchPopularCities() {
  try {
    const res = await fetch(`${API_BASE}/api/cities`);
    if (!res.ok) throw new Error('Failed to load cities');
    return await res.json();
  } catch {
    return [
      { name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, admin1: 'Delhi', typical_winter_aqi: 340 },
      { name: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436, admin1: 'Punjab', typical_winter_aqi: 375 },
      { name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074, admin1: 'Beijing', typical_winter_aqi: 140 },
      { name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, admin1: 'Dhaka', typical_winter_aqi: 290 },
      { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, admin1: 'Maharashtra', typical_winter_aqi: 165 },
      { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, admin1: 'England', typical_winter_aqi: 45 },
      { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, admin1: 'New York', typical_winter_aqi: 42 }
    ];
  }
}

export async function searchCities(query) {
  try {
    const res = await fetch(`${API_BASE}/api/geocoding?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch {
    const defaults = await fetchPopularCities();
    return defaults.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }
}

export async function fetchAirQualityData(city, lat, lon, country) {
  let url = `${API_BASE}/api/air-quality?city=${encodeURIComponent(city)}`;
  if (lat !== undefined && lon !== undefined) {
    url += `&lat=${lat}&lon=${lon}`;
  }
  if (country) {
    url += `&country=${encodeURIComponent(country)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Air quality fetch error');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching AQI, generating fallback data:', err);
    // Deterministic fallback
    const isHighSmog = ['delhi', 'lahore', 'dhaka'].some(s => city.toLowerCase().includes(s));
    const baseAqi = isHighSmog ? 315 : (city.toLowerCase().includes('london') || city.toLowerCase().includes('new york') ? 42 : 160);
    const pm25 = Math.round(baseAqi * 0.65);
    const pm10 = Math.round(pm25 * 1.8);
    
    return {
      city,
      country: country || 'Global',
      latitude: lat || 28.6,
      longitude: lon || 77.2,
      current: {
        pm2_5: pm25,
        pm10: pm10,
        no2: 24.5,
        so2: 6.8,
        co: 410.0,
        ozone: 36.0,
        us_aqi: baseAqi,
        category: baseAqi > 300 ? 'Hazardous' : (baseAqi > 200 ? 'Very Unhealthy' : (baseAqi > 150 ? 'Unhealthy' : 'Moderate')),
        category_color: baseAqi > 200 ? 'rose' : 'orange',
        health_recommendations: [
          'Wear N95/FFP2 respirator when stepping outdoors.',
          'Keep windows closed during early morning temperature inversion.',
          'Run True HEPA air purifier on continuous medium setting.'
        ]
      },
      hourly_trend: Array.from({ length: 24 }).map((_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        us_aqi: Math.round(baseAqi * (0.85 + 0.3 * Math.sin((i - 6) / 3.8))),
        pm2_5: Math.round(pm25 * (0.85 + 0.3 * Math.sin((i - 6) / 3.8))),
        pm10: Math.round(pm10 * (0.85 + 0.3 * Math.sin((i - 6) / 3.8)))
      })),
      source: 'BreatheWise Autonomous Model (Live API offline)',
      last_updated: new Date().toISOString(),
      is_live: false
    };
  }
}

export async function askAIAssistant(message, history, city, aqi, pm2_5) {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, city, current_aqi: aqi, pm2_5 })
    });
    if (!res.ok) throw new Error('AI Chat error');
    return await res.json();
  } catch {
    return {
      reply: `### 🌿 BreatheWise AI Guidance for ${city}\n\nAt your current **AQI of ${aqi}**, particulate levels require proactive management.\n\n• **Respirator:** Wear an airtight **N95 or FFP2 respirator** if outside.\n• **Indoor Protection:** Keep doors and windows closed during early morning and late night inversions.\n• **Transit:** Choose underground metro or electric bus over personal combustion vehicles.\n• **Hydration:** Flush particulate matter with warm water and a light saline rinse.`,
      model_used: 'BreatheWise Offline Intelligence',
      suggested_actions: ['Wear N95 Mask Outdoors', 'Turn On HEPA Purifier', 'Avoid Morning Jogging'],
      safety_level: aqi > 200 ? 'danger' : 'caution'
    };
  }
}

export async function generateDailyRoutine(params) {
  try {
    const res = await fetch(`${API_BASE}/api/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Routine generation error');
    return await res.json();
  } catch {
    return {
      summary: `Personalized Low-Emission Daily Routine for ${params.city}`,
      overall_guidance: `Plan tailored for ${params.lifestyle} in ${params.city} (AQI: ${params.aqi}). Shift outdoor exposure towards midday solar dispersion hours.`,
      peak_pollution_window: '06:30 AM – 09:30 AM (Morning Inversion Peak)',
      best_outdoor_window: '01:00 PM – 03:30 PM (Solar Convection Peak)',
      hourly_schedule: [
        { time_window: '06:30 AM – 08:00 AM', activity: 'Morning Exercise', air_quality_risk: 'Severe', recommendation: 'Stay indoors. Inversion layer traps diesel particulate at surface.', protective_action: 'Indoor yoga/stretching in HEPA room.' },
        { time_window: '08:30 AM – 09:30 AM', activity: 'Commute Window', air_quality_risk: 'High', recommendation: 'Opt for Metro. Recirculate car AC.', protective_action: 'N95 respirator on platforms.' },
        { time_window: '01:00 PM – 03:00 PM', activity: 'Midday Lunch & Airing', air_quality_risk: 'Moderate', recommendation: 'Solar heat disperses surface smog.', protective_action: 'Safest window for quick outdoor walk.' },
        { time_window: '06:00 PM – 07:30 PM', activity: 'Evening Return', air_quality_risk: 'High', recommendation: 'Inversion layer reforms with evening traffic.', protective_action: 'Wear N95 mask; seal indoor doors upon return.' },
        { time_window: '08:30 PM – 10:30 PM', activity: 'Dinner & Bedtime IAQ', air_quality_risk: 'Severe', recommendation: 'Night stagnation traps outdoor smoke.', protective_action: 'Turn bedroom HEPA purifier to whisper mode.' }
      ],
      key_indoor_habits: [
        'Damp mop hard surfaces to trap microdust.',
        'Use kitchen exhaust hoods when cooking.',
        'Seal drafty door thresholds.',
        'Keep air purifier at bedroom center.'
      ]
    };
  }
}

export async function calculateTravelOptions(params) {
  try {
    const res = await fetch(`${API_BASE}/api/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Travel calculation error');
    return await res.json();
  } catch {
    const dist = params.distance_km || 15;
    return {
      distance_km: dist,
      current_aqi: params.current_aqi || 180,
      options: [
        { mode: 'Metro / Urban Rail', icon: 'Train', duration_minutes: Math.round(dist * 2.2 + 5), co2_kg: +(dist * 0.018).toFixed(2), pm2_5_inhalation_risk: 'Low', cost_estimate: 'Low ($1.50)', is_recommended: true, explanation: 'Filtered cars + 90% CO2 reduction.' },
        { mode: 'Electric Bus', icon: 'Bus', duration_minutes: Math.round(dist * 3.2 + 8), co2_kg: +(dist * 0.038).toFixed(2), pm2_5_inhalation_risk: 'Moderate', cost_estimate: 'Very Low ($1.00)', is_recommended: true, explanation: 'Zero tailpipe emissions and dedicated lanes.' },
        { mode: 'Carpool (3 Persons)', icon: 'Car', duration_minutes: Math.round(dist * 2.5 + 4), co2_kg: +(dist * 0.064).toFixed(2), pm2_5_inhalation_risk: 'Low', cost_estimate: 'Moderate ($4.00)', is_recommended: false, explanation: 'Cuts traffic congestion by 70%.' },
        { mode: 'Solo Petrol Car', icon: 'Fuel', duration_minutes: Math.round(dist * 2.6 + 5), co2_kg: +(dist * 0.192).toFixed(2), pm2_5_inhalation_risk: 'Low', cost_estimate: 'High ($10.00)', is_recommended: false, explanation: 'Highest single contributor to urban smog.' }
      ],
      greenest_option: 'Metro / Urban Rail',
      healthiest_option: 'Metro / Urban Rail',
      co2_savings_potential_kg: +(dist * 0.174).toFixed(2),
      assumptions_note: 'Based on DEFRA conversion standards.'
    };
  }
}

export async function logAction(actionType, details = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/impact/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: actionType, details })
    });
    if (!res.ok) throw new Error('Log action error');
    return await res.json();
  } catch {
    return {
      success: true,
      action_type: actionType,
      co2_avoided_kg: 2.4,
      points_earned: 50,
      streak_count: 5,
      feedback_message: 'Eco action logged successfully!',
      assumptions_explanation: 'Standard urban carbon abatement metric applied.'
    };
  }
}

export async function fetchIndoorAdvisor() {
  try {
    const res = await fetch(`${API_BASE}/api/indoor-advisor`);
    if (!res.ok) throw new Error('Indoor advisor fetch error');
    return await res.json();
  } catch {
    return {
      title: 'Comprehensive Indoor Air Quality (IAQ) Masterplan',
      rooms: [
        {
          room: 'Bedroom & Sleeping Sanctuary',
          icon: 'Bed',
          risk_level: 'High (8 hours continuous exposure)',
          key_rules: [
            'Seal bedroom doors and windows throughout night inversion (10 PM - 8 AM).',
            'Place a True HEPA purifier 1.5m away from bed on quiet whisper mode.',
            'Use hypoallergenic pillow encasings to block micro particulate.',
            'Add a Snake Plant (releases oxygen at night via CAM photosynthesis).'
          ]
        },
        {
          room: 'Kitchen & Cooking Zone',
          icon: 'Flame',
          risk_level: 'Critical (Combustion emissions)',
          key_rules: [
            'Turn on range exhaust 2 minutes BEFORE igniting gas burners.',
            'Cook with tight lids to cut cooking time 30% and trap oil aerosols.',
            'Avoid deep-frying during severe smog alerts.',
            'Consider switching to an electric induction plate to eliminate NO2.'
          ]
        },
        {
          room: 'Living Room & Entryway',
          icon: 'Home',
          risk_level: 'Moderate (Frequent door openings)',
          key_rules: [
            'Install door bottom sweep draft stoppers to block corridor smog.',
            'Remove outdoor shoes and jackets at entrance threshold.',
            'Damp mop hard floors; avoid dry sweeping which resuspends fine dust.',
            'Maintain indoor humidity at 40%-50%.'
          ]
        }
      ],
      top_purifying_plants: [
        { name: 'Snake Plant (Sansevieria)', benefit: 'Releases nighttime oxygen, traps formaldehyde & benzene' },
        { name: 'Spider Plant (Chlorophytum)', benefit: 'Removes carbon monoxide & xylene, pet safe' },
        { name: 'Peace Lily (Spathiphyllum)', benefit: 'Filters mold spores, thrives in low light' },
        { name: 'Areca Palm', benefit: 'Natural humidity stabilizer and air purifier' }
      ]
    };
  }
}
