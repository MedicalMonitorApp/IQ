import React, { useState } from 'react';
import { ArrowRight, QrCode, Radio, Calendar, Heart, Activity, Droplets, Gauge, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import QRCodeView from '../components/QRCodeView';
import { evaluateVitalsRisk } from '../utils/mockData';

export default function PatientProfileScreen({ patient, onBack, onStartLiveExam }) {
  const [showQrModal, setShowQrModal] = useState(false);

  if (!patient) return null;

  const exams = patient.examinations || [];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Back Button & Action Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-[#001e40] font-cairo font-bold bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة المرضى</span>
        </button>

        <button
          onClick={() => onStartLiveExam(patient)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-cairo font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-teal-500/20 transition-all"
        >
          <Radio className="w-5 h-5 animate-pulse" />
          <span>بدء الفحص اللحظي بالمستشعرات</span>
        </button>
      </div>

      {/* Patient Main Profile Hero Card */}
      <div className="bg-gradient-to-br from-[#001e40] via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black font-cairo text-white">
                {patient.name}
              </h1>
              <span className="bg-teal-500/20 text-teal-300 font-mono text-sm px-3 py-1 rounded-full font-bold border border-teal-500/30">
                {patient.medical_id}
              </span>
            </div>
            
            <p className="text-sm text-blue-200/90 font-medium">
              العمر: <span className="font-bold text-white">{patient.age} سنة</span> • الجنس: <span className="font-bold text-white">{patient.gender || 'ذكر'}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-blue-200">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                📞 الهاتف: {patient.phone}
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                📍 العنوان: {patient.address}
              </span>
            </div>
          </div>

          {/* QR Code Quick Badge */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex flex-col items-center justify-center bg-white text-[#001e40] p-4 rounded-2xl shadow-lg hover:scale-105 transition-all group"
          >
            <QrCode className="w-10 h-10 text-[#001e40] group-hover:text-teal-600 transition-colors" />
            <span className="text-[11px] font-cairo font-black mt-1">رمز الـ QR الخاص بالمريض</span>
          </button>
        </div>
      </div>

      {/* Examination History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black font-cairo text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            سجل الفحوصات الطبية المنجزة ({exams.length})
          </h2>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-cairo font-bold text-slate-700 text-base">لا توجد فحوصات حيوية مسجلة بعد لهذا المريض.</h3>
            <p className="text-xs text-slate-500 mt-1">إضغط على زر "بدء الفحص اللحظي بالمستشعرات" لإجراء الفحص الأول.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam, index) => {
              const risk = evaluateVitalsRisk(exam);
              return (
                <div
                  key={exam.id || index}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Exam Date & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>تاريخ الفحص: {new Date(exam.created_at).toLocaleString('ar-IQ')}</span>
                    </div>

                    <span className={`text-xs font-cairo font-bold px-3 py-1 rounded-full ${risk.badgeBg}`}>
                      {risk.label}
                    </span>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-cairo">
                    
                    {/* BPM */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold block mb-1">نبض القلب</span>
                      <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-xl font-black">{exam.bpm}</span>
                        <span className="text-xs font-normal text-slate-500">bpm</span>
                      </div>
                    </div>

                    {/* SpO2 */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold block mb-1">نسبة الأوكسجين</span>
                      <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-xl font-black">{exam.spo2}</span>
                        <span className="text-xs font-normal text-slate-500">%</span>
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold block mb-1">ضغط الدم</span>
                      <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-xl font-black">{exam.sys}/{exam.dia}</span>
                        <span className="text-xs font-normal text-slate-500">mmHg</span>
                      </div>
                    </div>

                    {/* Glucose */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold block mb-1">مستوى السكر</span>
                      <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-xl font-black">{exam.glucose}</span>
                        <span className="text-xs font-normal text-slate-500">mg/dL</span>
                      </div>
                    </div>

                  </div>

                  {/* Examination Notes */}
                  {exam.notes && (
                    <div className="text-xs text-slate-600 bg-teal-50/50 p-3 rounded-2xl border border-teal-100 font-medium">
                      <span className="font-bold text-teal-800 font-cairo">ملاحظات الفحص الطبي:</span> {exam.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal rendering */}
      {showQrModal && (
        <QRCodeView
          patient={patient}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
