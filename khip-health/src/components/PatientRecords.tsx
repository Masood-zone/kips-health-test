import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Patient, VitalRecord } from '../types';
import {
  Search,
  UserPlus,
  Phone,
  ShieldCheck,
  Activity,
  Plus,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
  Calendar,
  X,
  PlusCircle,
  FileText,
  User
} from 'lucide-react';

export default function PatientRecords() {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    addPatient,
    addVitals,
    setActiveTab,
    addLabRequest,
    currentUser
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [hasAlerts, setHasAlerts] = useState<boolean>(false);

  // New Patient Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNhis, setNewNhis] = useState('');
  const [newBlood, setNewBlood] = useState('O+');
  const [newAllergies, setNewAllergies] = useState('');
  const [newECName, setNewECName] = useState('');
  const [newECRelationship, setNewECRelationship] = useState('');
  const [newECPhone, setNewECPhone] = useState('');
  const [newCritical, setNewCritical] = useState('');

  // Inline Add Vitals Dialog State
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [vBp, setVBp] = useState('120/80');
  const [vTemp, setVTemp] = useState('36.8');
  const [vHr, setVHr] = useState('78');
  const [vRr, setVRr] = useState('16');
  const [vSpo2, setVSpo2] = useState('98');
  const [vWeight, setVWeight] = useState('70');

  // Inline Quick Lab Request State
  const [showLabForm, setShowLabForm] = useState(false);
  const [labTestType, setLabTestType] = useState('Malaria Blood Film (MPS) & RDT');
  const [labSpecimen, setLabSpecimen] = useState('Blood');

  // Filter patients based on query, gender, and alerts
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.nhisNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = selectedGender === 'All' || patient.gender === selectedGender;
    const matchesAlerts = !hasAlerts || patient.criticalAlerts.length > 0;

    return matchesSearch && matchesGender && matchesAlerts;
  });

  const activePatient = patients.find((p) => p.id === selectedPatientId) || null;

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDob || !newPhone) return alert('Name, DOB, and Phone are required.');

    // Calculate age roughly
    const birthYear = new Date(newDob).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - birthYear;

    addPatient({
      name: newName,
      age: calculatedAge,
      gender: newGender,
      dob: newDob,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/ /g, '')}@example.com`,
      nhisNumber: newNhis || `NHIS-${Math.floor(1000000 + Math.random() * 9000000)}`,
      bloodGroup: newBlood,
      allergies: newAllergies ? newAllergies.split(',').map((s) => s.trim()) : [],
      emergencyContact: {
        name: newECName || 'Not Stated',
        relationship: newECRelationship || 'Guardian',
        phone: newECPhone || '+233 20 000 0000'
      },
      criticalAlerts: newCritical ? [newCritical] : []
    });

    // Reset Form
    setNewName('');
    setNewDob('');
    setNewPhone('');
    setNewEmail('');
    setNewNhis('');
    setNewAllergies('');
    setNewECName('');
    setNewECPhone('');
    setNewECRelationship('');
    setNewCritical('');
    setShowAddForm(false);
  };

  const handleLogVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    addVitals(activePatient.id, {
      bp: vBp,
      temp: parseFloat(vTemp) || 36.8,
      hr: parseInt(vHr) || 80,
      rr: parseInt(vRr) || 16,
      spo2: parseInt(vSpo2) || 98,
      weight: parseFloat(vWeight) || 70
    });

    setShowVitalsForm(false);
  };

  const handleIssueLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    addLabRequest({
      patientId: activePatient.id,
      patientName: activePatient.name,
      testType: labTestType,
      specimen: labSpecimen
    });

    // Show feedback popup alert
    setShowLabForm(false);
    setActiveTab('labs');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Records</h2>
          <p className="text-sm text-slate-500">Search profiles, view diagnostic records, and manage admissions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
        >
          <UserPlus size={16} />
          Register Patient
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: SEARCH & FILTER & PATIENT LISTING */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            {/* Search Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, ID, NHIS..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            {/* Filter Toggle row - Gender */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">Gender Group</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['All', 'Male', 'Female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender as any)}
                    className={`py-1 rounded-md border text-center font-medium transition ${
                      selectedGender === gender
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Alert checkbox */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <input
                id="critical-alert-only"
                type="checkbox"
                checked={hasAlerts}
                onChange={(e) => setHasAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="critical-alert-only" className="text-xs text-slate-600 cursor-pointer">
                Critical Health Alerts Only
              </label>
            </div>
          </div>

          {/* Patients Listing Area */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No patient folders match this search criteria.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                const lastBP = patient.vitalsHistory[0]?.bp || '--';
                const lastTemp = patient.vitalsHistory[0]?.temp || '--';

                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between ${
                      isSelected ? 'bg-slate-50/80 border-l-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">{patient.name}</h4>
                        {patient.criticalAlerts.length > 0 && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" title="Critical Alert Warning" />
                        )}
                      </div>
                      <p className="text-xxs font-mono text-slate-400 mt-0.5">
                        {patient.id} • {patient.gender === 'Female' ? 'F' : 'M'} • {patient.age}y
                      </p>
                      <p className="text-xs text-slate-500 mt-1 truncate">NHIS: {patient.nhisNumber}</p>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0">
                      <span className="text-xxs font-mono text-slate-400 uppercase">Last Vitals</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{lastBP}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lastTemp}°C</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: EXPANDED PATIENT DETAIL PROFILE */}
        <div className="lg:col-span-2 space-y-4">
          {activePatient ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Profile Header Band */}
              <div className="bg-slate-900 text-white p-5 relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 h-12 w-12 rounded-full flex items-center justify-center text-emerald-400 border border-slate-700 shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-white">{activePatient.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Patient Reference Code: {activePatient.id} • DOB: {activePatient.dob}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <button
                      onClick={() => setShowVitalsForm(true)}
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold text-slate-200 flex items-center gap-1"
                    >
                      <Activity size={14} /> Vitals
                    </button>
                    <button
                      onClick={() => setShowLabForm(true)}
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold text-slate-200 flex items-center gap-1"
                    >
                      <FlaskConical size={14} /> Request Lab
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('encounter');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1"
                    >
                      <Stethoscope size={14} /> Consult
                    </button>
                  </div>
                </div>

                {/* Critical health warnings banners */}
                {activePatient.criticalAlerts.length > 0 && (
                  <div className="mt-4 bg-red-950/40 text-red-400 rounded-lg p-3 border border-red-900/40 text-xs flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500 flex-shrink-0 animate-pulse" />
                    <div className="font-mono">
                      <span className="font-bold">CRITICAL CLINICAL ALERTS:</span> {activePatient.criticalAlerts.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Information tabs & metadata cards */}
              <div className="p-5 space-y-6">
                {/* Section 1: Demographics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Age / Gender</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{activePatient.age} years • {activePatient.gender}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">NHIS Enrollment Code</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      {activePatient.nhisNumber}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Blood Type</span>
                    <span className="text-sm font-semibold text-red-600 mt-0.5 block">{activePatient.bloodGroup || 'Not typed'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Primary Contact</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block truncate" title={activePatient.phone}>
                      {activePatient.phone}
                    </span>
                  </div>
                </div>

                {/* Section: Allergies & Emergency Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Allergies Card */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Drug & Food Allergies</h4>
                    {activePatient.allergies.length === 0 ? (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block font-mono">No known allergies logged (NKDA)</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {activePatient.allergies.map((allergy, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-semibold border border-red-100 font-mono">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Emergency Notification contact</h4>
                    <div className="text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Person:</span>
                        <span className="font-semibold text-slate-800">{activePatient.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Relationship:</span>
                        <span className="font-medium text-slate-700">{activePatient.emergencyContact.relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Emergency Phone:</span>
                        <span className="font-mono text-emerald-600 font-semibold">{activePatient.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Recent Clinical Encounters / Medical History */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 block">Recent Clinical Consultations</h4>
                  {activePatient.encounters.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                      No consultations logged yet. Start a new consult with Dr. Addo.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {activePatient.encounters.map((enc) => (
                        <div key={enc.id} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                          <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-100 flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-slate-800 font-sans">{enc.reason}</span>
                              <span className="text-[10px] text-slate-450 ml-2 font-mono">Prescribed by {enc.providerName} ({enc.providerRole})</span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">{new Date(enc.date).toLocaleDateString()}</span>
                          </div>
                          <div className="p-3.5 space-y-2.5 font-sans leading-relaxed text-slate-700 select-all">
                            {enc.diagnosis && (
                              <div className="font-mono text-xs text-slate-800 bg-slate-100/75 p-1 px-2.5 rounded border border-slate-200 inline-block font-bold">
                                Diagnosis: {enc.diagnosis}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-800 block text-xxs uppercase tracking-wider font-mono mb-0.5">Subjective Complaints</span>
                              <p className="p-1.5 bg-slate-50 rounded border border-slate-100">{enc.subjective}</p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xxs uppercase tracking-wider font-mono mb-0.5">Objective Findings</span>
                              <p className="p-1.5 bg-slate-50 rounded border border-slate-100">{enc.objective}</p>
                            </div>
                            {enc.prescriptions && enc.prescriptions.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-800 block text-xxs uppercase tracking-wider font-mono mb-1">Prescribed Medications</span>
                                <div className="space-y-1">
                                  {enc.prescriptions.map((med, idx) => (
                                    <div key={idx} className="flex justify-between text-xs bg-emerald-50/50 p-2 border border-emerald-100 rounded-lg">
                                      <span className="font-mono font-bold text-slate-800">{med.name} - {med.dosage}</span>
                                      <span className="text-slate-500 font-mono text-xxs">{med.frequency} • {med.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section: Vitals Log History */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Logged Vitals History</h4>
                  {activePatient.vitalsHistory.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                      No vital files collected yet. Use "Vitals" above to add.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs font-mono">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr className="text-left font-semibold text-xxs tracking-wider uppercase">
                            <th className="p-2">Date/Time</th>
                            <th className="p-2">BP (mmHg)</th>
                            <th className="p-2">Temp (°C)</th>
                            <th className="p-2">HR (bpm)</th>
                            <th className="p-2">RR (breaths/m)</th>
                            <th className="p-2">SPO2 (%)</th>
                            <th className="p-2">Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activePatient.vitalsHistory.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50/50 text-slate-700">
                              <td className="p-2 font-sans text-slate-500">{new Date(v.date).toLocaleDateString()} {new Date(v.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="p-2 font-bold text-slate-800">{v.bp}</td>
                              <td className="p-2">
                                <span className={v.temp >= 38 ? 'text-amber-600 font-bold' : ''}>{v.temp}</span>
                              </td>
                              <td className="p-2">{v.hr}</td>
                              <td className="p-2">{v.rr}</td>
                              <td className={`p-2 ${v.spo2 < 95 ? 'text-red-600 font-bold' : ''}`}>{v.spo2}</td>
                              <td className="p-2">{v.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Section: Live Diagnostic Labs */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Hospital Lab Diagnostics Requests</h4>
                  {activePatient.labRequests.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-3 border border-slate-100 rounded bg-slate-50">
                      No historic laboratory records associated with this chart.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activePatient.labRequests.map((lab) => (
                        <div key={lab.id} className="p-3 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">{lab.testType}</span>
                            <span className="text-xxs font-mono text-slate-500 mt-1 block">Requested By {lab.requestedBy}</span>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xxs font-semibold ${
                              lab.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              lab.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {lab.status}
                            </span>
                            {lab.results && (
                              <span className="block text-xxs font-mono text-slate-500 mt-1 truncate max-w-sm">Results: {lab.results}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white flex flex-col justify-center items-center">
              <User size={40} className="text-slate-300 mb-2.5" />
              <h3 className="text-sm font-semibold text-slate-700">No Patient EMR Chart Selected</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Select a patient card from the sidebar listing to view comprehensive clinical files, history logs, and vitals tracking.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL / BOTTOM SHEET FOR ADDING A NEW PATIENT REGISTER */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold leading-none">Register New Patient</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1">GHS Admission Desk</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-600 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Amina Mensah"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Gender *</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Blood Group</label>
                  <select
                    value={newBlood}
                    onChange={(e) => setNewBlood(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">NHIS Code (GHS ID)</label>
                  <input
                    type="text"
                    value={newNhis}
                    onChange={(e) => setNewNhis(e.target.value)}
                    placeholder="NHIS-8274619"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Primary Phone *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+233 24 412 3456"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="amina.m@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">Critical Contact & Medical Alerts</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Allergies (comma-separated)</label>
                    <input
                      type="text"
                      value={newAllergies}
                      onChange={(e) => setNewAllergies(e.target.value)}
                      placeholder="Penicillin, Peanuts"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Critical Health Alerts</label>
                    <input
                      type="text"
                      value={newCritical}
                      onChange={(e) => setNewCritical(e.target.value)}
                      placeholder="Hypertension Grade II, Asthma"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">Emergency contact person</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Contact Name</label>
                    <input
                      type="text"
                      value={newECName}
                      onChange={(e) => setNewECName(e.target.value)}
                      placeholder="e.g. Kwesi Mensah"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Relationship</label>
                    <input
                      type="text"
                      value={newECRelationship}
                      onChange={(e) => setNewECRelationship(e.target.value)}
                      placeholder="Husband, Mother"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Contact Phone</label>
                    <input
                      type="text"
                      value={newECPhone}
                      onChange={(e) => setNewECPhone(e.target.value)}
                      placeholder="+233 24..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/80 flex items-start gap-2 text-slate-400 text-xxs font-mono mt-3">
                <ShieldCheck size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Patient record encryption is enabled natively automatically in the HIPAA database directory. Admins will record GHS identifiers immediately.</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 cursor-pointer"
                >
                  Register in GHS Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / LIGHTBOX DIALOG FOR INPUTTING CLINICAL VITALS ON TIMELINE */}
      {showVitalsForm && activePatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-950 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Collect Vitals Checklist</h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Logged by {currentUser?.name || 'Nurse grace'}</p>
              </div>
              <button onClick={() => setShowVitalsForm(false)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogVitals} className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                <p className="font-sans font-bold text-slate-800">Logger Target: {activePatient.name}</p>
                <p className="text-xxs text-slate-400 mt-0.5 font-mono">Current Patient Code: {activePatient.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    required
                    value={vBp}
                    onChange={(e) => setVBp(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Heart Rate (HR)</label>
                  <input
                    type="text"
                    required
                    value={vHr}
                    onChange={(e) => setVHr(e.target.value)}
                    placeholder="e.g. 78 bpm"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Body Temperature (°C)</label>
                  <input
                    type="text"
                    required
                    value={vTemp}
                    onChange={(e) => setVTemp(e.target.value)}
                    placeholder="e.g. 36.8"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Resp Rate (RR)</label>
                  <input
                    type="text"
                    required
                    value={vRr}
                    onChange={(e) => setVRr(e.target.value)}
                    placeholder="e.g. 16/min"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Oxygen Saturation (SPO2)</label>
                  <input
                    type="text"
                    required
                    value={vSpo2}
                    onChange={(e) => setVSpo2(e.target.value)}
                    placeholder="e.g. 98%"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xxs text-slate-450 uppercase mb-1">Weight (kg)</label>
                  <input
                    type="text"
                    required
                    value={vWeight}
                    onChange={(e) => setVWeight(e.target.value)}
                    placeholder="e.g. 74 kg"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVitalsForm(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer"
                >
                  Save Vitals File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / DIALOG FOR QUICK LAB DIAGNOSTIC ISSUE */}
      {showLabForm && activePatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="bg-slate-950 text-white p-4 flex justify-between items-center">
              <h3 className="text-sm font-bold">Request Laboratory Test</h3>
              <button onClick={() => setShowLabForm(false)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueLab} className="p-5 space-y-4 text-xs font-sans">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                <p className="font-bold text-slate-800">Target Patient: {activePatient.name}</p>
                <p className="text-xxs font-mono text-slate-400 mt-0.5">NHIS Code: {activePatient.nhisNumber}</p>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Lab Test Panel Type</label>
                <select
                  value={labTestType}
                  onChange={(e) => setLabTestType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Malaria Blood Film (MPS) & RDT">Malaria Blood Film (MPS) & RDT</option>
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Widal Reaction Test (Typhoid Screen)">Widal Reaction Test (Typhoid Screen)</option>
                  <option value="Complete Urinalysis & Chemistry">Complete Urinalysis & Chemistry</option>
                  <option value="FBS / Plasma Glucose Monitoring">FBS / Plasma Glucose Monitoring</option>
                  <option value="Lipid Profile & Serum Cholesterol">Lipid Profile & Serum Cholesterol</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Required Specimen</label>
                <select
                  value={labSpecimen}
                  onChange={(e) => setLabSpecimen(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Blood">Blood (Whole Blood / Serum)</option>
                  <option value="Urine">Urine Specimen</option>
                  <option value="Sputum">Sputum Specimen</option>
                  <option value="Stool">Stool Specimen</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded text-xxs text-slate-450 font-mono flex items-start gap-1">
                <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span>Issuing lab test requests adds them directly to Samuel Osei's laboratory queue monitor.</span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLabForm(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold cursor-pointer text-slate-705"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer"
                >
                  Issue Lab Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
