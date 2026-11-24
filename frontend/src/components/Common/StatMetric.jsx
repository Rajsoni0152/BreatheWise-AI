import React from 'react';

export function StatMetric({ label, value, unit, icon: Icon, trend, color = 'emerald', subtext }) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }[color] || 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg border ${colorMap}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-100">{value}</span>
          {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
        </div>
        {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
