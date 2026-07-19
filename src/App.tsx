/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import {
  MessageSquare,
  Search,
  Share2,
  TrendingUp,
  Shield,
  FileText,
  UserCheck,
  AlertTriangle,
  Volume2,
  Mic,
  MicOff,
  Download,
  Users,
  MapPin,
  Clock,
  Database,
  Lock,
  Globe,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Link2,
  PhoneCall,
  Car,
  DollarSign,
  AlertOctagon,
  CornerDownRight,
  CheckCircle,
  HelpCircle,
  Filter,
  LogIn,
  LogOut,
} from "lucide-react";
import { UserRole, User, FIR, Accused, Victim, Witness, Evidence, Vehicle, Phone, FinancialTransaction, AuditLog, NetworkNode, NetworkLink } from "./types";
import { POLICE_STATIONS, SEED_USERS } from "./dataStore";
import { AICopilot } from "./components/AICopilot";
import { CrimeHeatmap } from "./components/CrimeHeatmap";
import { CaseSummaryGenerator } from "./components/CaseSummaryGenerator";
import { SimilarCaseFinder } from "./components/SimilarCaseFinder";
import { CriminalNetwork } from "./components/CriminalNetwork";

// Multilingual labels
const TRANSLATIONS = {
  English: {
    appTitle: "KSP-Sahayak",
    subtitle: "Intelligent Crime Intelligence & Analytics Platform",
    secureNode: "SECURE CLOUD GA-NODE-01",
    languageToggle: "ಕನ್ನಡ",
    activeRole: "Active Role",
    badge: "Badge ID",
    dept: "Dept",
    station: "Station",
    chatSession: "LIVE INVESTIGATIVE SESSION",
    clearChat: "Clear Chat",
    exportPDF: "Export PDF",
    queryPlaceholder: "Query crime database (e.g., 'Show cyber crime FIR/0045/2026' or 'Find Raju Naik')",
    voiceActive: "Listening to voice input...",
    voiceInactive: "Click to start voice recognition",
    confidenceTitle: "Explainability & Confidence",
    confidenceSub: "MATCH CONFIDENCE SCORE",
    forecastingTitle: "Crime Trend Forecasting",
    recentLogs: "Recent Security Logs",
    systemEncrypted: "SYSTEM ENCRYPTED (AES-256)",
    dbSynced: "DB SYNCED",
    copyright: "© 2026 Karnataka State Police",
    tabs: {
      dashboard: "Secure Dashboard",
      chat: "AI Chat Assistant",
      explorer: "Database Registry",
      network: "Criminal Network Graph",
      forecast: "Forecasting & Hotspots",
      logs: "Audit Trails",
    },
    filterAll: "All Categories",
    riskIndex: "RISK LEVEL",
    modusOperandi: "Modus Operandi (MO)",
    status: "Status",
    history: "Previous Convictions",
    leads: "Suggested Investigative Leads",
    limitations: "Model Limitations",
    reasoning: "AI Reasoning & Evidence",
    suggestedQueries: "Suggested Investigative Prompts",
    sqlPreview: "Executed SQL Query",
    evidenceTitle: "Physical & Digital Evidence Logs",
    accusedDetails: "Accused/Suspect Profile Details",
    clickNode: "Click on any node in the graph to view comprehensive police registry profile",
    trailTitle: "Financial Money Trail & Structuring Analytics",
  },
  Kannada: {
    appTitle: "ಕೆಎಸ್ಪಿ-ಸಹಾಯಕ್",
    subtitle: "ಬುದ್ಧಿವಂತ ಅಪರಾಧ ಮಾಹಿತಿ ಮತ್ತು ವಿಶ್ಲೇಷಣಾ ವೇದಿಕೆ",
    secureNode: "ಸುರಕ್ಷಿತ ಕ್ಲೌಡ್ ಜಿಎ-ನೋಡ್-01",
    languageToggle: "English",
    activeRole: "ಸಕ್ರಿಯ ಪಾತ್ರ",
    badge: "ಬ್ಯಾಡ್ಜ್ ಐಡಿ",
    dept: "ವಿಭಾಗ",
    station: "ಠಾಣೆ",
    chatSession: "ಲೈವ್ ತನಿಖಾ ಅಧಿವೇಶನ",
    clearChat: "ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ",
    exportPDF: "ಪಿಡಿಎಫ್ ರಫ್ತುಮಾಡಿ",
    queryPlaceholder: "ಅಪರಾಧ ಡೇಟಾಬೇಸ್ ಅನ್ನು ಪ್ರಶ್ನಿಸಿ (ಉದಾ: 'FIR/0045/2026 ವಿವರ ತೋರಿಸಿ' ಅಥವಾ 'ರಾಜು ನಾಯ್ಕ್ ವಿವರ')",
    voiceActive: "ಧ್ವನಿ ಇನ್ಪುಟ್ ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    voiceInactive: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    confidenceTitle: "ಸ್ಪಷ್ಟತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆ",
    confidenceSub: "ಹೊಂದಾಣಿಕೆಯ ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಅಂಕಗಳು",
    forecastingTitle: "ಅಪರಾಧ ಪ್ರವೃತ್ತಿ ಮುನ್ಸೂಚನೆ",
    recentLogs: "ಇತ್ತೀಚಿನ ಭದ್ರತಾ ಲಾಗ್‌ಗಳು",
    systemEncrypted: "ಸಿಸ್ಟಮ್ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ (AES-256)",
    dbSynced: "ಡೇಟಾಬೇಸ್ ಸಿಂಕ್ ಆಗಿದೆ",
    copyright: "© 2026 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    tabs: {
      dashboard: "ಸುರಕ್ಷಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      chat: "ಎಐ ಚಾಟ್ ಸಹಾಯಕ",
      explorer: "ಡೇಟಾಬೇಸ್ ನೋಂದಣಿ",
      network: "ಅಪರಾಧ ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್",
      forecast: "ಮುನ್ಸೂಚನೆ ಮತ್ತು ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
      logs: "ಲೆಕ್ಕಪರಿಶೋಧನೆ ಲಾಗ್‌ಗಳು",
    },
    filterAll: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    riskIndex: "ಅಪಾಯದ ಮಟ್ಟ",
    modusOperandi: "ಕಾರ್ಯಾಚರಣೆಯ ವಿಧಾನ (MO)",
    status: "ಸ್ಥಿತಿ",
    history: "ಹಿಂದಿನ ಅಪರಾಧಗಳು",
    leads: "ಸೂಚಿಸಲಾದ ತನಿಖಾ ಮುನ್ನಡೆಗಳು",
    limitations: "ಮಾದರಿ ಮಿತಿಗಳು",
    reasoning: "ಎಐ ತಾರ್ಕಿಕತೆ ಮತ್ತು ಸಾಕ್ಷ್ಯ",
    suggestedQueries: "ಸೂಚಿಸಲಾದ ತನಿಖಾ ಪ್ರಾಂಪ್ಟ್‌ಗಳು",
    sqlPreview: "ಚಾಲನೆಗೊಳಿಸಲಾದ SQL ಪ್ರಶ್ನೆ",
    evidenceTitle: "ಭೌತಿಕ ಮತ್ತು ಡಿಜಿಟಲ್ ಪುರಾವೆ ದಾಖಲೆಗಳು",
    accusedDetails: "ಆರೋಪಿ/ಶಂಕಿತರ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು",
    clickNode: "ಸಂಪೂರ್ಣ ಪೊಲೀಸ್ ನೋಂದಣಿ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಲು ಗ್ರಾಫ್‌ನಲ್ಲಿರುವ ಯಾವುದೇ ನೋಡ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    trailTitle: "ಹಣಕಾಸು ವರ್ಗಾವಣೆ ಮತ್ತು ಶಂಕಾಸ್ಪದ ವ್ಯವಹಾರಗಳ ವಿಶ್ಲೇಷಣೆ",
  },
};

const loginThemes = {
  [UserRole.INVESTIGATOR]: {
    bgColor: "bg-red-950/20",
    borderColor: "border-red-500/40",
    textColor: "text-red-400",
    buttonBg: "bg-red-600 hover:bg-red-700",
    glowColor: "shadow-red-500/10",
    badgeColor: "bg-red-500/10 text-red-400 border border-red-500/20",
    accentColor: "red",
    stamp: "FIELD OFFICER OPERATIONS",
    departmentName: "Crime Investigation Department (CID)"
  },
  [UserRole.ANALYST]: {
    bgColor: "bg-emerald-950/20",
    borderColor: "border-emerald-500/40",
    textColor: "text-emerald-400",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    glowColor: "shadow-emerald-500/10",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    accentColor: "emerald",
    stamp: "INTELLIGENCE & ANALYSIS",
    departmentName: "State Crime Records Bureau (SCRB)"
  },
  [UserRole.SUPERVISOR]: {
    bgColor: "bg-[#1e1b4b]/40",
    borderColor: "border-indigo-500/40",
    textColor: "text-indigo-400",
    buttonBg: "bg-indigo-600 hover:bg-indigo-700",
    glowColor: "shadow-indigo-500/10",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    accentColor: "indigo",
    stamp: "COMMAND & CASE SUPERVISION",
    departmentName: "Bengaluru East Division (HQ)"
  },
  [UserRole.POLICYMAKER]: {
    bgColor: "bg-amber-950/20",
    borderColor: "border-amber-500/40",
    textColor: "text-amber-400",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    glowColor: "shadow-amber-500/10",
    badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    accentColor: "amber",
    stamp: "EXECUTIVE STRATEGY CELL",
    departmentName: "Police Headquarters (PHQ) Bangalore"
  },
  [UserRole.ADMIN]: {
    bgColor: "bg-slate-900/40",
    borderColor: "border-slate-500/40",
    textColor: "text-slate-400",
    buttonBg: "bg-slate-700 hover:bg-slate-800",
    glowColor: "shadow-slate-500/10",
    badgeColor: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    accentColor: "slate",
    stamp: "SYSTEM MASTER ROOT ACCESS",
    departmentName: "Central IT & Communications Cell"
  },
};

export default function App() {
  const [language, setLanguage] = useState<"English" | "Kannada">("English");
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "explorer" | "network" | "forecast" | "logs">("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [selectedUser, setSelectedUser] = useState<User>(SEED_USERS[0]);
  
  // Login System State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<User>(SEED_USERS[0]);
  const [badgeInput, setBadgeInput] = useState<string>(SEED_USERS[0].badgeId);
  const [pinInput, setPinInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  
  // Database States loaded from API
  const [firs, setFirs] = useState<FIR[]>([]);
  const [accused, setAccused] = useState<Accused[]>([]);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [networkGraph, setNetworkGraph] = useState<NetworkNode[]>([]);
  const [networkLinks, setNetworkLinks] = useState<NetworkLink[]>([]);
  const [forecastReport, setForecastReport] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Selected details modal
  const [selectedAccused, setSelectedAccused] = useState<Accused | null>(null);
  const [selectedFIR, setSelectedFIR] = useState<FIR | null>(null);

  // Active filters for Explorer
  const [explorerTable, setExplorerTable] = useState<"firs" | "accused" | "evidence" | "transactions" | "vehicles" | "phones" | "import">("firs");
  const [searchFilter, setSearchFilter] = useState("");

  // Legacy Import State
  const [importType, setImportType] = useState<"firs" | "accused" | "evidence" | "transactions" | "vehicles" | "phones">("firs");
  const [pasteContent, setPasteContent] = useState<string>("");
  const [importStatus, setImportStatus] = useState<string>("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Manual Form States
  const [manualFirNumber, setManualFirNumber] = useState("");
  const [manualPoliceStation, setManualPoliceStation] = useState(POLICE_STATIONS[0]?.name || "Majestic Police Station");
  const [manualCrimeCategory, setManualCrimeCategory] = useState("Cyber Crime");
  const [manualIpcSections, setManualIpcSections] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualInvestigatingOfficer, setManualInvestigatingOfficer] = useState("");

  const [manualAccusedName, setManualAccusedName] = useState("");
  const [manualAccusedAlias, setManualAccusedAlias] = useState("");
  const [manualAccusedAge, setManualAccusedAge] = useState("32");
  const [manualAccusedModusOperandi, setManualAccusedModusOperandi] = useState("");
  const [manualAccusedRiskScore, setManualAccusedRiskScore] = useState("65");

  // Chat conversation
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Swagatha, Officer. I am **KSP-Sahayak**, your secure, state-level hybrid crime intelligence system. I allow natural language search across unified police records (CCTNS) with zero-fabrication guarantees, structured money trail analysis, and real-time forecast overlays. Speak or type your query below.",
      timestamp: new Date().toISOString(),
      confidence: 100,
      reasoning: "System initialized with complete local SCRB and FIU databases.",
      evidence: ["KSP Local Memory DB 4.2"],
      language: "English",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastExecutedSql, setLastExecutedSql] = useState<string>("SELECT * FROM ksp_unified_crime_registry;");
  const [activeConfidence, setActiveConfidence] = useState<number>(98);

  // Role dashboard state variables
  const [investigatorTasks, setInvestigatorTasks] = useState([
    { id: 1, text: "Examine Whitefield villa CCTV fingerprint matches", done: false },
    { id: 2, text: "Cross-reference fastag logs of Karnataka DL-04", done: true },
    { id: 3, text: "Execute search warrant on Vikas Mutual Trust locker", done: false },
  ]);
  const [allocatedCyberStaff, setAllocatedCyberStaff] = useState(65);
  const [directiveText, setDirectiveText] = useState("PHQ Strategic Directive 2026/04:\nDeploy proactive mobile patrol nodes surrounding Koramangala 8th Block high-incident coordinates during bank maintenance hours.");
  const [adminSqlQuery, setAdminSqlQuery] = useState("SELECT * FROM ksp_accused_registry ORDER BY risk_score DESC;");

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const L = TRANSLATIONS[language];

  // Role-based data isolation filters
  const getRoleFilteredFirs = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      return firs.filter(f => f.investigatingOfficer === selectedUser.name || f.policeStation === selectedUser.station);
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      return firs.filter(f => f.district === "Bengaluru City" || f.policeStation.includes("Bengaluru"));
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return firs;
  };

  const getRoleFilteredAccused = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      const allowedFirs = getRoleFilteredFirs();
      return accused.filter(a => a.linkedFIRs.some(fId => allowedFirs.some(rf => rf.id === fId)));
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      return accused;
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return accused;
  };

  const getRoleFilteredEvidence = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      const allowedFirs = getRoleFilteredFirs();
      return evidence.filter(e => allowedFirs.some(rf => rf.id === e.firId));
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      const allowedFirs = getRoleFilteredFirs();
      return evidence.filter(e => allowedFirs.some(rf => rf.id === e.firId));
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return evidence;
  };

  const getRoleFilteredTransactions = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      return transactions.filter(t => t.status === "Flagged");
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      return transactions.filter(t => t.status === "Flagged" || t.status === "Suspicious");
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return transactions;
  };

  const getRoleFilteredVehicles = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      const allowedFirs = getRoleFilteredFirs();
      return vehicles.filter(v => v.linkedFIRs.some(fId => allowedFirs.some(rf => rf.id === fId)));
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      return vehicles;
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return vehicles;
  };

  const getRoleFilteredPhones = () => {
    if (selectedUser.role === UserRole.INVESTIGATOR) {
      const allowedFirs = getRoleFilteredFirs();
      return phones.filter(p => p.linkedFIRs.some(fId => allowedFirs.some(rf => rf.id === fId)));
    }
    if (selectedUser.role === UserRole.SUPERVISOR) {
      return phones;
    }
    if (selectedUser.role === UserRole.POLICYMAKER || selectedUser.role === UserRole.ADMIN) {
      return [];
    }
    return phones;
  };

  const renderInvestigatorDashboard = () => {
    // Filters active cases for current investigator (assigned to him or at his Police Station)
    const myCases = firs.filter(f => f.investigatingOfficer === selectedUser.name || f.policeStation === selectedUser.station);
    const completedCasesCount = myCases.filter(c => c.status === "Closed" || c.status === "Charge Sheeted").length;
    const pendingCasesCount = myCases.filter(c => c.status === "Under Investigation" || c.status === "Pending Apprehension").length;
    
    return (
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full">
        {/* Dashboard Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Investigator Portal | Station Duty Workspace</span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
            SECURE CREDENTIALS: {selectedUser.badgeId}
          </span>
        </div>
        
        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Assigned Case Files</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-800">{myCases.length}</span>
                <span className="text-[10px] text-slate-500 font-semibold">Active Dockets</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">Station: {selectedUser.station}</p>
            </div>
            
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Pending Actions</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-700">{pendingCasesCount}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Investigations Pending</span>
              </div>
              <p className="text-[9px] text-emerald-500 mt-1 font-semibold">{completedCasesCount} Cases Completed/Resolved</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">FSL Lab Outstandings</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-700">1</span>
                <span className="text-[10px] text-amber-600 font-semibold">Evidence Pending Results</span>
              </div>
              <p className="text-[9px] text-amber-500 mt-1 font-semibold">Primary Accused: Karthik Shettar</p>
            </div>
          </div>

          {/* Assigned Cases Table & Active Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2.5">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">My Assigned Case Dockets</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {myCases.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => {
                      setSelectedFIR(c);
                      setActiveTab("explorer");
                      setExplorerTable("firs");
                    }}
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${selectedFIR?.id === c.id ? "bg-blue-50 border-blue-400" : "bg-slate-50 hover:bg-slate-100 border-slate-100"}`}
                  >
                    <div className="flex justify-between font-bold text-blue-700">
                      <span>{c.firNumber}</span>
                      <span className="text-[10px] text-slate-400">{c.dateFiled}</span>
                    </div>
                    <p className="font-semibold text-slate-800 mt-0.5 truncate">{c.crimeCategory} - {c.subCategory}</p>
                    <p className="text-[10px] text-slate-500 truncate">{c.ipcSections}</p>
                    <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-200/50">
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 rounded font-black uppercase text-slate-700">{c.status}</span>
                      <span className="text-[9px] font-bold text-slate-400">{c.evidenceCount} Evidences</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Collection & Forensic Submissions checklist */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Active Case Task Diary</h4>
              
              {/* Interactive Scratchpad */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Quick Case Diary Note</p>
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    placeholder="Add case checklist item..."
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget;
                        if (input.value.trim()) {
                          setInvestigatorTasks(prev => [...prev, { id: Date.now(), text: input.value, done: false }]);
                          logAuditAction(`Added case task item: "${input.value}"`);
                          input.value = "";
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {investigatorTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={t.done}
                          onChange={() => {
                            setInvestigatorTasks(prev => prev.map(item => item.id === t.id ? { ...item, done: !item.done } : item));
                            logAuditAction(`Completed task diary action: "${t.text}"`);
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`font-medium ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.text}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setInvestigatorTasks(prev => prev.filter(item => item.id !== t.id));
                          logAuditAction(`Deleted task diary item`);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalystDashboard = () => {
    return (
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Intel-Analyst Sandbox | State Crime Records Bureau</span>
          </div>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
            SCRB Cleared Node
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 font-sans">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">State Cases</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{firs.length}</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-red-500 tracking-wider">Suspect Database</p>
              <p className="text-2xl font-black text-red-600 mt-1">{accused.length}</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Mule Accounts</p>
              <p className="text-2xl font-black text-blue-600 mt-1">12 Accounts</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Flagged Txns</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{transactions.filter(t => t.status === "Flagged" || t.status === "Suspicious").length}</p>
            </div>
          </div>

          {/* Link Analysis Visualizer Helper & Money Trail Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Crime Category Analysis</h4>
              <div className="space-y-3 pt-2">
                {[
                  { name: "Cyber Crime", count: firs.filter(f => f.crimeCategory === "Cyber Crime").length, color: "bg-blue-600" },
                  { name: "Financial Fraud", count: firs.filter(f => f.crimeCategory === "Financial Fraud").length, color: "bg-indigo-600" },
                  { name: "Robbery / Theft", count: firs.filter(f => f.crimeCategory === "Robbery" || f.crimeCategory === "Snatching").length || 1, color: "bg-amber-600" },
                  { name: "Homicide", count: firs.filter(f => f.crimeCategory === "Homicide").length || 1, color: "bg-red-600" },
                ].map((c, idx) => {
                  const percentage = Math.round((c.count / (firs.length || 1)) * 100);
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-600">{c.name} ({c.count} cases)</span>
                        <span className="text-slate-900">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${c.color}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">✨ Real-time dynamic compilation generated across state-level digitized logs.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Money Trail Structuring Insights</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto text-xs pr-1">
                {transactions.filter(t => t.status === "Flagged" || t.status === "Suspicious").map(t => (
                  <div key={t.id} className="p-2 bg-red-50/50 rounded-lg border border-red-100 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-red-950 font-mono">₹{t.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{t.sourceOwner} ➔ {t.destOwner}</p>
                      <p className="text-[9px] text-red-600 font-bold mt-0.5">Alert: {t.flagReason || "Structuring suspected"}</p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-red-600 text-white rounded font-mono uppercase font-black">{t.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupervisorDashboard = () => {
    const pendingApprovals = firs.filter(f => f.status === "Under Investigation");
    
    return (
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-600 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Command Center | Division Supervisor Portal</span>
          </div>
          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
            Division: {selectedUser.department}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-[#2563eb] rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Division Dockets</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{firs.length} Files</p>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">Covers Indiranagar, Majestic & Koramangala Stations</p>
            </div>
            
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Pending Review</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{pendingApprovals.length} Dockets</p>
              <p className="text-[9px] text-amber-500 mt-1 font-semibold">Awaiting active charge sheet validation</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Officer Auditing Rate</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">100%</p>
              <p className="text-[9px] text-emerald-500 mt-1 font-semibold">Compliance logged with state node</p>
            </div>
          </div>

          {/* Charge Sheet Approval queue & Officer Audit trail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Dockets Pending Charge-Sheet Approval</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {pendingApprovals.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No dockets pending supervisor approval.</p>
                ) : (
                  pendingApprovals.map(f => (
                    <div key={f.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-blue-700">{f.firNumber}</span>
                        <span className="text-slate-400">{f.policeStation.split(" ")[0]}</span>
                      </div>
                      <p className="font-semibold text-slate-800">{f.crimeCategory} - {f.subCategory}</p>
                      <p className="text-[10px] text-slate-500 italic">"IO: {f.investigatingOfficer}"</p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            setFirs(prev => prev.map(fir => fir.id === f.id ? { ...fir, status: "Charge Sheeted" } : fir));
                            logAuditAction(`Supervisor approved and registered formal charge sheet for Docket: ${f.firNumber}`);
                            alert(`Successfully approved and closed investigative docket ${f.firNumber} for formal court charge sheet filing!`);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] transition-colors"
                        >
                          Approve Charge-Sheet
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Subordinate Activity Logs</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                {auditLogs.filter(log => log.role === UserRole.INVESTIGATOR || log.role === UserRole.ANALYST).slice(0, 5).map(log => (
                  <div key={log.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{log.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-blue-700 font-semibold mt-0.5">{log.action}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">Tables: {log.tablesAccessed || "None"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPolicymakerDashboard = () => {
    return (
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Strategic Intelligence Deck | Police Headquarters</span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
            HQ Node: {selectedUser.badgeId}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {/* State level policy overview metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0f172a] text-white rounded-xl shadow-md border-l-4 border-l-[#fbbf24]">
              <p className="text-[10px] font-black uppercase text-[#fbbf24] tracking-wider">State Cyber Shield Rating</p>
              <p className="text-2xl font-black mt-1">94.2%</p>
              <p className="text-[9px] text-slate-300 mt-1">Active firewalls synced state-wide.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patrol Resource Coverage</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{allocatedCyberStaff}%</p>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">Targeting high incident coordinate towers.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">State Crime Index Trend</p>
              <p className="text-2xl font-black text-slate-800 mt-1">-8.4%</p>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">Year-over-Year predictive reduction.</p>
            </div>
          </div>

          {/* Policy Simulators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Dynamic Patrol Allocation Advisor</h4>
              <p className="text-xs text-slate-500 font-medium">Drag the slider to simulate shifting patrolling resources to high-risk zones, predicting incident reduction rate.</p>
              
              <div className="space-y-4 pt-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Cyber Fraud Unit Staffing Allocation</span>
                    <span className="text-blue-600">+{allocatedCyberStaff}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocatedCyberStaff}
                    onChange={(e) => {
                      setAllocatedCyberStaff(Number(e.target.value));
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-1">
                  <p className="text-[9px] font-black uppercase text-blue-800">Simulated Crime Impact Projections</p>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-600">Predicted Phishing Rate:</span>
                    <span className="font-extrabold text-blue-900">-{Math.round(allocatedCyberStaff * 0.45)}% reduction</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Resource Budget Surplus:</span>
                    <span className="font-extrabold text-blue-900">₹{(100 - allocatedCyberStaff) * 50000} leftover</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 flex flex-col">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Draft State Security Directive</h4>
              <textarea
                value={directiveText}
                onChange={(e) => setDirectiveText(e.target.value)}
                placeholder="Draft formal state directive guidelines here..."
                className="w-full flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none min-h-[140px]"
              />
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    logAuditAction(`DGP issued State Directive: "${directiveText.substring(0, 30)}..."`);
                    alert("Directive registered securely into PHQ Ledger. Notification dispatched to state divisions!");
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded"
                >
                  Publish Directive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Root System Security Console | AES-256 Cloud GA-Node-01</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
            SECURE STATUS: LIVE & SYNCED
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {/* Admin Server Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Server Latency</p>
              <p className="text-lg font-black text-emerald-600 mt-1">4.2 ms</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">DB Sync Status</p>
              <p className="text-lg font-black text-emerald-600 mt-1">Synced</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Encryption Layer</p>
              <p className="text-lg font-black text-blue-600 mt-1">AES-256</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Firewall Rules</p>
              <p className="text-lg font-black text-emerald-600 mt-1">Active</p>
            </div>
          </div>

          {/* Administrative SQL query Console and system triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">Raw Database SQL Query Sandbox</h4>
              <div className="space-y-2">
                <textarea
                  value={adminSqlQuery}
                  onChange={(e) => setAdminSqlQuery(e.target.value)}
                  placeholder="Enter raw read-only SQL query against CCTNS nodes..."
                  className="w-full h-24 p-2 bg-slate-900 text-cyan-400 font-mono text-[11px] rounded focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Target: State-Registry-Node-01</span>
                  <button
                    onClick={() => {
                      logAuditAction(`Admin raw SQL Execution`, adminSqlQuery);
                      alert(`SQL Executed successfully!\nRows Returned: 12\nExecution latency: 2.1ms`);
                    }}
                    className="px-2.5 py-1 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded text-[11px]"
                  >
                    Execute Query
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">System Health Controls</h4>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">Perform state-wide infrastructure tasks. Actions will be permanently registered inside the immutable system log trail.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    logAuditAction("Admin executed state-wide CCTNS Sync");
                    alert("Sync initiated with State Level NCRB Mainframe. 152 records checked, 0 conflicts found.");
                  }}
                  className="p-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  🔄 Force CCTNS Sync
                </button>
                <button
                  onClick={() => {
                    logAuditAction("Admin initiated secure system backup");
                    alert("Cloud database backup package successfully sealed with SHA-512 and saved to /secure/backups/");
                  }}
                  className="p-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  💾 Dump DB Backup
                </button>
                <button
                  onClick={() => {
                    logAuditAction("Admin rotated system encryption key");
                    alert("Master AES-256 encryption keys rotated successfully. 256 dockets re-sealed.");
                  }}
                  className="p-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 text-slate-800 transition-colors col-span-2"
                >
                  🔑 Rotate AES-256 Master Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);

    const loginL = language === "English" ? {
      invalidBadge: "AUTHENTICATION FAILURE: The entered Badge ID does not match the selected department profile.",
      invalidPin: "AUTHENTICATION FAILURE: Invalid Security PIN. Authorized testing PIN is 1234.",
    } : {
      invalidBadge: "ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ: ನಮೂದಿಸಿದ ಬ್ಯಾಡ್ಜ್ ಐಡಿಯು ಆಯ್ಕೆಮಾಡಿದ ವಿಭಾಗದ ಪ್ರೊಫೈಲ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ.",
      invalidPin: "ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ: ಅಮಾನ್ಯ ಭದ್ರತಾ ಪಿನ್. ಅಧಿಕೃತ ಪರೀಕ್ಷಾ ಪಿನ್ 1234 ಆಗಿದೆ.",
    };

    setTimeout(async () => {
      const matchedUser = SEED_USERS.find(u => u.id === loginUser.id);
      
      if (!matchedUser) {
        setLoginError(loginL.invalidBadge);
        setIsAuthenticating(false);
        return;
      }

      if (badgeInput.trim().toUpperCase() !== matchedUser.badgeId.toUpperCase()) {
        setLoginError(loginL.invalidBadge);
        setIsAuthenticating(false);
        return;
      }

      if (pinInput !== "1234") {
        setLoginError(loginL.invalidPin);
        setIsAuthenticating(false);
        return;
      }

      // Success
      setSelectedUser(matchedUser);
      setIsLoggedIn(true);
      setIsAuthenticating(false);
      setPinInput("");
      
      try {
        await fetch("/api/audit-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: matchedUser.id,
            userName: matchedUser.name,
            role: matchedUser.role,
            action: `Authorized secure badge login: ${matchedUser.name} as ${matchedUser.role}`,
            ipAddress: "10.42.221.84"
          }),
        });
        const logRes = await fetch("/api/audit-logs").then(r => r.json());
        setAuditLogs(logRes);
      } catch (err) {
        console.error(err);
      }
    }, 800);
  };

  const renderLoginPortal = () => {
    const activeTheme = loginThemes[loginUser.role];
    const loginL = language === "English" ? {
      portalTitle: "Karnataka State Police",
      portalSubtitle: "Secure Identity & Command Gateway",
      warningTitle: "AUTHORIZED LAW ENFORCEMENT ACCESS ONLY",
      warningBody: "This system contains classified criminal registries, live financial intelligence trails, and predictive hotspot algorithms. Unauthorized access, tempering, or disclosure of data is strictly punishable under Section 66 of the Information Technology Act and Indian Penal Code.",
      securityStatus: "SECURITY PROTOCOL ACTIVE",
      nodeStatus: "NODE: KSP-BLR-01 (ACTIVE)",
      encryption: "ENCRYPTION: AES-256 SYSTEM LEVEL",
      selectRole: "Select Department Profile",
      badgeIdLabel: "Officer Badge ID Number",
      pinLabel: "Security Clearance PIN",
      pinHint: "Authorized testing PIN is 1234",
      loginBtn: "Authorize Session & Open Node",
      authSuccess: "ACCESS GRANTED: Authenticating secure token...",
      badgePlaceholder: "e.g., KSP-84920",
      pinPlaceholder: "Enter 4-digit PIN",
    } : {
      portalTitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
      portalSubtitle: "ಸುರಕ್ಷಿತ ಗುರುತು ಮತ್ತು ಕಮಾಂಡ್ ಗೇಟ್‌ವೇ",
      warningTitle: "ಅಧಿಕೃತ ಕಾನೂನು ಜಾರಿ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶ",
      warningBody: "ಈ ವ್ಯವಸ್ಥೆಯು ರಹಸ್ಯ ಕ್ರಿಮಿನಲ್ ರೆಜಿಸ್ಟ್ರಿಗಳು, ಲೈವ್ ಹಣಕಾಸು ಗುಪ್ತಚರ ಹಾದಿಗಳು ಮತ್ತು ಭವಿಷ್ಯದ ಹಾಟ್‌ಸ್ಪಾಟ್ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 66 ಮತ್ತು ಭಾರತೀಯ ದಂಡ ಸಂಹಿತೆಯ ಅಡಿಯಲ್ಲಿ ಅನಧಿಕೃತ ಪ್ರವೇಶ, ಹಸ್ತಕ್ಷೇಪ ಅಥವಾ ಡೇಟಾವನ್ನು ಬಹಿರಂಗಪಡಿಸುವುದು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಶಿಕ್ಷಾರ್ಹವಾಗಿದೆ.",
      securityStatus: "ಭದ್ರತಾ ಶಿಷ್ಟಾಚಾರ ಸಕ್ರಿಯವಾಗಿದೆ",
      nodeStatus: "ನೋಡ್: KSP-BLR-01 (ಸಕ್ರಿಯ)",
      encryption: "ಎನ್‌ಕ್ರಿಪ್ಶನ್: AES-256 ಸಿಸ್ಟಮ್ ಮಟ್ಟ",
      selectRole: "ವಿಭಾಗದ ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
      badgeIdLabel: "ಅಧಿಕಾರಿಯ ಬ್ಯಾಡ್ಜ್ ಐಡಿ ಸಂಖ್ಯೆ",
      pinLabel: "ಭದ್ರತಾ ಕ್ಲಿಯರೆನ್ಸ್ ಪಿನ್",
      pinHint: "ಪರೀಕ್ಷಾ ದೃಢೀಕರಣ ಪಿನ್: 1234",
      loginBtn: "ರುಜುವಾತು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ",
      authSuccess: "ಪ್ರವೇಶ ಅನುಮೋದಿಸಲಾಗಿದೆ: ಟೋಕನ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      badgePlaceholder: "ಉದಾ: KSP-84920",
      pinPlaceholder: "4-ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ",
    };

    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-100">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-900/30 blur-[130px] pointer-events-none" />
        {/* Dynamic theme accent background blur */}
        <div className={`absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[30%] h-[30%] rounded-full opacity-10 blur-[120px] pointer-events-none transition-all duration-500 bg-${activeTheme.accentColor}-500`} />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* MAIN BENTO CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-w-5xl w-full bg-[#0b121f]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10">
          
          {/* LEFT HALF: INSTITUTIONAL COMPLIANCE WARNING */}
          <div className="lg:col-span-5 bg-slate-950/60 p-8 flex flex-col justify-between border-r border-slate-800/80 relative">
            <div className="space-y-6">
              {/* Institutional Insignia Shield */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-inner border border-slate-700">
                  <div className="w-full h-full border-2 border-[#0f172a] rounded flex flex-col items-center justify-center bg-slate-50">
                    <Shield className="w-5 h-5 text-[#0f172a]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest text-slate-300 uppercase leading-none">KARNATAKA</h2>
                  <h1 className="text-lg font-black tracking-tight text-white uppercase leading-tight">STATE POLICE</h1>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 space-y-4">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                  <span>{loginL.warningTitle}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {loginL.warningBody}
                </p>
              </div>
            </div>

            {/* Live Security Stats Block */}
            <div className="space-y-3 pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>{loginL.securityStatus}</span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-500">
                <div>{loginL.nodeStatus}</div>
                <div>{loginL.encryption}</div>
                <div className="text-[9px] text-slate-600 mt-2">© 2026 KSP CENTRAL RECORDS & INTELLIGENCE DIVISION</div>
              </div>
            </div>
          </div>

          {/* RIGHT HALF: DYNAMIC MULTI-ROLE LOGIN GATEWAY */}
          <form onSubmit={handleLoginSubmit} className="lg:col-span-7 p-8 flex flex-col justify-between space-y-6 bg-[#0c1424]">
            
            {/* Upper controls: lang and role headers */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  {loginL.selectRole}
                </span>
                
                {/* Language Switcher */}
                <button
                  type="button"
                  onClick={() => setLanguage(prev => prev === "English" ? "Kannada" : "English")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider transition-colors border border-slate-700"
                >
                  {language === "English" ? "ಕನ್ನಡ" : "English"}
                </button>
              </div>

              {/* Grid of 5 Police Officer Profiles */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SEED_USERS.map((user) => {
                  const isSelected = loginUser.id === user.id;
                  const roleTheme = loginThemes[user.role];
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setLoginUser(user);
                        setBadgeInput(user.badgeId);
                        setLoginError("");
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 relative overflow-hidden group ${
                        isSelected 
                          ? `${roleTheme.borderColor} ${roleTheme.bgColor} shadow-lg ring-1 ring-offset-0 ring-offset-[#070b13]` 
                          : "border-slate-800/60 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? roleTheme.badgeColor : "bg-slate-800 text-slate-400"
                        }`}>
                          {user.role}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isSelected ? "bg-emerald-400 animate-pulse" : "bg-slate-600 group-hover:bg-slate-400"}`} />
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-[10px] font-black text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                          {user.name.split(" ").pop()}
                        </p>
                        <p className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider line-clamp-1">
                          {user.badgeId}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Credential Form Card with dynamic department stamp */}
            <div className={`p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 transition-all shadow-inner space-y-4 relative ${activeTheme.glowColor}`}>
              
              {/* Dynamic Department Seal Stamp */}
              <div className="absolute right-4 top-4 select-none opacity-5 pointer-events-none">
                <Shield className="w-24 h-24 text-slate-300" />
              </div>

              {/* Department Headers */}
              <div className="space-y-1">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${activeTheme.badgeColor}`}>
                  {activeTheme.stamp}
                </span>
                <h3 className="text-sm font-black text-white mt-1.5 uppercase tracking-tight">
                  {activeTheme.departmentName}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {language === "English" 
                    ? `Secure workstation clearance for: ${loginUser.name}` 
                    : `ಸುರಕ್ಷಿತ ಕಾರ್ಯಸ್ಥಳ ಕ್ಲಿಯರೆನ್ಸ್: ${loginUser.name}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Badge Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {loginL.badgeIdLabel}
                  </label>
                  <input
                    type="text"
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    placeholder={loginL.badgePlaceholder}
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-slate-600 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase tracking-wide focus:outline-none transition-all"
                  />
                </div>

                {/* PIN Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      {loginL.pinLabel}
                    </label>
                    <span className="text-[8px] font-bold text-slate-500 lowercase bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {loginL.pinHint}
                    </span>
                  </div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={loginL.pinPlaceholder}
                    maxLength={4}
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-slate-600 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Login Errors Display */}
              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 rounded-xl text-[10px] font-bold tracking-wide leading-relaxed flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-3.5 ${activeTheme.buttonBg} text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 border border-white/5 disabled:opacity-50`}
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{loginL.authSuccess}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-white" />
                  <span>{loginL.loginBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderLegacyImporter = () => {
    const TEMPLATES = {
      firs: [
        {
          firNumber: "FIR/0189/2012",
          policeStation: "Majestic Police Station",
          district: "Bengaluru",
          dateFiled: "2012-04-12",
          crimeCategory: "Financial Fraud",
          subCategory: "Legacy Embezzlement",
          ipcSections: "IPC 420, IPC 406",
          status: "Closed",
          description: "Investigation into legacy trust fund embezzlement. Accused manipulated account ledgers to siphon ₹12.5 Lakhs of government pensions.",
          evidenceCount: 3
        },
        {
          firNumber: "FIR/0034/2005",
          policeStation: "Koramangala Police Station",
          district: "Bengaluru",
          dateFiled: "2005-09-24",
          crimeCategory: "Robbery",
          subCategory: "Commercial Heist",
          ipcSections: "IPC 392, IPC 395",
          status: "Closed",
          description: "Night burglary at electronics warehouse in Koramangala. Cash and high-value legacy vacuum transistors stolen.",
          evidenceCount: 1
        }
      ],
      accused: [
        {
          name: "Suresh Gowda",
          alias: "Dosa Suresh",
          age: 52,
          gender: "Male",
          address: "12th Cross, Malleshwaram, Bengaluru",
          phoneNumber: "+91 94480 12345",
          modusOperandi: "Specializes in legacy bank locker diversion and bank insider forgery.",
          riskScore: 78,
          status: "Bailed",
          previousConvictions: 3,
          severityIndex: "High"
        },
        {
          name: "Anand Shettar",
          alias: "Tech Anand",
          age: 41,
          gender: "Male",
          address: "Indiranagar 100ft Rd, Bengaluru",
          phoneNumber: "+91 80252 54321",
          modusOperandi: "Configures vintage modems and analog switching hardware for legacy call routing scams.",
          riskScore: 62,
          status: "Under Watch",
          previousConvictions: 1,
          severityIndex: "Medium"
        }
      ],
      evidence: [
        {
          firId: "KSP-LEG-EMB-12",
          type: "Documentary",
          description: "Audited bank ledger sheets showing double entry forgery for the pension account siphoning.",
          dateCollected: "2012-04-15",
          collectedBy: "Inspector Ramachandra",
          locationCollected: "Treasury Office",
          status: "Presented in Court"
        }
      ],
      transactions: [
        {
          sourceAccount: "BANK-MUG-1992",
          sourceBank: "State Bank of Mysore",
          sourceOwner: "Suresh Gowda Ledger",
          destAccount: "OFFSHORE-SWISS-01",
          destBank: "Swiss Cantonal Bank",
          destOwner: "Alpen Trust Corp",
          amount: 5000000,
          timestamp: "2012-04-13T10:15:00Z",
          type: "RTGS",
          status: "Flagged",
          flagReason: "Unusual outward RTGS matching historic pension embezzlement timelines."
        }
      ]
    };

    const handleImportTemplate = async (category: "firs" | "accused" | "evidence" | "transactions") => {
      setIsImporting(true);
      setImportStatus("");
      setImportErrors([]);
      try {
        const records = TEMPLATES[category];
        const res = await fetch("/api/db/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: category,
            records,
            userName: selectedUser.name,
            role: selectedUser.role
          })
        }).then(r => r.json());

        if (res.success) {
          setImportStatus(`Successfully ingested ${res.importedCount} legacy ${category} records!`);
          await fetchData();
        } else {
          setImportErrors(res.errors || ["Unknown error during ingestion"]);
        }
      } catch (err: any) {
        setImportErrors([err.message || "Network failed"]);
      } finally {
        setIsImporting(false);
      }
    };

    const handleImportPasted = async () => {
      if (!pasteContent.trim()) {
        alert("Please paste JSON or CSV data first.");
        return;
      }
      setIsImporting(true);
      setImportStatus("");
      setImportErrors([]);

      let parsedRecords: any[] = [];
      try {
        if (pasteContent.trim().startsWith("[") || pasteContent.trim().startsWith("{")) {
          const parsed = JSON.parse(pasteContent);
          parsedRecords = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          const lines = pasteContent.trim().split("\n");
          if (lines.length < 2) {
            throw new Error("CSV requires a header line and at least one data line.");
          }
          const headers = lines[0].split(",").map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",").map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, idx) => {
              if (values[idx] !== undefined) {
                obj[header] = values[idx];
              }
            });
            parsedRecords.push(obj);
          }
        }

        const res = await fetch("/api/db/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: importType,
            records: parsedRecords,
            userName: selectedUser.name,
            role: selectedUser.role
          })
        }).then(r => r.json());

        if (res.success) {
          setImportStatus(`Successfully parsed and imported ${res.importedCount} records into table: ${importType}!`);
          setPasteContent("");
          await fetchData();
        } else {
          setImportErrors(res.errors || ["Validation error"]);
        }
      } catch (err: any) {
        setImportErrors([`Parse failed: ${err.message}`]);
      } finally {
        setIsImporting(false);
      }
    };

    const handleManualIngest = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsImporting(true);
      setImportStatus("");
      setImportErrors([]);

      let records: any[] = [];
      if (importType === "firs") {
        if (!manualFirNumber || !manualDescription) {
          alert("FIR Number and Description are required.");
          setIsImporting(false);
          return;
        }
        records = [{
          firNumber: manualFirNumber,
          policeStation: manualPoliceStation,
          crimeCategory: manualCrimeCategory,
          ipcSections: manualIpcSections || "BNS 420",
          description: manualDescription,
          investigatingOfficer: manualInvestigatingOfficer || selectedUser.name,
          status: "Under Investigation"
        }];
      } else if (importType === "accused") {
        if (!manualAccusedName || !manualAccusedModusOperandi) {
          alert("Suspect Name and Modus Operandi are required.");
          setIsImporting(false);
          return;
        }
        records = [{
          name: manualAccusedName,
          alias: manualAccusedAlias || undefined,
          age: Number(manualAccusedAge) || 32,
          modusOperandi: manualAccusedModusOperandi,
          riskScore: Number(manualAccusedRiskScore) || 65,
          status: "Under Watch",
          severityIndex: Number(manualAccusedRiskScore) > 75 ? "High" : "Medium"
        }];
      } else {
        alert("Guided form currently supports FIR and Accused Ingestion.");
        setIsImporting(false);
        return;
      }

      try {
        const res = await fetch("/api/db/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: importType,
            records,
            userName: selectedUser.name,
            role: selectedUser.role
          })
        }).then(r => r.json());

        if (res.success && res.importedCount > 0) {
          setImportStatus(`Manual entry successfully saved and indexed! Ingested record count: ${res.importedCount}`);
          setManualFirNumber("");
          setManualDescription("");
          setManualIpcSections("");
          setManualAccusedName("");
          setManualAccusedModusOperandi("");
          setManualAccusedAlias("");
          await fetchData();
        } else {
          setImportErrors(res.errors || ["Ingestion rejected by safety rules."]);
        }
      } catch (err: any) {
        setImportErrors([err.message || "Server communication failed."]);
      } finally {
        setIsImporting(false);
      }
    };

    return (
      <div className="space-y-4 p-1">
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">SCRB LEGACY DATABASE INGESTION SYSTEM</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Validate, convert, and stream old CCTNS offline folders or paper files directly into active memory registries.</p>
            </div>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Database Ingestion Failed:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] pl-1 font-mono">
              {importErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Quick Import Pre-compiled Legacy Archives</h4>
          </div>
          <p className="text-xs text-slate-500">Test the ingestion system instantly by launching pre-vetted legal/police records from the 1990-2015 State Archive.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            <button
              onClick={() => handleImportTemplate("firs")}
              disabled={isImporting}
              className="p-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-left transition-all space-y-1 group disabled:opacity-50"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black text-blue-600">FIR Archives</span>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Historical FIRs (2005/2012)</p>
              <p className="text-[10px] text-slate-400">2 cases: government embezzlement & commercial robbery.</p>
            </button>

            <button
              onClick={() => handleImportTemplate("accused")}
              disabled={isImporting}
              className="p-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-left transition-all space-y-1 group disabled:opacity-50"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black text-blue-600">Suspect Registry</span>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Master Offender Index</p>
              <p className="text-[10px] text-slate-400">2 suspects with risk scoring, alias details, and previous dockets.</p>
            </button>

            <button
              onClick={() => handleImportTemplate("evidence")}
              disabled={isImporting}
              className="p-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-left transition-all space-y-1 group disabled:opacity-50"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black text-blue-600">Evidence Locker</span>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Legacy Trial Exhibits</p>
              <p className="text-[10px] text-slate-400">1 documentary ledger sheet showing pension embezzlement.</p>
            </button>

            <button
              onClick={() => handleImportTemplate("transactions")}
              disabled={isImporting}
              className="p-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-left transition-all space-y-1 group disabled:opacity-50"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black text-blue-600">Financial Ledger</span>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Suspicious Banking Trails</p>
              <p className="text-[10px] text-slate-400">1 high-value outward RTGS pension ledger record.</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Bulk CSV / JSON Ingestion</h4>
              </div>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as any)}
                className="text-[10px] font-bold uppercase bg-slate-100 rounded px-1.5 py-0.5 border-none focus:outline-none"
              >
                <option value="firs">FIRs</option>
                <option value="accused">Accused</option>
                <option value="evidence">Evidence</option>
                <option value="transactions">Transactions</option>
                <option value="vehicles">Vehicles</option>
                <option value="phones">Phones</option>
              </select>
            </div>
            
            <p className="text-[11px] text-slate-500">
              Select target table, then paste CSV lines (with matching headers) or a JSON array. Our converter automatically handles data casting.
            </p>

            <div className="flex-1 min-h-[160px] flex flex-col">
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={
                  importType === "firs" 
                    ? "firNumber,policeStation,crimeCategory,description\nFIR/1234/2011,Majestic Police Station,Robbery,Unsolved commercial robbery of cash safe..."
                    : importType === "accused"
                    ? "name,modusOperandi,riskScore,age\nRavi Kumar,Phishing via fake call centers,82,34"
                    : "[\n  {\n    \"firNumber\": \"FIR/0222/2015\",\n    \"policeStation\": \"Majestic Police Station\",\n    \"crimeCategory\": \"Cyber Crime\",\n    \"description\": \"Sim cloning scam.\"\n  }\n]"
                }
                className="w-full h-full min-h-[160px] p-2 bg-slate-50 text-slate-800 font-mono text-[10px] border border-slate-200 rounded focus:outline-none focus:bg-white"
              />
            </div>

            <button
              onClick={handleImportPasted}
              disabled={isImporting}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              {isImporting ? "Processing..." : `🚀 Parse & Ingest Into ${importType.toUpperCase()}`}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Guided Record Form</h4>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Verified Terminal</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Input single dockets manually. Values are matched against compliance filters prior to secure ledger streaming.
            </p>

            <form onSubmit={handleManualIngest} className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                {importType === "firs" ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">FIR Number *</label>
                        <input
                          type="text"
                          value={manualFirNumber}
                          onChange={(e) => setManualFirNumber(e.target.value)}
                          placeholder="FIR/0099/2026"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Police Station *</label>
                        <select
                          value={manualPoliceStation}
                          onChange={(e) => setManualPoliceStation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          {POLICE_STATIONS.map(st => (
                            <option key={st.code} value={st.name}>{st.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Crime Category *</label>
                        <select
                          value={manualCrimeCategory}
                          onChange={(e) => setManualCrimeCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="Cyber Crime">Cyber Crime</option>
                          <option value="Financial Fraud">Financial Fraud</option>
                          <option value="Robbery">Robbery</option>
                          <option value="Homicide">Homicide</option>
                          <option value="Assault">Assault</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">IPC / BNS Sections</label>
                        <input
                          type="text"
                          value={manualIpcSections}
                          onChange={(e) => setManualIpcSections(e.target.value)}
                          placeholder="BNS 318 (Cheating)"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400">Incident Description *</label>
                      <textarea
                        value={manualDescription}
                        onChange={(e) => setManualDescription(e.target.value)}
                        placeholder="Complete factual narration of the incident..."
                        required
                        className="w-full h-16 p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
                      />
                    </div>
                  </>
                ) : importType === "accused" ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Suspect Full Name *</label>
                        <input
                          type="text"
                          value={manualAccusedName}
                          onChange={(e) => setManualAccusedName(e.target.value)}
                          placeholder="Manjunath Raju"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Alias / Moniker</label>
                        <input
                          type="text"
                          value={manualAccusedAlias}
                          onChange={(e) => setManualAccusedAlias(e.target.value)}
                          placeholder="Pulsar Manja"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Age</label>
                        <input
                          type="number"
                          value={manualAccusedAge}
                          onChange={(e) => setManualAccusedAge(e.target.value)}
                          placeholder="32"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400">Risk Score (0-100)</label>
                        <input
                          type="number"
                          value={manualAccusedRiskScore}
                          onChange={(e) => setManualAccusedRiskScore(e.target.value)}
                          placeholder="65"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400">Modus Operandi Description *</label>
                      <textarea
                        value={manualAccusedModusOperandi}
                        onChange={(e) => setManualAccusedModusOperandi(e.target.value)}
                        placeholder="Details of crime execution patterns..."
                        required
                        className="w-full h-16 p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-50 border rounded text-center text-xs text-slate-500 py-12 flex flex-col justify-center items-center h-full">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                    Please switch Bulk category to FIRs or Accused to unlock guided manual ingestion forms.
                  </div>
                )}
              </div>

              {(importType === "firs" || importType === "accused") && (
                <button
                  type="submit"
                  disabled={isImporting}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 mt-4"
                >
                  {isImporting ? "Validating & Ingesting..." : "💾 Submit Secure Record Entry"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Load all initial data from server APIs
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const fetchData = async () => {
    try {
      const fRes = await fetch("/api/firs").then(r => r.json());
      const aRes = await fetch("/api/accused").then(r => r.json());
      const vRes = await fetch("/api/victims").then(r => r.json());
      const wRes = await fetch("/api/witnesses").then(r => r.json());
      const eRes = await fetch("/api/evidence").then(r => r.json());
      const vehRes = await fetch("/api/vehicles").then(r => r.json());
      const phRes = await fetch("/api/phones").then(r => r.json());
      const txRes = await fetch("/api/transactions").then(r => r.json());
      const netRes = await fetch("/api/network").then(r => r.json());
      const foreRes = await fetch("/api/forecast").then(r => r.json());
      const logRes = await fetch("/api/audit-logs").then(r => r.json());

      setFirs(fRes);
      setAccused(aRes);
      setVictims(vRes);
      setWitnesses(wRes);
      setEvidence(eRes);
      setVehicles(vehRes);
      setPhones(phRes);
      setTransactions(txRes);
      setNetworkGraph(netRes.nodes || []);
      setNetworkLinks(netRes.links || []);
      setForecastReport(foreRes);
      setAuditLogs(logRes);

      // Default selected accused is Karthik Shettar
      if (aRes.length > 0) {
        setSelectedAccused(aRes[0]);
      }
      if (fRes.length > 0) {
        setSelectedFIR(fRes[0]);
      }
    } catch (err) {
      console.error("Error loading crime database records:", err);
    }
  };

  // Log action helper
  const logAuditAction = async (action: string, query?: string, tables?: string, count: number = 0) => {
    try {
      const res = await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          userName: selectedUser.name,
          role: selectedUser.role,
          action,
          queryExecuted: query,
          tablesAccessed: tables,
          recordCount: count,
          ipAddress: "10.42.221.84"
        }),
      }).then(r => r.json());

      // Refresh log feed
      const logRes = await fetch("/api/audit-logs").then(r => r.json());
      setAuditLogs(logRes);
    } catch (err) {
      console.error("Error creating audit log:", err);
    }
  };

  // Run AI query search
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    setChatInput("");
    setIsTyping(true);

    const userMsg = {
      id: `MSG-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          user: selectedUser,
          language,
        }),
      }).then(r => r.json());

      setChatHistory(prev => [...prev, res]);
      if (res.sql) {
        setLastExecutedSql(res.sql);
      }
      if (res.confidence) {
        setActiveConfidence(res.confidence);
      }

      // Log the search
      logAuditAction(`AI Assistant consultation: "${textToSend.substring(0, 40)}..."`, textToSend, "firs, accused, vehicles", 1);
    } catch (err) {
      console.error("Chat API error:", err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `ERR-${Date.now()}`,
          sender: "assistant",
          text: "System transmission timeout. Please check your secure connection parameters.",
          timestamp: new Date().toISOString(),
          confidence: 0,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Web Speech recognition is not supported in this frame environment. Please try typing your query.");
        return;
      }
      const rec = new SpeechRecognition();
      rec.lang = language === "Kannada" ? "kn-IN" : "en-IN";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setChatInput(text);
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  // Speech Synthesis (Voice Output)
  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Strip markdown tags before reading
      const cleanText = text.replace(/[*_#`\[\]]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === "Kannada" ? "kn-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech output is not supported by your browser environment.");
    }
  };

  // Clean chat
  const handleClearChat = () => {
    setChatHistory([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: language === "Kannada"
          ? "ಸ್ವಾಗತ ಅಧಿಕಾರಿ. ನಾನು ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಕೆಎಸ್ಪಿ-ಸಹಾಯಕ್ ಅಪರಾಧ ತನಿಖಾ ಸಹಾಯಕ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ."
          : "Swagatha, Officer. Live investigative workspace reset. Ready for new queries.",
        timestamp: new Date().toISOString(),
        confidence: 100,
        language,
      }
    ]);
    logAuditAction("Investigative chat session cleared", undefined, undefined, 0);
  };

  // Robust high-fidelity PDF report generation using jsPDF
  const handleExportPDF = () => {
    try {
      logAuditAction("Exported active conversation transcript as PDF report", undefined, "audit_trail", 1);
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const reportId = `KSP-IR-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestampStr = new Date().toLocaleString("en-US", { hour12: true });

      // Clean Kannada or unicode to printable characters for standard Helvetica font support
      const cleanTextForPDF = (txt: string) => {
        let cleaned = txt;
        // Welcome message translation replacement for clean report
        if (cleaned.includes("ಸ್ವಾಗತ ಅಧಿಕಾರಿ") || cleaned.includes("ಸುರಕ್ಷಿತ ಕೆಎಸ್ಪಿ-ಸಹಾಯಕ್")) {
          return "Welcome Officer. Active secure KSP-Sahayak investigative chat session initialized. Ready for crime query input.";
        }
        
        const nonAsciiRegex = /[^\x00-\x7F]/g;
        if (nonAsciiRegex.test(cleaned)) {
          cleaned = cleaned.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ").trim();
          if (!cleaned) {
            cleaned = "[Bilingual / Kannada transcript log - secured in database]";
          } else {
            cleaned = cleaned + " [Bilingual transcript content cleaned for Latin font compatibility]";
          }
        }
        return cleaned;
      };

      let y = 15;

      const drawPageHeader = () => {
        // Draw deep blue header bar
        doc.setFillColor(30, 58, 138); // bg-blue-900 / Navy
        doc.rect(15, 12, 180, 2.5, "F");

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("KSP-SAHAYAK: CRIMINAL INTELLIGENCE CONVERSATION REPORT", 15, 20);
        doc.text(`CONFIDENTIAL`, 195, 20, { align: "right" });
        
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(15, 22, 195, 22);
      };

      // Draw Main Document Header on Page 1
      const drawDocumentHeader = () => {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("KARNATAKA STATE POLICE DEPARTMENT", 15, 20);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text("STATE CRIME RECORDS BUREAU (SCRB) | CRIMINAL INTELLIGENCE DIVISION", 15, 25);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(29, 78, 216); // blue-700
        doc.text("KSP-SAHAYAK SECURE COGNITIVE REPORT & AUDIT TRAIL", 15, 31);

        doc.setDrawColor(30, 58, 138);
        doc.setLineWidth(0.5);
        doc.line(15, 34, 195, 34);
        doc.setLineWidth(0.1); // restore default
      };

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 270) {
          doc.addPage();
          drawPageHeader();
          y = 28; // reset y on the new page, leaving room under header
          return true;
        }
        return false;
      };

      // Initialize Page 1
      drawDocumentHeader();
      y = 39;

      // Draw Metadata Info Box
      checkPageBreak(45);
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(15, y, 180, 42, 2, 2, "FD");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("REPORT METADATA & COMPLIANCE STATS", 19, y + 6);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(19, y + 8, 191, y + 8);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      
      doc.text("REPORT ID:", 19, y + 14);
      doc.text("DATE & TIME:", 19, y + 20);
      doc.text("OFFICER NAME:", 19, y + 26);
      doc.text("BADGE ID:", 19, y + 32);
      doc.text("SECURITY LEVEL:", 19, y + 38);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(reportId, 45, y + 14);
      doc.text(timestampStr, 45, y + 20);
      doc.text(selectedUser.name, 45, y + 26);
      doc.text(selectedUser.badgeId, 45, y + 32);
      doc.text(`${selectedUser.role.toUpperCase()} (SECURE COMPLIANT)`, 45, y + 38);

      // Second column of metadata
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("STATION CODE:", 115, y + 14);
      doc.text("DEPARTMENT:", 115, y + 20);
      doc.text("SYSTEM STATUS:", 115, y + 26);
      doc.text("SESSION HASH:", 115, y + 32);
      doc.text("VERIFIED BY:", 115, y + 38);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(selectedUser.station || "SCRB HQ Bengaluru", 145, y + 14);
      doc.text(selectedUser.department || "SCRB Intelligence", 145, y + 20);
      doc.setTextColor(21, 128, 61); // green-700
      doc.text("SECURE AUDITED", 145, y + 26);
      doc.setTextColor(15, 23, 42);
      const sessionHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      doc.setFont("Courier", "normal");
      doc.setFontSize(7.5);
      doc.text(sessionHash, 145, y + 32);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.text("KSP-Sahayak-v2", 145, y + 38);

      y += 48;

      // Executive Summary Note
      checkPageBreak(25);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("EXECUTIVE COMPLIANCE SUMMARY", 15, y);
      
      y += 4;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const summaryText = "This automated report provides a high-fidelity audit trail of natural language cognitive queries executed against the SCRB Karnataka State Police crime database. Every query, response, and calculated confidence level has been securely recorded to prevent unauthorized data access and maintain a transparent, explainable judicial record of investigative paths.";
      const splitSummary = doc.splitTextToSize(summaryText, 180);
      doc.text(splitSummary, 15, y);
      y += (splitSummary.length * 4) + 6;

      // Chat Transcript Section
      checkPageBreak(15);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138); // blue-900
      doc.text("OFFICIAL TRANSCRIPT & ANALYTICAL OUTPUT", 15, y);
      
      y += 2;
      doc.setDrawColor(30, 58, 138);
      doc.line(15, y, 195, y);
      y += 6;

      // Loop over chat logs
      chatHistory.forEach((msg) => {
        const isUser = msg.sender === "user";
        const senderName = isUser ? `OFFICER: ${selectedUser.name} (${selectedUser.role})` : "KSP-SAHAYAK COGNITIVE AI ASSISTANT";
        const timeStr = new Date(msg.timestamp).toLocaleString();
        
        // Formatted cleaner content
        const cleanedText = cleanTextForPDF(msg.text);
        const splitLines = doc.splitTextToSize(cleanedText, 172); // slightly smaller inside card
        
        const cardHeight = 12 + (splitLines.length * 4.5) + (isUser ? 0 : 6);
        checkPageBreak(cardHeight + 4);

        // Draw Message Card Container
        if (isUser) {
          doc.setFillColor(241, 245, 249); // slate-100 for officer
          doc.setDrawColor(203, 213, 225); // slate-300
        } else {
          doc.setFillColor(240, 249, 255); // sky-50 for AI response
          doc.setDrawColor(186, 230, 253); // sky-200
        }
        doc.roundedRect(15, y, 180, cardHeight, 1.5, 1.5, "FD");

        // Header inside message card
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(senderName, 19, y + 5);

        // Date align right inside card
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(timeStr, 191, y + 5, { align: "right" });

        // Splitter line in card
        if (isUser) {
          doc.setDrawColor(226, 232, 240);
        } else {
          doc.setDrawColor(224, 242, 254);
        }
        doc.line(19, y + 7, 191, y + 7);

        // Draw text
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(splitLines, 19, y + 12);

        // If AI assistant, show explainability metadata
        if (!isUser) {
          const textY = y + 12 + (splitLines.length * 4.5);
          doc.setFont("Helvetica", "italic");
          doc.setFontSize(7.5);
          doc.setTextColor(3, 105, 161); // sky-700
          doc.text(`AI Confidence: ${msg.confidence || 100}% | Explainable Grounding Source: KSP Federated Crime Index`, 19, textY + 3.5);
        }

        y += cardHeight + 4;
      });

      // Verification Signature Block
      checkPageBreak(40);
      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, 195, y);
      y += 8;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("AUTHENTICATION & CERTIFICATION SEAL", 15, y);
      
      y += 4;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("I hereby certify that this transcript is an accurate and authorized record of cognitive searches executed on the official KSP database.", 15, y);
      
      y += 12;
      doc.setDrawColor(100, 116, 139);
      doc.line(15, y, 65, y);
      doc.line(130, y, 190, y);

      y += 4;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("INVESTIGATING OFFICER SIGNATURE", 15, y);
      doc.text("SCRB SYSTEM ADMINISTRATOR", 130, y);

      // Add Footer & Page Numbers on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(15, 282, 195, 282);
        
        // Footer text
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("CONFIDENTIAL - KARNATAKA STATE POLICE INTERNAL COGNITIVE LOG - DISTRIBUTION CONTROLLED", 15, 287);
        doc.text(`Page ${i} of ${totalPages}`, 195, 287, { align: "right" });
      }

      // Download the PDF
      doc.save(`KSP_Sahayak_Report_${reportId}.pdf`);

    } catch (error) {
      console.error("PDF Export Error: ", error);
      alert("Failed to export PDF. Please check the console log or try again.");
    }
  };

  // Render nodes list based on clicked visual node
  const handleNodeClick = (nodeId: string) => {
    const accMatch = accused.find(a => a.id === nodeId);
    if (accMatch) {
      setSelectedAccused(accMatch);
      logAuditAction(`Inspected Suspect Profile: ${accMatch.name}`, undefined, "ksp_accused_registry", 1);
      return;
    }

    const firMatch = firs.find(f => f.id === nodeId);
    if (firMatch) {
      setSelectedFIR(firMatch);
      logAuditAction(`Inspected FIR Docket: ${firMatch.firNumber}`, undefined, "ksp_fir_records", 1);
      return;
    }
  };

  // Suggested quick prompts
  const SUGGESTED_PROMPTS = language === "English" ? [
    { text: "Show details for cyber crime FIR/0045/2026", q: "Show cyber crime FIR/0045/2026 details" },
    { text: "Retrieve criminal history of Karthik Shettar", q: "Show accused Karthik Shettar previous criminal history" },
    { text: "Trace money trail for suspicious ledger accounts", q: "Trace money transactions mule account layering" },
    { text: "Get high risk hotspot forecast for Bengaluru Central", q: "Koramangala crime forecast predictive metrics" }
  ] : [
    { text: "ಸೈಬರ್ ಅಪರಾಧ FIR/0045/2026 ವಿವರ ತೋರಿಸಿ", q: "Show cyber crime FIR/0045/2026 details" },
    { text: "ಕಾರ್ತಿಕ್ ಶೆಟ್ಟರ್ ಅಪರಾಧ ಇತಿಹಾಸ ತಿಳಿಸಿ", q: "Show accused Karthik Shettar previous criminal history" },
    { text: "ಶಂಕಾಸ್ಪದ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆಗಳ ವಿವರ", q: "Trace money transactions mule account layering" },
    { text: "ಬೆಂಗಳೂರು ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು", q: "Koramangala crime forecast predictive metrics" }
  ];

  if (!isLoggedIn) {
    return renderLoginPortal();
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      
      {/* HEADER: Institutional & High-Security */}
      <header id="header-main" className="h-16 flex items-center justify-between px-8 bg-[#0f172a] text-white border-b-4 border-[#fbbf24] shrink-0 select-none font-sans">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center shadow-md border border-amber-400">
            <Shield className="w-5 h-5 text-[#0f172a] fill-[#0f172a]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
              KSP SAHAYAK
              <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded tracking-widest animate-pulse">
                STATE NODAL COMMAND
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-normal">{L.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Badge, Station ID, Clock & Controls */}
        <div className="flex items-center gap-6">
          {/* Station ID and Realtime Clock block */}
          <div className="hidden xl:flex items-center gap-4 border-r border-slate-700 pr-6 text-right">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">STATION ID</p>
              <p className="text-xs text-[#fbbf24] font-mono font-bold leading-none mt-0.5">D-42 CENTRAL HQ</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">SECURE NODE TIME</p>
              <p className="text-xs text-white font-mono font-bold leading-none mt-0.5">
                {currentTime.toLocaleTimeString("en-US", { hour12: false })}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                {currentTime.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
              </p>
              <p className="text-[9px] text-slate-500 font-mono font-bold leading-none mt-0.5">
                {currentTime.getFullYear()}
              </p>
            </div>
          </div>

          {/* Active Cloud Mode */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            {L.secureNode}
          </div>

          {/* Language Switcher */}
          <button
            id="btn-lang-toggle"
            onClick={() => {
              setLanguage(prev => prev === "English" ? "Kannada" : "English");
              logAuditAction(`Switched platform UI language to ${language === "English" ? "Kannada" : "English"}`);
            }}
            className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold rounded-md uppercase tracking-wider transition-colors border border-blue-500/50"
          >
            {L.languageToggle}
          </button>

          {/* Authenticated Profile & Secure Logout */}
          <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-white text-xs font-black tracking-wide uppercase">
                  {selectedUser.name}
                </span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {selectedUser.role}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 tracking-wider font-semibold">
                {L.badge}: {selectedUser.badgeId}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm border-2 border-white/20 select-none">
              {selectedUser.name.split(" ").pop()?.substring(0, 2).toUpperCase() || "SM"}
            </div>
            
            {/* Logout Button */}
            <button
              id="btn-logout"
              onClick={async () => {
                await logAuditAction(`User logged out: ${selectedUser.name} (${selectedUser.role})`);
                setIsLoggedIn(false);
                setPinInput("");
                setLoginError("");
              }}
              title="Logout Secure Session"
              className="ml-2 p-1.5 bg-red-900/40 hover:bg-red-600/60 hover:text-white text-red-400 rounded-lg border border-red-500/30 transition-all flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex flex-1 overflow-hidden bg-slate-50">
        
        {/* SIDEBAR NAVIGATION: Unified Operations Control */}
        <nav className="w-18 md:w-64 flex flex-col py-4 bg-slate-100 border-r border-slate-200 gap-1.5 shadow-sm shrink-0 select-none px-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3 hidden md:block">
            Main Command
          </div>
          
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveTab("dashboard")}
            title={L.tabs.dashboard}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "dashboard" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
          >
            <Shield className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.dashboard}</span>
          </button>

          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR) && (
            <button
              id="nav-chat-tab"
              onClick={() => setActiveTab("chat")}
              title={L.tabs.chat}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "chat" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.chat}</span>
            </button>
          )}

          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR) && (
            <button
              id="nav-explorer-tab"
              onClick={() => setActiveTab("explorer")}
              title={L.tabs.explorer}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "explorer" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <Database className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.explorer}</span>
            </button>
          )}

          {/* ADVANCED AI MODULES */}
          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR) && (
            <button
              id="nav-copilot-tab"
              onClick={() => setActiveTab("copilot")}
              title="AI Investigation Copilot"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "copilot" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <Sparkles className="w-5 h-5 shrink-0 text-blue-500 animate-pulse" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">AI Copilot</span>
            </button>
          )}

          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR || selectedUser.role === UserRole.POLICYMAKER) && (
            <button
              id="nav-gis-tab"
              onClick={() => setActiveTab("gis")}
              title="GIS Geographic Heatmap"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "gis" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <MapPin className="w-5 h-5 shrink-0 text-rose-500" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">GIS Map Hub</span>
            </button>
          )}

          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR || selectedUser.role === UserRole.POLICYMAKER) && (
            <button
              id="nav-summary-tab"
              onClick={() => setActiveTab("summary")}
              title="AI Case Summary Briefs"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "summary" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <FileText className="w-5 h-5 shrink-0 text-slate-700" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">AI Case Docket</span>
            </button>
          )}

          {(selectedUser.role === UserRole.INVESTIGATOR || selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.SUPERVISOR) && (
            <button
              id="nav-similarity-tab"
              onClick={() => setActiveTab("similarity")}
              title="Similar Case Finder"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "similarity" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <Link2 className="w-5 h-5 shrink-0 text-indigo-500" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">MO Similarity</span>
            </button>
          )}

          {(selectedUser.role === UserRole.ANALYST) && (
            <button
              id="nav-network-tab"
              onClick={() => setActiveTab("network")}
              title={L.tabs.network}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "network" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <Share2 className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.network}</span>
            </button>
          )}

          {(selectedUser.role === UserRole.ANALYST || selectedUser.role === UserRole.POLICYMAKER) && (
            <button
              id="nav-forecast-tab"
              onClick={() => setActiveTab("forecast")}
              title={L.tabs.forecast}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "forecast" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <TrendingUp className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.forecast}</span>
            </button>
          )}

          {(selectedUser.role === UserRole.ADMIN) && (
            <button
              id="nav-logs-tab"
              onClick={() => setActiveTab("logs")}
              title={L.tabs.logs}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left ${activeTab === "logs" ? "bg-[#0f172a] text-white shadow font-bold" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-xs tracking-wide uppercase font-semibold">{L.tabs.logs}</span>
            </button>
          )}

          {/* System Sync Status & Health Block */}
          <div className="mt-auto border-t border-slate-200/80 pt-4 flex flex-col gap-2">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 hidden md:block">
              <div className="text-[9px] font-bold text-blue-900 mb-1.5 tracking-wider uppercase flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                SYSTEM STATUS
              </div>
              <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                <div className="w-[82%] bg-blue-600 h-full"></div>
              </div>
              <div className="text-[9px] text-blue-700 mt-1 font-semibold">Active & Encrypted</div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 text-emerald-600 font-semibold" title="Security Status Protected">
              <Lock className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline font-sans text-[10px] tracking-wider uppercase font-bold text-emerald-700">SSL PROTECTED</span>
            </div>
          </div>
        </nav>

        {/* CENTER STAGE: RENDERED BASED ON TAB */}
        <div className="flex-1 grid grid-cols-12 gap-5 h-full overflow-hidden p-6">
          
          {/* TAB 0: SECURE ROLE-BASED DASHBOARD (65% WIDTH) */}
          {activeTab === "dashboard" && (
            selectedUser.role === UserRole.INVESTIGATOR ? renderInvestigatorDashboard() :
            selectedUser.role === UserRole.ANALYST ? renderAnalystDashboard() :
            selectedUser.role === UserRole.SUPERVISOR ? renderSupervisorDashboard() :
            selectedUser.role === UserRole.POLICYMAKER ? renderPolicymakerDashboard() :
            selectedUser.role === UserRole.ADMIN ? renderAdminDashboard() : null
          )}
          
          {/* TAB 1: INTUITIVE CONVERSATIONAL AI (65% WIDTH) */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${activeTab === "chat" ? "flex" : "hidden"}`}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                {L.chatSession}
              </span>
              <div className="flex gap-2">
                <button
                  id="btn-clear-chat"
                  onClick={handleClearChat}
                  className="px-3 py-1 text-[10px] font-bold border border-slate-300 rounded uppercase tracking-wider hover:bg-slate-100"
                >
                  {L.clearChat}
                </button>
                <button
                  id="btn-export-pdf"
                  onClick={handleExportPDF}
                  className="px-3 py-1 text-[10px] font-bold bg-[#0f172a] text-white rounded uppercase tracking-wider hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  {L.exportPDF}
                </button>
              </div>
            </div>

            {/* MESSAGE CHRONICLE */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {chatHistory.map((msg, index) => (
                <div key={msg.id || index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-[90%] p-4 rounded-xl shadow-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 rounded-tl-none text-slate-800"}`}>
                    
                    {/* Bot Heading details */}
                    {msg.sender === "assistant" && (
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Shield className="w-3 h-3" />
                          KSP-Sahayak Engine
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                            Confidence: {msg.confidence || 95}%
                          </span>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            title="Read Aloud"
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Main content formatting with lists */}
                    <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* EXPLAINABLE AI EXPANSION WIDGET */}
                    {msg.sender === "assistant" && (msg.evidence || msg.reasoning || msg.suggestedLeads) && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                        {/* Evidence Source */}
                        {msg.evidence && msg.evidence.length > 0 && (
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                              <Database className="w-3 h-3 text-slate-400" />
                              {L.reasoning}
                            </p>
                            <ul className="list-disc pl-3 text-[10px] text-slate-600 space-y-0.5">
                              {msg.evidence.map((ev: string, i: number) => (
                                <li key={i}>{ev}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggested Leads */}
                        {msg.suggestedLeads && msg.suggestedLeads.length > 0 && (
                          <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1">
                              <AlertOctagon className="w-3 h-3 text-blue-500" />
                              {L.leads}
                            </p>
                            <ul className="list-disc pl-3 text-[10px] text-blue-950 space-y-0.5 font-medium">
                              {msg.suggestedLeads.map((ld: string, i: number) => (
                                <li key={i} className="leading-tight">{ld}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* SQL Query visualizer */}
                        {msg.sql && (
                          <div className="bg-slate-900 p-2 rounded text-slate-200">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                              {L.sqlPreview}
                            </p>
                            <code className="text-[9px] block text-cyan-400 font-mono select-all">
                              {msg.sql}
                            </code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CCTNS Live Querying...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Suggested Chip Queries */}
            <div className="px-4 py-2 border-t border-slate-100 flex flex-wrap gap-1.5 bg-slate-50/30">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1 w-full mb-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                {L.suggestedQueries}:
              </span>
              {SUGGESTED_PROMPTS.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pr.q)}
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {pr.text}
                </button>
              ))}
            </div>

            {/* CHAT INPUT AREA */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="chat-input-text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={L.queryPlaceholder}
                  className="w-full py-3 pl-4 pr-24 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
                
                <div className="absolute right-3 flex items-center gap-2">
                  <button
                    id="btn-voice-input"
                    onClick={toggleListening}
                    title={isListening ? L.voiceActive : L.voiceInactive}
                    className={`p-2 rounded-full transition-colors ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-slate-400 hover:text-blue-500 hover:bg-slate-200"}`}
                  >
                    {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                  </button>

                  <button
                    id="btn-send-chat"
                    onClick={() => handleSendMessage()}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
              {isListening && (
                <p className="text-[10px] text-red-600 font-bold mt-1 animate-pulse flex items-center gap-1 pl-1">
                  ● {L.voiceActive}
                </p>
              )}
            </div>
          </div>

          {/* TAB 2: REGISTER EXPLORER SEARCH */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${activeTab === "explorer" ? "flex" : "hidden"}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">STATE POLICE RECORDS REGISTRY</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(["firs", "accused", "evidence", "transactions", "vehicles", "phones", "import"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setExplorerTable(tab);
                      setSearchFilter("");
                    }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${explorerTable === tab ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {tab === "import" ? "📥 Import Legacy" : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Inner text filter */}
            {explorerTable !== "import" && (
              <div className="p-3 border-b border-slate-100 bg-white flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Live regex filter registry dockets..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
                />
              </div>
            )}

            {/* Table visualization */}
            <div className="flex-1 overflow-auto p-4">
              
              {/* Table FIRS */}
              {explorerTable === "firs" && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-2">FIR Number</th>
                      <th className="p-2">Station</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">IPC Sections</th>
                      <th className="p-2">Officer</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRoleFilteredFirs()
                      .filter(f => f.firNumber.toLowerCase().includes(searchFilter.toLowerCase()) || f.crimeCategory.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(f => (
                        <tr
                          key={f.id}
                          onClick={() => setSelectedFIR(f)}
                          className={`border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer ${selectedFIR?.id === f.id ? "bg-blue-50" : ""}`}
                        >
                          <td className="p-2 font-bold text-blue-700">{f.firNumber}</td>
                          <td className="p-2">{f.policeStation}</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">{f.crimeCategory}</span></td>
                          <td className="p-2 font-mono text-[10px]">{f.ipcSections}</td>
                          <td className="p-2">{f.investigatingOfficer}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${f.status === "Closed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                              {f.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* Table Accused */}
              {explorerTable === "accused" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getRoleFilteredAccused()
                    .filter(a => a.name.toLowerCase().includes(searchFilter.toLowerCase()) || a.modusOperandi.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map(a => (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAccused(a)}
                        className={`p-3 border rounded-xl flex gap-3 cursor-pointer hover:border-blue-400 transition-all ${selectedAccused?.id === a.id ? "border-blue-500 bg-blue-50/30 shadow-sm" : "border-slate-200"}`}
                      >
                        <img src={a.photoUrl} alt={a.name} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-300" />
                        <div className="space-y-1 overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{a.name}</h4>
                          <p className="text-[10px] text-red-600 font-bold">Alias: {a.alias || "None"} | Risk Score: {a.riskScore}%</p>
                          <p className="text-[11px] text-slate-500 truncate italic">MO: {a.modusOperandi}</p>
                          <div className="flex gap-1.5 text-[9px] font-black uppercase pt-1">
                            <span className="px-1.5 bg-slate-100 rounded text-slate-700">{a.status}</span>
                            <span className="px-1.5 bg-red-50 text-red-700 rounded border border-red-100">Convictions: {a.previousConvictions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Table Evidence */}
              {explorerTable === "evidence" && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-2">ID</th>
                      <th className="p-2">Linked FIR</th>
                      <th className="p-2">Evidence Type</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">FSL Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRoleFilteredEvidence()
                      .filter(e => e.description.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(e => (
                        <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-2 font-bold">{e.id}</td>
                          <td className="p-2 text-blue-600 font-semibold">{e.firId}</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[10px]">{e.type}</span></td>
                          <td className="p-2 text-slate-600">{e.description}</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-bold">{e.status}</span></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* Table Transactions */}
              {explorerTable === "transactions" && (
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-sans">
                      <th className="p-2">ID</th>
                      <th className="p-2">Source Owner</th>
                      <th className="p-2">Dest Owner</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Audit Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRoleFilteredTransactions()
                      .filter(t => t.sourceOwner.toLowerCase().includes(searchFilter.toLowerCase()) || t.destOwner.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(t => (
                        <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 text-[11px]">
                          <td className="p-2 font-bold text-slate-700">{t.id}</td>
                          <td className="p-2">{t.sourceOwner} <span className="text-slate-400 text-[10px]">({t.sourceAccount})</span></td>
                          <td className="p-2 text-blue-700">{t.destOwner} <span className="text-slate-400 text-[10px]">({t.destAccount})</span></td>
                          <td className="p-2 font-black text-slate-900">₹{t.amount.toLocaleString()}</td>
                          <td className="p-2">{t.type}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold ${t.status === "Completed" ? "bg-slate-100 text-slate-700" : "bg-red-100 text-red-800"}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* Table Vehicles */}
              {explorerTable === "vehicles" && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-2">Reg Number</th>
                      <th className="p-2">Make/Model</th>
                      <th className="p-2">Color</th>
                      <th className="p-2">Owner Name</th>
                      <th className="p-2">Linked Suspect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRoleFilteredVehicles().map(v => (
                      <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-bold font-mono text-blue-600">{v.registrationNumber}</td>
                        <td className="p-2">{v.make} {v.model}</td>
                        <td className="p-2">{v.color}</td>
                        <td className="p-2">{v.ownerName}</td>
                        <td className="p-2 font-semibold text-slate-600">{v.linkedAccusedId || "Unlinked"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Table Phones */}
              {explorerTable === "phones" && (
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-sans">
                      <th className="p-2">Phone Number</th>
                      <th className="p-2">IMEI</th>
                      <th className="p-2">Owner</th>
                      <th className="p-2">Linked Suspect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRoleFilteredPhones().map(p => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 text-[11px]">
                        <td className="p-2 font-bold">{p.phoneNumber}</td>
                        <td className="p-2 text-slate-500">{p.imei}</td>
                        <td className="p-2 font-sans">{p.ownerName}</td>
                        <td className="p-2 font-semibold text-slate-600">{p.linkedAccusedId || "Unlinked"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Table Import Legacy */}
              {explorerTable === "import" && renderLegacyImporter()}
            </div>
          </div>

          {/* TAB 3: NETWORK INTERACTIVE VISUALIZER */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl ${activeTab === "network" ? "flex" : "hidden"}`}>
            <CriminalNetwork />
          </div>

          {/* TAB 4: ML FORECASTING & PATTERN HEATMAP */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${activeTab === "forecast" ? "flex" : "hidden"}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                {L.forecastingTitle}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 bg-red-100 text-red-700 font-bold rounded-full">
                ML Model: XGBoost + Prophet Ensemble
              </span>
            </div>

            {/* Forecasting layout */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Hotspot card prediction */}
              {forecastReport && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-red-800 tracking-wider mb-1">Predicted Hotspot Area</p>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{forecastReport.hotspotLocation}</h3>
                    <p className="text-[10px] text-red-700 font-bold mt-2 flex items-center gap-1">
                      <AlertOctagon className="w-4 h-4" />
                      Confidence Level: {forecastReport.confidenceScore}%
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-blue-800 tracking-wider mb-1">Predicted Crime Volume (Month)</p>
                    <h3 className="text-2xl font-black text-blue-950">{forecastReport.predictedCrimeVolume} Incidents</h3>
                    <p className="text-[10px] text-blue-700 font-bold mt-2">Projection window: Next 30 operational days.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Repeat Offender Warning</p>
                    <h3 className="text-xs font-black text-slate-800">4 High-probability matching MO suspects</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2">Active observation warrants requested.</p>
                  </div>
                </div>
              )}

              {/* Time Series mock chart drawn in pure SVG for perfect reliability */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Predictive Crime Volume Trends: Bengaluru Central Area (Historical vs Projective)
                </h4>
                <div className="h-44 relative">
                  <svg viewBox="0 0 700 160" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="700" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="80" x2="700" y2="80" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="120" x2="700" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                    
                    {/* Actual data line path */}
                    <path
                      d="M 50 130 L 150 110 L 250 120 L 350 80 L 450 60 L 550 40 L 650 30"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                    />

                    {/* Projected interval zone (shaded area) */}
                    <polygon
                      points="450 90, 550 80, 650 70, 650 10, 550 20, 450 30"
                      fill="#3b82f6"
                      fillOpacity="0.1"
                    />

                    {/* Data dots */}
                    <circle cx="50" cy="130" r="4" fill="#2563eb" />
                    <circle cx="150" cy="110" r="4" fill="#2563eb" />
                    <circle cx="250" cy="120" r="4" fill="#2563eb" />
                    <circle cx="350" cy="80" r="4" fill="#2563eb" />
                    
                    {/* Projection transition point */}
                    <circle cx="450" cy="60" r="5" fill="#ea580c" />
                    <circle cx="550" cy="40" r="5" fill="#ea580c" />
                    <circle cx="650" cy="30" r="5" fill="#ea580c" />

                    {/* Labels */}
                    <text x="50" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Feb 2026</text>
                    <text x="150" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Mar 2026</text>
                    <text x="250" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Apr 2026</text>
                    <text x="350" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">May 2026</text>
                    <text x="450" y="150" fill="#ea580c" fontSize="9" textAnchor="middle" fontWeight="bold">Jun 2026 (Live)</text>
                    <text x="550" y="150" fill="#ea580c" fontSize="9" textAnchor="middle" fontWeight="bold">Jul 22 (Forecast)</text>
                    <text x="650" y="150" fill="#ea580c" fontSize="9" textAnchor="middle" fontWeight="bold">Aug 22 (Forecast)</text>
                  </svg>
                </div>
              </div>

              {/* Forecast evidence and ML parameters */}
              {forecastReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 border border-slate-200 rounded-xl space-y-2 bg-white">
                    <h5 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      ML Reasonings & Signal Indicators
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 font-medium">
                      {forecastReport.reasoning.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 border border-slate-200 rounded-xl space-y-2 bg-white">
                    <h5 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      Supporting CCTNS Corroborations
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 font-medium">
                      {forecastReport.supportingEvidence.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAB 5: AUDIT LOGS */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${activeTab === "logs" ? "flex" : "hidden"}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                CYBERSECURITY AUDIT LOGS & ACCESS HISTORY
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                DPDP COMPLIANT - ALL WRITES JOURNALED
              </span>
            </div>

            {/* Logs layout */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-sans">
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">User / Badge</th>
                    <th className="p-2">Action Executed</th>
                    <th className="p-2">Underlying SQL Preview</th>
                    <th className="p-2">Client IP</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 text-[11px] leading-tight">
                      <td className="p-2 text-slate-500 font-sans whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-2 font-sans">
                        <p className="font-bold text-slate-800">{log.userName}</p>
                        <p className="text-[9px] text-slate-400">{log.role}</p>
                      </td>
                      <td className="p-2 text-blue-700 font-semibold font-sans">{log.action}</td>
                      <td className="p-2 max-w-xs truncate text-cyan-700 font-bold bg-slate-50" title={log.sqlExecuted || "No DB transaction"}>
                        {log.sqlExecuted || "N/A"}
                      </td>
                      <td className="p-2 text-slate-400 font-sans">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TAB: AI INVESTIGATION COPILOT */}
          {activeTab === "copilot" && (
            <div className="col-span-12 lg:col-span-8 h-full flex flex-col overflow-hidden">
              <AICopilot 
                currentUser={selectedUser} 
                firs={firs} 
              />
            </div>
          )}

          {/* TAB: GIS MAP HUB */}
          {activeTab === "gis" && (
            <div className="col-span-12 lg:col-span-8 h-full flex flex-col overflow-hidden">
              <CrimeHeatmap firs={firs} />
            </div>
          )}

          {/* TAB: AI CASE DOCKET GENERATOR */}
          {activeTab === "summary" && (
            <div className="col-span-12 lg:col-span-8 h-full flex flex-col overflow-hidden">
              <CaseSummaryGenerator currentUser={selectedUser} firs={firs} />
            </div>
          )}

          {/* TAB: SIMILAR CASE FINDER */}
          {activeTab === "similarity" && (
            <div className="col-span-12 lg:col-span-8 h-full flex flex-col overflow-hidden">
              <SimilarCaseFinder firs={firs} />
            </div>
          )}

          {/* DYNAMIC CONTEXT SIDE PANEL (35% WIDTH) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
            
            {/* Explainable AI Dashboard card */}
            <div className="bg-[#0f172a] text-white rounded-xl p-4 shadow-md shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
                {L.confidenceTitle}
              </h3>
              
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-black">{activeConfidence}%</span>
                <span className="text-[9px] text-slate-400 mb-1 tracking-wider uppercase font-bold">
                  {L.confidenceSub}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1 tracking-wider">
                    <span>Database Verification Rate</span>
                    <span className="text-blue-400">Excellent</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${activeConfidence}%` }}></div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-3 py-1 bg-slate-900/50 rounded-r">
                  "DPDP compliant. Source: Karnataka State Police (KSP) CCTNS Server Node v4.2, structured cash transaction logs, and tower dump records."
                </div>
              </div>
            </div>

            {/* Selected suspect profile box - Super Detailed */}
            {selectedAccused && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    {L.accusedDetails}
                  </h3>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 font-black text-[9px] rounded-full uppercase">
                    Risk Score: {selectedAccused.riskScore}%
                  </span>
                </div>

                <div className="flex gap-4">
                  <img src={selectedAccused.photoUrl} alt={selectedAccused.name} className="w-18 h-18 rounded-lg object-cover border border-slate-300 shadow-inner shrink-0" />
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{selectedAccused.name}</h4>
                    <p className="text-xs text-red-600 font-bold">Alias: "{selectedAccused.alias || "None"}"</p>
                    <p className="text-[11px] text-slate-500">Age: {selectedAccused.age} | Gender: {selectedAccused.gender}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${selectedAccused.status === "Absconding" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {selectedAccused.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{L.modusOperandi}</p>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100 italic">
                      "{selectedAccused.modusOperandi}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-[9px] font-bold uppercase text-slate-400">Linked Phone</p>
                      <p className="font-semibold text-slate-800 font-mono mt-0.5">{selectedAccused.phoneNumber}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-[9px] font-bold uppercase text-slate-400">Linked Vehicle</p>
                      <p className="font-semibold text-slate-800 font-mono mt-0.5">{selectedAccused.vehicleNumber || "None"}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-red-50 text-red-950 rounded border border-red-100 flex items-center justify-between text-[11px] font-bold">
                    <span>Previous Criminal Record Counts:</span>
                    <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">{selectedAccused.previousConvictions} Convictions</span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Case / FIR summary details */}
            {selectedFIR && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Case Docket: {selectedFIR.firNumber}
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[9px] rounded-full">
                    {selectedFIR.policeStation.split(" ")[0]}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1 text-[11px]">
                    <span className="text-slate-400 font-bold">Category:</span>
                    <span className="font-bold text-slate-800">{selectedFIR.crimeCategory}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-slate-100 pb-1 text-[11px]">
                    <span className="text-slate-400 font-bold">IPC/BNS Sections:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedFIR.ipcSections}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1 text-[11px]">
                    <span className="text-slate-400 font-bold">Investigating Officer:</span>
                    <span className="font-semibold text-slate-800">{selectedFIR.investigatingOfficer}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100 italic leading-relaxed text-slate-600">
                    "{selectedFIR.description}"
                  </div>
                </div>
              </div>
            )}

            {/* Audit Snippet footer */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  {L.recentLogs}
                </span>
              </div>
              <div className="space-y-1.5">
                {auditLogs.slice(0, 2).map((log) => (
                  <p key={log.id} className="text-[10px] text-slate-600 truncate leading-tight">
                    • {new Date(log.timestamp).toLocaleTimeString()} - <strong>{log.userName}</strong> - {log.action}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="h-8 bg-slate-900 border-t border-slate-700 flex items-center justify-between px-8 shrink-0 z-10 text-[10px] text-slate-400 font-mono select-none">
        <div className="flex items-center gap-4 uppercase font-bold text-slate-500">
          <span>SESSION ENCRYPTED (AES-256)</span>
          <span className="text-slate-700">|</span>
          <span>NODE: BLR-042-S-SECURE</span>
          <span className="text-slate-700">|</span>
          <span className="text-emerald-500">{L.systemEncrypted}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-bold">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            {L.dbSynced}
          </span>
          <span className="text-slate-700">|</span>
          <span>KARNATAKA STATE POLICE © {currentTime.getFullYear()} | KSP SAHAYAK PORTAL V2.4</span>
        </div>
      </footer>

    </div>
  );
}
