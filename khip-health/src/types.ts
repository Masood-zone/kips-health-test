export interface VitalRecord {
  id: string;
  date: string;
  bp: string; // e.g. "120/80"
  temp: number; // in Celsius, e.g. 36.8
  hr: number;   // bpm, e.g. 78
  rr: number;   // breaths/min, e.g. 16
  spo2: number; // e.g. 98
  weight: number; // kg
  recordedBy: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'active' | 'completed' | 'discontinued';
}

export interface Encounter {
  id: string;
  date: string;
  providerName: string;
  providerRole: 'Doctor' | 'Nurse' | 'Physician Assistant' | 'Lab Technician';
  facility: string;
  reason: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis: string;
  prescriptions: Medication[];
}

export interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  requestedBy: string;
  dateRequested: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  specimen: string;
  results?: string;
  technician?: string;
  dateCompleted?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  clinicianName: string;
  clinicType: 'General Outpatient' | 'Pediatrics' | 'Antenatal Care' | 'Chronic Diseases' | 'Dental' | 'Lab' | 'Mental Health';
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'No Show';
  urgency: 'Routine' | 'Urgent' | 'Emergency';
}

export interface Message {
  id: string;
  sender: string;
  senderRole: string;
  recipient: string;
  date: string;
  subject: string;
  body: string;
  read: boolean;
  category: 'General' | 'Referral Out' | 'Referral In' | 'Lab Alert';
  attachment?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'User Session' | 'Patient Record' | 'Encounter' | 'Clinical' | 'Laboratory' | 'System';
  details: string;
  ipAddress: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  email: string;
  nhisNumber: string; // National Health Insurance Scheme
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  criticalAlerts: string[];
  vitalsHistory: VitalRecord[];
  encounters: Encounter[];
  labRequests: LabRequest[];
}

export type HealthWorkerRole = 'Administrator' | 'Doctor' | 'Nurse' | 'Lab Technician';

export interface HealthWorker {
  id: string;
  name: string;
  username: string;
  role: HealthWorkerRole;
  facility: string;
  avatarUrl: string;
}
