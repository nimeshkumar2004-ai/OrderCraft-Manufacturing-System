import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  description,
  accentColor = 'orange', // 'orange' | 'blue' | 'emerald' | 'amber' | 'rose'
  badge,
  onClick
}) => {
  const colorMap = {
    orange: {
      bgIcon: 'bg-orange-50 text-orange-600 border-orange-100',
      badge: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  };

  const scheme = colorMap[accentColor] || colorMap.orange;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:shadow-card hover:border-slate-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Decorative top bar accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          accentColor === 'orange'
            ? 'bg-orange-500'
            : accentColor === 'emerald'
            ? 'bg-emerald-500'
            : accentColor === 'blue'
            ? 'bg-blue-600'
            : accentColor === 'rose'
            ? 'bg-rose-500'
            : 'bg-amber-500'
        } opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
            {badge && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${scheme.badge}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border shadow-2xs ${scheme.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                trendType === 'up'
                  ? 'bg-emerald-50 text-emerald-700'
                  : trendType === 'down'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {trendType === 'up' && <TrendingUp className="w-3 h-3" />}
              {trendType === 'down' && <TrendingDown className="w-3 h-3" />}
              {trendType === 'warning' && <AlertCircle className="w-3 h-3" />}
              {trend}
            </span>
          )}
          <span className="text-slate-500 font-normal truncate">{description}</span>
        </div>
      </div>
    </div>
  );
};
