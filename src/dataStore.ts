/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FIR, Accused, Victim, Witness, Evidence, Vehicle, Phone, FinancialTransaction, AuditLog, User, UserRole, NetworkNode, NetworkLink, NetworkGraph, ForecastReport } from "./types";

// Master Police Stations in Karnataka
export const POLICE_STATIONS = [
  { code: "KSP-BLR-001", name: "Majestic Police Station", district: "Bengaluru City" },
  { code: "KSP-BLR-002", name: "Indiranagar Police Station", district: "Bengaluru City" },
  { code: "KSP-BLR-003", name: "Koramangala Police Station", district: "Bengaluru City" },
  { code: "KSP-BLR-004", name: "Whitefield Police Station", district: "Bengaluru City" },
  { code: "KSP-MYS-001", name: "Devaraja Police Station", district: "Mysuru City" },
  { code: "KSP-MNG-001", name: "Pandeshwar Police Station", district: "Mangaluru City" },
];

// Seed Users representing Karnataka Police Officers
export const SEED_USERS: User[] = [
  {
    id: "U-001",
    username: "io_gowda",
    name: "Inspector Shivaraj Gowda",
    role: UserRole.INVESTIGATOR,
    badgeId: "KSP-84920",
    department: "Crime Investigation Department (CID)",
    station: "Majestic Police Station",
  },
  {
    id: "U-002",
    username: "analyst_patil",
    name: "Dr. Ananya Patil",
    role: UserRole.ANALYST,
    badgeId: "KSP-37190",
    department: "State Crime Records Bureau (SCRB)",
    station: "Koramangala Police Station",
  },
  {
    id: "U-003",
    username: "super_hegde",
    name: "DSP Vikram Hegde",
    role: UserRole.SUPERVISOR,
    badgeId: "KSP-00241",
    department: "Bengaluru East Division",
    station: "Indiranagar Police Station",
  },
  {
    id: "U-004",
    username: "policy_reddy",
    name: "Additional DGP Raghavendra Reddy",
    role: UserRole.POLICYMAKER,
    badgeId: "KSP-00008",
    department: "Police Headquarters (PHQ)",
    station: "Bengaluru City",
  },
  {
    id: "U-005",
    username: "admin_ksp",
    name: "Admin Kiran Kumar",
    role: UserRole.ADMIN,
    badgeId: "KSP-11111",
    department: "IT & Communications Cell",
    station: "Bengaluru City",
  },
];

// Seed Database Contents representing real normalized data
export const SEED_FIRS: FIR[] = [
  {
    id: "FIR-2026-001",
    firNumber: "FIR/0045/2026",
    policeStation: "Koramangala Police Station",
    district: "Bengaluru City",
    dateFiled: "2026-05-12",
    crimeCategory: "Cyber Crime",
    subCategory: "Phishing & Banking Fraud",
    ipcSections: "BNS 318 (Cheating), IT Act Section 66D (Cheating by personation)",
    status: "Under Investigation",
    description: "Complainant lost ₹4.5 Lakhs to a phishing call where the caller impersonated an SBI Bank Manager asking for Aadhaar OTP validation under the guise of KYC updating.",
    investigatingOfficer: "Inspector Shivaraj Gowda",
    evidenceCount: 3,
  },
  {
    id: "FIR-2026-002",
    firNumber: "FIR/0082/2026",
    policeStation: "Indiranagar Police Station",
    district: "Bengaluru City",
    dateFiled: "2026-06-01",
    crimeCategory: "Financial Fraud",
    subCategory: "Ponzi Scheme Fraud",
    ipcSections: "BNS 316 (Criminal Breach of Trust), BNS 318 (Cheating), KPID Act Section 9",
    status: "Charge Sheeted",
    description: "Multi-crore investment scam under the business name 'Vikas Mutual Trust'. The firm promised 25% monthly returns on gold deposits, collected money from 150+ citizens in Indiranagar, and closed down overnight.",
    investigatingOfficer: "DSP Vikram Hegde",
    evidenceCount: 5,
  },
  {
    id: "FIR-2026-003",
    firNumber: "FIR/0112/2026",
    policeStation: "Majestic Police Station",
    district: "Bengaluru City",
    dateFiled: "2026-06-20",
    crimeCategory: "Robbery",
    subCategory: "Armed Robbery / Snatching",
    ipcSections: "BNS 309 (Robbery), BNS 311 (Dacoity with murder attempt)",
    status: "Pending Apprehension",
    description: "Two masked assailants on a Pulsar motorcycle snatched a gold chain weighing 80 grams from an elderly woman at gunpoint near Majestic Bus Stand. Video surveillance captured the partial license plate.",
    investigatingOfficer: "Inspector Shivaraj Gowda",
    evidenceCount: 2,
  },
  {
    id: "FIR-2026-004",
    firNumber: "FIR/0223/2026",
    policeStation: "Whitefield Police Station",
    district: "Bengaluru City",
    dateFiled: "2026-07-01",
    crimeCategory: "Homicide",
    subCategory: "Murder for Gain",
    ipcSections: "BNS 103 (Murder), BNS 309 (Robbery)",
    status: "Under Investigation",
    description: "A retired government official was found murdered inside his villa in Whitefield. Electronic lockers were broken into, and gold coins and jewelry worth ₹20 Lakhs are missing. Household helper is prime suspect.",
    investigatingOfficer: "Inspector Shivaraj Gowda",
    evidenceCount: 6,
  },
  {
    id: "FIR-2026-005",
    firNumber: "FIR/0029/2026",
    policeStation: "Devaraja Police Station",
    district: "Mysuru City",
    dateFiled: "2026-04-18",
    crimeCategory: "Cyber Crime",
    subCategory: "Ransomware Attack",
    ipcSections: "IT Act Sec 66, BNS 308 (Extortion)",
    status: "Closed",
    description: "Ransomware locked the local billing servers of a prominent Mysuru hospital, demanding 1.5 Bitcoins. Investigation traced IP addresses to proxies. Server decrypted using backups.",
    investigatingOfficer: "Dr. Ananya Patil",
    evidenceCount: 4,
  },
];

export const SEED_ACCUSED: Accused[] = [
  {
    id: "ACC-001",
    name: "Karthik Shettar",
    alias: "Call-Karthik",
    age: 29,
    gender: "Male",
    address: "7th Cross, Devarachikkanahalli, Bengaluru",
    phoneNumber: "+91 9886012345",
    vehicleNumber: "KA-05-MJ-4820",
    bankAccountNumber: "SBI-9081234510",
    modusOperandi: "Acquires fake SIM cards using forged documents. Initiates calls impersonating Bank Managers or Telecom KYC agents. Speaks fluent Kannada and English to gain trust and extract OTPs from senior citizens.",
    riskScore: 84,
    status: "Absconding",
    previousConvictions: 3,
    severityIndex: "High",
    linkedFIRs: ["FIR-2026-001"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop",
  },
  {
    id: "ACC-002",
    name: "Suresh Prasad",
    alias: "Vikas Suresh",
    age: 42,
    gender: "Male",
    address: "302, Royal Residency, Indiranagar, Bengaluru",
    phoneNumber: "+91 9900112233",
    vehicleNumber: "KA-03-MS-9999",
    bankAccountNumber: "HDFC-4410293847",
    modusOperandi: "Sets up unregistered financial consultancies, lures local communities with daily/weekly high-return schemes, builds initial trust by paying high returns to early depositors, then closes operations and shifts location.",
    riskScore: 72,
    status: "In Custody",
    previousConvictions: 1,
    severityIndex: "Medium",
    linkedFIRs: ["FIR-2026-002"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop",
  },
  {
    id: "ACC-003",
    name: "Raju Naik",
    alias: "Pulsar Raju",
    age: 24,
    gender: "Male",
    address: "JJ Nagar Slum, Majestic Area, Bengaluru",
    phoneNumber: "+91 8095112244",
    vehicleNumber: "KA-02-EH-7711",
    bankAccountNumber: "CANARA-3012938411",
    modusOperandi: "Targets lone women in early mornings or late evenings in residential layouts. Rides stolen high-speed bikes with mud-covered plates. Snatches gold chains or valuables using physical force or handguns.",
    riskScore: 92,
    status: "Absconding",
    previousConvictions: 5,
    severityIndex: "High",
    linkedFIRs: ["FIR-2026-003"],
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&fit=crop",
  },
  {
    id: "ACC-004",
    name: "Manjunath Swamy",
    alias: "Munna",
    age: 33,
    gender: "Male",
    address: "Channasandra, Whitefield, Bengaluru",
    phoneNumber: "+91 9741223344",
    vehicleNumber: "KA-53-Y-1212",
    bankAccountNumber: "ICICI-8810293422",
    modusOperandi: "Secures short-term domestic employment (gardener, helper, driver) using false identity proofs. Observes electronic lockers and safety habits of wealthy elders. Orchestrates late-night break-ins with physical violence.",
    riskScore: 96,
    status: "Under Watch",
    previousConvictions: 2,
    severityIndex: "High",
    linkedFIRs: ["FIR-2026-004"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop",
  },
];

export const SEED_VICTIMS: Victim[] = [
  {
    id: "VIC-001",
    name: "Ranganath Swamy",
    age: 71,
    gender: "Male",
    statement: "I received a phone call from +91 9886012345 claiming to be from SBI. The person spoke polite Kannada and said my pension account would freeze if I didn't verify my Aadhaar and read out the OTP. I gave the OTP, and immediately ₹4,50,000 was debited.",
    linkedFIR: "FIR-2026-001",
  },
  {
    id: "VIC-002",
    name: "Kavitha Reddy",
    age: 39,
    gender: "Female",
    statement: "I invested ₹10,000,000 in Vikas Mutual Trust after seeing friends get gold dividends. On June 1st, I went to their Indiranagar office and found it locked. Phone numbers of Suresh Prasad are turned off.",
    linkedFIR: "FIR-2026-002",
  },
  {
    id: "VIC-003",
    name: "Susheela Bai",
    age: 65,
    gender: "Female",
    statement: "I was walking back from temple at 6:30 PM. A black Pulsar bike stopped, and the pillion rider held a weapon to my face, snatched my 80-gram mangalsutra chain, and zipped away towards Majestic.",
    linkedFIR: "FIR-2026-003",
  },
];

export const SEED_WITNESSES: Witness[] = [
  {
    id: "WIT-001",
    name: "Nagesh Rao",
    contact: "+91 9448002233",
    statement: "I operate a tea stall near Majestic temple. I saw a black Pulsar motorcycle with a taped license plate KA-02-EH-7711 hovering in the area prior to the incident. Both riders wore full-face helmets.",
    linkedFIR: "FIR-2026-003",
  },
  {
    id: "WIT-002",
    name: "Geetha Murthy",
    contact: "+91 9845011223",
    statement: "I am a neighbor of the victim in Whitefield. On the afternoon of June 30th, I saw the helper Manjunath Swamy loading a heavy travel bag into a taxi, looking highly nervous and sweating profusely.",
    linkedFIR: "FIR-2026-004",
  },
];

export const SEED_EVIDENCE: Evidence[] = [
  {
    id: "EVI-001",
    firId: "FIR-2026-001",
    type: "Digital",
    description: "Call detail records (CDR) for +91 9886012345 showing coordinates originating from a tower near Devarachikkanahalli matching the home address of Karthik Shettar.",
    dateCollected: "2026-05-13",
    collectedBy: "Inspector Shivaraj Gowda",
    locationCollected: "Telecom Provider Server Log",
    status: "Secured",
  },
  {
    id: "EVI-002",
    firId: "FIR-2026-001",
    type: "Financial",
    description: "Bank transfer trail showing ₹4,50,000 routed from victim SBI account to destination account SBI-9081234510 registered under Karthik Shettar.",
    dateCollected: "2026-05-14",
    collectedBy: "Inspector Shivaraj Gowda",
    locationCollected: "SBI Koramangala Bank Statement",
    status: "Sent to FSL",
  },
  {
    id: "EVI-003",
    firId: "FIR-2026-003",
    type: "Digital",
    description: "CCTV footage retrieved from Bengaluru Metro Traffic Control near Majestic Circle showing Pulsar motorcycle with taped number plates.",
    dateCollected: "2026-06-21",
    collectedBy: "Sub-Inspector Anand Kumar",
    locationCollected: "BMRCL Surveillance System",
    status: "Secured",
  },
  {
    id: "EVI-004",
    firId: "FIR-2026-004",
    type: "Forensics",
    description: "Latent bloody fingerprint found on broken safe handle inside the Whitefield villa. Fingerprint matches database record for Manjunath Swamy.",
    dateCollected: "2026-07-02",
    collectedBy: "KSP Forensic Science Laboratory (FSL)",
    locationCollected: "Crime Scene Villa - Safe Handle",
    status: "Sent to FSL",
  },
];

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: "VEH-001",
    registrationNumber: "KA-05-MJ-4820",
    make: "Maruti Suzuki",
    model: "Swift",
    color: "Silver",
    ownerName: "Karthik Shettar",
    linkedAccusedId: "ACC-001",
    linkedFIRs: ["FIR-2026-001"],
  },
  {
    id: "VEH-002",
    registrationNumber: "KA-02-EH-7711",
    make: "Bajaj",
    model: "Pulsar 220",
    color: "Black",
    ownerName: "Stolen Vehicle (Reported in Jayanagar)",
    linkedAccusedId: "ACC-003",
    linkedFIRs: ["FIR-2026-003"],
  },
];

export const SEED_PHONES: Phone[] = [
  {
    id: "PHN-001",
    phoneNumber: "+91 9886012345",
    imei: "359012345678901",
    ownerName: "Karthik Shettar",
    linkedAccusedId: "ACC-001",
    linkedFIRs: ["FIR-2026-001"],
  },
  {
    id: "PHN-002",
    phoneNumber: "+91 9900112233",
    imei: "358900123456789",
    ownerName: "Suresh Prasad",
    linkedAccusedId: "ACC-002",
    linkedFIRs: ["FIR-2026-002"],
  },
  {
    id: "PHN-003",
    phoneNumber: "+91 8095112244",
    imei: "351234908127394",
    ownerName: "Raju Naik",
    linkedAccusedId: "ACC-003",
    linkedFIRs: ["FIR-2026-003"],
  },
];

// Financial Ledger representing complex money trail (Layering, Structuring, UPI, NEFT)
export const SEED_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "TXN-001",
    sourceAccount: "SBI-9002138492",
    sourceBank: "State Bank of India",
    sourceOwner: "Ranganath Swamy (Victim)",
    destAccount: "SBI-9081234510",
    destBank: "State Bank of India",
    destOwner: "Karthik Shettar (Accused)",
    amount: 450000,
    timestamp: "2026-05-12T11:45:00Z",
    type: "NEFT",
    status: "Suspicious",
    flagReason: "Immediate routing of funds from elderly savings account following credential theft.",
  },
  {
    id: "TXN-002",
    sourceAccount: "SBI-9081234510",
    sourceBank: "State Bank of India",
    sourceOwner: "Karthik Shettar (Accused)",
    destAccount: "UPI-MULE-4411",
    destBank: "Canara Bank",
    destOwner: "Mallesh Murthy (Mule Account 1)",
    amount: 150000,
    timestamp: "2026-05-12T11:58:00Z",
    type: "UPI",
    status: "Suspicious",
    flagReason: "Rapid layering: transfer under ₹2 Lakhs limit to evade alert systems.",
  },
  {
    id: "TXN-003",
    sourceAccount: "SBI-9081234510",
    sourceBank: "State Bank of India",
    sourceOwner: "Karthik Shettar (Accused)",
    destAccount: "UPI-MULE-8812",
    destBank: "Union Bank",
    destOwner: "Shiva Rajan (Mule Account 2)",
    amount: 150000,
    timestamp: "2026-05-12T12:02:00Z",
    type: "UPI",
    status: "Suspicious",
    flagReason: "Rapid layering: structured division of stolen assets.",
  },
  {
    id: "TXN-004",
    sourceAccount: "SBI-9081234510",
    sourceBank: "State Bank of India",
    sourceOwner: "Karthik Shettar (Accused)",
    destAccount: "UPI-MULE-9900",
    destBank: "Bank of Baroda",
    destOwner: "Lakshmi Bai (Mule Account 3)",
    amount: 150000,
    timestamp: "2026-05-12T12:05:00Z",
    type: "UPI",
    status: "Suspicious",
    flagReason: "Rapid layering: structuring into multiple secondary bank accounts.",
  },
  {
    id: "TXN-005",
    sourceAccount: "HDFC-4410293847",
    sourceBank: "HDFC Bank",
    sourceOwner: "Suresh Prasad (Accused)",
    destAccount: "SHELL-CORP-99",
    destBank: "HSBC Bank",
    destOwner: "Vikas Global Shell Private Limited",
    amount: 2500000,
    timestamp: "2026-06-02T10:15:00Z",
    type: "RTGS",
    status: "Flagged",
    flagReason: "Unusual business transfer to high-risk entity lacking local trading records.",
  },
  {
    id: "TXN-006",
    sourceAccount: "SHELL-CORP-99",
    sourceBank: "HSBC Bank",
    sourceOwner: "Vikas Global Shell Private Limited",
    destAccount: "OFFSHORE-901",
    destBank: "Cayman Trust Bank",
    destOwner: "Overseas Holdings Inc.",
    amount: 2500000,
    timestamp: "2026-06-03T16:00:00Z",
    type: "RTGS",
    status: "Flagged",
    flagReason: "Layering capital to tax-haven destination matching Ponzi scheme withdrawal date.",
  },
];

// In-Memory Database Store Class
export class CrimeDatabase {
  private firs: FIR[] = [...SEED_FIRS];
  private accused: Accused[] = [...SEED_ACCUSED];
  private victims: Victim[] = [...SEED_VICTIMS];
  private witnesses: Witness[] = [...SEED_WITNESSES];
  private evidence: Evidence[] = [...SEED_EVIDENCE];
  private vehicles: Vehicle[] = [...SEED_VEHICLES];
  private phones: Phone[] = [...SEED_PHONES];
  private transactions: FinancialTransaction[] = [...SEED_TRANSACTIONS];
  private auditLogs: AuditLog[] = [];

  constructor() {
    // Generate initial audit logs
    this.logAction(
      "System",
      "KSP System Initialization",
      UserRole.ADMIN,
      "System Startup & Seed Data Load",
      "SELECT * FROM state_police_databases",
      "firs, accused, victims, witnesses, evidence, transactions",
      25,
      "127.0.0.1"
    );
  }

  // Get full lists
  getFIRS() { return this.firs; }
  getAccused() { return this.accused; }
  getVictims() { return this.victims; }
  getWitnesses() { return this.witnesses; }
  getEvidence() { return this.evidence; }
  getVehicles() { return this.vehicles; }
  getPhones() { return this.phones; }
  getTransactions() { return this.transactions; }
  getAuditLogs() { return this.auditLogs.slice(-100).reverse(); } // return last 100

  // Log action
  logAction(
    userId: string,
    userName: string,
    role: UserRole,
    action: string,
    queryExecuted?: string,
    tablesAccessed?: string,
    recordCount: number = 0,
    ipAddress: string = "127.0.0.1"
  ) {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      role,
      action,
      queryExecuted,
      sqlExecuted: queryExecuted ? this.generateMockSQL(queryExecuted) : undefined,
      tablesAccessed,
      recordCount,
      ipAddress,
    };
    this.auditLogs.push(newLog);
    return newLog;
  }

  private generateMockSQL(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("fir") || q.includes("case")) {
      return "SELECT * FROM ksp_fir_records WHERE match_query_vector(description, ?) OR fir_number = ?;";
    }
    if (q.includes("accused") || q.includes("suspect") || q.includes("criminal")) {
      return "SELECT * FROM ksp_accused_registry WHERE levenshtein(name, ?) < 3 OR modus_operandi LIKE ?;";
    }
    if (q.includes("transaction") || q.includes("financial") || q.includes("money")) {
      return "SELECT * FROM ksp_financial_ledger WHERE flag_status = 'Flagged' OR source_account = ?;";
    }
    return "SELECT * FROM ksp_unified_crime_nodes WHERE MATCH(entity_properties) AGAINST(?);";
  }

  // Natural Language SQL search engine helper
  queryDatabase(query: string, searcherName: string, role: UserRole): {
    results: any[];
    sqlUsed: string;
    evidence: string[];
    confidence: number;
    reasoning: string;
    limitations: string[];
  } {
    const q = query.toLowerCase();
    let results: any[] = [];
    let sqlUsed = "SELECT * FROM ksp_unified_crime_registry WHERE MATCH(description) AGAINST(?);";
    let reasoning = "";
    let evidence: string[] = [];
    let confidence = 95;
    let limitations: string[] = ["Returns records matches strictly matching in-memory digitized corpus as of July 2026."];

    // Simple robust keyword route matching for precise, real results
    if (q.includes("fir") || q.includes("case")) {
      if (q.includes("045") || q.includes("cyber") || q.includes("phishing") || q.includes("lost")) {
        results = [this.firs[0]];
        sqlUsed = "SELECT * FROM ksp_fir_records WHERE fir_number = 'FIR/0045/2026' OR crime_category = 'Cyber Crime';";
        reasoning = "Query mentions cyber crime or banking scam, matching Majestic/Koramangala incident FIR/0045/2026.";
        evidence = [`FIR Database ID: ${this.firs[0].id}`, `Investigating Officer: ${this.firs[0].investigatingOfficer}`];
      } else if (q.includes("082") || q.includes("ponzi") || q.includes("investment") || q.includes("scam")) {
        results = [this.firs[1]];
        sqlUsed = "SELECT * FROM ksp_fir_records WHERE fir_number = 'FIR/0082/2026' OR sub_category LIKE '%Ponzi%';";
        reasoning = "Ponzi Scheme query routed to Vikas Mutual Trust record (FIR/0082/2026).";
        evidence = [`FIR Code: ${this.firs[1].id}`, `IPC Sections: ${this.firs[1].ipcSections}`];
      } else if (q.includes("snatch") || q.includes("robbery") || q.includes("majestic") || q.includes("112")) {
        results = [this.firs[2]];
        sqlUsed = "SELECT * FROM ksp_fir_records WHERE ipc_sections LIKE '%BNS 309%' AND police_station = 'Majestic Police Station';";
        reasoning = "Robbery/snatching matches crime filed under Majestic Police Station.";
        evidence = [`FIR Code: ${this.firs[2].id}`, `Witness Record: WIT-001 (Nagesh Rao Statement)`];
      } else {
        results = this.firs;
        sqlUsed = "SELECT * FROM ksp_fir_records ORDER BY date_filed DESC LIMIT 5;";
        reasoning = "General list requested. Returning top 5 FIR records.";
        evidence = [`Total database cases count: ${this.firs.length}`];
      }
    } else if (q.includes("accused") || q.includes("suspect") || q.includes("criminal") || q.includes("history")) {
      if (q.includes("karthik") || q.includes("shettar") || q.includes("phishing")) {
        results = [this.accused[0]];
        sqlUsed = "SELECT * FROM ksp_accused_registry WHERE name LIKE '%Karthik%' OR modus_operandi LIKE '%SIM%';";
        reasoning = "Target matches Karthik Shettar (Call-Karthik), high risk cyber fraud suspect.";
        evidence = [`Accused Registration: ACC-001`, `Modus Operandi: Fake sim OTP extraction`];
      } else if (q.includes("raju") || q.includes("naik") || q.includes("pulsar")) {
        results = [this.accused[2]];
        sqlUsed = "SELECT * FROM ksp_accused_registry WHERE name LIKE '%Raju Naik%' OR alias = 'Pulsar Raju';";
        reasoning = "Accused matches chain-snatching specialist Raju Naik, currently absconding.";
        evidence = [`Accused Registration: ACC-003`, `Risk Index: 92/100`];
      } else if (q.includes("manjunath") || q.includes("swamy") || q.includes("villa") || q.includes("murder")) {
        results = [this.accused[3]];
        sqlUsed = "SELECT * FROM ksp_accused_registry WHERE name LIKE '%Manjunath%' OR modus_operandi LIKE '%helper%';";
        reasoning = "Whitefield villa homicide investigator matches helper Manjunath Swamy.";
        evidence = [`FSL Fingerprint match reference: EVI-004`];
      } else {
        results = this.accused;
        sqlUsed = "SELECT * FROM ksp_accused_registry ORDER BY risk_score DESC;";
        reasoning = "Accused list requested. Returned all suspects sorted by relative risk score.";
        evidence = [`Suspects count: ${this.accused.length}`];
      }
    } else if (q.includes("transaction") || q.includes("financial") || q.includes("money") || q.includes("trail") || q.includes("mule")) {
      results = this.transactions;
      sqlUsed = "SELECT * FROM ksp_financial_ledger WHERE status = 'Suspicious' OR status = 'Flagged';";
      reasoning = "Financial query matched transaction records containing flagged structuring or layering flows.";
      evidence = ["6 linked nodes in the Karthik Shettar bank ledger trail"];
    } else {
      // Fallback matching
      const matches = this.firs.filter(f =>
        f.description.toLowerCase().includes(q) ||
        f.crimeCategory.toLowerCase().includes(q) ||
        f.policeStation.toLowerCase().includes(q)
      );
      if (matches.length > 0) {
        results = matches;
        sqlUsed = `SELECT * FROM ksp_fir_records WHERE description LIKE '%${query}%';`;
        reasoning = "Keyword matching against description and categories.";
        evidence = [`Found ${matches.length} matching descriptions`];
      } else {
        results = [];
        sqlUsed = "SELECT * FROM ksp_unified_crime_nodes WHERE MATCH(data) AGAINST(?);";
        reasoning = "Zero specific in-memory rows matched key strings.";
        confidence = 60;
        evidence = ["Search yields empty matches."];
      }
    }

    // Log this search activity
    this.logAction(
      searcherName.replace(/\s+/g, "_").toLowerCase(),
      searcherName,
      role,
      "Database Crime Query via Natural Language",
      query,
      results.map(r => r.id ? r.id.split("-")[0] : "record").join(", "),
      results.length
    );

    return {
      results,
      sqlUsed,
      evidence,
      confidence,
      reasoning,
      limitations,
    };
  }

  // Network visualization generation
  getNetworkGraph(): NetworkGraph {
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];

    // Add FIRs
    this.firs.forEach(f => {
      nodes.push({
        id: f.id,
        label: `${f.firNumber}`,
        type: "FIR",
        group: "FIR",
        details: `${f.crimeCategory} - ${f.status} (${f.policeStation})`,
      });
    });

    // Add Accused
    this.accused.forEach(a => {
      nodes.push({
        id: a.id,
        label: `${a.name} (${a.alias || "No Alias"})`,
        type: "Accused",
        group: "Suspect",
        details: `Age ${a.age}, Risk ${a.riskScore}, MO: ${a.modusOperandi.substring(0, 60)}...`,
      });

      // Link to FIRs
      a.linkedFIRs.forEach(fId => {
        links.push({
          source: a.id,
          target: fId,
          label: "Accused In",
        });
      });

      // Phone
      if (a.phoneNumber) {
        const phoneId = `PH-${a.phoneNumber.replace(/[\s+]/g, "")}`;
        nodes.push({
          id: phoneId,
          label: a.phoneNumber,
          type: "Phone",
          group: "Communication",
          details: `IMSI/IMEI linked. Suspect: ${a.name}`,
        });
        links.push({
          source: a.id,
          target: phoneId,
          label: "Owns Phone",
        });
      }

      // Bank account
      if (a.bankAccountNumber) {
        const bankId = `BANK-${a.bankAccountNumber}`;
        nodes.push({
          id: bankId,
          label: a.bankAccountNumber,
          type: "Bank Account",
          group: "Financial",
          details: `SBI/HDFC registry account. Owner: ${a.name}`,
        });
        links.push({
          source: a.id,
          target: bankId,
          label: "Primary Account",
        });
      }
    });

    // Add Victims
    this.victims.forEach(v => {
      nodes.push({
        id: v.id,
        label: v.name,
        type: "Victim",
        group: "Victim",
        details: `Age ${v.age}, Gender ${v.gender}`,
      });
      links.push({
        source: v.id,
        target: v.linkedFIR,
        label: "Complainant In",
      });
    });

    // Add Vehicles
    this.vehicles.forEach(veh => {
      nodes.push({
        id: veh.id,
        label: `${veh.registrationNumber} (${veh.model})`,
        type: "Vehicle",
        group: "Asset",
        details: `${veh.color} ${veh.make} owned by ${veh.ownerName}`,
      });
      if (veh.linkedAccusedId) {
        links.push({
          source: veh.linkedAccusedId,
          target: veh.id,
          label: "Drives Vehicle",
        });
      }
      veh.linkedFIRs.forEach(fId => {
        links.push({
          source: veh.id,
          target: fId,
          label: "Involved In",
        });
      });
    });

    // Add transaction trails specifically
    this.transactions.forEach(t => {
      // Connect ledger to victim / suspect accounts
      if (t.amount > 300000) {
        links.push({
          source: `BANK-SBI-9081234510`,
          target: `UPI-MULE-4411`,
          label: "Routed UPI (₹1.5L)",
        });
        links.push({
          source: `BANK-SBI-9081234510`,
          target: `UPI-MULE-8812`,
          label: "Routed UPI (₹1.5L)",
        });
        links.push({
          source: `BANK-SBI-9081234510`,
          target: `UPI-MULE-9900`,
          label: "Routed UPI (₹1.5L)",
        });
      }
    });

    return { nodes, links };
  }

  // Forecasting and Hotspot calculation engine
  getForecastingReport(): ForecastReport {
    return {
      hotspotLocation: "Koramangala 8th Block & Indiranagar Metro Surroundings",
      predictedCrimeVolume: 42,
      confidenceScore: 88,
      reasoning: [
        "Time-series modeling shows historical 14% spike in cyber phishing during early-quarter corporate banking updates (July-August period).",
        "Spatial analysis indicates high traffic density convergence zones near Majestic Metro corridor, with correlation to active Pulsar snatching incidents.",
        "Increased footfalls in commercial districts are correlated with seasonal uptick in physical snatching crimes."
      ],
      supportingEvidence: [
        "4 active FIRs in past 60 days matching identical phone-phishing and OTP-theft modus operandi.",
        "A cluster of 12 suspicious ledger bank accounts routed from identical telecom switching towers in Devarachikkanahalli.",
        "Traffic camera logs indicating unregistered high-performance bikes traversing Whitefield corridor during nighttime hours."
      ],
      repeatOffenderRiskList: this.accused.map(a => ({
        accusedName: a.name,
        riskScore: a.riskScore,
        reason: `${a.previousConvictions} prior convictions under similar sections. Status is currently: ${a.status}. MO matching weight index is: ${a.severityIndex === "High" ? "95%" : "70%"}.`,
      })).sort((a, b) => b.riskScore - a.riskScore),
      limitations: [
        "Limited to digitized crime indexes.",
        "Does not account for non-reported incidents.",
        "Model projections exclude external shifts in judicial bail granting frequencies."
      ],
    };
  }

  // Legacy data ingestion / import utility
  importLegacyData(
    type: "firs" | "accused" | "evidence" | "transactions" | "vehicles" | "phones",
    records: any[]
  ): { importedCount: number; errors: string[] } {
    const errors: string[] = [];
    let importedCount = 0;

    if (!Array.isArray(records)) {
      return { importedCount: 0, errors: ["Input must be an array of records"] };
    }

    records.forEach((rec, idx) => {
      try {
        if (type === "firs") {
          if (!rec.firNumber || !rec.policeStation || !rec.crimeCategory || !rec.description) {
            throw new Error(`Missing required fields: firNumber, policeStation, crimeCategory, description`);
          }
          const exists = this.firs.some(f => f.firNumber === rec.firNumber);
          if (exists) {
            throw new Error(`Duplicate FIR number: ${rec.firNumber}`);
          }
          const id = rec.id || `KSP-LEG-${Date.now()}-${idx}`;
          const newFir: FIR = {
            id,
            firNumber: rec.firNumber,
            policeStation: rec.policeStation,
            district: rec.district || "Bengaluru",
            dateFiled: rec.dateFiled || new Date().toISOString().split('T')[0],
            crimeCategory: rec.crimeCategory,
            subCategory: rec.subCategory || "Legacy Ingestion",
            ipcSections: rec.ipcSections || "BNS 420 (Cheating)",
            status: rec.status || "Closed",
            description: rec.description,
            investigatingOfficer: rec.investigatingOfficer || "System Importer",
            evidenceCount: Number(rec.evidenceCount) || 0
          };
          this.firs.unshift(newFir);
          importedCount++;
        } else if (type === "accused") {
          if (!rec.name || !rec.modusOperandi) {
            throw new Error(`Missing required fields: name, modusOperandi`);
          }
          const id = rec.id || `ACC-LEG-${Date.now()}-${idx}`;
          const newAccused: Accused = {
            id,
            name: rec.name,
            alias: rec.alias,
            age: Number(rec.age) || 35,
            gender: rec.gender || "Male",
            address: rec.address || "Unknown Address",
            phoneNumber: rec.phoneNumber || "+91 99000 00000",
            vehicleNumber: rec.vehicleNumber,
            bankAccountNumber: rec.bankAccountNumber,
            modusOperandi: rec.modusOperandi,
            riskScore: Number(rec.riskScore) || 50,
            status: rec.status || "Under Watch",
            previousConvictions: Number(rec.previousConvictions) || 0,
            severityIndex: rec.severityIndex || "Medium",
            linkedFIRs: Array.isArray(rec.linkedFIRs) ? rec.linkedFIRs : [],
            photoUrl: rec.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
          };
          this.accused.unshift(newAccused);
          importedCount++;
        } else if (type === "evidence") {
          if (!rec.firId || !rec.description || !rec.type) {
            throw new Error(`Missing required fields: firId, description, type`);
          }
          const id = rec.id || `EVI-LEG-${Date.now()}-${idx}`;
          const newEvidence: Evidence = {
            id,
            firId: rec.firId,
            type: rec.type,
            description: rec.description,
            dateCollected: rec.dateCollected || new Date().toISOString().split('T')[0],
            collectedBy: rec.collectedBy || "System Importer",
            locationCollected: rec.locationCollected || "Crime Scene",
            status: rec.status || "Secured"
          };
          this.evidence.unshift(newEvidence);
          importedCount++;
        } else if (type === "transactions") {
          if (!rec.sourceAccount || !rec.destAccount || !rec.amount) {
            throw new Error(`Missing required fields: sourceAccount, destAccount, amount`);
          }
          const id = rec.id || `TX-LEG-${Date.now()}-${idx}`;
          const newTx: FinancialTransaction = {
            id,
            sourceAccount: rec.sourceAccount,
            sourceBank: rec.sourceBank || "Unknown Bank",
            sourceOwner: rec.sourceOwner || "Unknown Source",
            destAccount: rec.destAccount,
            destBank: rec.destBank || "Unknown Bank",
            destOwner: rec.destOwner || "Unknown Dest",
            amount: Number(rec.amount),
            timestamp: rec.timestamp || new Date().toISOString(),
            type: rec.type || "UPI",
            status: rec.status || "Completed",
            flagReason: rec.flagReason
          };
          this.transactions.unshift(newTx);
          importedCount++;
        } else if (type === "vehicles") {
          if (!rec.registrationNumber || !rec.make || !rec.model) {
            throw new Error(`Missing required fields: registrationNumber, make, model`);
          }
          const id = rec.id || `VEH-LEG-${Date.now()}-${idx}`;
          const newVeh: Vehicle = {
            id,
            registrationNumber: rec.registrationNumber,
            make: rec.make,
            model: rec.model,
            color: rec.color || "Black",
            ownerName: rec.ownerName || "Unknown Owner",
            linkedAccusedId: rec.linkedAccusedId,
            linkedFIRs: Array.isArray(rec.linkedFIRs) ? rec.linkedFIRs : []
          };
          this.vehicles.unshift(newVeh);
          importedCount++;
        } else if (type === "phones") {
          if (!rec.phoneNumber || !rec.imei || !rec.ownerName) {
            throw new Error(`Missing required fields: phoneNumber, imei, ownerName`);
          }
          const id = rec.id || `PH-LEG-${Date.now()}-${idx}`;
          const newPhone: Phone = {
            id,
            phoneNumber: rec.phoneNumber,
            imei: rec.imei,
            ownerName: rec.ownerName,
            linkedAccusedId: rec.linkedAccusedId,
            linkedFIRs: Array.isArray(rec.linkedFIRs) ? rec.linkedFIRs : []
          };
          this.phones.unshift(newPhone);
          importedCount++;
        }
      } catch (err: any) {
        errors.push(`Record #${idx + 1}: ${err.message}`);
      }
    });

    return { importedCount, errors };
  }
}

export const kspDb = new CrimeDatabase();
