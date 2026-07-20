import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  Download, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckSquare, 
  ShieldCheck, 
  ChevronRight, 
  Users, 
  Database 
} from "lucide-react";
import { FIR, User, UserRole } from "../types";

interface CaseSummaryProps {
  currentUser: User;
  firs: FIR[];
  language?: "English" | "Kannada";
}

interface CaseReport {
  executiveSummary: string;
  caseOverview: string;
  firDetails: {
    firNumber: string;
    dateFiled: string;
    policeStation: string;
    ipcSections: string;
    description: string;
  };
  suspectAnalysis: string;
  victimAnalysis: string;
  evidenceCollected: string;
  missingEvidence: string;
  investigationProgress: string;
  riskAssessment: string;
  recommendedNextActions: string[];
  probabilityOfConviction: number;
  courtReadinessScore: number;
}

const TRANSLATIONS = {
  English: {
    title: "AI Case Docket Generator",
    subtitle: "Court-Ready Prosecution Briefs",
    selectFirLabel: "Select Case FIR Number",
    selectPlaceholder: "-- Select Target FIR file --",
    generateBtn: "Generate Court Brief",
    generating: "Synthesizing legal intelligence brief...",
    courtReadiness: "Court Readiness Score",
    probabilityOfConviction: "Probability of Conviction",
    riskAssessment: "Risk Assessment",
    executiveSummary: "Executive Summary",
    caseOverview: "Case Operational Overview",
    accusedAnalysis: "Accused Suspect Analysis",
    victimStatements: "Victim Statement Records",
    evidenceCollected: "Physical & Digital Evidence",
    missingEvidence: "Missing Evidence Checklist",
    investigationProgress: "Investigation Progress",
    recommendedActions: "Recommended Next Actions",
    convictionRate: "Estimated Conviction Rate",
    evidenceIntegrity: "Evidence Integrity Score",
    auditInsight: "Audit Insight:",
    riskClassification: "Risk classification is cataloged as:",
    supervisorSignOff: "Supervisor Sign-Off",
    docketAuthorized: "Docket Authorized",
    authorizedBy: "Authorized by Supervisor:",
    digitalStampApplied: "Digital stamp applied to file block registry.",
    signOffNotice: "Only Authorized Supervisor or Admin accounts can sign off on CCTNS briefs before court compilation.",
    authorizeBtn: "Authorize & Stamp Dossier",
    readOnlyNotice: "🔒 Read-only access: Your currently logged-in profile role does not hold case sign-off authorization.",
    exportBtn: "Export Brief as PDF",
    workspaceReady: "Dossier Workspace Ready",
    workspaceReadyDesc: "Choose an active FIR investigation file from the dropdown above to auto-synthesize a prosecution brief for magistrates and courts."
  },
  Kannada: {
    title: "ಎಐ ಕೇಸ್ ಡಾಕೆಟ್ ಜನರೇಟರ್",
    subtitle: "ನ್ಯಾಯಾಲಯಕ್ಕೆ ಸಿದ್ಧವಾಗಿರುವ ಪ್ರಾಸಿಕ್ಯೂಷನ್ ಬ್ರೀಫ್ಗಳು",
    selectFirLabel: "ಪ್ರಕರಣದ ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectPlaceholder: "-- ಗುರಿ ಎಫ್‌ಐಆರ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ --",
    generateBtn: "ನ್ಯಾಯಾಲಯದ ಬ್ರೀಫ್ ರಚಿಸಿ",
    generating: "ಕಾನೂನು ಮಾಹಿತಿಯ ಸಾರಾಂಶವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
    courtReadiness: "ನ್ಯಾಯಾಲಯದ ಸಿದ್ಧತೆಯ ಅಂಕ",
    probabilityOfConviction: "ಶಿಕ್ಷೆಯಾಗುವ ಸಂಭವನೀಯತೆ",
    riskAssessment: "ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ",
    executiveSummary: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ",
    caseOverview: "ಪ್ರಕರಣದ ಕಾರ್ಯಾಚರಣೆಯ ಅವಲೋಕನ",
    accusedAnalysis: "ಆರೋಪಿ/ಶಂಕಿತರ ವಿಶ್ಲೇಷಣೆ",
    victimStatements: "ದೂರುದಾರರ ಹೇಳಿಕೆಗಳ ದಾಖಲೆಗಳು",
    evidenceCollected: "ಭೌತಿಕ ಮತ್ತು ಡಿಜಿಟಲ್ ಪುರಾವೆಗಳು",
    missingEvidence: "ಕಾಣೆಯಾದ ಪುರಾವೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    investigationProgress: "ತನಿಖೆಯ ಪ್ರಗತಿ",
    recommendedActions: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಮುಂದಿನ ಕ್ರಮಗಳು",
    convictionRate: "ಅಂದಾಜು ಶಿಕ್ಷೆಯಾಗುವ ದರ",
    evidenceIntegrity: "ಸಾಕ್ಷ್ಯಾಧಾರಗಳ ಸಮಗ್ರತೆಯ ಅಂಕ",
    auditInsight: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ಮಾಹಿತಿ:",
    riskClassification: "ಅಪಾಯದ ವರ್ಗೀಕರಣವನ್ನು ಹೀಗೆ ದಾಖಲಿಸಲಾಗಿದೆ:",
    supervisorSignOff: "ಮೇಲ್ವಿಚಾರಕರ ಅನುಮೋದನೆ",
    docketAuthorized: "ಡಾಕೆಟ್ ಅಧಿಕೃತಗೊಂಡಿದೆ",
    authorizedBy: "ಮೇಲ್ವಿಚಾರಕರಿಂದ ಅಧಿಕೃತಗೊಂಡಿದೆ:",
    digitalStampApplied: "ಫೈಲ್ ಬ್ಲಾಕ್ ನೋಂದಣಿಗೆ ಡಿಜಿಟಲ್ ಮುದ್ರೆ ಅನ್ವಯಿಸಲಾಗಿದೆ.",
    signOffNotice: "ನ್ಯಾಯಾಲಯದ ಸಂಕಲನಕ್ಕೆ ಮುನ್ನ ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ಬ್ರೀಫ್‌ಗಳನ್ನು ಅನುಮೋದಿಸಲು ಅಧಿಕೃತ ಮೇಲ್ವಿಚಾರಕ ಅಥವಾ ನಿರ್ವಾಹಕ ಖಾತೆಗಳಿಗೆ ಮಾತ್ರ ಅನುಮತಿಯಿದೆ.",
    authorizeBtn: "ದೊಸ್ಸಿಯರ್ ಅನ್ನು ಅಧಿಕೃತಗೊಳಿಸಿ ಮತ್ತು ಮುದ್ರೆ ಒತ್ತಿ",
    readOnlyNotice: "🔒 ಓದಲು ಮಾತ್ರ ಪ್ರವೇಶ: ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಲಾಗಿನ್ ಆಗಿರುವ ಪ್ರೊಫೈಲ್ ಪಾತ್ರವು ಕೇಸ್ ಅನುಮೋದನೆ ಅಧಿಕಾರವನ್ನು ಹೊಂದಿಲ್ಲ.",
    exportBtn: "ವರದಿಯನ್ನು PDF ಆಗಿ ರಫ್ತುಮಾಡಿ",
    workspaceReady: "ದೊಸ್ಸಿಯರ್ ಕಾರ್ಯಸ್ಥಳ ಸಿದ್ಧವಾಗಿದೆ",
    workspaceReadyDesc: "ನ್ಯಾಯಾಧೀಶರು ಮತ್ತು ನ್ಯಾಯಾಲಯಗಳಿಗೆ ಪ್ರಾಸಿಕ್ಯೂಷನ್ ಬ್ರೀಫ್ ಅನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಂಶ್ಲೇಷಿಸಲು ಮೇಲಿನ ಡ್ರಾಪ್‌ಡೌನ್‌ನಿಂದ ಸಕ್ರಿಯ ಎಫ್‌ಐಆರ್ ತನಿಖಾ ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ."
  }
};

export function CaseSummaryGenerator({ currentUser, firs, language = "English" }: CaseSummaryProps) {
  const [selectedFirNumber, setSelectedFirNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<CaseReport | null>(null);
  const [approvedBySupervisor, setApprovedBySupervisor] = useState<boolean>(false);
  const [supervisorName, setSupervisorName] = useState<string>("");

  const L = TRANSLATIONS[language];

  const handleGenerateSummary = async () => {
    if (!selectedFirNumber) return;

    setLoading(true);
    setReport(null);
    setApprovedBySupervisor(false);

    try {
      const response = await fetch("/api/case-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firNumber: selectedFirNumber,
          user: currentUser,
          language
        })
      });
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("Error generating case summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupervisorApproval = () => {
    if (currentUser.role !== UserRole.SUPERVISOR && currentUser.role !== UserRole.ADMIN) {
      alert(language === "Kannada" 
        ? "ಅನಧಿಕೃತ: ಕೇವಲ ಮೇಲ್ವಿಚಾರಕ ಖಾತೆಗಳಿಗೆ ಮಾತ್ರ ಕಾನೂನು ಸಂಶ್ಲೇಷಣೆ ಅನುಮೋದಿಸಲು ಅವಕಾಶವಿದೆ." 
        : "Unauthorized: Only supervisor profiles are permitted to authorize legal briefs.");
      return;
    }
    setApprovedBySupervisor(true);
    setSupervisorName(currentUser.name);
  };

  const handleExportPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    
    // Legal style document header
    doc.setFillColor(248, 250, 252); // soft grey bg
    doc.rect(0, 0, 210, 297, "F");

    doc.setDrawColor(15, 23, 42); // dark slate line
    doc.setLineWidth(1);
    doc.line(10, 10, 200, 10);
    doc.line(10, 10, 10, 287);
    doc.line(200, 10, 200, 287);
    doc.line(10, 287, 200, 287);

    // Letterhead text
    doc.setTextColor(15, 23, 42);
    doc.setFont("Courier", "bold");
    doc.setFontSize(14);
    doc.text("KARNATAKA STATE POLICE DEPARTMENT", 105, 22, { align: "center" });
    
    doc.setFont("Courier", "normal");
    doc.setFontSize(9);
    doc.text("COURT-READY CASE RECORD DOSSIER // CCTNS SYNC MODULE", 105, 28, { align: "center" });
    doc.text("----------------------------------------------------------------------", 105, 33, { align: "center" });

    // Summary block
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("CASE METADATA DOCKET:", 18, 42);
    
    doc.setFont("Helvetica", "normal");
    doc.text(`FIR REF NUMBER : ${report.firDetails.firNumber}`, 18, 48);
    doc.text(`DATE REGISTERED: ${report.firDetails.dateFiled}`, 18, 54);
    doc.text(`POLICE STATION : ${report.firDetails.policeStation}`, 18, 60);
    doc.text(`LEGAL STATUTES : ${report.firDetails.ipcSections}`, 18, 66);

    doc.setDrawColor(200, 200, 200);
    doc.line(18, 72, 192, 72);

    // Section: Executive Summary
    doc.setFont("Helvetica", "bold");
    doc.text("I. EXECUTIVE SUMMARY", 18, 80);
    doc.setFont("Helvetica", "normal");
    const splitExec = doc.splitTextToSize(report.executiveSummary, 172);
    doc.text(splitExec, 18, 86);

    let y = 86 + (splitExec.length * 5) + 6;

    // Section: Case Overview & Description
    doc.setFont("Helvetica", "bold");
    doc.text("II. INVESTIGATIVE FILE OVERVIEW", 18, y);
    doc.setFont("Helvetica", "normal");
    y += 6;
    const splitDesc = doc.splitTextToSize(report.firDetails.description, 172);
    doc.text(splitDesc, 18, y);

    y += (splitDesc.length * 5) + 6;

    // Section: Suspect & Evidence Analytics
    doc.setFont("Helvetica", "bold");
    doc.text("III. ACCUSED & FORENSIC METRICS", 18, y);
    doc.setFont("Helvetica", "normal");
    y += 6;
    doc.text(`Suspect Profile: ${report.suspectAnalysis}`, 18, y);
    y += 6;
    doc.text(`Evidence Collected: ${report.evidenceCollected}`, 18, y);
    y += 6;
    doc.text(`Missing Critical Material: ${report.missingEvidence}`, 18, y);

    y += 12;

    // Probability & Conviction
    doc.setFont("Helvetica", "bold");
    doc.text(`IV. COURT PROSECUTION READINESS AUDIT`, 18, y);
    doc.setFont("Helvetica", "normal");
    y += 6;
    doc.text(`Probability of Conviction Score : ${report.probabilityOfConviction}%`, 18, y);
    y += 6;
    doc.text(`Court Evidence Readiness Score   : ${report.courtReadinessScore}%`, 18, y);
    y += 6;
    doc.text(`Security Flight Risk Profile     : ${report.riskAssessment}`, 18, y);

    y += 12;

    // Section: Recommendations
    doc.setFont("Helvetica", "bold");
    doc.text("V. REQUIRED INVESTIGATION PROGRESS COMMANDS", 18, y);
    doc.setFont("Helvetica", "normal");
    y += 6;
    report.recommendedNextActions.forEach((action, idx) => {
      doc.text(`- ${action}`, 18, y);
      y += 6;
    });

    y += 8;
    // Sign-off status
    doc.setFont("Helvetica", "bold");
    doc.text("VI. ADMINISTRATIVE SIGN-OFF", 18, y);
    doc.setFont("Helvetica", "normal");
    y += 6;
    if (approvedBySupervisor) {
      doc.text(`BRIEF STATUS: [AUTHORIZED] Approved By Supervisor: ${supervisorName}`, 18, y);
    } else {
      doc.text("BRIEF STATUS: [PENDING REVIEW] Awaiting Supervisor Clearance.", 18, y);
    }

    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(`Document digital footprint verification hash: KSP-MD5-E938A-${report.firDetails.firNumber.replace(/\//g,"-")}`, 105, 280, { align: "center" });

    doc.save(`KSP_Court_Docket_${report.firDetails.firNumber.replace(/\//g,"-")}.pdf`);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" id="case-summary-panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          {L.title}
        </span>
        <span className="text-[10px] text-slate-500 font-bold">{L.subtitle}</span>
      </div>

      {/* Select Box Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1.5 block">
            {L.selectFirLabel}
          </label>
          <select
            value={selectedFirNumber}
            onChange={(e) => setSelectedFirNumber(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none shadow-inner"
          >
            <option value="">{L.selectPlaceholder}</option>
            {firs.map(f => (
              <option key={f.id} value={f.firNumber}>
                {f.firNumber} - {f.crimeCategory} ({f.policeStation})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={loading || !selectedFirNumber}
          className="md:mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{L.generating}</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>{L.generateBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50/30">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold">{L.generating}</p>
          </div>
        ) : report ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
            {/* Left side: Report fields */}
            <div className="lg:col-span-8 space-y-4">
              {/* Executive Summary */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  {L.executiveSummary}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">{report.executiveSummary}</p>
              </div>

              {/* Case Operational Overview */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {L.caseOverview}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">{report.caseOverview}</p>
              </div>

              {/* Suspect & Victim Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    {L.accusedAnalysis}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{report.suspectAnalysis}</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    {L.victimStatements}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{report.victimAnalysis}</p>
                </div>
              </div>

              {/* Physical & Digital Evidence */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-500" />
                  {L.evidenceCollected}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">{report.evidenceCollected}</p>
              </div>

              {/* Missing Evidence Checklist */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-red-800 border-b border-red-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                  {L.missingEvidence}
                </h4>
                <p className="text-xs text-red-700 leading-relaxed text-justify bg-red-50/40 p-3 rounded-lg border border-red-100/50">{report.missingEvidence}</p>
              </div>

              {/* Chronological Investigation Progress */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                  {L.investigationProgress}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">{report.investigationProgress}</p>
              </div>

              {/* Suggested Next Steps */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">
                  {L.recommendedActions}
                </h4>
                <ul className="space-y-2">
                  {report.recommendedNextActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: Summary audit widgets & actions */}
            <div className="lg:col-span-4 space-y-5">
              {/* Analytics Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-100">
                  {language === "Kannada" ? "ಪ್ರಾಸಿಕ್ಯೂಷನ್ ವಿಶ್ಲೇಷಣೆ" : "Prosecution Audit Summary"}
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-bold">{L.convictionRate}</span>
                      <span className="text-emerald-600 font-extrabold">{report.probabilityOfConviction}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${report.probabilityOfConviction}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-bold">{L.evidenceIntegrity}</span>
                      <span className="text-blue-600 font-extrabold">{report.courtReadinessScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${report.courtReadinessScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">{L.auditInsight}</p>
                  <p>{L.riskClassification} <span className="font-bold text-red-600">{report.riskAssessment}</span>.</p>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  {L.supervisorSignOff}
                </h3>

                {approvedBySupervisor ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl space-y-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-wider">{L.docketAuthorized}</p>
                    <p className="text-xs font-bold leading-snug">
                      {L.authorizedBy} {supervisorName}
                    </p>
                    <p className="text-[9px] text-emerald-600">{L.digitalStampApplied}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed text-justify">
                      {L.signOffNotice}
                    </p>
                    {currentUser.role === UserRole.SUPERVISOR || currentUser.role === UserRole.ADMIN ? (
                      <button
                        onClick={handleSupervisorApproval}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        {L.authorizeBtn}
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700 font-bold leading-tight">
                        🔒 Read-only access: {language === "Kannada" 
                          ? `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಲಾಗಿನ್ ಆಗಿರುವ ಪಾತ್ರವು (${currentUser.role}) ಅನುಮೋದಿಸುವ ಅಧಿಕಾರ ಹೊಂದಿಲ್ಲ.` 
                          : `Your currently logged-in profile role (${currentUser.role}) does not hold case sign-off authorization.`}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Download Controls */}
              <button
                onClick={handleExportPDF}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
              >
                <Download className="w-4 h-4" />
                {L.exportBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-24 max-w-sm mx-auto">
            <div className="p-4 bg-white rounded-full border border-slate-200 text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">{L.workspaceReady}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {L.workspaceReadyDesc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
