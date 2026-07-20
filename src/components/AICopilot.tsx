import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  Sparkles, 
  Send, 
  Download, 
  ShieldAlert, 
  Brain, 
  Database, 
  CheckCircle2, 
  FileText, 
  HelpCircle 
} from "lucide-react";
import { User, FIR } from "../types";

interface AICopilotProps {
  currentUser: User;
  firs: FIR[];
  language?: "English" | "Kannada";
}

interface CopilotResponse {
  recommendations: string[];
  reasoning: string;
  confidence: number;
  evidence: string[];
}

const TRANSLATIONS = {
  English: {
    copilotTitle: "AI Investigation Copilot",
    tacticalIntelligence: "Tactical Intelligence",
    assistantNode: "Secured Officer Assistant Node // CCTNS Layer",
    officerAuthority: "Officer Authority",
    selectSuggested: "Select Suggested Tactical Focus",
    targetFir: "Target FIR Context Reference",
    selectActive: "-- Select Active FIR File --",
    inquireNatural: "Inquire Natural Language Instructions",
    placeholderInquire: "Ask details (e.g., 'What are the main financial risks for FIR/0082/2026?')",
    inputsLogged: "* Inputs are logged, audited, and encrypted in compliance with state surveillance procedures.",
    consultingCctns: "Consulting Neural CCTNS Database Node...",
    formulatingDirectives: "Formulating role-aware tactical directives",
    advisoryConfidence: "Advisory Confidence Level",
    basedOnEvidence: "Based on evidence count and suspect MO match density",
    exportAdvisory: "Export Advisory (PDF)",
    actionDirectives: "Tactical Action Directives",
    aiLogic: "Explainable AI Logic & Core Rationale",
    linkedContext: "Linked Context Sources",
    readyInquest: "Copilot Ready for Inquest",
    readyInquestDesc: "Select a suggested tactical focus or enter custom investigation goals to command the AI copilot engine.",
    disclaimer: "🛡️ End-to-end audit ledger encrypted",
    securityId: "Security ID: SEC-KSP-992A"
  },
  Kannada: {
    copilotTitle: "ಎಐ ತನಿಖಾ ಸಹಾಯಕ",
    tacticalIntelligence: "ಕಾರ್ಯತಂತ್ರದ ಗುಪ್ತಚರ",
    assistantNode: "ಸುರಕ್ಷಿತ ಅಧಿಕಾರಿ ಸಹಾಯಕ ನೋಡ್ // ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ಲೇಯರ್",
    officerAuthority: "ಅಧಿಕಾರಿಯ ಅಧಿಕಾರ",
    selectSuggested: "ಸೂಚಿಸಲಾದ ತನಿಖಾ ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ",
    targetFir: "ಗುರಿ ಎಫ್‌ಐಆರ್ ಸಂದರ್ಭದ ಉಲ್ಲೇಖ",
    selectActive: "-- ಸಕ್ರಿಯ ಎಫ್‌ಐಆರ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ --",
    inquireNatural: "ನೈಸರ್ಗಿಕ ಭಾಷೆಯ ಸೂಚನೆಗಳನ್ನು ಪ್ರಶ್ನಿಸಿ",
    placeholderInquire: "ವಿವರಗಳನ್ನು ಕೇಳಿ (ಉದಾಹರಣೆಗೆ: 'FIR/0082/2026 ರ ಪ್ರಮುಖ ಹಣಕಾಸು ಅಪಾಯಗಳು ಯಾವುವು?')",
    inputsLogged: "* ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಲಾಗ್ ಮಾಡಲಾಗುತ್ತದೆ, ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ರಾಜ್ಯ ಕಣ್ಗಾವಲು ಕಾರ್ಯವಿಧಾನಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗುತ್ತದೆ.",
    consultingCctns: "ನರ ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ಡೇಟಾಬೇಸ್ ನೋಡ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    formulatingDirectives: "ಪಾತ್ರ-ಜಾಗೃತ ಕಾರ್ಯತಂತ್ರದ ನಿರ್ದೇಶನಗಳನ್ನು ರೂಪಿಸಲಾಗುತ್ತಿದೆ",
    advisoryConfidence: "ಸಲಹೆ ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮಟ್ಟ",
    basedOnEvidence: "ಸಾಕ್ಷ್ಯಾಧಾರಗಳ ಸಂಖ್ಯೆ ಮತ್ತು ಶಂಕಿತರ ಎಂಒ ಹೊಂದಾಣಿಕೆಯ ಸಾಂದ್ರತೆಯ ಆಧಾರದ ಮೇಲೆ",
    exportAdvisory: "ಸಲಹೆ ರಫ್ತುಮಾಡಿ (PDF)",
    actionDirectives: "ಕಾರ್ಯತಂತ್ರದ ಕ್ರಮದ ನಿರ್ದೇಶನಗಳು",
    aiLogic: "ವಿವರಿಸಬಹುದಾದ ಎಐ ತಾರ್ಕಿಕ ವಿವರಣೆ",
    linkedContext: "ಸಂಪರ್ಕಿತ ಸಂದರ್ಭದ ಮೂಲಗಳು",
    readyInquest: "ತನಿಖೆಗೆ ಸಹಾಯಕ ಸಿದ್ಧವಾಗಿದೆ",
    readyInquestDesc: "ಎಐ ಕಾಪಿಲಟ್ ಎಂಜಿನ್ ಅನ್ನು ನಿಯಂತ್ರಿಸಲು ಸೂಚಿಸಲಾದ ತನಿಖಾ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಕಸ್ಟಮ್ ತನಿಖಾ ಗುರಿಗಳನ್ನು ನಮೂದಿಸಿ.",
    disclaimer: "🛡️ ಕೊನೆಯಿಂದ ಕೊನೆಯವರೆಗಿನ ಲೆಕ್ಕಪರಿಶೋಧನಾ ಲೆಡ್ಜರ್ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿದೆ",
    securityId: "ಭದ್ರತಾ ಐಡಿ: SEC-KSP-992A"
  }
};

export function AICopilot({ currentUser, firs, language = "English" }: AICopilotProps) {
  const [query, setQuery] = useState("");
  const [selectedFir, setSelectedFir] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopilotResponse | null>(null);

  const L = TRANSLATIONS[language];

  const suggestedPrompts = [
    {
      label: language === "Kannada" ? "ಫಿಶಿಂಗ್ ಮುಂದಿನ ಹಂತಗಳು" : "Phishing Next Steps",
      text: language === "Kannada" ? "ಸೈಬರ್ ಫಿಶಿಂಗ್ ಪ್ರಕರಣ FIR/0045/2026 ಕ್ಕೆ ಮುಂದಿನ ತಂತ್ರಗಳನ್ನು ರೂಪಿಸಿ" : "Generate tactical next steps for cyber phishing case FIR/0045/2026",
      fir: "FIR/0045/2026"
    },
    {
      label: language === "Kannada" ? "ಮೂಲ್ ಖಾತೆಯ ಜಾಡು" : "Mule Account Trail",
      text: language === "Kannada" ? "ಚಿನ್ನದ ಪೋಂಜಿ FIR/0082/2026 ಕ್ಕೆ ಲಿಂಕ್ ಮಾಡಲಾದ ಶೆಲ್ ಖಾತೆಗಳ ವಹಿವಾಟುಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ" : "Analyze transaction trails for potential shell mule accounts linked to Gold Ponzi FIR/0082/2026",
      fir: "FIR/0082/2026"
    },
    {
      label: language === "Kannada" ? "ಸಶಸ್ತ್ರ ದರೋಡೆ ಸುಳಿವುಗಳು" : "Armed Robbery Leads",
      text: language === "Kannada" ? "ಮೆಜೆಸ್ಟಿಕ್ ಸಶಸ್ತ್ರ ದರೋಡೆ ಪ್ರಕರಣ FIR/0112/2026 ಕ್ಕೆ ವಾಹನ ಪತ್ತೆ ಮಾದರಿಗಳನ್ನು ರಚಿಸಿ" : "Generate vehicle tracing search patterns for Majestic armed robbery FIR/0112/2026",
      fir: "FIR/0112/2026"
    }
  ];

  const handlePromptSelect = (prompt: typeof suggestedPrompts[0]) => {
    setQuery(prompt.text);
    setSelectedFir(prompt.fir);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          firNumber: selectedFir,
          user: currentUser,
          language
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error calling copilot API:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    // Official Karnataka State Police Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("KARNATAKA STATE POLICE", 105, 15, { align: "center" });
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("CRIME INVESTIGATION DIVISION - TACTICAL CO-PILOT ADVISORY", 105, 22, { align: "center" });
    doc.text("STRICTLY CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE", 105, 28, { align: "center" });

    // Date & Officer Details
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text("REPORT METADATA:", 15, 50);
    doc.setFont("Helvetica", "normal");
    doc.text(`Generated By: ${currentUser.name} (${currentUser.role})`, 15, 56);
    doc.text(`Badge Identifier: ${currentUser.badgeId}`, 15, 62);
    doc.text(`Reference Unit: Karnataka State Police Command HQ`, 15, 68);
    doc.text(`Target FIR Record: ${selectedFir || "General Intelligence Query"}`, 15, 74);
    doc.text(`System Generation Time: ${new Date().toUTCString()}`, 15, 80);

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 86, 195, 86);

    // Advisory Recommendations
    doc.setFont("Helvetica", "bold");
    doc.text("TACTICAL ADVISORY RECOMMENDATIONS:", 15, 96);
    doc.setFont("Helvetica", "normal");
    
    let yOffset = 104;
    result.recommendations.forEach((rec, idx) => {
      const splitRec = doc.splitTextToSize(`${idx + 1}. ${rec}`, 180);
      splitRec.forEach((line: string) => {
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(line, 15, yOffset);
        yOffset += 6;
      });
      yOffset += 2;
    });

    // Reasoning
    yOffset += 4;
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
    }
    doc.setFont("Helvetica", "bold");
    doc.text("INVESTIGATION REASONING LOGIC & ANALYSIS:", 15, yOffset);
    doc.setFont("Helvetica", "normal");
    yOffset += 8;

    const splitReasoning = doc.splitTextToSize(result.reasoning, 180);
    splitReasoning.forEach((line: string) => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(line, 15, yOffset);
      yOffset += (splitReasoning.length * 6) + 2;
    });

    yOffset += 4;
    doc.setFont("Helvetica", "bold");
    doc.text("SUPPORTING EVIDENCE & DATA REFERENCES:", 15, yOffset);
    doc.setFont("Helvetica", "normal");
    yOffset += 6;
    doc.text(result.evidence.join(" | "), 15, yOffset);

    // Official Footer Sign-off
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This document is generated by an authorized AI node and validated against CCTNS databases.", 105, 285, { align: "center" });

    doc.save(`KSP_Copilot_Briefing_${selectedFir || "General"}.pdf`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="copilot-panel">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {L.copilotTitle}
              <span className="px-2 py-0.5 text-[9px] font-black bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 tracking-wider uppercase">
                {L.tacticalIntelligence}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">{L.assistantNode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          {L.officerAuthority}: <span className="text-white font-bold">{currentUser.role}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Side: Prompts & Inputs */}
        <div className="col-span-12 lg:col-span-5 p-5 border-r border-slate-800 flex flex-col justify-between overflow-y-auto bg-slate-950/40">
          <div className="space-y-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {L.selectSuggested}
              </label>
              <div className="space-y-2">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptSelect(p)}
                    className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs transition-all flex flex-col gap-1 text-slate-300 group"
                  >
                    <span className="font-bold text-blue-400 flex items-center justify-between">
                      {p.label}
                      <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">{language === "Kannada" ? "ಅನ್ವಯಿಸು" : "Apply"} &rarr;</span>
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-2">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                {L.targetFir}
              </label>
              <select
                value={selectedFir}
                onChange={(e) => setSelectedFir(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="">{L.selectActive}</option>
                {firs.map(f => (
                  <option key={f.id} value={f.firNumber}>
                    {f.firNumber} - {f.crimeCategory} ({f.policeStation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleQuerySubmit} className="mt-5 pt-4 border-t border-slate-800">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              {L.inquireNatural}
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={L.placeholderInquire}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2.5 bottom-3 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-1.5 italic text-justify leading-normal">
              {L.inputsLogged}
            </p>
          </form>
        </div>

        {/* Right Side: Copilot Intelligence Response Area */}
        <div className="col-span-12 lg:col-span-7 p-5 flex flex-col justify-between overflow-y-auto bg-slate-900/40">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-300">{L.consultingCctns}</p>
                <p className="text-[10px] text-slate-500">{L.formulatingDirectives}</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 flex-1 animate-fadeIn">
              {/* Score & Header info */}
              <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border font-bold text-sm ${
                    result.confidence >= 90 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {result.confidence}%
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{L.advisoryConfidence}</h3>
                    <p className="text-[10px] text-slate-500 leading-tight">{L.basedOnEvidence}</p>
                  </div>
                </div>

                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  {L.exportAdvisory}
                </button>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {L.actionDirectives}
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-slate-950/25 border border-slate-800 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-300">
                      <span className="font-bold text-blue-400 shrink-0">{index + 1}.</span>
                      <p className="text-justify">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI Reasoning */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-blue-400" />
                  {L.aiLogic}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">{result.reasoning}</p>
              </div>

              {/* Evidence references */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  {L.linkedContext}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.evidence.map((ev, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-400 font-bold">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="p-4 bg-slate-950/60 rounded-full border border-slate-800 text-slate-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="max-w-[340px] space-y-1">
                <h4 className="text-xs font-bold text-slate-300">{L.readyInquest}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {L.readyInquestDesc}
                </p>
              </div>
            </div>
          )}

          {/* Secure disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
            <span>{L.disclaimer}</span>
            <span>{L.securityId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
