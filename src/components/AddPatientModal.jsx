import React, { useState } from 'react';
import { UserPlus, X, Hash, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { generateMedicalId, createNewPatient } from '../utils/patientStorage';

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    const newPatientData = {
      name,
      age: parseInt(age, 10) || 30,
      phone,
      address,
      gender
    };

    const { patient, allPatients } = await createNewPatient(newPatientData);
    
    setLoading(false);
    onPatientAdded(patient, allPatients);
    onClose();

    // Reset Form
    setName('');
    setAge('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black font-cairo text-slate-900">
              تسجيل مريض جديد
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              سيتم إنشاء معرف فريد (Patient ID) وتوليد باركود تلقائياً
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-cairo">
          
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المريض الثلاثي <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="مثال: أحمد علي المحمداوي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                العمر (بالسنوات) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                placeholder="مثال: 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الجنس
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="07701234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              العنوان والمدينة
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثال: بغداد - الكرادة"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'جاري الحفظ...' : 'حفظ المريض وتوليد الـ ID'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3.5 rounded-2xl transition-all text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
