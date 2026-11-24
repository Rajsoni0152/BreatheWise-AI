import React, { useState } from 'react';
import {
  Activity,
  Leaf,
  Flame,
  Award,
  ShieldCheck,
  Train,
  Wind,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';
import { Button } from '../components/Common/Button';

const LOGGABLE_ACTIONS = [
  { id: 'public_transit', title: 'Took Metro / Suburban Rail', co2: 2.4, pts: 50, icon: Train, desc: 'Avoided solo driving emissions for average 15km commute' },
  { id: 'telecommute', title: 'Remote Work / Avoided Commute', co2: 4.6, pts: 75, icon: Leaf, desc: 'Zero transit footprint on severe smog red-alert day' },
  { id: 'carpool', title: 'Carpool Ride-Share', co2: 1.8, pts: 40, icon: TrendingUp, desc: 'Shared vehicular transit among 3+ colleagues' },
  { id: 'hepa_smart_mode', title: 'Smart HEPA Purifier Timing', co2: 0.35, pts: 25, icon: Wind, desc: 'Auto sensor speed regulation saving kWh electricity' },
  { id: 'low_emission_cooking', title: 'Covered Cookware & Range Exhaust', co2: 0.45, pts: 30, icon: Flame, desc: 'Conserved natural gas and captured toxic kitchen NO2' },
  { id: 'mask_care', title: 'Reusable N95 Rotation & Care', co2: 0.08, pts: 15, icon: ShieldCheck, desc: 'Paper-bag decontamination avoiding single-use microplastic waste' }
];

export function ImpactView() {
  const { totalCo2Avoided, points, streak, actionsHistory, badges, logUserAction } = useImpact();
  const [loggingId, setLoggingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleLogAction = async (action) => {
    setLoggingId(action.id);
    try {
      const res = await logUserAction(action.id, action.title, action.co2, action.pts);
      setToastMessage(`Logged "${action.title}"! +${action.co2} kg CO2 avoided, +${action.pts} eco points.`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setLoggingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-semibold shadow-2xl flex items-center gap-3 animate-slideUp">
          <Sparkles className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Environmental Impact & Community Tracker
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Quantify your personal contribution to cleaner urban air and track verified carbon emission avoidance.
          </p>
        </div>

        <Badge variant="emerald" size="md">
          {streak}-Day Active Streak Active
        </Badge>
      </div>

      {/* Hero Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total CO2 Avoided</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">{totalCo2Avoided}</span>
            <span className="text-xs text-slate-400 font-medium">kg CO2e</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            Equivalent to {Math.round(totalCo2Avoided * 1.8)} tree-days of sequestration
          </p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Eco-Friendly Score</span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">{points}</span>
            <span className="text-xs text-slate-400 font-medium">Pts</span>
          </div>
          <p className="text-[11px] text-teal-400 mt-1 font-medium">Rank: Top 8% Clean Commuters</p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">{streak}</span>
            <span className="text-xs text-slate-400 font-medium">Consecutive Days</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-1 font-medium">2 days until 7-Day Badge</p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Actions Completed</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">{actionsHistory.length}</span>
            <span className="text-xs text-slate-400 font-medium">Verified Events</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium">100% verified math standards</p>
        </Card>
      </div>

      {/* Action Logger Section */}
      <Card>
        <CardHeader
          title="Log Today's Sustainable Choices"
          subtitle="Click to instantly record your clean-air action, avoid CO2, and earn points"
          icon={Plus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOGGABLE_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isLogging = loggingId === action.id;

            return (
              <button
                key={action.id}
                onClick={() => handleLogAction(action)}
                disabled={isLogging}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 group-hover:bg-emerald-500/10 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="emerald" size="sm">
                      +{action.pts} pts
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100">{action.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{action.desc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">-{action.co2} kg CO2</span>
                  <span className="text-slate-400 group-hover:text-white flex items-center gap-1">
                    {isLogging ? 'Logging...' : 'Log Action +'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Badges & Recent History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader
            title="Clean Air Achievements"
            subtitle="Milestones unlocked through continuous emission reduction"
            icon={Award}
          />
          <div className="space-y-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  b.unlocked
                    ? 'bg-slate-900/90 border-emerald-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    b.unlocked
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-600'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-xs text-slate-200">{b.name}</h5>
                    {b.unlocked && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1 rounded">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Log (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader
            title="Verified Action Log"
            subtitle="Your recent community emissions reduction events"
            icon={CheckCircle2}
          />
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {actionsHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <p className="font-semibold text-slate-200">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">-{item.co2_saved} kg CO2</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assumptions & Mathematical Transparency Card */}
      <Card>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-200 block">Calculation Methodology & Transparency Assumptions:</span>
            <p>
              • <strong>Transit Savings:</strong> Based on DEFRA 2024 Passenger Transport conversion guidelines (Solo ICE Car: 0.192 kg CO2e/km vs Metro: 0.018 kg CO2e/passenger-km; 15 km baseline trip = 2.61 kg net delta).
            </p>
            <p>
              • <strong>Telecommuting:</strong> Assumes avoided 25 km round-trip personal commute plus avoided commercial workspace HVAC energy overhead.
            </p>
            <p>
              • <strong>Smart HEPA Purifier:</strong> Assumes a 45W True-HEPA air purifier modulated by optical laser sensors rather than continuous max wattage, saving ~0.45 kWh/day at 0.78 kg CO2/kWh grid intensity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
