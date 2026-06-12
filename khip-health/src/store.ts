import { create } from 'zustand';
import { Patient, Appointment, LabRequest, Message, AuditLog, HealthWorker, HealthWorkerRole, VitalRecord, Encounter } from './types';
import { mockPatients, mockAppointments, mockMessages, mockAuditLogs, mockHealthWorkers } from './data';

interface AppStore {
  // Authentication & Session
  currentUser: HealthWorker | null;
  allHealthWorkers: HealthWorker[];
  login: (workerId: string) => boolean;
  logout: () => void;

  // Active Navigation/View
  activeTab: 'analytics' | 'patients' | 'encounter' | 'labs' | 'appointments' | 'messages' | 'logs' | 'settings';
  setActiveTab: (tab: 'analytics' | 'patients' | 'encounter' | 'labs' | 'appointments' | 'messages' | 'logs' | 'settings') => void;

  // Patient Sub-flows
  patients: Patient[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'vitalsHistory' | 'encounters' | 'labRequests'>) => void;
  addVitals: (patientId: string, vitals: Omit<VitalRecord, 'id' | 'date' | 'recordedBy'>) => void;
  addEncounter: (patientId: string, encounter: Omit<Encounter, 'id' | 'date' | 'providerName' | 'providerRole' | 'facility'>) => void;

  // Lab Requests
  labRequests: LabRequest[];
  addLabRequest: (request: Omit<LabRequest, 'id' | 'dateRequested' | 'status' | 'requestedBy'>) => void;
  updateLabRequestStatus: (id: string, status: LabRequest['status'], results?: string, technician?: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  // Messages & Referrals
  messages: Message[];
  sendMessage: (recipient: string, category: Message['category'], subject: string, body: string, attachment?: string) => void;
  markMessageAsRead: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (category: AuditLog['category'], action: string, details: string) => void;

  // Facility Metadata
  bedOccupancy: number;
  totalBeds: number;
  availableAmbulances: number;
  selectedFacility: string;
  updateFacilitySettings: (settings: { bedOccupancy?: number; totalBeds?: number; availableAmbulances?: number; selectedFacility?: string }) => void;
}

export const useAppStore = create<AppStore>((set, get) => {
  // Local helper to gather active lab requests from patients or direct
  const initialLabs = mockPatients.flatMap(p => p.labRequests).concat(
    mockPatients.flatMap(p => p.labRequests).length === 0 ? [
      {
        id: "LAB-2026-001",
        patientId: "KHIP-2026-002",
        patientName: "Kojo Boateng",
        testType: "Malaria Blood Film (MPS) & RDT",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-12T09:20:00Z",
        status: "In Progress",
        specimen: "Blood"
      },
      {
        id: "LAB-2026-002",
        patientId: "KHIP-2026-003",
        patientName: "Abena Oforiwaa",
        testType: "Complete Urine analysis + Culture",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-11T14:10:00Z",
        status: "Completed",
        specimen: "Urine",
        results: "Leukocytes: 3+, Nitrites: Positive, Protein: Trace. Epith cells: 10-15.",
        technician: "Samuel Osei",
        dateCompleted: "2026-06-11T15:30:00Z"
      },
      {
        id: "LAB-2026-003",
        patientId: "KHIP-2026-004",
        patientName: "Kofi Annan",
        testType: "Lipid Profile & Serum Cholesterol",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-12T10:15:00Z",
        status: "Pending",
        specimen: "Blood"
      },
      {
        id: "LAB-2026-004",
        patientId: "KHIP-2026-006",
        patientName: "Amara Boateng",
        testType: "Widal Reaction Test (Typhoid Screen)",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-12T11:05:00Z",
        status: "Pending",
        specimen: "Blood"
      }
    ] : []
  );

  return {
    currentUser: mockHealthWorkers[3], // Defaults to Amina Al-Hassan (Admin)
    allHealthWorkers: mockHealthWorkers,
    activeTab: 'analytics',
    patients: mockPatients,
    selectedPatientId: null,
    labRequests: initialLabs,
    appointments: mockAppointments,
    messages: mockMessages,
    auditLogs: mockAuditLogs,

    bedOccupancy: 84, // Bed occupancy is 84% from prompt images
    totalBeds: 120,
    availableAmbulances: 3,
    selectedFacility: "Kwadaso Community Hospital",

    login: (workerId) => {
      const worker = mockHealthWorkers.find(w => w.id === workerId);
      if (worker) {
        set({ currentUser: worker });
        get().addAuditLog(
          'User Session',
          'User Login Success',
          `Authorized user ${worker.name} logged into the dashboard (${worker.role} panel)`
        );
        return true;
      }
      return false;
    },

    logout: () => {
      const user = get().currentUser;
      if (user) {
        get().addAuditLog(
          'User Session',
          'User Logout',
          `User ${user.name} logged out from secure medical terminal.`
        );
      }
      set({ currentUser: null });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),

    setSelectedPatientId: (id) => set({ selectedPatientId: id }),

    addPatient: (p) => {
      const user = get().currentUser;
      const newId = `KHIP-2026-${String(get().patients.length + 1).padStart(3, '0')}`;
      const newPatient: Patient = {
        ...p,
        id: newId,
        vitalsHistory: [],
        encounters: [],
        labRequests: []
      };

      set(state => ({
        patients: [newPatient, ...state.patients]
      }));

      get().addAuditLog(
        'Patient Record',
        'Patient Registered',
        `Registered Amina-style patient: ${p.name} (ID: ${newId}) under NHIS.`
      );
    },

    addVitals: (patientId, vitals) => {
      const user = get().currentUser;
      const recordedBy = user ? user.name : "Grace Appiah, RN";
      const newVital: VitalRecord = {
        ...vitals,
        id: `V-${Date.now()}`,
        date: new Date().toISOString(),
        recordedBy
      };

      set(state => {
        const updatedPatients = state.patients.map(p => {
          if (p.id === patientId) {
            return {
              ...p,
              vitalsHistory: [newVital, ...p.vitalsHistory]
            };
          }
          return p;
        });

        return { patients: updatedPatients };
      });

      const patient = get().patients.find(p => p.id === patientId);
      get().addAuditLog(
        'Patient Record',
        'Vitals Collected',
        `Logged clinical vitals for ${patient?.name || 'Patient'} (BP: ${vitals.bp}, Temp: ${vitals.temp}C, SPO2: ${vitals.spo2}%).`
      );
    },

    addEncounter: (patientId, enc) => {
      const user = get().currentUser;
      const providerName = user ? user.name : "Dr. Kwabena Addo";
      const providerRole = user ? (user.role as Encounter['providerRole']) : "Doctor";
      const facility = get().selectedFacility;

      const newEncounter: Encounter = {
        ...enc,
        id: `E-${Date.now()}`,
        date: new Date().toISOString(),
        providerName,
        providerRole,
        facility
      };

      set(state => {
        const updatedPatients = state.patients.map(p => {
          if (p.id === patientId) {
            return {
              ...p,
              encounters: [newEncounter, ...p.encounters]
            };
          }
          return p;
        });
        return { patients: updatedPatients };
      });

      const patient = get().patients.find(p => p.id === patientId);
      get().addAuditLog(
        'Clinical',
        'Encounter Session Finalized',
        `Consultation notes finalized for ${patient?.name || 'Patient'} with diagnosis: ${enc.diagnosis}.`
      );
    },

    addLabRequest: (req) => {
      const user = get().currentUser;
      const requestedBy = user ? user.name : "Dr. Kwabena Addo";
      const newId = `LAB-2026-${String(get().labRequests.length + 1).padStart(3, '0')}`;

      const newRequest: LabRequest = {
        ...req,
        id: newId,
        dateRequested: new Date().toISOString(),
        status: 'Pending',
        requestedBy
      };

      // Add to global lab queue and patient record labs
      set(state => ({
        labRequests: [newRequest, ...state.labRequests],
        patients: state.patients.map(p => {
          if (p.id === req.patientId) {
            return {
              ...p,
              labRequests: [newRequest, ...p.labRequests]
            };
          }
          return p;
        })
      }));

      get().addAuditLog(
        'Laboratory',
        'Lab Request Created',
        `Created lab diagnostic query ${newId} (${req.testType}) for ${req.patientName}.`
      );
    },

    updateLabRequestStatus: (id, status, results, technician) => {
      const dateCompleted = status === 'Completed' ? new Date().toISOString() : undefined;

      set(state => {
        const updatedLabs = state.labRequests.map(l => {
          if (l.id === id) {
            return {
              ...l,
              status,
              results: results ?? l.results,
              technician: technician ?? l.technician,
              dateCompleted: dateCompleted ?? l.dateCompleted
            };
          }
          return l;
        });

        // Sync to patient record list as well
        const lab_item = state.labRequests.find(l => l.id === id);
        const updatedPatients = state.patients.map(p => {
          if (lab_item && p.id === lab_item.patientId) {
            return {
              ...p,
              labRequests: p.labRequests.map(r => {
                if (r.id === id) {
                  return {
                    ...r,
                    status,
                    results: results ?? r.results,
                    technician: technician ?? r.technician,
                    dateCompleted: dateCompleted ?? r.dateCompleted
                  };
                }
                return r;
              })
            };
          }
          return p;
        });

        return {
          labRequests: updatedLabs,
          patients: updatedPatients
        };
      });

      const updatedLab = get().labRequests.find(l => l.id === id);
      get().addAuditLog(
        'Laboratory',
        'Lab Request State Changed',
        `Updated request ${id} state to "${status}". Results logged: ${results ? 'Yes' : 'No'}.`
      );
    },

    addAppointment: (apt) => {
      const newId = `APT-2026-${String(get().appointments.length + 1).padStart(3, '0')}`;
      const newApt: Appointment = {
        ...apt,
        id: newId,
        status: 'Scheduled'
      };

      set(state => ({
        appointments: [newApt, ...state.appointments]
      }));

      get().addAuditLog(
        'System',
        'Appointment Scheduled',
        `Booked ${apt.clinicType} consultation on ${apt.date} (${apt.timeSlot}) for ${apt.patientName}.`
      );
    },

    updateAppointmentStatus: (id, status) => {
      set(state => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
      }));

      const apt = get().appointments.find(a => a.id === id);
      get().addAuditLog(
        'System',
        'Appointment Modified',
        `Set appointment status to "${status}" for ${apt?.patientName || 'Patient'}.`
      );
    },

    sendMessage: (recipient, category, subject, body, attachment) => {
      const user = get().currentUser;
      const sender = user ? user.name : "System Administrator";
      const senderRole = user ? user.role : "Staff";

      const newMsg: Message = {
        id: `MSG-${Date.now()}`,
        sender,
        senderRole,
        recipient,
        date: new Date().toISOString(),
        category,
        subject,
        body,
        read: false,
        attachment
      };

      set(state => ({
        messages: [newMsg, ...state.messages]
      }));

      get().addAuditLog(
        'System',
        'Message Dispatched',
        `Sent secure internal correspondence: "${subject}" to ${recipient}.`
      );
    },

    markMessageAsRead: (id) => {
      set(state => ({
        messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
      }));
    },

    addAuditLog: (category, action, details) => {
      const user = get().currentUser;
      const userId = user ? user.id : "SYSTEM";
      const userName = user ? user.name : "System Routine Backend";
      const userRole = user ? user.role : "System Server";

      const log: AuditLog = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId,
        userName,
        userRole,
        action,
        category,
        details,
        ipAddress: "192.168.1.13"
      };

      set(state => ({
        auditLogs: [log, ...state.auditLogs]
      }));
    },

    updateFacilitySettings: (settings) => {
      set(state => ({
        ...state,
        ...settings
      }));

      get().addAuditLog(
        'System',
        'Facility Config Modified',
        `Facility parameter update: ${JSON.stringify(settings)}`
      );
    }
  };
});
