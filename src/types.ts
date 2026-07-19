/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Roles for access control
export enum UserRole {
  INVESTIGATOR = "Investigator",
  ANALYST = "Analyst",
  SUPERVISOR = "Supervisor",
  POLICYMAKER = "Policymaker",
  ADMIN = "Admin",
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  badgeId: string;
  department: string;
  station: string;
}

// FIR (First Information Report)
export interface FIR {
  id: string; // e.g., "KSP-BLR-2026-0042"
  firNumber: string;
  policeStation: string;
  district: string;
  dateFiled: string;
  crimeCategory: string; // "Cyber Crime", "Financial Fraud", "Robbery", "Homicide", "Assault"
  subCategory: string;
  ipcSections: string; // e.g., "IPC 420 (Cheating), IPC 406 (Criminal Breach of Trust)"
  status: "Under Investigation" | "Charge Sheeted" | "Closed" | "Pending Apprehension";
  description: string;
  investigatingOfficer: string;
  evidenceCount: number;
}

// Suspect / Accused Profile
export interface Accused {
  id: string;
  name: string;
  alias?: string;
  age: number;
  gender: string;
  address: string;
  phoneNumber: string;
  vehicleNumber?: string;
  bankAccountNumber?: string;
  modusOperandi: string; // MO Description
  riskScore: number; // 0-100 calculated transparently
  status: "In Custody" | "Absconding" | "Bailed" | "Acquitted" | "Under Watch";
  previousConvictions: number;
  severityIndex: "High" | "Medium" | "Low";
  linkedFIRs: string[]; // IDs of FIRs
  photoUrl: string;
}

// Victim
export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: string;
  statement: string;
  linkedFIR: string;
}

// Witness
export interface Witness {
  id: string;
  name: string;
  contact: string;
  statement: string;
  linkedFIR: string;
}

// Evidence
export interface Evidence {
  id: string;
  firId: string;
  type: "Physical" | "Digital" | "Documentary" | "Forensics" | "Financial";
  description: string;
  dateCollected: string;
  collectedBy: string;
  locationCollected: string;
  status: "Secured" | "Sent to FSL" | "Presented in Court";
}

// Vehicles
export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  ownerName: string;
  linkedAccusedId?: string;
  linkedFIRs: string[];
}

// Phones & Comms
export interface Phone {
  id: string;
  phoneNumber: string;
  imei: string;
  ownerName: string;
  linkedAccusedId?: string;
  linkedFIRs: string[];
}

// Financial Transaction for Money Trail Analytics
export interface FinancialTransaction {
  id: string;
  sourceAccount: string;
  sourceBank: string;
  sourceOwner: string;
  destAccount: string;
  destBank: string;
  destOwner: string;
  amount: number;
  timestamp: string;
  type: "NEFT" | "RTGS" | "IMPS" | "UPI" | "Cash Deposit";
  status: "Completed" | "Suspicious" | "Flagged";
  flagReason?: string;
}

// Audit Logs
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string; // e.g., "FIR Search", "Export PDF", "AI Consultation"
  queryExecuted?: string;
  sqlExecuted?: string;
  tablesAccessed?: string;
  recordCount: number;
  ipAddress: string;
}

// Graph Representation for network visualization
export interface NetworkNode {
  id: string;
  label: string;
  type: "Accused" | "Victim" | "Witness" | "Phone" | "Vehicle" | "Bank Account" | "FIR" | "Address";
  group: string;
  details?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  label: string; // e.g., "Used Phone", "Committed Crime", "Defrauded"
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// Forecasting report structure
export interface ForecastReport {
  hotspotLocation: string;
  predictedCrimeVolume: number; // e.g. next month estimate
  confidenceScore: number; // percentage (e.g. 85%)
  reasoning: string[];
  supportingEvidence: string[];
  repeatOffenderRiskList: { accusedName: string; riskScore: number; reason: string }[];
  limitations: string[];
}

// Conversation interfaces
export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  // Explainable AI metadata
  evidence?: string[];
  confidence?: number;
  reasoning?: string;
  limitations?: string[];
  suggestedLeads?: string[];
  sql?: string;
  language?: "English" | "Kannada";
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}
