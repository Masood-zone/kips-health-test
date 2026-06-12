import React from 'react';
import { useAppStore } from '../store';
import {
  BarChart3,
  Users,
  Stethoscope,
  FlaskConical,
  CalendarDays,
  Mail,
  FileSpreadsheet,
  Settings,
  LogOut,
  Hospital,
  HeartPulse
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    labRequests,
    appointments,
    messages
  } = useAppStore();

  if (!currentUser) return null;

  // Calculate dynamic outstanding badge numbers
  const pendingLabs = labRequests.filter(l => l.status === 'Pending' || l.status === 'In Progress').length;
  const activeAppts = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Checked In').length;
  const unreadMsgs = messages.filter(m => !m.read).length;

  const navItems = [
    {
      id: 'analytics',
      name: 'Reports & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'patients',
      name: 'Patient Records list',
      icon: Users,
      badge: null
    },
    {
      id: 'encounter',
      name: 'New Consultation',
      icon: Stethoscope,
      badge: null
    },
    {
      id: 'labs',
      name: 'Laboratory queue',
      icon: FlaskConical,
      badge: pendingLabs > 0 ? pendingLabs : null,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'appointments',
      name: 'Schedule coordinator',
      icon: CalendarDays,
      badge: activeAppts > 0 ? activeAppts : null,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'messages',
      name: 'Messaging & Referrals',
      icon: Mail,
      badge: unreadMsgs > 0 ? unreadMsgs : null,
      badgeColor: 'bg-rose-600 text-white'
    },
    {
      id: 'logs',
      name: 'System Audit logs',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'settings',
      name: 'Administrative board',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300 font-sans">
      {/* Top Brand Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <HeartPulse size={20} />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight leading-none block">KHIP Health</span>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mt-0.5">Municipal Hub</span>
        </div>
      </div>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item: any) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border-l-4 border-emerald-500'
                  : 'hover:bg-slate-800/40 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`${
                    isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                  size={18}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== null && (
                <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xxs font-mono font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Authenticated Staff Card & Actions */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/40">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/40 p-2.5">
          <img
            className="h-9 w-9 rounded-full object-cover border border-emerald-500"
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-100 truncate leading-tight">
              {currentUser.name}
            </h4>
            <span className="inline-block mt-0.5 text-[10px] bg-slate-700/60 text-slate-300 font-mono px-1.5 py-0.2 rounded-md uppercase">
              {currentUser.role}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-850 hover:text-rose-450 transition"
            title="Log out of clinic terminal"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <Hospital size={10} />
          <span className="truncate max-w-[180px]">{currentUser.facility}</span>
        </div>
      </div>
    </div>
  );
}
