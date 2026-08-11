import React, { useState } from 'react';
import { Search, UserPlus, QrCode, Radio, FileText, ChevronLeft, ShieldCheck, Heart, UserCheck } from 'lucide-react';
import QRCodeView from '../components/QRCodeView';

export default function PatientsScreen({ patients, onSelectPatient, onStartLiveMonitor, onOpenAddModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrPatient, setSelectedQrPatient] = useState(null);

  // Filter patients by query
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medical_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  // Calculate quick stats
  const totalPatients = patients.length;
  const totalExams = patients.reduce((acc, p) => acc + (p.examinations ? p.examinations.length : 0), 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-[#001e40] to-blue-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-200 font-bold block mb-1">إجمالي المرضى المسجلين</span>
            <span className="text-3xl font-black font-cairo">{totalPatients} مريض</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <UserCheck className="w-7 h-7 text-teal-300" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block mb-1">الفحوصات الطبية المنجزة</span>
            <span className="text-3xl font-black font-cairo text-slate-900">{totalExams} فحص</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block mb-1">حالة الأجهزة والمستشعرات</span>
            <span className="text-lg font-black font-cairo text-emerald-600 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              متصلة وجاهزة للمزامنة
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="البحث باسم المريض، رقم الهاتف، أو الـ ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm font-cairo focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Add Patient Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#001e40] hover:bg-[#00142d] text-white font-cairo font-bold px-6 py-3 rounded-2xl shadow-md transition-all text-sm"
        >
          <UserPlus className="w-4 h-4 text-teal-400" />
          <span>إضافة مريض جديد</span>
        </button>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-cairo font-bold text-base">لم يتم العثور على أي مريض بهذه التفاصيل.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />

              {/* Patient Header Details */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black font-cairo text-slate-900 group-hover:text-teal-600 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      العمر: <span className="font-bold text-slate-700">{patient.age} سنة</span> • الجنس: <span className="font-bold text-slate-700">{patient.gender || 'ذكر'}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
                    {patient.medical_id}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p><span className="font-bold">الهاتف:</span> {patient.phone}</p>
                  <p><span className="font-bold">العنوان:</span> {patient.address}</p>
                  <p><span className="font-bold">عدد الفحوصات السابقة:</span> {patient.examinations ? patient.examinations.length : 0} فحص</p>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-cairo text-xs font-bold">
                
                {/* QR Code Button */}
                <button
                  onClick={() => setSelectedQrPatient(patient)}
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-all"
                >
                  <QrCode className="w-4 h-4 text-teal-600" />
                  <span>الرمز QR</span>
                </button>

                {/* Patient Profile / History */}
                <button
                  onClick={() => onSelectPatient(patient)}
                  className="flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 py-2.5 rounded-xl transition-all"
                >
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>الملف</span>
                </button>

                {/* Start Live Monitor */}
                <button
                  onClick={() => onStartLiveMonitor(patient)}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2.5 rounded-xl transition-all shadow-md shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>فحص حقيقي</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal rendering */}
      {selectedQrPatient && (
        <QRCodeView
          patient={selectedQrPatient}
          onClose={() => setSelectedQrPatient(null)}
        />
      )}
    </div>
  );
}
