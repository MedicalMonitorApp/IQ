import React from 'react';
import { Activity, Users, Radio, Cpu, Plus, HeartPulse } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenAddPatient, activePatient }) {
  return (
    <header className="sticky top-0 z-40 bg-[#001e40] text-white shadow-xl border-b border-blue-900/50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black font-cairo tracking-wide text-white">
                  نظام المراقبة الطبية
                </h1>
                <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-teal-500/30">
                  Supabase Realtime
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium">
                قسم الهندسة الطبية • متابعة العلامات الحيوية اللحظية
              </p>
            </div>
          </div>

          {/* Active Patient Pill indicator if selected */}
          {activePatient && (
            <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs">
                <span className="text-blue-200 block">المريض قيد الفحص:</span>
                <span className="font-bold text-white font-cairo">{activePatient.name} ({activePatient.medical_id})</span>
              </div>
            </div>
          )}

          {/* Quick Add Patient Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddPatient}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-cairo font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مريض جديد</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar pt-1 border-t border-white/10">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-cairo font-bold transition-all ${
              activeTab === 'patients'
                ? 'bg-white text-[#001e40] shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل المرضى</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-cairo font-bold transition-all relative ${
              activeTab === 'live'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-red-400" />
            <span>المراقبة الحية (Live Monitor)</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute top-1.5 left-1.5" />
          </button>

          <button
            onClick={() => setActiveTab('arduino')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-cairo font-bold transition-all ${
              activeTab === 'arduino'
                ? 'bg-white text-[#001e40] shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span>ربط الأردوينو & SQL</span>
          </button>
        </div>
      </div>
    </header>
  );
}
