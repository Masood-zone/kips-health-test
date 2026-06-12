import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Search, ShieldCheck, FileSpreadsheet, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'All' || log.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'User Session', 'Patient Record', 'Clinical', 'Laboratory', 'System'];

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Registry</h2>
          <p className="text-sm text-slate-500">Immutable trace log of logins, EMR updates, clinical consult finalizations, and configuration mutations</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-4 md:mt-0 bg-slate-900 text-slate-205 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xxs">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>GHS SHA256 BLOCK SIGNED STATE</span>
        </div>
      </div>

      {/* Filter rows */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        {/* Category loops */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Searching block */}
        <div className="relative w-full max-w-xs shrink-0 select-none">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search audit trail..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-205 bg-white focus:outline-none focus:border-slate-800"
          />
          <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Live table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs font-mono">
            <thead className="bg-slate-50 text-slate-450 text-left uppercase tracking-wider text-[10px]">
              <tr className="font-semibold">
                <th className="p-3.5">Time Stamp</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Clinician / Operator</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Operational Details</th>
                <th className="p-3.5 text-right">IP Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-55 transition">
                  <td className="p-3.5 whitespace-nowrap text-slate-400">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${
                      log.category === 'Clinical' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      log.category === 'Laboratory' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      log.category === 'Patient Record' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                      log.category === 'User Session' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-150 text-slate-600'
                    }`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-sans">
                    <span className="font-bold text-slate-800">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 uppercase font-mono">[{log.userRole}]</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-sans font-bold text-slate-900">{log.action}</td>
                  <td className="p-3.5 text-slate-500 font-sans max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-3.5 text-right text-slate-400 font-mono whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory Info notice */}
      <div className="bg-amber-50/40 p-4 border border-amber-100 rounded-xl flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-500 mt-0.5" />
        <div className="text-xs text-slate-650 font-sans">
          <span className="font-bold block text-slate-800 mb-0.5">Failsafe System Notice</span>
          Under Section 12 of the GHS Security Framework, system directories and clinical journal entries are indexed cryptographically. Manual edits or clearance of database transaction audit lines is prohibited under federal penalties.
        </div>
      </div>
    </div>
  );
}
