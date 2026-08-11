// Initial Patient Seed Data
export const INITIAL_PATIENTS = [
  {
    id: 'p1-uuid-84920',
    medical_id: 'PAT-84920',
    name: 'أحمد علي المحمداوي',
    age: 45,
    phone: '07701234567',
    address: 'بغداد - الكرادة / محلة 903',
    gender: 'ذكر',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    examinations: [
      {
        id: 'ex-101',
        patient_id: 'p1-uuid-84920',
        bpm: 78,
        spo2: 98,
        sys: 122,
        dia: 82,
        glucose: 105,
        notes: 'حالة المريض مستقرة والقراءات ضمن المعدل الطبيعي.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'ex-100',
        patient_id: 'p1-uuid-84920',
        bpm: 82,
        spo2: 97,
        sys: 128,
        dia: 85,
        glucose: 112,
        notes: 'فحص دوري - ارتفاع بسيط في الضغط الانقباضي.',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      }
    ]
  },
  {
    id: 'p2-uuid-71049',
    medical_id: 'PAT-71049',
    name: 'زينب حسين البصراوي',
    age: 62,
    phone: '07809876543',
    address: 'البصرة - الجزائر / قرب مستشفى الصدر',
    gender: 'أنثى',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    examinations: [
      {
        id: 'ex-102',
        patient_id: 'p2-uuid-71049',
        bpm: 92,
        spo2: 94,
        sys: 142,
        dia: 92,
        glucose: 195,
        notes: 'ارتفاع في سكر الدم وضغط الدم. يوصى بالمتابعة.',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      }
    ]
  },
  {
    id: 'p3-uuid-39401',
    medical_id: 'PAT-39401',
    name: 'حيدر عبد الزهرة العبيدي',
    age: 38,
    phone: '07715554433',
    address: 'النجف الأشرف - الحنانة',
    gender: 'ذكر',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    examinations: [
      {
        id: 'ex-103',
        patient_id: 'p3-uuid-39401',
        bpm: 72,
        spo2: 99,
        sys: 118,
        dia: 78,
        glucose: 95,
        notes: 'قراءات ممتازة جداً. لا توجد أي أعراض.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    ]
  },
  {
    id: 'p4-uuid-92815',
    medical_id: 'PAT-92815',
    name: 'مريم خلف الموسوي',
    age: 29,
    phone: '07503332211',
    address: 'أربيل - عينكاوة',
    gender: 'أنثى',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    examinations: []
  }
];

// Generates smooth simulated live vital signs
export const generateLiveVitals = (prev = null) => {
  if (!prev) {
    return {
      bpm: 75,
      spo2: 98,
      sys: 120,
      dia: 80,
      glucose: 105,
      timestamp: new Date().toLocaleTimeString('ar-IQ')
    };
  }

  // Organic random drift +/- 1 to 2 units
  const bpmDelta = Math.floor(Math.random() * 5) - 2;
  const spo2Delta = Math.floor(Math.random() * 3) - 1;
  const sysDelta = Math.floor(Math.random() * 5) - 2;
  const diaDelta = Math.floor(Math.random() * 3) - 1;
  const glucoseDelta = Math.floor(Math.random() * 5) - 2;

  const newBpm = Math.max(55, Math.min(130, prev.bpm + bpmDelta));
  const newSpo2 = Math.max(88, Math.min(100, prev.spo2 + spo2Delta));
  const newSys = Math.max(90, Math.min(170, prev.sys + sysDelta));
  const newDia = Math.max(60, Math.min(110, prev.dia + diaDelta));
  const newGlucose = Math.max(70, Math.min(260, prev.glucose + glucoseDelta));

  return {
    bpm: newBpm,
    spo2: newSpo2,
    sys: newSys,
    dia: newDia,
    glucose: newGlucose,
    timestamp: new Date().toLocaleTimeString('ar-IQ')
  };
};

// Assess vital signs health risk level
export const evaluateVitalsRisk = (vitals) => {
  const { bpm, spo2, sys, dia, glucose } = vitals;
  
  let riskScore = 0;
  let reasons = [];

  // Heart Rate BPM
  if (bpm < 60 || bpm > 100) {
    riskScore += 1;
    reasons.push(bpm > 100 ? 'تسارع ضربات القلب (تسرع)' : 'بطء ضربات القلب');
  }
  if (bpm > 115 || bpm < 50) riskScore += 2;

  // Oxygen SpO2 %
  if (spo2 < 95) {
    riskScore += 1;
    reasons.push('انخفاض نسبة الأوكسجين (SpO2 < 95%)');
  }
  if (spo2 < 90) {
    riskScore += 3;
    reasons.push('نقص أوكسجين حاد (SpO2 < 90%)');
  }

  // Blood Pressure Sys/Dia
  if (sys > 135 || dia > 85) {
    riskScore += 1;
    reasons.push('ارتفاع ضغط الدم');
  }
  if (sys > 150 || dia > 95) {
    riskScore += 2;
  }

  // Glucose mg/dL
  if (glucose > 140) {
    riskScore += 1;
    reasons.push('ارتفاع مستوى السكر في الدم');
  }
  if (glucose > 200) {
    riskScore += 2;
  }

  if (riskScore >= 3) {
    return {
      status: 'critical',
      label: 'حرج / يتطلب تدخل عاجل',
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-500',
      badgeBg: 'bg-rose-100 text-rose-700',
      reasons
    };
  } else if (riskScore >= 1) {
    return {
      status: 'warning',
      label: 'تحذير / متوسط الخطورة',
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800',
      reasons
    };
  }

  return {
    status: 'normal',
    label: 'مستقر / ضمن المعدل الطبيعي',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    reasons: ['جميع القراءات الحيوية سليمة']
  };
};
