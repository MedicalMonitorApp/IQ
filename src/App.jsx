import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AddPatientModal from './components/AddPatientModal';
import PatientsScreen from './screens/PatientsScreen';
import PatientProfileScreen from './screens/PatientProfileScreen';
import LiveMonitorScreen from './screens/LiveMonitorScreen';
import { fetchAllPatients } from './utils/patientStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' | 'live'
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [selectedProfilePatient, setSelectedProfilePatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initial Data Fetching
  useEffect(() => {
    async function loadData() {
      const loadedPatients = await fetchAllPatients();
      setPatients(loadedPatients);
      if (loadedPatients.length > 0) {
        setActivePatient(loadedPatients[0]);
      }
    }
    loadData();
  }, []);

  // Handle when a patient is selected from list
  const handleSelectPatientProfile = (patient) => {
    setSelectedProfilePatient(patient);
  };

  // Handle starting live monitor for a specific patient
  const handleStartLiveMonitor = (patient) => {
    setActivePatient(patient);
    setSelectedProfilePatient(null);
    setActiveTab('live');
  };

  // Handle newly registered patient
  const handlePatientAdded = (newPatient, updatedAllPatients) => {
    setPatients(updatedAllPatients);
    setActivePatient(newPatient);
  };

  // Handle updating patient list when an exam is saved
  const handleExaminationSaved = (updatedAllPatients) => {
    setPatients(updatedAllPatients);
    if (activePatient) {
      const refreshed = updatedAllPatients.find(p => p.id === activePatient.id || p.medical_id === activePatient.medical_id);
      if (refreshed) setActivePatient(refreshed);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-tajawal">
      
      {/* Sticky Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'patients') setSelectedProfilePatient(null);
        }}
        onOpenAddPatient={() => setIsAddModalOpen(true)}
        activePatient={activePatient}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render Patient Profile if open */}
        {selectedProfilePatient ? (
          <PatientProfileScreen
            patient={selectedProfilePatient}
            onBack={() => setSelectedProfilePatient(null)}
            onStartLiveExam={handleStartLiveMonitor}
          />
        ) : (
          <>
            {/* Render Tab Screens */}
            {activeTab === 'patients' && (
              <PatientsScreen
                patients={patients}
                onSelectPatient={handleSelectPatientProfile}
                onStartLiveMonitor={handleStartLiveMonitor}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'live' && (
              <LiveMonitorScreen
                activePatient={activePatient}
                patients={patients}
                onSelectPatient={(p) => setActivePatient(p)}
                onExaminationSaved={handleExaminationSaved}
              />
            )}
          </>
        )}

      </main>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-cairo">
        <p>نظام المراقبة الطبية والمستشعرات اللحظية • قسم الهندسة الطبية • Supabase Realtime Engine</p>
      </footer>
    </div>
  );
}
