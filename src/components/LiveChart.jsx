import React from 'react';
import { Activity } from 'lucide-react';

export default function LiveChart({ dataHistory = [] }) {
  // SVG Dimensions
  const width = 650;
  const height = 200;
  const padding = 35;

  if (dataHistory.length < 2) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
        <Activity className="w-8 h-8 text-teal-500 animate-spin mb-2" />
        <p className="text-sm font-bold font-cairo text-slate-600">جاري جلب القراءات اللحظية لرسومات المستشعر...</p>
      </div>
    );
  }

  // Calculate coordinates for SVG line
  const maxBpm = 140;
  const minBpm = 40;

  const points = dataHistory.map((item, index) => {
    const x = padding + (index / (dataHistory.length - 1)) * (width - padding * 2);
    const bpmVal = Math.max(minBpm, Math.min(maxBpm, item.bpm || 75));
    const y = height - padding - ((bpmVal - minBpm) / (maxBpm - minBpm)) * (height - padding * 2);
    return { x, y, bpm: item.bpm, time: item.timestamp };
  });

  // Construct SVG Path
  const dPath = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Fill area path under line
  const areaPath = `${dPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const latestPoint = points[points.length - 1];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cairo font-black text-slate-800 text-lg">
              المخطط البياني التفاعلي لنبض القلب (ECG Realtime Wave)
            </h3>
            <p className="text-xs text-slate-500 font-medium">متابعة موجة استجابة المستشعر مع كل ثانية</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-cairo font-bold">
          <span className="flex items-center gap-1.5 text-teal-600">
            <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" /> نبض القلب (BPM)
          </span>
          <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200">
            القراءة الأخيرة: {latestPoint.bpm} bpm
          </span>
        </div>
      </div>

      {/* SVG Waveform Graph */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#bpmGradient)" />

          {/* Line Path */}
          <path
            d={dPath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Nodes */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? "6" : "3"}
              className={i === points.length - 1 ? "fill-teal-500 stroke-white stroke-2 animate-ping" : "fill-teal-600"}
            />
          ))}

          {/* Active Highlight Node */}
          <circle
            cx={latestPoint.x}
            cy={latestPoint.y}
            r="6"
            fill="#0d9488"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-2 pt-2 border-t border-slate-100">
        <span>معدل المعاينة: 1.0Hz</span>
        <span>زمن البث: التوقيت اللحظي الحقيقي</span>
      </div>
    </div>
  );
}
