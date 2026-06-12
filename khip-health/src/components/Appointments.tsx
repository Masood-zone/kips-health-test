import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Calendar, Clock, Plus, Search, Check, AlertCircle, X, CheckSquare, RefreshCw } from 'lucide-react';

export default function Appointments() {
  const { appointments, patients, addAppointment, updateAppointmentStatus } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);

  // Book appointment Form state
  const [selectedPatId, setSelectedPatId] = useState('');
  const [clinician, setClinician] = useState('Dr. Kwabena Addo');
  const [clinicType, setClinicType] = useState<'General Outpatient' | 'Pediatrics' | 'Antenatal Care' | 'Chronic Diseases' | 'Dental' | 'Lab'>('General Outpatient');
  const [date, setDate] = useState('2026-06-12');
  const [timeSlot, setTimeSlot] = useState('09:00 - 09:30');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatId) return alert('Please choose a patient target.');

    const patient = patients.find(p => p.id === selectedPatId);
    if (!patient) return;

    addAppointment({
      patientId: selectedPatId,
      patientName: patient.name,
      clinicianName: clinician,
      clinicType,
      date,
      timeSlot,
      urgency
    });

    setSelectedPatId('');
    setShowBookForm(false);
  };

  const filteredAppts = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.clinicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.clinicType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule Coordinator</h2>
          <p className="text-sm text-slate-500">Manage daily clinical queues, verify clinician availability, and check-in outpatients</p>
        </div>
        <button
          onClick={() => setShowBookForm(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
        >
          <Plus size={16} />
          Book Appointment
        </button>
      </div>

      {/* Statistics and filters card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-6 text-xs text-slate-650 font-mono">
          <div>
            <span>Checked In Clinic Queue: </span>
            <span className="font-bold text-emerald-600 font-sans">
              {appointments.filter(a => a.status === 'Checked In').length} patients
            </span>
          </div>
          <div>
            <span>Pending Schedule: </span>
            <span className="font-bold text-blue-600 font-sans">
              {appointments.filter(a => a.status === 'Scheduled').length} patients
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booked patient, clinic..."
            className="w-full text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none bg-white"
          />
          <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Appointments Live Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppts.map((appt) => (
          <div
            key={appt.id}
            className={`border rounded-xl p-4 shadow-xxs bg-white transition relative ${
              appt.status === 'Checked In' ? 'border-emerald-200 ring-2 ring-emerald-50/50' :
              appt.status === 'Completed' ? 'border-slate-200 opacity-75' : 'border-slate-200'
            }`}
          >
            {/* Urgency Badge */}
            <span className={`absolute top-4 right-4 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
              appt.urgency === 'Emergency' ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' :
              appt.urgency === 'Urgent' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
              'bg-slate-100 text-slate-600'
            }`}>
              {appt.urgency}
            </span>

            <div className="space-y-3 font-sans">
              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{appt.id} • {appt.status}</span>
                <h4 className="text-sm font-black text-slate-800 mt-1 leading-tight">{appt.patientName}</h4>
              </div>

              {/* Time Details */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100/85">
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{appt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock size={13} className="text-slate-400" />
                  <span>{appt.timeSlot}</span>
                </div>
                <div className="text-slate-500 font-sans pt-1 mt-1 border-t border-slate-200/50">
                  <span className="font-bold">Clinic:</span> {appt.clinicType} • {appt.clinicianName}
                </div>
              </div>

              {/* Dynamic Dispatch Action control */}
              {appt.status === 'Scheduled' && (
                <button
                  onClick={() => updateAppointmentStatus(appt.id, 'Checked In')}
                  className="w-full mt-2 py-1.5 hover:bg-emerald-500 hover:text-white border border-emerald-500 text-emerald-600 bg-emerald-50/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition shadow-xxs"
                >
                  <CheckSquare size={13} /> Check In Patient
                </button>
              )}

              {appt.status === 'Checked In' && (
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                  >
                    <Check size={13} /> Log Completed
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'No Show')}
                    className="py-1.5 px-3 border border-red-500 hover:bg-red-50 text-red-500 rounded-lg text-xs font-semibold cursor-pointer transition"
                    title="Mark No Show"
                  >
                    No Show
                  </button>
                </div>
              )}

              {appt.status === 'Completed' && (
                <div className="flex items-center justify-center gap-1 text-xxs font-mono text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                  <Check size={12} />
                  <span>Consultation Session Finalized</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOOK APPOINTMENT OVERLAY MODAL */}
      {showBookForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Schedule Consultation Slot</h3>
                <p className="text-[10px] text-slate-400 font-mono">DOCKET REGISTRAR</p>
              </div>
              <button onClick={() => setShowBookForm(false)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBook} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Target Patient *</label>
                <select
                  required
                  value={selectedPatId}
                  onChange={(e) => setSelectedPatId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Patient Folder --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Consulting Clinician</label>
                <select
                  value={clinician}
                  onChange={(e) => setClinician(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-705 focus:border-emerald-500"
                >
                  <option value="Dr. Kwabena Addo">Dr. Kwabena Addo (MD Consultant)</option>
                  <option value="Grace Appiah, RN">Grace Appiah, RN (Chronic Care specialist)</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Clinic Specialty Division</label>
                <select
                  value={clinicType}
                  onChange={(e) => setClinicType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-705 focus:border-emerald-500"
                >
                  <option value="General Outpatient">General Outpatient Clinic</option>
                  <option value="Pediatrics">Pediatrics Care</option>
                  <option value="Antenatal Care">Antenatal Care (ANC)</option>
                  <option value="Chronic Diseases">Chronic Diseases clinic</option>
                  <option value="Dental">Dental Outpatients</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-35">
                <div>
                  <label className="block text-xxs ... font-mono mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-emerald-500 bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs ... font-mono mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-750 focus:outline-none"
                  >
                    <option value="08:30 - 09:00">08:30 - 09:30</option>
                    <option value="09:15 - 09:45">09:15 - 09:45</option>
                    <option value="10:15 - 10:45">10:15 - 10:45</option>
                    <option value="11:00 - 11:30">11:00 - 11:30</option>
                    <option value="14:00 - 14:30">14:00 - 14:30</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Urgency Classification</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Routine', 'Urgent', 'Emergency'] as const).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`py-1 rounded border text-center font-mono font-bold hover:bg-slate-50 cursor-pointer ${
                        urgency === u
                          ? u === 'Emergency' ? 'border-red-500 bg-red-50 text-red-700' :
                            u === 'Urgent' ? 'border-amber-500 bg-amber-50 text-amber-700' :
                            'border-slate-500 bg-slate-50 text-slate-800'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookForm(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold cursor-pointer text-slate-705"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
