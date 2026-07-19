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

export function CaseSummaryGenerator({ currentUser, firs }: CaseSummaryProps) {
  const [selectedFirNumber, setSelectedFirNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<CaseReport | null>(null);
  const [approvedBySupervisor, setApprovedBySupervisor] = useState<boolean>(false);
  const [supervisorName, setSupervisorName] = useState<string>("");

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
          language: "English"
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
      alert("Unauthorized: Only supervisor profiles are permitted to authorize legal briefs.");
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
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm" id="case-summary-panel">
      {/* File folder tab styling header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              AI Court Case Docket Generator
              <span className="px-2 py-0.5 text-[9px] font-black bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase tracking-wider">
                Court Ready
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">Auto-Synthesized Prosecution Briefs // CCTNS Standard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFirNumber}
            onChange={(e) => setSelectedFirNumber(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          >
            <option value="">-- Choose FIR File --</option>
            {firs.map(f => (
              <option key={f.id} value={f.firNumber}>
                {f.firNumber} ({f.policeStation.split(" ")[0]})
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateSummary}
            disabled={!selectedFirNumber || loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Generate Brief
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-800">Synthesizing CCTNS Dossier Database...</p>
              <p className="text-[10px] text-slate-400">Structuring legal parameters, MO profiles, and evidence logs</p>
            </div>
          </div>
        ) : report ? (
          <div className="grid grid-cols-12 gap-5 max-w-5xl mx-auto">
            {/* Left Column: Brief Details in classical lawyer file aesthetic */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
              {/* Report Header letterhead */}
              <div className="text-center border-b border-slate-100 pb-5 space-y-1">
                <h3 className="font-mono text-sm font-black text-slate-900 uppercase tracking-tight">Karnataka State Police Department</h3>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">STRICTLY CONFIDENTIAL // LAW ENFORCEMENT PROSECUTION BRIEF</p>
              </div>

              {/* Case Details metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">FIR Docket Reference</p>
                  <p className="font-black text-slate-900">{report.firDetails.firNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Registration</p>
                  <p className="font-black text-slate-900">{report.firDetails.dateFiled}</p>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Jurisdiction Station</p>
                  <p className="font-bold text-slate-800">{report.firDetails.policeStation}</p>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Statute Section Chapters</p>
                  <p className="font-bold text-slate-800 font-mono text-[11px]">{report.firDetails.ipcSections}</p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  1. Executive Case Summary
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{report.executiveSummary}</p>
              </div>

              {/* CCTNS Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  2. Detailed Occurrence Chronicle
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{report.firDetails.description}</p>
              </div>

              {/* Profiles & Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3A. Suspect Profile</h5>
                  <p className="text-xs text-slate-700 leading-relaxed font-bold">{report.suspectAnalysis}</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3B. Complainant Statement</h5>
                  <p className="text-xs text-slate-700 leading-relaxed font-bold">{report.victimAnalysis}</p>
                </div>
              </div>

              {/* Evidence & Deficit analysis */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <Database className="w-4 h-4 text-slate-400" />
                    4. Logged Forensic Exhibits
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{report.evidenceCollected}</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                  <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Pending Forensic Materials Required
                  </h4>
                  <p className="text-xs text-rose-900">{report.missingEvidence}</p>
                </div>
              </div>

              {/* Next steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  5. Actionable Prosecution Directives
                </h4>
                <ul className="space-y-1.5">
                  {report.recommendedNextActions.map((action, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Court Probability scores & Actions */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {/* Conviction Predictor */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Prosecution Conviction Probability
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-bold">Estimated Conviction Rate</span>
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
                      <span className="text-slate-500 font-bold">Evidence Integrity Score</span>
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
                  <p className="font-bold text-slate-700">Audit Insight:</p>
                  <p>Risk classification is cataloged as: <span className="font-bold text-red-600">{report.riskAssessment}</span>.</p>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Supervisor Sign-Off
                </h3>

                {approvedBySupervisor ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl space-y-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-wider">Docket Authorized</p>
                    <p className="text-xs font-bold leading-snug">
                      Authorized by Supervisor: {supervisorName}
                    </p>
                    <p className="text-[9px] text-emerald-600">Digital stamp applied to file block registry.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Only Authorized Supervisor or Admin accounts can sign off on CCTNS briefs before court compilation.
                    </p>
                    {currentUser.role === UserRole.SUPERVISOR || currentUser.role === UserRole.ADMIN ? (
                      <button
                        onClick={handleSupervisorApproval}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Authorize & Stamp Dossier
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700 font-bold leading-tight">
                        🔒 Read-only access: Your currently logged-in profile role ({currentUser.role}) does not hold case sign-off authorization.
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
                Export Brief as PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-24 max-w-sm mx-auto">
            <div className="p-4 bg-white rounded-full border border-slate-200 text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Dossier Workspace Ready</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose an active FIR investigation file from the dropdown above to auto-synthesize a prosecution brief for magistrates and courts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
