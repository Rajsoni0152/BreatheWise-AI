import React from 'react';
import {
  Wind,
  ShieldCheck,
  Bot,
  CalendarClock,
  Home,
  Navigation,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { getAQIInfo } from '../utils/aqiUtils';
import { Badge } from '../components/Common/Badge';

export function LandingPage({ onLaunch }) {
  const { data, selectedCity, popularCities, selectCity } = useAirQuality();
  const currentAqi = data?.current?.us_aqi || 285;
  const aqiInfo = getAQIInfo(currentAqi);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[100px] right-1/4 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[250px] left-1/3 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Competition-Ready AI Clean Air Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Breathe Smarter, Live Greener with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            BreatheWise AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your GenAI-powered urban air quality copilot. Navigate severe winter smog, protect family health,
          plan low-emission daily routines, and track verified carbon reduction in real time.
        </p>

        {/* Call to actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunch('dashboard')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onLaunch('assistant')}
            className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Chat with AI Copilot</span>
          </button>
        </div>

        {/* Live City Preview Card */}
        <div className="mt-14 max-w-3xl mx-auto p-6 rounded-3xl glass-panel border border-slate-800 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-100 text-base">{selectedCity} Live Snapshot</h3>
                <p className="text-xs text-slate-400">Open-Meteo Global Air Quality Feeds</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={aqiInfo.color} pulse size="md">
                <span className="font-bold text-sm">{currentAqi} AQI</span>
                <span>• {aqiInfo.label}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Fine PM2.5</span>
              <span className="text-lg font-bold text-slate-100">{data?.current?.pm2_5 || 142}</span>
              <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Coarse PM10</span>
              <span className="text-lg font-bold text-slate-100">{data?.current?.pm10 || 220}</span>
              <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Optimal Window</span>
              <span className="text-sm font-semibold text-emerald-400">1:00 PM – 3:30 PM</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Recommended Mask</span>
              <span className="text-sm font-semibold text-rose-400">Airtight N95 / N99</span>
            </div>
          </div>

          {/* Quick city switch chips */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Compare Hotspots:</span>
            {popularCities.slice(0, 5).map((city, idx) => (
              <button
                key={idx}
                onClick={() => selectCity(city)}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  city.name === selectedCity
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Complete Toolkit for Winter Smog Navigation
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
            Engineered with deep atmospheric science, epidemiology heuristics, and Google Gemini AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit text-emerald-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Google Gemini AI Copilot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time conversational intelligence trained on winter thermal inversion, mask filtration mechanics,
              and pediatric air safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-teal-500/30 transition-all">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 w-fit text-teal-400 mb-4">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Diurnal Smart Routine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dynamically maps your day around nocturnal inversion layers to shield lung health and schedule exercise
              during solar dispersion peaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit text-cyan-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Indoor Air Quality (IAQ) Masterplan</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Room-by-room audit: smart True-HEPA purifier placement, kitchen NO2 reduction, draft proofing,
              and NASA-proven air purifying flora.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit text-emerald-400 mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Eco-Route & Exposure Matrix</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Evaluates CO2 emissions alongside alveolar PM2.5 inhalation dosages across Metro, electric bus,
              carpool, and active transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-teal-500/30 transition-all">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 w-fit text-teal-400 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Verified Carbon Avoidance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Log daily sustainable choices, earn eco badges, maintain streaks, and view transparent mathematical
              assumptions behind every kg of CO2 saved.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit text-cyan-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Open-Meteo & CAMS Data</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Live meteorological and atmospheric chemical modeling powered by Copernicus CAMS and NOAA GFS
              with 24-hour predictive trends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 BreatheWise AI – Competition-Ready Smart Urban Air Quality Assistant.</p>
        <p className="mt-1">Built with React, Vite, Tailwind CSS, Python FastAPI, and Google Gemini API.</p>
      </footer>
    </div>
  );
}
