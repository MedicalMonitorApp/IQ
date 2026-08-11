import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, X, Download, Copy, Check } from 'lucide-react';

export default function QRCodeView({ patient, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!patient) return null;

  const qrData = JSON.stringify({
    medical_id: patient.medical_id,
    name: patient.name,
    age: patient.age,
    phone: patient.phone,
    app: 'MedicalMonitorSupabase'
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(patient.medical_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <QrCode className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black font-cairo text-slate-900">
            رمز الاستجابة السريعة والبار كود
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            البطاقة الطبية الذكية الخاصة بالمريض
          </p>
        </div>

        {/* QR Code Canvas Card */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200">
            <QRCodeSVG
              value={qrData}
              size={180}
              level="H"
              includeMargin={true}
              fgColor="#001e40"
            />
          </div>

          {/* Patient Details */}
          <div className="mt-4 text-center font-cairo">
            <h3 className="text-lg font-black text-slate-900">{patient.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                ID: {patient.medical_id}
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                title="نسخ الـ ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">العمر: {patient.age} سنة • {patient.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[#001e40] hover:bg-[#00142d] text-white font-cairo font-bold py-3 rounded-2xl transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة البطاقة</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-cairo font-bold py-3 rounded-2xl transition-all"
          >
            <span>إغلاق النافذة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
