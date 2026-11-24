import React from 'react';
import { AlertTriangle, ShieldAlert, Wind, ChevronRight } from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { getAQIInfo } from '../utils/aqiUtils';

export function HealthAlertBanner({ onOpenAssistant }) {
  const { data, selectedCity } = useAirQuality();

  if (!data?.current) return null;
  const aqi = data.current.us_aqi;
  const aqiInfo = getAQIInfo(aqi);

  // Only show urgent warning banner if AQI > 100
  if (aqi <= 100) return null;

  const isSevere = aqi > 200;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 mb-6 border transition-all ${
        isSevere
          ? 'bg-gradient-to-r from-rose-950/70 via-purple-950/50 to-slate-900 border-rose-500/40 glow-rose'
          : aqi > 150
          ? 'bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-slate-900 border-orange-500/40 glow-orange'
          : 'bg-gradient-to-r from-amber-950/60 via-yellow-950/30 to-slate-900 border-amber-500/40'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              isSevere
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : aqi > 150
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            {isSevere ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isSevere ? 'text-rose-400' : aqi > 150 ? 'text-orange-400' : 'text-amber-400'
              }`}>
                {isSevere ? 'Severe Smog Advisory' : aqi > 150 ? 'Unhealthy Air Quality Advisory' : 'Elevated Air Pollution Alert'}
              </span>
              <span className="text-xs text-slate-400">• {selectedCity}</span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 mt-0.5">
              Current AQI is {aqi} ({aqiInfo.label}). Fine particulate PM2.5 is at {data.current.pm2_5} µg/m³.
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {isSevere
                ? 'Avoid outdoor cardio and morning runs. Wear a certified airtight N95/N99 respirator outdoors and seal residential windows.'
                : aqi > 150
                ? 'Everyone may begin to experience health effects; sensitive groups should avoid outdoor exercise. Wear an N95 mask outdoors and run indoor HEPA purifiers.'
                : 'Sensitive groups, children, and athletes should limit prolonged outdoor exertion and keep indoor air purifiers active.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-sm border border-white/20 transition shrink-0 self-start sm:self-center"
        >
          <span>Ask AI Copilot for Safety Tips</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
