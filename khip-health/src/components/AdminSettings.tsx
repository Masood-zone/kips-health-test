import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Settings, ShieldCheck, Sliders, Users, RefreshCw, Hospital, Bed, Truck, Check } from 'lucide-react';

export default function AdminSettings() {
  const {
    bedOccupancy,
    totalBeds,
    availableAmbulances,
    selectedFacility,
    updateFacilitySettings,
    allHealthWorkers
  } = useAppStore();

  const [bedsRange, setBedsRange] = useState(bedOccupancy);
  const [totalBedsInput, setTotalBedsInput] = useState(totalBeds.toString());
  const [ambulances, setAmbulances] = useState(availableAmbulances);
  const [facilitySelect, setFacilitySelect] = useState(selectedFacility);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFacilitySettings({
      bedOccupancy: bedsRange,
      totalBeds: parseInt(totalBedsInput) || totalBeds,
      availableAmbulances: ambulances,
      selectedFacility: facilitySelect
    });

    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  const facilities = [
    "Kwadaso Community Hospital",
    "Kwadaso Municipal Outpost Directorate",
    "Sofoline Urban Health Outpost",
    "Patasi Health Station"
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Administrative Configuration Board</h2>
          <p className="text-sm text-slate-500">Configure logistics capacities, alternate facility divisions, and review staff profiles directories</p>
        </div>
        {showSavedFeedback && (
          <div className="flex items-center gap-1.5 shrink-0 mt-4 md:mt-0 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-lg border border-emerald-100 font-mono text-xs animate-in fade-in duration-250">
            <Check size={14} />
            <span>Facility Parameters Saved Successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: Parameters Adjustment Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sliders size={18} className="text-emerald-550" />
              <h4 className="text-sm font-bold text-slate-900">Ward Capacity & Logistics Parameters</h4>
            </div>

            {/* Selector active hospital */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">Active Clinic / Facility Area</label>
              <select
                value={facilitySelect}
                onChange={(e) => setFacilitySelect(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50 font-sans"
              >
                {facilities.map((f, i) => (
                  <option key={i} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Slider Bed Occupancy */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Logistics Ward Bed Occupancy:</span>
                <span className="font-bold text-emerald-600 font-sans text-sm">{bedsRange}% Occupied</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bedsRange}
                onChange={(e) => setBedsRange(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400 block font-mono">Sliding logs reactive updates directly into Recharts Pie capacity metrics diagrams.</span>
            </div>

            {/* Numeric input row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">Total Hospital beds Capacity</label>
                <div className="flex items-center gap-2">
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500">
                    <Bed size={14} />
                  </div>
                  <input
                    type="number"
                    value={totalBedsInput}
                    onChange={(e) => setTotalBedsInput(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">Available Ambulance units</label>
                <div className="flex items-center gap-2">
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500">
                    <Truck size={14} />
                  </div>
                  <select
                    value={ambulances}
                    onChange={(e) => setAmbulances(parseInt(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-700"
                  >
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} operational</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-sm rounded-lg text-xs cursor-pointer transition shadow-xxs"
            >
              Update active parameters
            </button>
          </div>
        </form>

        {/* Right Columns: Active Staff Directory Credentials */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users size={18} className="text-slate-500" />
              <h4 className="text-sm font-bold text-slate-900">Hospital Staff Credentials</h4>
            </div>

            <div className="space-y-3">
              {allHealthWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-150">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      src={worker.avatarUrl}
                      alt={worker.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{worker.name}</span>
                      <span className="text-[10px] text-slate-450 font-mono mt-0.5 block truncate uppercase">{worker.role} Code: {worker.id}</span>
                    </div>
                  </div>
                  <span className="inline-block shrink-0 px-2.5 py-0.2 select-none border border-emerald-100 bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold rounded">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
