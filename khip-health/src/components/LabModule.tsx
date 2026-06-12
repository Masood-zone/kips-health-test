import React, { useState } from 'react';
import { useAppStore } from '../store';
import { FlaskConical, Search, Clock, ShieldCheck, CheckCircle2, ChevronRight, Play, Check } from 'lucide-react';

export default function LabModule() {
  const { labRequests, updateLabRequestStatus, currentUser } = useAppStore();
  const [filterType, setFilterType] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active results release inputs (captures text typed by tech for a specific test ID)
  const [labFindings, setLabFindings] = useState<Record<string, string>>({});

  const handleUpdateStatus = (id: string, state: 'In Progress' | 'Completed') => {
    const technicianName = currentUser ? currentUser.name : "Samuel Osei";
    const findings = labFindings[id] || "No specimen anomalies noted. Completed clinical panel.";

    updateLabRequestStatus(id, state, state === 'Completed' ? findings : undefined, technicianName);
  };

  const filteredLabs = labRequests.filter(req => {
    const matchesSearch =
      req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.testType.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'All') return matchesSearch;
    if (filterType === 'Pending') return matchesSearch && (req.status === 'Pending' || req.status === 'In Progress');
    return matchesSearch && req.status === 'Completed';
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Laboratory Diagnostics</h2>
          <p className="text-sm text-slate-500">Process blood and urine specimens, release medical assays, and inspect results queues</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-4 md:mt-0 bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-lg border border-indigo-100 font-mono text-xs">
          <FlaskConical size={14} className="animate-spin" />
          <span>Samuel Osei, Lead Lab Analyst Online</span>
        </div>
      </div>

      {/* Filter and Tab Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex gap-2">
          {(['All', 'Pending', 'Completed'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-650 border border-slate-200'
              }`}
            >
              {type === 'Pending' ? 'Active / Processing Queue' : type === 'Completed' ? 'Released Diagnostics' : 'All Test Orders'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test reference, patient name..."
            className="w-full text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-205 focus:border-indigo-500 focus:outline-none bg-white"
          />
          <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Main requests queue */}
      <div className="space-y-4">
        {filteredLabs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-250 p-12 text-center bg-white">
            <FlaskConical size={32} className="text-slate-350 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-600 uppercase">No Lab Assay Requests Located</h3>
            <p className="text-xxs text-slate-400 mt-1">There are no diagnostic orders active matching the chosen parameters.</p>
          </div>
        ) : (
          filteredLabs.map((req) => (
            <div
              key={req.id}
              className={`rounded-xl border shadow-xs overflow-hidden bg-white transition hover:shadow-md ${
                req.status === 'Completed' ? 'border-slate-200/90' : 'border-indigo-200/80 ring-1 ring-indigo-50/50'
              }`}
            >
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Assay Info labels */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xxs font-black text-slate-400 uppercase">ASSAY REFERENCE: {req.id}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                      req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      req.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' :
                      'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mt-1">{req.testType}</h4>
                </div>

                {/* Metadata Column */}
                <div className="flex items-center gap-6 text-xxs font-mono text-slate-500">
                  <div>
                    <span className="block text-slate-400 uppercase">Patient</span>
                    <span className="font-bold text-slate-700 text-xs">{req.patientName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase">Specimen</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                      {req.specimen}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-405 uppercase">Authorized By</span>
                    <span className="text-slate-705 font-bold">{req.requestedBy}</span>
                  </div>
                </div>
              </div>

              {/* Lab Technician Active Action Box */}
              <div className="p-4 bg-slate-50/50">
                {req.status === 'Pending' && (
                  <div className="flex items-center justify-between text-xs font-sans">
                    <p className="text-slate-500 font-mono">Order has been verified. Accept specimen to initialize cellular microscope count.</p>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'In Progress')}
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 flex items-center gap-1 cursor-pointer transition shadow-sm"
                    >
                      <Play size={12} /> Accept Specimen
                    </button>
                  </div>
                )}

                {req.status === 'In Progress' && (
                  <div className="space-y-3 font-sans">
                    <p className="text-xs text-slate-550 font-mono">Datalog Findings: Enter quantitative indices and observations to release to medical charts.</p>
                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        value={labFindings[req.id] || ''}
                        onChange={(e) => setLabFindings({ ...labFindings, [req.id]: e.target.value })}
                        placeholder="e.g. Parasitemia: Falciparum RDT positive. MPS Smear demonstrates ring-forms, count: 240/uL."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-205 focus:border-indigo-500 bg-white"
                      />
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Completed')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 flex items-center gap-1 cursor-pointer shrink-0 transition shadow-sm"
                      >
                        <Check size={14} /> Release Results
                      </button>
                    </div>
                  </div>
                )}

                {req.status === 'Completed' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-emerald-50/20 border border-emerald-100/50 rounded-lg p-3">
                    <div className="space-y-1">
                      <span className="font-mono text-xxs block text-slate-400 uppercase">Released Laboratory Report findings</span>
                      <p className="font-mono font-bold text-slate-800">{req.results}</p>
                    </div>
                    <div className="shrink-0 text-right text-xxs font-mono text-slate-400 leading-tight">
                      <span>Released {new Date(req.dateCompleted!).toLocaleDateString()}</span>
                      <span className="block mt-0.5 text-slate-500">Signoff tech: {req.technician}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
