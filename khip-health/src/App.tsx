import React from 'react';
import { useAppStore } from './store';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import DashboardOverview from './components/DashboardOverview';
import PatientRecords from './components/PatientRecords';
import NewEncounter from './components/NewEncounter';
import LabModule from './components/LabModule';
import Appointments from './components/Appointments';
import Messaging from './components/Messaging';
import AuditLogs from './components/AuditLogs';
import AdminSettings from './components/AdminSettings';
import { ShieldCheck, LogOut, Hospital } from 'lucide-react';

export default function App() {
  const { currentUser, activeTab, logout } = useAppStore();

  // If session is unauthenticated, show clinical credential lock
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Render the core workspace application layout
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 overflow-hidden font-sans select-none">
      {/* Primary Navigation Sidebar */}
      <Sidebar />

      {/* Main workspace container */}
      <div className="flex flex-col flex-1 min-w-0 bg-slate-55 overflow-hidden">
        {/* Global Administrative Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-xxs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-mono text-xxs font-bold tracking-widest text-slate-450 uppercase">Kwadaso terminal online</span>
            <span className="text-slate-300">|</span>
            <span className="hidden md:flex gap-1 items-center text-xs text-slate-500 font-medium">
              <Hospital size={12} className="text-slate-400" />
              {currentUser.facility}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right hidden sm:block">
              <span className="text-slate-800 font-sans font-bold block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 uppercase mt-0.5 block font-bold tracking-wider">{currentUser.role}</span>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-650 cursor-pointer transition font-semibold"
              title="Secure Logout from terminal"
            >
              <LogOut size={13} />
              <span className="hidden md:inline">Lock Device</span>
            </button>
          </div>
        </header>

        {/* Dynamic active subview portal panel */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 border-t border-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {activeTab === 'analytics' && <DashboardOverview />}
            {activeTab === 'patients' && <PatientRecords />}
            {activeTab === 'encounter' && <NewEncounter />}
            {activeTab === 'labs' && <LabModule />}
            {activeTab === 'appointments' && <Appointments />}
            {activeTab === 'messages' && <Messaging />}
            {activeTab === 'logs' && <AuditLogs />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}
