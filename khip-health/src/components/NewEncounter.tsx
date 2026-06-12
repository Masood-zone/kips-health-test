import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Medication, Patient } from '../types';
import {
  Stethoscope,
  Heart,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  ChevronDown,
  Trash2,
  ListRestart
} from 'lucide-react';
import { commonDiagnoses } from '../data';

export default function NewEncounter() {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    addEncounter,
    setActiveTab,
    currentUser
  } = useAppStore();

  const activePatient = patients.find((p) => p.id === selectedPatientId) || null;

  // If no patient selected, let the doctor pick one first
  const [selectedPatId, setSelectedPatId] = useState(selectedPatientId || '');

  // SOAP notes
  const [reason, setReason] = useState('General Outpatient Consultation');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(commonDiagnoses[0]);
  const [customDiagnosis, setCustomDiagnosis] = useState('');

  // Prescription builder state
  const [medsList, setMedsList] = useState<Omit<Medication, 'id'>[]>([]);
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('Twice Daily');
  const [duration, setDuration] = useState('5 Days');

  // Sync state if selected patient changes globally
  useEffect(() => {
    if (selectedPatientId) {
      setSelectedPatId(selectedPatientId);
    }
  }, [selectedPatientId]);

  // Set selected patient in store when modified here
  const handleSelectPatient = (id: string) => {
    setSelectedPatId(id);
    setSelectedPatientId(id || null);
  };

  // Add medication to the current prescription table
  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName) return;
    setMedsList([
      ...medsList,
      {
        name: drugName,
        dosage,
        frequency,
        duration,
        status: 'active'
      }
    ]);
    setDrugName('');
  };

  const handleRemoveMed = (index: number) => {
    setMedsList(medsList.filter((_, i) => i !== index));
  };

  // SOAP values templates to help clinicians speed up demo
  const applyTemplate = (type: 'malaria' | 'hypertension' | 'typhoid') => {
    if (type === 'malaria') {
      setReason('Acute Fever & Shaking Chills');
      setSubjective('Patient reports sudden high-grade fever starting 3 days ago. Complains of severe chills and headache, lower joint pains, and physical weakness. No vomiting or stiff neck.');
      setObjective('Temperature: 38.9°C, HR: 95 bpm, BP: 118/76. Sclera slightly yellow. Lungs and chest fully clear. Abdomen soft, mild spleen swelling palpated.');
      setAssessment('K90.4 Suspected Malaria, confirmed by malaria rapid test.');
      setPlan('1. Artemether-Lumefantrine 20/120mg (Coartem) orally as prescribed.\n2. Ingest with fatty food.\n3. Paracetamol for fever management.\n4. Advised to sleep under insecticide-treated bed nets.');
      setSelectedDiagnosis('B50.9 - Plasmodium Falciparum Malaria');
      setMedsList([
        { name: 'Artemether-Lumefantrine (Coartem)', dosage: '20/120mg', frequency: 'Twice daily', duration: '3 Days', status: 'active' },
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 8 hours', duration: '3 Days', status: 'active' }
      ]);
    } else if (type === 'hypertension') {
      setReason('Hypertension Routine Review');
      setSubjective('Admitted patient presents for blood pressure progress. Admits to slight morning-onset headaches and occasional visual cloudiness. Self-reports compliance with medications, but consumes salted fish.');
      setObjective('BP logged: 148/96. HR: 82 bpm, regular. Weight: 76kg. Mild pedal swelling detected.');
      setAssessment('I10 controlled Class II Hypertension.');
      setPlan('1. Titrate Lisinopril medication.\n2. Counsel on reducing high-sodium local diets (e.g., Momoni, salted fish).\n3. Re-evaluate kidney panel in next routine visit.');
      setSelectedDiagnosis('I10 - Essential (Primary) Hypertension');
      setMedsList([
        { name: 'Lisinopril', dosage: '20mg', frequency: 'Once Daily (Morning)', duration: '30 Days', status: 'active' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily (Night)', duration: '30 Days', status: 'active' }
      ]);
    } else if (type === 'typhoid') {
      setReason('Gradual fever & abdominal pains');
      setSubjective('Complains of progressive high fever, constipation alternating with mild fluid diarrhea, and dry cough for 5 days. Severe abdominal discomfort.');
      setObjective('Temp: 38.6°C. Abdominal loading tender. Rose spots faintly visible on lower chest.');
      setAssessment('A01.0 Suspected Enteric / Typhoid fever.');
      setPlan('1. Awaiting formal blood-culture output.\n2. Prescribe oral Ciprofloxacin 500mg immediately.\n3. Strict guidance on water-sanitation safety.');
      setSelectedDiagnosis('A01.0 - Typhoid Fever, unspecified');
      setMedsList([
        { name: 'Ciprofloxacin', dosage: '500mg', frequency: 'Twice daily', duration: '7 Days', status: 'active' },
        { name: 'ORS (Oral Rehydration Salts)', dosage: '1 Sachet', frequency: 'Dissolved in 1L sterile water, drink throughout day', duration: '3 Days', status: 'active' }
      ]);
    }
  };

  const handleSubmitEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPatientId = selectedPatientId || selectedPatId;
    if (!finalPatientId) return alert('Please select a target patient first.');

    const diagnosisValue = customDiagnosis ? customDiagnosis : selectedDiagnosis;

    // Build prescription object list with random IDs
    const prescriptions = medsList.map((m, idx) => ({
      ...m,
      id: `M-${Date.now()}-${idx}`
    }));

    addEncounter(finalPatientId, {
      reason,
      subjective,
      objective,
      assessment,
      plan,
      diagnosis: diagnosisValue,
      prescriptions
    });

    // Reset Form & Switch Tab
    setReason('');
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setMedsList([]);
    setActiveTab('patients');
  };

  // Safe vital checks from current active patients' latest record
  const latestVitals = activePatient?.vitalsHistory[0] || null;

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Consultation Notebook</h2>
          <p className="text-sm text-slate-500">Record physical symptoms, final SOAP logs, and issue prescriptions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0 text-xs">
          <span className="font-bold text-slate-400 font-mono uppercase">Prefill templates:</span>
          <button
            onClick={() => applyTemplate('malaria')}
            className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-semibold border border-red-100 shadow-sm hover:bg-red-100 transition cursor-pointer"
          >
            Fever/Malaria
          </button>
          <button
            onClick={() => applyTemplate('hypertension')}
            className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold border border-blue-100 shadow-sm hover:bg-blue-100 transition cursor-pointer"
          >
            BP/Hypertension
          </button>
          <button
            onClick={() => applyTemplate('typhoid')}
            className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-semibold border border-amber-100 shadow-sm hover:bg-amber-105 transition cursor-pointer"
          >
            Typhoid Screen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Patient selector and latest vitals assistant */}
        <div className="lg:col-span-1 space-y-4">
          {/* Patient Selector Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">Selected Patient Folder</label>
              <select
                value={selectedPatId}
                onChange={(e) => handleSelectPatient(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm cursor-pointer font-sans"
              >
                <option value="">-- Choose Patient Folder --</option>
                {patients.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.name} ({pat.id}) — NHIS {pat.nhisNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Patient Demographics Card */}
            {activePatient ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2.5">
                <p className="font-bold text-slate-800 text-sm border-b border-slate-205 pb-1">{activePatient.name}</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gender / Age:</span>
                  <span className="font-semibold text-slate-700">{activePatient.gender} • {activePatient.age}y</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NHIS Code ID:</span>
                  <span className="font-semibold text-slate-700">{activePatient.nhisNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Drug Allergies:</span>
                  <span className="font-bold text-red-650 truncate max-w-[130px]" title={activePatient.allergies.join(', ') || 'None limit'}>
                    {activePatient.allergies.join(', ') || 'NKDA'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed border-slate-250 rounded-lg text-slate-400 text-xs">
                No patient card active. Select above or go to Patient Records listing.
              </div>
            )}
          </div>

          {/* Vitals Assistant Monitor */}
          {activePatient && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Heart size={18} className="text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-900">Vitals telemetry Monitor</h4>
              </div>

              {latestVitals ? (
                <div className="space-y-3.5 text-xs">
                  {/* Alert Indicators logic */}
                  {parseFloat(latestVitals.temp.toString()) >= 38 && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg flex items-start gap-2">
                      <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold block">Patient Hyperthermia (Fever) Alert:</span>
                        Logged temperature of {latestVitals.temp}°C exceeds limits. Check for local malaria or typhoid symptoms.
                      </div>
                    </div>
                  )}

                  {/* BP alerts */}
                  {(() => {
                    const bp_top = parseInt(latestVitals.bp.split('/')[0]) || 0;
                    if (bp_top >= 140) {
                      return (
                        <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg flex items-start gap-2">
                          <AlertCircle className="shrink-0 text-amber-600 mt-0.5" size={16} />
                          <div>
                            <span className="font-bold block">Elevated Blood Pressure:</span>
                            Systolic BP of {bp_top} mmHg indicates risk. Advise sodium coaching.
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-2.5 font-mono">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-xxs text-slate-400 block uppercase">Blood Pressure</span>
                      <span className="text-sm font-black text-slate-800 mt-0.5 block">{latestVitals.bp}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-xxs text-slate-400 block uppercase">Temperature</span>
                      <span className={`text-sm font-black mt-0.5 block ${latestVitals.temp >= 38 ? 'text-red-600' : 'text-slate-800'}`}>
                        {latestVitals.temp}°C
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-xxs text-slate-400 block uppercase">Heart Rate</span>
                      <span className="text-sm font-black text-slate-800 mt-0.5 block">{latestVitals.hr} bpm</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-xxs text-slate-400 block uppercase">O2 Sat (SPO2)</span>
                      <span className={`text-sm font-black mt-0.5 block ${latestVitals.spo2 < 95 ? 'text-red-500' : 'text-slate-800'}`}>
                        {latestVitals.spo2}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center uppercase font-mono">
                    Recorded {new Date(latestVitals.date).toLocaleDateString()} by Grace Appiah, RN
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No core vitals recorded on current patient timeline is available. Use "Vitals" on Patient Records tab.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: SOAP Notebook and prescription builder */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitEncounter} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
            {/* Form Name Indicator */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold">SOAP consultation Notes</h3>
              </div>
              <span className="text-xxs bg-emerald-600 font-mono tracking-widest uppercase font-bold text-white px-2 py-0.5 rounded">
                Prescriber: {currentUser?.name || 'Dr. Addo'}
              </span>
            </div>

            {/* SOAP section */}
            <div className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Reason for Visit *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Acute Fever and joint pains"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Subjective complaints (S) *</label>
                  <textarea
                    required
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                    placeholder="Patient reports subjective complaints: headache, chills, joint pain..."
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Objective Findings (O)</label>
                  <textarea
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Physical exam results, chest clarity, palpation, visible marks..."
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Assessment & Diagnosis (A)</label>
                  <textarea
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="Provisional pathology, physiological evaluation..."
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Treatment / Plan (P)</label>
                  <textarea
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Scheduled dosing instructions, dietary salt adjustments, follow-up timelines..."
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* ICD-10 Coding Picker */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">ICD-10 Diagnostic Code</label>
                  <select
                    value={selectedDiagnosis}
                    onChange={(e) => setSelectedDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                  >
                    {commonDiagnoses.map((diag, idx) => (
                      <option key={idx} value={diag}>
                        {diag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Or Type Custom Diagnosis</label>
                  <input
                    type="text"
                    value={customDiagnosis}
                    onChange={(e) => setCustomDiagnosis(e.target.value)}
                    placeholder="e.g. B51.9 - Plasmodium Vivax Malaria"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Prescription builder */}
            <div className="p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-1.5">Prescription medication Builder</h4>

              {/* Prescription Mini Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div className="md:col-span-1">
                  <label className="block text-xxs text-slate-500 font-mono mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="Paracetamol, Amoxicillin"
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xxs text-slate-500 font-mono mb-1">Dosage</label>
                  <select
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-705"
                  >
                    <option value="500mg">500mg</option>
                    <option value="1000mg">1000mg</option>
                    <option value="20mg/120mg">20mg/120mg</option>
                    <option value="100mg">100mg</option>
                    <option value="1 Sachet">1 Sachet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xxs text-slate-500 font-mono mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-705"
                  >
                    <option value="Once Daily (Morning)">Once Daily (Morning)</option>
                    <option value="Once Daily (Night)">Once Daily (Night)</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Three Times Daily">Three Times Daily</option>
                    <option value="Every 8 Hours as needed">Every 8 Hours as needed</option>
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xxs text-slate-500 font-mono mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-705"
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMed}
                    className="bg-slate-800 text-white p-1 rounded-md hover:bg-slate-700 cursor-pointer flex-shrink-0 mb-0.5"
                    title="Add medicine to list"
                  >
                    <PlusCircle size={22} />
                  </button>
                </div>
              </div>

              {/* Added Meds Table */}
              {medsList.length === 0 ? (
                <p className="text-xxs text-slate-400 italic text-center py-2">No medications added yet to this prescription checklist.</p>
              ) : (
                <div className="border border-slate-150 rounded-lg overflow-hidden text-xs">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-slate-500 font-mono">
                      <tr className="text-left text-xxs font-bold">
                        <th className="p-2">Medication Name</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Frequency</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {medsList.map((med, index) => (
                        <tr key={index} className="hover:bg-slate-53">
                          <td className="p-2 font-sans font-bold text-slate-800">{med.name}</td>
                          <td className="p-2 text-slate-650">{med.dosage}</td>
                          <td className="p-2 text-slate-550">{med.frequency}</td>
                          <td className="p-2 text-slate-550">{med.duration}</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveMed(index)}
                              className="text-red-650 hover:text-red-500 transition cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="p-5 flex justify-end gap-3.5 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setReason('');
                  setSubjective('');
                  setObjective('');
                  setAssessment('');
                  setPlan('');
                  setMedsList([]);
                  setActiveTab('patients');
                }}
                className="px-4 py-2 border border-slate-205 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer transition text-xs"
              >
                Clear Notebook
              </button>
              <button
                type="submit"
                disabled={!activePatient}
                className={`px-5 py-2 text-white font-bold rounded-lg cursor-pointer transition text-xs flex items-center gap-1 shadow-sm ${
                  activePatient ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-350 cursor-not-allowed'
                }`}
              >
                <FileSpreadsheet size={14} /> Finalize Consultation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
