import React from 'react';

const VARIANTS = {
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lime: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  slate: 'bg-slate-800 text-slate-300 border-slate-700'
};

export function Badge({ children, variant = 'emerald', size = 'md', className = '', pulse = false }) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  const variantClass = VARIANTS[variant] || VARIANTS.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${variantClass} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
}
