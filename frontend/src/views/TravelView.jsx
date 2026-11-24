import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Train,
  Bus,
  Car,
  Bike,
  Fuel,
  ShieldAlert,
  Leaf,
  CheckCircle2,
  Info,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { calculateTravelOptions } from '../api/client';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';

export function TravelView() {
  const { selectedCity, data } = useAirQuality();
  const currentAqi = data?.current?.us_aqi || 220;

  const [distanceKm, setDistanceKm] = useState(15);
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async (dist) => {
    setLoading(true);
    try {
      const plan = await calculateTravelOptions({
        city: selectedCity,
        distance_km: dist,
        current_aqi: currentAqi
      });
      setTravelPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(distanceKm);
  }, [distanceKm, selectedCity, currentAqi]);

  const getModeIcon = (mode) => {
    if (mode.includes('Metro') || mode.includes('Rail')) return Train;
    if (mode.includes('Bus')) return Bus;
    if (mode.includes('Carpool')) return Car;
    if (mode.includes('Cycle') || mode.includes('Bike')) return Bike;
    return Fuel;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            Eco-Friendly & Low-Exposure Travel Planner
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare travel modes by carbon footprint and particulate inhalation risk at {selectedCity}'s current AQI of {currentAqi}.
          </p>
        </div>

        <Badge variant={currentAqi > 200 ? 'rose' : 'orange'} size="md">
          AQI {currentAqi} Inhalation Risk Active
        </Badge>
      </div>

      {/* Distance Slider Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-white text-base">Select Your Commute Distance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Adjust trip length to model emissions and exposure time</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-emerald-400">{distanceKm}</span>
            <span className="text-sm text-slate-400 ml-1">km round-trip</span>
          </div>
        </div>

        {/* Distance Range Input */}
        <input
          type="range"
          min="2"
          max="50"
          value={distanceKm}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        {/* Preset quick buttons */}
        <div className="flex items-center gap-2 mt-4 text-xs">
          <span className="text-slate-400">Quick Select:</span>
          {[5, 12, 20, 35].map((d) => (
            <button
              key={d}
              onClick={() => setDistanceKm(d)}
              className={`px-3 py-1 rounded-lg border transition ${
                distanceKm === d
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d} km
            </button>
          ))}
        </div>
      </Card>

      {/* Carbon Savings Summary Banner */}
      {travelPlan && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Potential Savings</span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Save up to {travelPlan.co2_savings_potential_kg} kg CO2 today
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                By choosing Metro or electric transit over a solo petrol car for this {distanceKm} km commute.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-right shrink-0">
            <span className="text-[11px] text-slate-400">Recommended Mode:</span>
            <span className="text-sm font-bold text-emerald-400">{travelPlan.healthiest_option}</span>
          </div>
        </div>
      )}

      {/* Travel Modes Comparison Matrix */}
      {travelPlan && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Modal Emissions & Inhalation Matrix
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {travelPlan.options.map((opt, idx) => {
              const Icon = getModeIcon(opt.mode);
              const isRecommended = opt.is_recommended;
              const isCriticalRisk = opt.pm2_5_inhalation_risk === 'Critical';
              const isHighRisk = opt.pm2_5_inhalation_risk === 'High';

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isRecommended
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Mode details */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl border shrink-0 ${
                          isRecommended
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-base text-white">{opt.mode}</h4>
                          {isRecommended && (
                            <Badge variant="emerald" size="sm">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 max-w-xl">{opt.explanation}</p>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      <div>
                        <span className="text-[11px] text-slate-400 block">CO2 Emitted</span>
                        <span className="text-base font-bold text-white">{opt.co2_kg} kg</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">Est. Duration</span>
                        <span className="text-base font-bold text-slate-200">{opt.duration_minutes} min</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">PM2.5 Exposure</span>
                        <Badge
                          variant={isCriticalRisk ? 'rose' : isHighRisk ? 'orange' : 'emerald'}
                          size="sm"
                        >
                          {opt.pm2_5_inhalation_risk} Risk
                        </Badge>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">Cost Tier</span>
                        <span className="text-xs font-semibold text-slate-300">{opt.cost_estimate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assumptions and Methodology Disclosure */}
      <Card>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">Calculation Standards & Epidemiological Logic:</span>
            <p>
              Emissions benchmarks reference DEFRA 2024 and IPCC conversion metrics (Solo petrol car: 0.192 kg CO2/km;
              Metro/Electric rail: 0.018 kg CO2/km; Electric bus: 0.038 kg CO2/km).
            </p>
            <p>
              Inhalation risk models tidal breathing volume: cycling or running outdoors elevates minute ventilation from 8 L/min
              to 60+ L/min, depositing up to 750% more micro particulate deep into alveolar capillaries. Thus, active transit is
              discouraged during severe winter smog episodes (AQI &gt; 150).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
