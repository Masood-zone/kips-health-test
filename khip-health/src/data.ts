import { Patient, Appointment, LabRequest, Message, AuditLog, HealthWorker } from './types';

export const mockHealthWorkers: HealthWorker[] = [
  {
    id: "HW-001",
    name: "Dr. Kwabena Addo",
    username: "draddo",
    role: "Doctor",
    facility: "Kwadaso Community Hospital",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "HW-002",
    name: "Grace Appiah, RN",
    username: "grace_rn",
    role: "Nurse",
    facility: "Kwadaso Community Hospital",
    avatarUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "HW-003",
    name: "Samuel Osei",
    username: "samuel_lab",
    role: "Lab Technician",
    facility: "Kwadaso Community Hospital",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "HW-004",
    name: "Amina Al-Hassan",
    username: "amina_admin",
    role: "Administrator",
    facility: "Kwadaso Municipal Health Directorate",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  }
];

export const mockPatients: Patient[] = [
  {
    id: "KHIP-2026-001",
    name: "Amina Mensah",
    age: 42,
    gender: "Female",
    dob: "1984-05-12",
    phone: "+233 24 412 3456",
    email: "amina.mensah@gmail.com",
    nhisNumber: "NHIS-8274619",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Sulfa Drugs"],
    emergencyContact: {
      name: "Kofi Mensah",
      relationship: "Husband",
      phone: "+233 20 811 9876"
    },
    criticalAlerts: ["Grade 2 Hypertension", "Severe Penicillin Allergy"],
    vitalsHistory: [
      {
        id: "V-101",
        date: "2026-06-12T08:30:00Z",
        bp: "145/95",
        temp: 36.8,
        hr: 82,
        rr: 18,
        spo2: 98,
        weight: 76.5,
        recordedBy: "Grace Appiah, RN"
      },
      {
        id: "V-102",
        date: "2026-05-15T09:15:00Z",
        bp: "140/92",
        temp: 36.6,
        hr: 79,
        rr: 16,
        spo2: 99,
        weight: 77.0,
        recordedBy: "Grace Appiah, RN"
      },
      {
        id: "V-103",
        date: "2026-04-10T10:00:00Z",
        bp: "150/100",
        temp: 37.0,
        hr: 85,
        rr: 20,
        spo2: 97,
        weight: 78.2,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [
      {
        id: "E-501",
        date: "2026-06-12T08:45:00Z",
        providerName: "Dr. Kwabena Addo",
        providerRole: "Doctor",
        facility: "Kwadaso Community Hospital",
        reason: "Routine Hypertension Review",
        subjective: "Patient presents for a follow-up on her blood pressure. Complains of occasional mild tension headache, mostly in the mornings. No dizziness, chest pain, or visual disturbances. Self-reports taking Lisinopril and Amlodipine regularly, but admits to high sodium intake due to local diet changes.",
        objective: "BP: 145/95. HR: 82 bpm, regular. Lungs clear to percussion and auscultation. Heart: S1, S2 normal, no murmurs. Extremities: Mild pedal swelling noted (1+).",
        assessment: "Inadequately controlled Essential Hypertension (I10), likely compounded by dietary sodium levels. Responding stably but needs dosage titration.",
        plan: "1. Upgrade Lisinopril dose to 20mg daily (from 10mg).\n2. Continue Amlodipine 5mg daily.\n3. Referral to hospital nutritionist for sodium reduction coaching.\n4. Advised to log native BP three times a week and return in 2 weeks.",
        diagnosis: "I10 - Essential (Primary) Hypertension",
        prescriptions: [
          {
            id: "M-301",
            name: "Lisinopril",
            dosage: "20mg",
            frequency: "Once Daily (Morning)",
            duration: "30 Days",
            status: "active"
          },
          {
            id: "M-302",
            name: "Amlodipine",
            dosage: "5mg",
            frequency: "Once Daily (Night)",
            duration: "30 Days",
            status: "active"
          },
          {
            id: "M-303",
            name: "Paracetamol",
            dosage: "1000mg",
            frequency: "Every 8 hours as needed for headache",
            duration: "5 Days",
            status: "active"
          }
        ]
      }
    ],
    labRequests: []
  },
  {
    id: "KHIP-2026-002",
    name: "Kojo Boateng",
    age: 29,
    gender: "Male",
    dob: "1997-09-05",
    phone: "+233 55 219 4488",
    email: "kojo_boat97@yahoo.com",
    nhisNumber: "NHIS-1122334",
    bloodGroup: "B+",
    allergies: [],
    emergencyContact: {
      name: "Kwame Boateng",
      relationship: "Brother",
      phone: "+233 24 931 0033"
    },
    criticalAlerts: ["Acute Fever"],
    vitalsHistory: [
      {
        id: "V-201",
        date: "2026-06-12T09:00:00Z",
        bp: "115/75",
        temp: 39.1,
        hr: 98,
        rr: 22,
        spo2: 96,
        weight: 68.0,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [
      {
        id: "E-502",
        date: "2026-06-12T09:15:00Z",
        providerName: "Dr. Kwabena Addo",
        providerRole: "Doctor",
        facility: "Kwadaso Community Hospital",
        reason: "Acute Fever and Rigors",
        subjective: "Patient complains of high fever, intense shaking chills, joint pain, and profuse sweating starting 3 days ago. Also notes mild nausea and head and lower back pain. No cough or respiratory difficulty.",
        objective: "Slight jaundice in sclera. Temp: 39.1°C. BP: 115/75. Abdomen: Soft, non-tender, spleen is palpably enlarged (1cm below costal margin).",
        assessment: "Suspected Malaria, acute presentation. High temperature.",
        plan: "1. Order immediate Malaria Rapid Diagnostic Test (RDT) and blood smear.\n2. Prescribe Artemether-Lumefantrine once result is confirmed.\n3. Intramuscular Paracetamol 300mg now for fever containment.",
        diagnosis: "B50.9 - Plasmodium Falciparum Malaria",
        prescriptions: []
      }
    ],
    labRequests: [
      {
        id: "LAB-2026-001",
        patientId: "KHIP-2026-002",
        patientName: "Kojo Boateng",
        testType: "Malaria Blood Film (MPS) & RDT",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-12T09:20:00Z",
        status: "In Progress",
        specimen: "Blood"
      }
    ]
  },
  {
    id: "KHIP-2026-003",
    name: "Abena Oforiwaa",
    age: 31,
    gender: "Female",
    dob: "1995-11-22",
    phone: "+233 27 655 4112",
    email: "abena.ofori@gmail.com",
    nhisNumber: "NHIS-9938475",
    bloodGroup: "A-",
    allergies: ["Sulfa Drugs"],
    emergencyContact: {
      name: "Cecilia Oforiwaa",
      relationship: "Mother",
      phone: "+233 24 388 7755"
    },
    criticalAlerts: [],
    vitalsHistory: [
      {
        id: "V-301",
        date: "2026-06-11T13:45:00Z",
        bp: "110/70",
        temp: 37.6,
        hr: 76,
        rr: 16,
        spo2: 99,
        weight: 62.4,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [
      {
        id: "E-503",
        date: "2026-06-11T14:00:00Z",
        providerName: "Dr. Kwabena Addo",
        providerRole: "Doctor",
        facility: "Kwadaso Community Hospital",
        reason: "Suspected Urinary Tract Infection",
        subjective: "Patient experiences painful urination (dysuria), increased urinary frequency, and lower abdominal discomfort for the last 48 hours. No fever or vomiting.",
        objective: "Abdomen: Mild suprapubic tenderness. Percussion: No costovertebral angle tenderness.",
        assessment: "Cystitis / Acute Urinary Tract Infection.",
        plan: "1. Urinalysis and urine culture requested.\n2. Prescribe Ciprofloxacin while awaiting urinalysis output.\n3. Increase oral hydration.",
        diagnosis: "N39.0 - Urinary Tract Infection, site unspecified",
        prescriptions: [
          {
            id: "M-304",
            name: "Ciprofloxacin 500mg",
            dosage: "500gm",
            frequency: "Twice daily",
            duration: "5 Days",
            status: "active"
          }
        ]
      }
    ],
    labRequests: [
      {
        id: "LAB-2026-002",
        patientId: "KHIP-2026-003",
        patientName: "Abena Oforiwaa",
        testType: "Complete Urine analysis + Culture",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-11T14:10:00Z",
        status: "Completed",
        specimen: "Urine",
        results: "Leukocytes: 3+, Nitrites: Positive, Protein: Trace. Epith cells: 10-15. Culture pending.",
        technician: "Samuel Osei",
        dateCompleted: "2026-06-11T15:30:00Z"
      }
    ]
  },
  {
    id: "KHIP-2026-004",
    name: "Kofi Annan",
    age: 56,
    gender: "Male",
    dob: "1970-01-30",
    phone: "+233 24 990 0112",
    email: "kofi.annan@gmail.com",
    nhisNumber: "NHIS-5566778",
    bloodGroup: "O-",
    allergies: ["NSAIDs", "Aspirin"],
    emergencyContact: {
      name: "Kwaku Annan",
      relationship: "Son",
      phone: "+233 20 543 2109"
    },
    criticalAlerts: ["Hyperlipidemia", "Aspirin-induced asthma risk"],
    vitalsHistory: [
      {
        id: "V-401",
        date: "2026-06-12T10:10:00Z",
        bp: "135/88",
        temp: 36.5,
        hr: 72,
        rr: 15,
        spo2: 98,
        weight: 84.5,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [],
    labRequests: [
      {
        id: "LAB-2026-003",
        patientId: "KHIP-2026-004",
        patientName: "Kofi Annan",
        testType: "Lipid Profile & Serum Cholesterol",
        requestedBy: "Dr. Kwabena Addo",
        dateRequested: "2026-06-12T10:15:00Z",
        status: "Pending",
        specimen: "Blood"
      }
    ]
  },
  {
    id: "KHIP-2026-005",
    name: "Mary Appiah",
    age: 62,
    gender: "Female",
    dob: "1964-03-24",
    phone: "+233 20 123 4567",
    email: "maryappiah64@gmail.com",
    nhisNumber: "NHIS-3344556",
    bloodGroup: "AB+",
    allergies: [],
    emergencyContact: {
      name: "Thomas Appiah",
      relationship: "Husband",
      phone: "+233 24 555 9931"
    },
    criticalAlerts: ["Type 2 Diabetes mellitus"],
    vitalsHistory: [
      {
        id: "V-501",
        date: "2026-06-12T07:45:00Z",
        bp: "128/82",
        temp: 36.6,
        hr: 75,
        rr: 18,
        spo2: 99,
        weight: 71.0,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [
      {
        id: "E-504",
        date: "2026-06-05T09:00:00Z",
        providerName: "Dr. Kwabena Addo",
        providerRole: "Doctor",
        facility: "Kwadaso Community Hospital",
        reason: "Diabetic Monitoring",
        subjective: "Patient checks in for blood glucose monitoring. Self-reports compliance with Metformin. Feeling well overall, no polyuria or polydipsia.",
        objective: "FBS test done: 6.8 mmol/L. BP is 128/82. Feet checked: no ulcerations, protective sensation is intact.",
        assessment: "Type 2 Diabetes - stable glycemic control.",
        plan: "1. Continue Metformin 500mg twice daily with meals.\n2. Scheduled HbA1c test for next month's review.",
        diagnosis: "E11.9 - Type 2 Diabetes mellitus without complications",
        prescriptions: [
          {
            id: "M-305",
            name: "Metformin 500mg",
            dosage: "500gm",
            frequency: "Twice daily with meals",
            duration: "60 Days",
            status: "active"
          }
        ]
      }
    ],
    labRequests: []
  },
  {
    id: "KHIP-2026-006",
    name: "Amara Boateng",
    age: 25,
    gender: "Female",
    dob: "2001-08-14",
    phone: "+233 24 777 8888",
    email: "amara.b@gmail.com",
    nhisNumber: "NHIS-4455663",
    bloodGroup: "O+",
    allergies: [],
    emergencyContact: {
      name: "Regina Boateng",
      relationship: "Mother",
      phone: "+233 24 666 5555"
    },
    criticalAlerts: ["Persistent vomiting"],
    vitalsHistory: [
      {
        id: "V-601",
        date: "2026-06-12T11:00:00Z",
        bp: "105/65",
        temp: 38.5,
        hr: 94,
        rr: 20,
        spo2: 97,
        weight: 55.4,
        recordedBy: "Grace Appiah, RN"
      }
    ],
    encounters: [],
    labRequests: [
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
    ]
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "APT-2026-001",
    patientId: "KHIP-2026-001",
    patientName: "Amina Mensah",
    clinicianName: "Dr. Kwabena Addo",
    clinicType: "Chronic Diseases",
    date: "2026-06-12",
    timeSlot: "08:30 - 09:00",
    status: "Completed",
    urgency: "Routine"
  },
  {
    id: "APT-2026-002",
    patientId: "KHIP-2026-002",
    patientName: "Kojo Boateng",
    clinicianName: "Dr. Kwabena Addo",
    clinicType: "General Outpatient",
    date: "2026-06-12",
    timeSlot: "09:15 - 09:45",
    status: "Checked In",
    urgency: "Urgent"
  },
  {
    id: "APT-2026-003",
    patientId: "KHIP-2026-004",
    patientName: "Kofi Annan",
    clinicianName: "Dr. Kwabena Addo",
    clinicType: "General Outpatient",
    date: "2026-06-12",
    timeSlot: "10:15 - 10:45",
    status: "Checked In",
    urgency: "Routine"
  },
  {
    id: "APT-2026-004",
    patientId: "KHIP-2026-006",
    patientName: "Amara Boateng",
    clinicianName: "Dr. Kwabena Addo",
    clinicType: "General Outpatient",
    date: "2026-06-12",
    timeSlot: "11:00 - 11:30",
    status: "Scheduled",
    urgency: "Urgent"
  },
  {
    id: "APT-2026-005",
    patientId: "KHIP-2026-005",
    patientName: "Mary Appiah",
    clinicianName: "Grace Appiah, RN",
    clinicType: "Chronic Diseases",
    date: "2026-06-12",
    timeSlot: "14:00 - 14:30",
    status: "Scheduled",
    urgency: "Routine"
  },
  {
    id: "APT-2026-006",
    patientId: "KHIP-2026-003",
    patientName: "Abena Oforiwaa",
    clinicianName: "Dr. Kwabena Addo",
    clinicType: "General Outpatient",
    date: "2026-06-13",
    timeSlot: "09:00 - 09:30",
    status: "Scheduled",
    urgency: "Routine"
  }
];

export const mockMessages: Message[] = [
  {
    id: "MSG-001",
    sender: "Kwadaso Lab Section",
    senderRole: "Lab Technician",
    recipient: "Dr. Kwabena Addo",
    date: "2026-06-12T09:32:00Z",
    subject: "Urgent: Abnormal Urinalysis on Abena Oforiwaa",
    body: "Dr. Addo, the patient Abena Oforiwaa (KHIP-2026-003) exhibits 3+ leukocytes and trace proteins. We prepared the blood culture as requested, but you may want to start antibiotics immediately if symptoms match. Full details added to lab log.",
    read: false,
    category: "Lab Alert"
  },
  {
    id: "MSG-002",
    sender: "District Director",
    senderRole: "Administrator",
    recipient: "Dr. Kwabena Addo",
    date: "2026-06-12T08:00:00Z",
    subject: "Kwadaso Vaccination Outpost Drive - Finalizing Materials",
    body: "Good morning team, please submit your final estimates for the childhood yellow fever vaccination vials needed for standard distribution in the rural catchment. Deadline is close of business tomorrow.",
    read: true,
    category: "General"
  },
  {
    id: "MSG-003",
    sender: "Dr. Kwabena Addo",
    senderRole: "Doctor",
    recipient: "Komfo Anokye Teaching Hospital (KATH)",
    date: "2026-06-11T16:20:00Z",
    subject: "Cardiology Referral: Amina Mensah",
    body: "Referring Amina Mensah, 42-year-old female, with persistent hypertension. Despite combined Lisinopril and Amlodipine regimen, her BP logs hover above 140/90 consistently with mild pedal swelling. Requesting formal cardiac evaluation and echocardiography advice.",
    read: true,
    category: "Referral Out",
    attachment: "Referral-Amina-Mensah.pdf"
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    timestamp: "2026-06-12T09:20:20Z",
    userId: "HW-001",
    userName: "Dr. Kwabena Addo",
    userRole: "Doctor",
    action: "Lab request generated",
    category: "Laboratory",
    details: "Issued Malaria Blood Film & RDT request for patient Kojo Boateng (KHIP-2026-002)",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-002",
    timestamp: "2026-06-12T09:15:10Z",
    userId: "HW-001",
    userName: "Dr. Kwabena Addo",
    userRole: "Doctor",
    action: "Encounter records finalized",
    category: "Clinical",
    details: "Created clinical consultation encounter for Kojo Boateng. Diagnosis B50.9 - Falciparum Malaria.",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-003",
    timestamp: "2026-06-12T09:00:15Z",
    userId: "HW-002",
    userName: "Grace Appiah, RN",
    userRole: "Nurse",
    action: "Vitals collection logged",
    category: "Patient Record",
    details: "Recorded vitals (BP: 115/75, Temp: 39.1C, HR: 98, SPO2: 96%) for Kojo Boateng.",
    ipAddress: "192.168.1.48"
  },
  {
    id: "AUD-004",
    timestamp: "2026-06-12T08:50:00Z",
    userId: "HW-001",
    userName: "Dr. Kwabena Addo",
    userRole: "Doctor",
    action: "Encounter records finalized",
    category: "Clinical",
    details: "Created clinic encounter for Amina Mensah. Diagnosis I10 - Essential Hypertension.",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-005",
    timestamp: "2026-06-12T08:30:10Z",
    userId: "HW-002",
    userName: "Grace Appiah, RN",
    userRole: "Nurse",
    action: "Vitals collection logged",
    category: "Patient Record",
    details: "Recorded vitals (BP: 145/95, Temp: 36.8C, HR: 82) for Amina Mensah.",
    ipAddress: "192.168.1.48"
  },
  {
    id: "AUD-006",
    timestamp: "2026-06-12T08:02:44Z",
    userId: "HW-004",
    userName: "Amina Al-Hassan",
    userRole: "Administrator",
    action: "Dashboard login success",
    category: "User Session",
    details: "Administrator logged in to Kwadaso division dashboard safely through authorized terminal.",
    ipAddress: "192.168.1.10"
  }
];

export const commonDiagnoses = [
  "B50.9 - Plasmodium Falciparum Malaria",
  "I10 - Essential (Primary) Hypertension",
  "E11.9 - Type 2 Diabetes mellitus without complications",
  "N39.0 - Urinary Tract Infection, site unspecified",
  "A01.0 - Typhoid Fever, unspecified",
  "J03.9 - Acute Tonsillitis, unspecified",
  "J06.9 - Acute Upper Respiratory Infection",
  "K30 - Dyspepsia / Indigestion",
  "L24.9 - Irritant Contact Dermatitis"
];
