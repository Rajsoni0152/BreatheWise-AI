import React, { useState } from 'react';
import { Search, MapPin, X, Globe, Sparkles } from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { searchCities } from '../api/client';

export function CitySearchModal() {
  const { isSearchOpen, setIsSearchOpen, selectCity, popularCities } = useAirQuality();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  if (!isSearchOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const results = await searchCities(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg text-white">Select or Search City</h3>
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="relative mb-5">
          <input
            type="text"
            placeholder="Type any city (e.g. Delhi, Lahore, London, New York)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
            autoFocus
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition"
          >
            {searching ? 'Finding...' : 'Search'}
          </button>
        </form>

        {/* Dynamic Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Search Results
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {searchResults.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => selectCity(city)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        {city.name} {city.admin1 ? `(${city.admin1})` : ''}
                      </p>
                      <p className="text-xs text-slate-400">{city.country}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Select</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Smog & Urban Centers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Popular Urban Centers & Smog Hotspots
          </h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {popularCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => selectCity(city)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-200">{city.name}</p>
                  <p className="text-[11px] text-slate-400">{city.country}</p>
                </div>
                {city.typical_winter_aqi && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    ~{city.typical_winter_aqi} AQI
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
