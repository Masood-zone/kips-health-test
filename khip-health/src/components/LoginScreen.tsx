import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShieldAlert, LogIn, HeartPulse, ShieldCheck } from 'lucide-react';

export default function LoginScreen() {
  const { allHealthWorkers, login, currentUser } = useAppStore();
  const [selectedId, setSelectedId] = useState(allHealthWorkers[3]?.id || ''); // admin default

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedId);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative medical pulses in background */}
      <div className="absolute top-0 right-0 p-8 text-sky-800/10 pointer-events-none">
        <HeartPulse size={600} className="animate-pulse" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-900/30">
            <HeartPulse size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">KHIP Health</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Kwadaso Municipal Medical Hub</p>
          </div>
        </div>
        <h2 className="mt-8 text-center text-xl font-medium text-slate-200">
          Sign in to secure clinical terminal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800 py-8 px-4 shadow-2xl rounded-2xl border border-slate-700 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="worker-select" className="block text-sm font-medium text-slate-300">
                Select Personnel Profile
              </label>
              <div className="mt-1">
                <select
                  id="worker-select"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-slate-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm cursor-pointer"
                >
                  {allHealthWorkers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} — {worker.role} ({worker.facility.replace(" Directorate", "")})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700/50">
              <div className="flex">
                <div className="shrink-0 text-amber-500 mt-0.5">
                  <ShieldAlert size={18} />
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-medium text-slate-300">Role-Based Terminal Authorization</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Signing in establishes an authenticated session in compliance with the Ghana Health Service ICT framework and HIPAA guidelines. All interactions are recorded in the system audit registry.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-sm font-semibold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition"
              >
                <LogIn size={16} />
                Access Terminal
              </button>
            </div>
          </form>

          {/* Quick-test helper notice */}
          <div className="mt-6 border-t border-slate-700 pt-6">
            <p className="text-center text-xs text-slate-400">
              Click to login with the chosen profile. You can switch profiles at any time using the logout controls in the administrative header.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 z-10 flex justify-center items-center gap-1.5 font-mono">
        <ShieldCheck size={14} className="text-slate-600" />
        SECURE CONNECTED IP: 192.168.1.13 | KV: 4.12
      </div>
    </div>
  );
}
