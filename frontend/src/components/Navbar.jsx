import React from 'react';
import { Search, MapPin, RefreshCw, Wind, Sparkles } from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { getAQIInfo } from '../utils/aqiUtils';
import { Badge } from './Common/Badge';

export function Navbar({ activeTab, setActiveTab }) {
  const { selectedCity, data, loading, refreshData, setIsSearchOpen } = useAirQuality();
  const aqiInfo = data?.current ? getAQIInfo(data.current.us_aqi) : null;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      {/* Brand logo & mobile indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wind className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                Breathe<span className="text-emerald-400">Wise</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Smart Urban Air Quality Assistant</p>
          </div>
        </button>
      </div>

      {/* Center / Right: City Selector & AQI Quick Pill */}
      <div className="flex items-center gap-3">
        {/* City button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all text-xs text-slate-200"
          title="Change City"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium max-w-[120px] truncate">{selectedCity}</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Search</span>
        </button>

        {/* Live AQI status pill */}
        {aqiInfo && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <Badge variant={aqiInfo.color} pulse size="sm">
              <span className="font-bold">{aqiInfo.aqi} AQI</span>
              <span className="hidden md:inline font-normal">({aqiInfo.label})</span>
            </Badge>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={refreshData}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Launch AI Copilot CTA */}
        <button
          onClick={() => setActiveTab('assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask AI Copilot</span>
        </button>
      </div>
    </header>
  );
}
