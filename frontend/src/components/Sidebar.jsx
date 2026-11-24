import React from 'react';
import {
  LayoutDashboard,
  Bot,
  CalendarClock,
  Home,
  Navigation,
  Activity,
  BookOpen,
  Sparkles,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Air Dashboard', icon: LayoutDashboard, badge: 'Live' },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'GenAI' },
  { id: 'routine', label: 'Smart Routine', icon: CalendarClock },
  { id: 'indoor', label: 'Indoor Air Advisor', icon: Home },
  { id: 'travel', label: 'Eco Travel Planner', icon: Navigation },
  { id: 'impact', label: 'Impact Tracker', icon: Activity },
  { id: 'learn', label: 'Smog Science Guide', icon: BookOpen }
];

export function Sidebar({ activeTab, setActiveTab }) {
  const { streak, totalCo2Avoided } = useImpact();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex shrink-0">
      {/* Navigation tabs */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom status widget: Eco Streak & Saved CO2 */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Eco Streak
            </span>
            <span className="font-bold text-amber-400">{streak} Days</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              CO2 Avoided
            </span>
            <span className="font-semibold text-emerald-400">{totalCo2Avoided} kg</span>
          </div>
        </div>

        {/* AI status badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Gemini 2.5 Flash Engine Connected</span>
        </div>
      </div>
    </aside>
  );
}
