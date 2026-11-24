import React from 'react';

export function Card({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'glass-card-hover' : ''
      } ${glow ? 'glow-emerald' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon, iconColor = 'text-emerald-400', className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-5 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg text-slate-100 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
