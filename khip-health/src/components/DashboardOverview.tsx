import React from 'react';
import { useAppStore } from '../store';
import {
  Users,
  Bed,
  FlaskConical,
  CalendarCheck,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function DashboardOverview() {
  const {
    patients,
    labRequests,
    appointments,
    bedOccupancy,
    totalBeds,
    availableAmbulances,
    selectedFacility,
    setActiveTab,
    setSelectedPatientId
  } = useAppStore();

  // Dynamically calculate chart values from state
  const pendingLabs = labRequests.filter(l => l.status === 'Pending' || l.status === 'In Progress').length;
  const todayAppts = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Checked In').length;

  // Pie chart data for Bed Occupancy
  const occBedsCount = Math.round((bedOccupancy / 100) * totalBeds);
  const freeBedsCount = totalBeds - occBedsCount;
  const bedsData = [
    { name: 'Occupied', value: occBedsCount, color: '#3b82f6' }, // blue
    { name: 'Available', value: freeBedsCount, color: '#e2e8f0' } // slate
  ];

  // Diagnosis aggregation from our active patient encounters + some realistic static totals scaled up
  const diagnosisCounts: Record<string, number> = {
    'Malaria (B50.9)': 245,
    'Hypertension (I10)': 188,
    'Diabetes (E11.9)': 92,
    'UTI (N39.0)': 76,
    'Typhoid (A01.0)': 54,
    'Tonsillitis (J03.9)': 42
  };

  // Add the ones created by user
  patients.forEach(p => {
    p.encounters.forEach(e => {
      if (e.diagnosis) {
        const shortName = e.diagnosis.split(' - ')[1] || e.diagnosis;
        const codeAndName = `${shortName.slice(0, 12)} (${e.diagnosis.split(' - ')[0]})`;
        diagnosisCounts[codeAndName] = (diagnosisCounts[codeAndName] || 0) + 1;
      }
    });
  });

  const diagnosisChartData = Object.entries(diagnosisCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Core Appointment Volumes chart (by time slot or date)
  const apptTrendData = [
    { date: 'Jun 06', General: 34, Chronic: 12, Pediatrics: 15 },
    { date: 'Jun 07', General: 45, Chronic: 18, Pediatrics: 22 },
    { date: 'Jun 08', General: 52, Chronic: 20, Pediatrics: 19 },
    { date: 'Jun 09', General: 48, Chronic: 15, Pediatrics: 25 },
    { date: 'Jun 10', General: 61, Chronic: 26, Pediatrics: 30 },
    { date: 'Jun 11', General: 55, Chronic: 22, Pediatrics: 28 },
    { date: 'Jun 12', General: todayAppts * 5 + 32, Chronic: todayAppts * 2 + 10, Pediatrics: todayAppts + 12 }
  ];

  // Facility performance mockup database
  const catchmentData = [
    { district: 'Kwadaso Central', patients: 4280, beds: 48, rating: '94%', ambulances: 1 },
    { district: 'Tanoso', patients: 2840, beds: 20, rating: '88%', ambulances: 1 },
    { district: 'Sofoline', patients: 1950, beds: 35, rating: '91%', ambulances: 1 },
    { district: 'Asuoyeboah', patients: 1412, beds: 12, rating: '82%', ambulances: 0 },
    { district: 'Patasi', patients: 1102, beds: 15, rating: '85%', ambulances: 0 }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Welcome Band */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedFacility}</h2>
          <p className="text-sm text-slate-500">Municipal Health Administration Dashboard • Live Stream</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 text-xs bg-slate-100 p-1 rounded-lg border border-slate-250">
          <button
            onClick={() => setActiveTab('encounter')}
            className="bg-white px-3 py-1.5 rounded-md shadow-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            New Consultation +
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className="bg-emerald-600 px-3 py-1.5 rounded-md text-white font-semibold hover:bg-emerald-500 transition"
          >
            Admit Patient
          </button>
        </div>
      </div>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Total Patients</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">12,482</h3>
            </div>
            <div className="rounded-lg bg-emerald-50 text-emerald-600 p-3 self-start">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-600">
            <TrendingUp size={14} className="mr-1" />
            <span className="font-bold">+4.2%</span>
            <span className="text-slate-400 ml-1.5">vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Bed Occupancy</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{bedOccupancy}%</h3>
            </div>
            <div className="rounded-lg bg-blue-50 text-blue-600 p-3 self-start">
              <Bed size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-blue-600 font-mono">
            <span>{occBedsCount} / {totalBeds} Active Beds Occupied</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Pending Labs</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{pendingLabs}</h3>
            </div>
            <div className="rounded-lg bg-indigo-50 text-indigo-600 p-3 self-start">
              <FlaskConical size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-600">
            <button onClick={() => setActiveTab('labs')} className="hover:underline flex items-center gap-1">
              Go to lab module queue <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Today's Clinics</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{todayAppts}</h3>
            </div>
            <div className="rounded-lg bg-rose-50 text-rose-600 p-3 self-start">
              <CalendarCheck size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-rose-600">
            <button onClick={() => setActiveTab('appointments')} className="hover:underline flex items-center gap-1">
              Open Schedule Coordinator <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Diagnosis Trends (Bar Chart) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Diagnosis Volume Trends</h4>
              <p className="text-xs text-slate-400">Total cases treated at Kwadaso clinics and outposts</p>
            </div>
            <span className="text-[10px] uppercase font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-bold">
              ICD-10 Categorized
            </span>
          </div>
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagnosisChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={34}>
                  {diagnosisChartData.map((entry, index) => {
                    const colors = ['#059669', '#3b82f6', '#4f46e5', '#f59e0b', '#d97706', '#dc2626'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Bed Capacity Gauge (Pie Chart visualization) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ward Capacity Control</h4>
              <p className="text-xs text-slate-400">Current available patient beds status</p>
            </div>
            <Bed size={16} className="text-slate-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {bedsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-black text-slate-800">{bedOccupancy}%</span>
                <span className="text-[10px] uppercase font-mono text-slate-400">Occupied</span>
              </div>
            </div>

            {/* Bed Breakdown Indicators */}
            <div className="w-full space-y-2 mt-4 text-xs font-mono">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500">Occupied Beds:</span>
                <span className="font-bold text-blue-600">{occBedsCount} beds</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500">Available Beds:</span>
                <span className="font-bold text-slate-600">{freeBedsCount} beds</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500">Active Ambulances:</span>
                <span className="font-bold text-emerald-600">{availableAmbulances} ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment volumes & Catchment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Appointment Volumes Area Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Appointment Volumes by Clinic</h4>
              <p className="text-xs text-slate-400">Historic weekly load of daily clinics</p>
            </div>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apptTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="General" stroke="#10b981" fillOpacity={0.1} fill="url(#colorGen)" strokeWidth={2} />
                <Area type="monotone" dataKey="Chronic" stroke="#3b82f6" fillOpacity={0.1} fill="url(#colorChr)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Catchment Area and Facility Matrix */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Catchment Performance Matrix</h4>
              <p className="text-xs text-slate-400">Kwadaso Municipal Outposts load & logistics tracking</p>
            </div>
            <MapPin size={16} className="text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] text-left">
                  <th className="pb-2 font-semibold">Catchment Sector</th>
                  <th className="pb-2 font-semibold text-right">Active Patients</th>
                  <th className="pb-2 font-semibold text-right">Beds Provisioned</th>
                  <th className="pb-2 font-semibold text-right">Facility Index</th>
                  <th className="pb-2 font-semibold text-center">Logistics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catchmentData.map((district, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-sans font-semibold text-slate-800">{district.district}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-700">{district.patients.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-slate-600">{district.beds}</td>
                    <td className="py-2.5 text-right">
                      <span className="font-mono bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-md font-bold">
                        {district.rating}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${district.ambulances > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} title={district.ambulances > 0 ? 'Ambulance Unit Standby' : 'None Available'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* District Catchment Graphic Map Layout representer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block" />
              <span className="text-xxs font-semibold uppercase text-slate-400 tracking-wider">Logistics Connected Outpost</span>
            </div>
            <button onClick={() => setActiveTab('settings')} className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">
              Configure parameters <Sliders size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
