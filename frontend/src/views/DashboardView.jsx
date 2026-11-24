import React, { useState } from 'react';
import {
  Wind,
  Shield,
  Activity,
  AlertCircle,
  Thermometer,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useAirQuality } from '../context/AirQualityContext';
import { getAQIInfo, getPrecautions } from '../utils/aqiUtils';
import { formatNumber, formatDateTime } from '../utils/formatters';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';
import { HealthAlertBanner } from '../components/HealthAlertBanner';

export function DashboardView({ onNavigate }) {
  const { data, loading, selectedCity, refreshData, setIsSearchOpen } = useAirQuality();
  const [metricView, setMetricView] = useState('us_aqi'); // 'us_aqi', 'pm2_5', 'pm10'

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Retrieving real-time air quality metrics for {selectedCity}...</p>
      </div>
    );
  }

  const current = data?.current || {
    us_aqi: 220,
    pm2_5: 145,
    pm10: 235,
    no2: 28,
    so2: 8,
    co: 450,
    ozone: 30
  };

  const aqiInfo = getAQIInfo(current.us_aqi);
  const precautions = getPrecautions(current.us_aqi);
  const hourlyData = data?.hourly_trend || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Dynamic Severe Alert Banner */}
      <HealthAlertBanner onOpenAssistant={() => onNavigate('assistant')} />

      {/* Main Top Grid: AQI Circular Meter Card + Pollutants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AQI Main Score Card (5 Cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between" glow={current.us_aqi > 200}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Air Quality</span>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedCity}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-xs font-normal text-emerald-400 hover:underline"
                  >
                    (Change)
                  </button>
                </h2>
              </div>
              <Badge variant={aqiInfo.color} pulse size="md">
                {aqiInfo.label}
              </Badge>
            </div>

            {/* Big Circular Metric Representation */}
            <div className="my-6 flex flex-col items-center text-center">
              <div
                className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center p-3 shadow-2xl transition-all"
                style={{
                  background: `radial-gradient(circle, rgba(15,23,42,0.95) 60%, ${aqiInfo.hex}22 100%)`,
                  border: `3px solid ${aqiInfo.hex}55`
                }}
              >
                <span className="text-xs text-slate-400 font-medium">US AQI Index</span>
                <span className="text-5xl font-extrabold text-white tracking-tight my-0.5">
                  {current.us_aqi}
                </span>
                <span className={`text-xs font-semibold ${aqiInfo.text}`}>
                  {aqiInfo.label}
                </span>

                {/* Ring Indicator */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed opacity-40 animate-spin"
                  style={{ borderColor: aqiInfo.hex, animationDuration: '40s' }}
                />
              </div>

              <p className="text-xs text-slate-300 max-w-xs mt-4">
                Primary pollutant is <strong>Fine Particulate (PM2.5)</strong> at{' '}
                <span className="text-emerald-400 font-semibold">{current.pm2_5} µg/m³</span>.
              </p>
            </div>
          </div>

          {/* Source Attribution & Timestamp */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 truncate max-w-[220px]">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {data?.is_live ? 'Live: Open-Meteo & Copernicus CAMS' : 'Deterministic Environmental Model'}
            </span>
            <span className="shrink-0">{formatDateTime(data?.last_updated)}</span>
          </div>
        </Card>

        {/* Right: Detailed Pollutant Breakdown Grid (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">PM2.5</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Fine Dust</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.pm2_5} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {current.pm2_5 > 75 ? '⚠️ Exceeds WHO guideline by 15x' : 'Within normal range'}
              </p>
            </div>
          </Card>

          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">PM10</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Coarse Dust</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Road dust & construction particulate</p>
            </div>
          </Card>

          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">NO2</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Traffic Exhaust</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.no2} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Nitrogen dioxide from diesel & vehicles</p>
            </div>
          </Card>

          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Ozone (O3)</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Photochemical</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.ozone} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ground level oxidizer in sunlight</p>
            </div>
          </Card>

          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Carbon Monoxide</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">CO</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.co} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Incomplete fuel combustion gas</p>
            </div>
          </Card>

          <Card hover className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">SO2</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Industrial</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {current.so2} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Sulfur dioxide emissions</p>
            </div>
          </Card>
        </div>
      </div>

      {/* 24-Hour Pollution Trend & Inversion Cycle Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-base text-white">24-Hour Atmospheric Pollution Trend</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice the diurnal peak during morning and nocturnal temperature inversions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMetricView('us_aqi')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                metricView === 'us_aqi' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              AQI
            </button>
            <button
              onClick={() => setMetricView('pm2_5')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                metricView === 'pm2_5' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              PM2.5 (µg/m³)
            </button>
            <button
              onClick={() => setMetricView('pm10')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                metricView === 'pm10' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              PM10 (µg/m³)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pollutionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={aqiInfo.hex} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={aqiInfo.hex} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              <ReferenceLine y={100} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Moderate (100)', fill: '#eab308', fontSize: 10 }} />
              <ReferenceLine y={200} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Unhealthy (200)', fill: '#f97316', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey={metricView}
                stroke={aqiInfo.hex}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#pollutionGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Health Precautions & Protective Action Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <Shield className="w-4 h-4" />
            <span>Outdoor Mask Protocol</span>
          </div>
          <p className="text-sm font-bold text-white mb-1">{precautions.maskType}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{precautions.mask}</p>
        </Card>

        <Card hover className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-2">
            <Activity className="w-4 h-4" />
            <span>Outdoor Exercise</span>
          </div>
          <p className="text-sm font-bold text-white mb-1">Workout Timing</p>
          <p className="text-xs text-slate-400 leading-relaxed">{precautions.exercise}</p>
        </Card>

        <Card hover className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            <Wind className="w-4 h-4" />
            <span>Ventilation Windows</span>
          </div>
          <p className="text-sm font-bold text-white mb-1">Window Status</p>
          <p className="text-xs text-slate-400 leading-relaxed">{precautions.windows}</p>
        </Card>

        <Card hover className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Layers className="w-4 h-4" />
            <span>Air Purifier (IAQ)</span>
          </div>
          <p className="text-sm font-bold text-white mb-1">HEPA Setting</p>
          <p className="text-xs text-slate-400 leading-relaxed">{precautions.purifier}</p>
        </Card>
      </div>

      {/* Quick Launch Cards to Routine & Travel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('routine')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 text-left flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 2: Daily Life</span>
            <h4 className="text-base font-bold text-white mt-1">Generate Your Smart Daily Routine</h4>
            <p className="text-xs text-slate-400 mt-1">
              Personalized hour-by-hour schedule avoiding the morning thermal smog peak.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('travel')}
          className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-teal-500/40 text-left flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 3: Commute</span>
            <h4 className="text-base font-bold text-white mt-1">Plan Eco-Friendly & Low-Exposure Travel</h4>
            <p className="text-xs text-slate-400 mt-1">
              Compare Metro, electric bus, cycling, and car emissions and inhalation risks.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
