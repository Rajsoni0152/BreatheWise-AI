// AQI Scale classification conforming to US EPA & WHO guidelines

export const AQI_LEVELS = [
  { min: 0, max: 50, label: 'Good', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', hex: '#10b981' },
  { min: 51, max: 100, label: 'Moderate', color: 'lime', bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-400', hex: '#84cc16' },
  { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups', color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', hex: '#f59e0b' },
  { min: 151, max: 200, label: 'Unhealthy', color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', hex: '#f97316' },
  { min: 201, max: 300, label: 'Very Unhealthy', color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', hex: '#a855f7' },
  { min: 301, max: 999, label: 'Hazardous', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', hex: '#e11d48' },
];

export function getAQIInfo(aqi) {
  const value = Math.max(0, Number(aqi) || 0);
  for (const level of AQI_LEVELS) {
    if (value <= level.max) {
      return {
        ...level,
        aqi: value,
        percentage: Math.min(100, (value / 500) * 100),
      };
    }
  }
  return {
    ...AQI_LEVELS[AQI_LEVELS.length - 1],
    aqi: value,
    percentage: 100,
  };
}

export function getPrecautions(aqi) {
  if (aqi <= 50) {
    return {
      mask: 'Not needed',
      maskType: 'None',
      exercise: 'Ideal for all outdoor activities and vigorous cardio',
      windows: 'Open windows freely for cross-ventilation',
      purifier: 'Standby / low mode'
    };
  } else if (aqi <= 100) {
    return {
      mask: 'Optional (sensitive groups)',
      maskType: 'Surgical or cloth',
      exercise: 'Safe for most; sensitive groups monitor symptoms',
      windows: 'Open during afternoon sunshine',
      purifier: 'Auto / Eco mode'
    };
  } else if (aqi <= 150) {
    return {
      mask: 'Recommended near traffic',
      maskType: 'N95 / FFP2 for sensitive individuals',
      exercise: 'Limit prolonged outdoor workouts; shift cardio indoors',
      windows: 'Close during morning and night inversions',
      purifier: 'Run in bedroom and living spaces'
    };
  } else if (aqi <= 200) {
    return {
      mask: 'Required outdoors',
      maskType: 'N95 / KN95 / FFP2 with airtight nose seal',
      exercise: 'Cancel outdoor sports; workout in filtered indoor rooms',
      windows: 'Keep tightly sealed; seal door bottoms with draft stoppers',
      purifier: 'Run continuously on medium-high with True HEPA filter'
    };
  } else if (aqi <= 300) {
    return {
      mask: 'Critical requirement',
      maskType: 'N95 or N99 respirator with snug fit',
      exercise: 'Avoid outdoor exertion completely; rest indoors',
      windows: 'Strictly sealed; use damp towels for window frame gaps',
      purifier: 'High output HEPA filtration in all active zones'
    };
  } else {
    return {
      mask: 'Mandatory respirator',
      maskType: 'N99 / FFP3 respirator with particulate valves',
      exercise: 'Severe danger: remain indoors with minimal physical exertion',
      windows: 'Emergency seal; avoid opening exterior doors',
      purifier: 'Maximum continuous HEPA purification'
    };
  }
}
