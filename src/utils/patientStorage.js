import { INITIAL_PATIENTS } from './mockData';
import { supabase } from '../config/supabase';

const STORAGE_KEY = 'med_monitor_patients_v1';

// Load patients from LocalStorage or Fallback Mock Data
export const getStoredPatients = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to parse stored patients:', err);
  }
  // Initialize with seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
  return INITIAL_PATIENTS;
};

// Save patients list to LocalStorage
export const saveStoredPatients = (patients) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch (err) {
    console.error('Failed to save patients:', err);
  }
};

// Generate unique Medical Patient ID
export const generateMedicalId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PAT-${randomNum}`;
};

// Fetch patients from Supabase or Local Storage
export const fetchAllPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*, examinations(*)');

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.log('Supabase offline or table not setup yet, using local storage.');
  }
  return getStoredPatients();
};

// Add New Patient to Supabase & Local Storage
export const createNewPatient = async (patientData) => {
  const newMedicalId = generateMedicalId();
  const newPatient = {
    id: 'p-' + Date.now(),
    medical_id: newMedicalId,
    name: patientData.name.trim(),
    age: parseInt(patientData.age, 10) || 30,
    phone: patientData.phone.trim() || 'غير محدد',
    address: patientData.address.trim() || 'غير محدد',
    gender: patientData.gender || 'ذكر',
    created_at: new Date().toISOString(),
    examinations: []
  };

  // Try Supabase insert
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          medical_id: newPatient.medical_id,
          name: newPatient.name,
          age: newPatient.age,
          phone: newPatient.phone,
          address: newPatient.address,
        }
      ])
      .select();

    if (!error && data && data[0]) {
      newPatient.id = data[0].id;
    }
  } catch (e) {
    console.log('Using local patient creation fallback');
  }

  // Update local storage
  const current = getStoredPatients();
  const updated = [newPatient, ...current];
  saveStoredPatients(updated);

  return { patient: newPatient, allPatients: updated };
};

// Save Examination Record to Supabase & Local Patient History
export const savePatientExamination = async (patientId, vitals, notes = '') => {
  const newExam = {
    id: 'ex-' + Date.now(),
    patient_id: patientId,
    bpm: vitals.bpm,
    spo2: vitals.spo2,
    sys: vitals.sys,
    dia: vitals.dia,
    glucose: vitals.glucose,
    notes: notes || 'تم حفظ الفحص عبر شاشة المراقبة الطبية اللحظية.',
    created_at: new Date().toISOString()
  };

  // Try Supabase insert
  try {
    await supabase.from('examinations').insert([
      {
        patient_id: patientId,
        bpm: vitals.bpm,
        spo2: vitals.spo2,
        sys: vitals.sys,
        dia: vitals.dia,
        glucose: vitals.glucose,
        notes: newExam.notes
      }
    ]);
  } catch (e) {
    console.log('Using local examination storage fallback');
  }

  // Update Local Storage
  const currentPatients = getStoredPatients();
  const updatedPatients = currentPatients.map(p => {
    if (p.id === patientId || p.medical_id === patientId) {
      const existingExams = p.examinations || [];
      return {
        ...p,
        examinations: [newExam, ...existingExams]
      };
    }
    return p;
  });

  saveStoredPatients(updatedPatients);
  return { exam: newExam, updatedPatients };
};
