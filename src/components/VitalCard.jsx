import React from 'react';
import { Heart, Activity, Droplets, Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VitalCard({ title, value, unit, icon: Icon, normalRange, status, trend }) {
  // Determine card styles based on status
  let statusBadge = {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-500 text-white',
    cardBorder: 'border-slate-200 shadow-sm hover:border-emerald-300',
    dot: 'bg-emerald-500',
    label: 'طبيعي'
  };

  if (status === 'warning') {
    statusBadge = {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      iconBg: 'bg-amber-500 text-white',
      cardBorder: 'border-amber-300 shadow-md shadow-amber-500/10',
      dot: 'bg-amber-500',
      label: 'تنبيه'
    };
  } else if (status === 'critical') {
    statusBadge = {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      iconBg: 'bg-rose-600 text-white',
      cardBorder: 'border-rose-400 animate-strobe-warning',
      dot: 'bg-rose-600 animate-ping',
      label: 'حرج جداً'
    };
  }

  return (
    <div className={`bg-white rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden ${statusBadge.cardBorder}`}>
      
      {/* Top row: Icon & Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${statusBadge.iconBg}`}>
            <Icon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cairo font-black text-slate-800 text-base">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">المعدل: {normalRange}</span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cairo font-bold border ${statusBadge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Main Value Display */}
      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-cairo tracking-tight text-slate-900">
            {value}
          </span>
          <span className="text-sm font-bold text-slate-500 font-cairo">{unit}</span>
        </div>

        {/* Pulse Heart Animation if Heart icon */}
        {title.includes('القلب') && (
          <div className="flex items-center gap-1 text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500 animate-pulse-fast" />
          </div>
        )}
      </div>

      {/* Progress / Gauge indicator bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            status === 'critical' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(15, (parseFloat(value) || 75) / 1.8))}%` }}
        />
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>محدث لحظياً عبر المستشعر</span>
        <span className="flex items-center gap-1 text-slate-600">
          <Activity className="w-3 h-3 text-teal-600" /> live
        </span>
      </div>
    </div>
  );
}
