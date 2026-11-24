import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  }[size] || 'px-4 py-2 text-sm gap-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 focus:ring-emerald-400',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 focus:ring-slate-500',
    outline: 'bg-transparent border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 focus:ring-emerald-400',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500'
  }[variant] || 'bg-slate-800 text-white';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}
