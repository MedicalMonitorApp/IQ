import React, { useState, useEffect, useRef } from 'react';
import { Radio, Save, Heart, Activity, Droplets, Gauge, AlertTriangle, CheckCircle2, RefreshCw, Cpu, Volume2, ShieldAlert } from 'lucide-react';
import VitalCard from '../components/VitalCard';
import LiveChart from '../components/LiveChart';
import { generateLiveVitals, evaluateVitalsRisk } from '../utils/mockData';
import { savePatientExamination } from '../utils/patientStorage';
import { supabase } from '../config/supabase';

export default function LiveMonitorScreen({ activePatient, patients, onSelectPatient, onExaminationSaved }) {
  const [currentPatient, setCurrentPatient] = useState(activePatient || patients[0]);
  const [vitals, setVitals] = useState({ bpm: 78, spo2: 98, sys: 120, dia: 80, glucose: 105 });
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [mode, setMode] = useState('simulation'); // 'simulation' or 'supabase'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [examNotes, setExamNotes] = useState('');

  // Synchronize when active patient changes
  useEffect(() => {
    if (activePatient) {
      setCurrentPatient(activePatient);
    }
  }, [activePatient]);

  // Simulation Interval Engine
  useEffect(() => {
    if (mode === 'simulation') {
      const interval = setInterval(() => {
        setVitals(prev => {
          const updated = generateLiveVitals(prev);
          setVitalsHistory(history => {
            const newHistory = [...history, updated];
            return newHistory.slice(-25); // keep last 25 ticks
          });
          return updated;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  // Supabase Realtime Subscription Engine
  useEffect(() => {
    if (mode === 'supabase') {
      // Subscribe to Supabase live_monitor table updates
      const subscription = supabase
        .channel('live_monitor_channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'live_monitor', filter: 'device_id=eq.01' },
          (payload) => {
            if (payload.new) {
              const newVitals = {
                bpm: payload.new.bpm,
                spo2: payload.new.spo2,
                sys: payload.new.sys,
                dia: payload.new.dia,
                glucose: payload.new.glucose,
                timestamp: new Date().toLocaleTimeString('ar-IQ')
              };
              setVitals(newVitals);
              setVitalsHistory(h => [...h, newVitals].slice(-25));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [mode]);

  // Handle Saving Exam Results
  const handleSaveExam = async () => {
    if (!currentPatient) return;
    setIsSaving(true);

    const { exam, updatedPatients } = await savePatientExamination(currentPatient.id, vitals, examNotes);

    setIsSaving(false);
    setSaveSuccess(true);
    if (onExaminationSaved) {
      onExaminationSaved(updatedPatients);
    }

    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const riskEval = evaluateVitalsRisk(vitals);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Controls & Mode Switcher Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Active Patient Selector */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">المريض الخاضع للفحص الان:</label>
            <select
              value={currentPatient ? currentPatient.id : ''}
              onChange={(e) => {
                const found = patients.find(p => p.id === e.target.value);
                if (found) {
                  setCurrentPatient(found);
                  if (onSelectPatient) onSelectPatient(found);
                }
              }}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-cairo font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.medical_id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode Toggle & Status Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 font-cairo text-xs font-bold">
            <button
              onClick={() => setMode('simulation')}
              className={`px-4 py-2 rounded-xl transition-all ${
                mode === 'simulation'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              وضع المحاكاة (Demo)
            </button>
            <button
              onClick={() => setMode('supabase')}
              className={`px-4 py-2 rounded-xl transition-all ${
                mode === 'supabase'
                  ? 'bg-[#001e40] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supabase Realtime (الأردوينو)
            </button>
          </div>
        </div>

      </div>

      {/* Global Risk Warning Banner if vitals abnormal */}
      {riskEval.status !== 'normal' && (
        <div className={`p-5 rounded-3xl border flex items-center justify-between shadow-lg ${
          riskEval.status === 'critical' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-amber-50 border-amber-300 text-amber-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
              riskEval.status === 'critical' ? 'bg-rose-600 animate-bounce' : 'bg-amber-500'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cairo font-black text-base">{riskEval.label}</h4>
              <p className="text-xs font-medium mt-0.5">
                سبب التنبيه: {riskEval.reasons.join(' • ')}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/80 px-3 py-1 rounded-full border">
            تنبيه حاد
          </span>
        </div>
      )}

      {/* 4 Sensor Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Heart Rate BPM */}
        <VitalCard
          title="نبض القلب (Pulse)"
          value={vitals.bpm}
          unit="bpm"
          icon={Heart}
          normalRange="60 - 100"
          status={vitals.bpm > 115 || vitals.bpm < 50 ? 'critical' : vitals.bpm > 100 || vitals.bpm < 60 ? 'warning' : 'normal'}
        />

        {/* Oxygen Level SpO2 */}
        <VitalCard
          title="نسبة الأوكسجين (SpO2)"
          value={vitals.spo2}
          unit="%"
          icon={Activity}
          normalRange="95% - 100%"
          status={vitals.spo2 < 90 ? 'critical' : vitals.spo2 < 95 ? 'warning' : 'normal'}
        />

        {/* Blood Pressure */}
        <VitalCard
          title="ضغط الدم (Blood Pressure)"
          value={`${vitals.sys}/${vitals.dia}`}
          unit="mmHg"
          icon={Gauge}
          normalRange="120/80"
          status={vitals.sys > 145 || vitals.dia > 95 ? 'critical' : vitals.sys > 130 || vitals.dia > 85 ? 'warning' : 'normal'}
        />

        {/* Blood Glucose */}
        <VitalCard
          title="نسبة السكر (Glucose)"
          value={vitals.glucose}
          unit="mg/dL"
          icon={Droplets}
          normalRange="70 - 140"
          status={vitals.glucose > 200 ? 'critical' : vitals.glucose > 140 ? 'warning' : 'normal'}
        />

      </div>

      {/* Realtime Waveform Live Graph */}
      <LiveChart dataHistory={vitalsHistory} />

      {/* Save Exam Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 font-cairo">
        
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Save className="w-5 h-5 text-teal-600" />
          حفظ الفحص في سجل المريض ({currentPatient ? currentPatient.name : ''})
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            إضافة ملاحظات الطبيب / التشخيص الطبي السريع (اختياري)
          </label>
          <input
            type="text"
            placeholder="مثال: القراءات مستقرة بعد إعطاء العلاج المناسب."
            value={examNotes}
            onChange={(e) => setExamNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSaveExam}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-500/20 transition-all text-sm hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSaving ? 'جاري الحفظ في Supabase...' : 'حفظ قراءات المستشعرات الآن'}</span>
          </button>

          {saveSuccess && (
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-fadeIn flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم حفظ نتائج الفحص بنجاح في الجدول (examinations)!
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
