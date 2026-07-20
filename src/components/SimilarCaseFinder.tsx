import React, { useState } from "react";
import { 
  Search, 
  Layers, 
  GitMerge, 
  Sliders, 
  Link2, 
  Eye, 
  AlertOctagon, 
  ArrowLeftRight 
} from "lucide-react";
import { FIR } from "../types";

interface SimilarCaseFinderProps {
  firs: FIR[];
  language?: "English" | "Kannada";
}

interface SimilarCaseResult {
  id: string;
  firNumber: string;
  crimeCategory: string;
  subCategory: string;
  policeStation: string;
  dateFiled: string;
  status: string;
  similarityPercentage: number;
  sharedCharacteristics: string[];
  commonLocations: string[];
  commonSuspects: string[];
  outcome: string;
}

const TRANSLATIONS = {
  English: {
    title: "CCTNS Similar Case Finder",
    badge: "MO Linkage",
    subtitle: "Modus Operandi Correlation Matrix // Advanced Identity Analytics",
    choosePlaceholder: "-- Choose Base FIR file --",
    findMatches: "Find Matches",
    querying: "Querying identity networks and crime MO vectors...",
    resultsListTitle: "Similar Records List",
    clickMatch: "Click Find Matches to search similarity grids.",
    selectBase: "Select a base FIR file above to run identity & MO comparisons.",
    analysisTip: "Analysis Tip:",
    analysisTipDesc: "Matches above 75% indicate a very high probability of being committed by the same individual or organized syndicate.",
    sideBySideTitle: "Interactive Side-by-Side Verification",
    primaryBaseCase: "Primary Base Case",
    matchedRecordCase: "Matched Record Case",
    linkageBreakdown: "Modus Operandi Linkage Breakdown",
    commonJurisdictions: "Common Jurisdictions",
    commonSuspects: "Common Suspect Aliases",
    noRecordSelected: "No record selected for verification. Click \"Compare\" on any item in the left list to see split comparison analytics.",
    secureCctnsLink: "🔒 Secure CCTNS Linkage Core",
    compareBtn: "Compare"
  },
  Kannada: {
    title: "ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ಹೋಲುವ ಪ್ರಕರಣಗಳ ಶೋಧಕ",
    badge: "ಎಂಒ ಸಂಪರ್ಕ",
    subtitle: "ಕಾರ್ಯಾಚರಣೆಯ ವಿಧಾನದ ಸಹಸಂಬಂಧ ಮ್ಯಾಟ್ರಿಕ್ಸ್ // ಸುಧಾರಿತ ಗುರುತು ವಿಶ್ಲೇಷಣೆ",
    choosePlaceholder: "-- ಮೂಲ ಎಫ್‌ಐಆರ್ ಆಯ್ಕೆಮಾಡಿ --",
    findMatches: "ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಿ",
    querying: "ಗುರುತಿನ ಜಾಲಗಳು ಮತ್ತು ಅಪರಾಧದ ಎಂಒ ವೆಕ್ಟರ್‌ಗಳನ್ನು ಪ್ರಶ್ನಿಸಲಾಗುತ್ತಿದೆ...",
    resultsListTitle: "ಹೋಲುವ ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
    clickMatch: "ಹೋಲಿಕೆಯ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಲು ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಿ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    selectBase: "ಗುರುತು ಮತ್ತು ಎಂಒ ಹೋಲಿಕೆಗಳನ್ನು ನಡೆಸಲು ಮೂಲ ಎಫ್‌ಐಆರ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.",
    analysisTip: "ವಿಶ್ಲೇಷಣಾ ಸಲಹೆ:",
    analysisTipDesc: "೭೫% ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಹೊಂದಾಣಿಕೆಯು ಒಂದೇ ವ್ಯಕ್ತಿ ಅಥವಾ ಸಂಘಟಿತ ಗ್ಯಾಂಗ್‌ನಿಂದ ಅಪರಾಧ ನಡೆದಿದೆ ಎಂಬುದರ ಬಲವಾದ ಸೂಚನೆಯಾಗಿದೆ.",
    sideBySideTitle: "ಸಂವಾದಾತ್ಮಕ ಪಕ್ಕ-ಪಕ್ಕದ ಪರಿಶೀಲನೆ",
    primaryBaseCase: "ಪ್ರಾಥಮಿಕ ಮೂಲ ಪ್ರಕರಣ",
    matchedRecordCase: "ಹೊಂದಾಣಿಕೆಯಾದ ದಾಖಲೆ ಪ್ರಕರಣ",
    linkageBreakdown: "ಕಾರ್ಯಾಚರಣೆಯ ವಿಧಾನದ ಲಿಂಕೇಜ್ ವಿವರ",
    commonJurisdictions: "ಸಾಮಾನ್ಯ ನ್ಯಾಯವ್ಯಾಪ್ತಿಗಳು",
    commonSuspects: "ಸಾಮಾನ್ಯ ಶಂಕಿತ ಅಲಿಯಾಸ್ಗಳು",
    noRecordSelected: "ಪರಿಶೀಲನೆಗಾಗಿ ಯಾವುದೇ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ. ಪಕ್ಕ-ಪಕ್ಕದ ಹೋಲಿಕೆಗಾಗಿ ಎಡ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಯಾವುದೇ ಐಟಂ ಮೇಲೆ \"ಹೋಲಿಸಿ\" ಕ್ಲಿಕ್ ಮಾಡಿ.",
    secureCctnsLink: "🔒 ಸುರಕ್ಷಿತ ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ಸಂಪರ್ಕ ಕೋರ್",
    compareBtn: "ಹೋಲಿಸಿ"
  }
};

export function SimilarCaseFinder({ firs, language = "English" }: SimilarCaseFinderProps) {
  const [selectedSourceFir, setSelectedSourceFir] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SimilarCaseResult[]>([]);
  const [compareCase, setCompareCase] = useState<SimilarCaseResult | null>(null);

  const L = TRANSLATIONS[language];

  const handleFindSimilar = async () => {
    if (!selectedSourceFir) return;

    setLoading(true);
    setResults([]);
    setCompareCase(null);

    try {
      const response = await fetch("/api/similar-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firNumber: selectedSourceFir })
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching similar cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSourceFirDetails = () => {
    return firs.find(f => f.firNumber === selectedSourceFir);
  };

  const sourceFir = getSourceFirDetails();

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="similarity-panel">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {L.title}
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 uppercase tracking-wider">
                {L.badge}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">{L.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSourceFir}
            onChange={(e) => {
              setSelectedSourceFir(e.target.value);
              setResults([]);
              setCompareCase(null);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">{L.choosePlaceholder}</option>
            {firs.map(f => (
              <option key={f.id} value={f.firNumber}>
                {f.firNumber} - {f.crimeCategory}
              </option>
            ))}
          </select>
          <button
            onClick={handleFindSimilar}
            disabled={!selectedSourceFir || loading}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            {L.findMatches}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-slate-950/40">
        {/* Left Column: Results List */}
        <div className="col-span-12 lg:col-span-6 p-5 border-r border-slate-800 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              {L.resultsListTitle}
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <div className="w-8 h-8 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400">{L.querying}</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => setCompareCase(item)}
                    className={`p-4 border rounded-xl cursor-pointer hover:bg-slate-900/60 transition-all flex justify-between items-start ${
                      compareCase?.id === item.id ? "border-indigo-500 bg-slate-900" : "border-slate-850 bg-slate-900/30"
                    }`}
                  >
                    <div className="space-y-1.5 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-blue-400">{item.firNumber}</h4>
                        <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-[9px] text-slate-500 font-bold">
                          {item.policeStation.split(" ")[0]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">
                        {language === "Kannada" ? "ವರ್ಗ" : "Category"}: {item.crimeCategory} ({item.subCategory})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.sharedCharacteristics.slice(0, 2).map((char, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-950/30 border border-indigo-900/30 rounded text-[9px] text-indigo-300">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs font-black text-indigo-400">{item.similarityPercentage}% {language === "Kannada" ? "ಹೊಂದಾಣಿಕೆ" : "Match"}</div>
                      <button className="px-2 py-0.5 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 text-[10px] font-bold rounded flex items-center gap-1 border border-indigo-900/40 transition-all">
                        <Eye className="w-3 h-3" />
                        {L.compareBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-slate-500 leading-normal">
                {selectedSourceFir 
                  ? L.clickMatch
                  : L.selectBase
                }
              </div>
            )}
          </div>

          <div className="text-[10px] text-indigo-400/80 bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 mt-4 flex items-start gap-1.5">
            <AlertOctagon className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              <b>{L.analysisTip}</b> {L.analysisTipDesc}
            </span>
          </div>
        </div>

        {/* Right Column: Comparative Analysis Split View */}
        <div className="col-span-12 lg:col-span-6 p-5 overflow-y-auto flex flex-col justify-between bg-slate-900/10">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ArrowLeftRight className="w-4 h-4 text-slate-400" />
              {L.sideBySideTitle}
            </h3>

            {compareCase && sourceFir ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Visual side-by-side block */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Source Case */}
                  <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase">{L.primaryBaseCase}</p>
                    <h4 className="font-extrabold text-blue-400 text-sm">{sourceFir.firNumber}</h4>
                    <div>
                      <p className="font-semibold text-slate-300">{sourceFir.crimeCategory}</p>
                      <p className="text-[10px] text-slate-400">{sourceFir.subCategory}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-3 italic text-justify">"{sourceFir.description}"</p>
                  </div>

                  {/* Compared Case */}
                  <div className="p-4 bg-indigo-950/10 border border-indigo-900/20 rounded-xl space-y-2">
                    <p className="text-[9px] font-black text-indigo-400 uppercase">{L.matchedRecordCase}</p>
                    <h4 className="font-extrabold text-indigo-300 text-sm">{compareCase.firNumber}</h4>
                    <div>
                      <p className="font-semibold text-slate-300">{compareCase.crimeCategory}</p>
                      <p className="text-[10px] text-slate-400">{compareCase.subCategory}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-3 italic">"{compareCase.policeStation} {language === "Kannada" ? "ದಿನಾಂಕದಂದು ದಾಖಲಾಗಿದೆ" : "filed on"} {compareCase.dateFiled}"</p>
                  </div>
                </div>

                {/* Similarity Parameter breakdown card */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                  <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">
                    {L.linkageBreakdown}
                  </h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    {compareCase.sharedCharacteristics.map((char, index) => (
                      <div key={index} className="flex items-center gap-2 p-1 bg-slate-900/30 rounded border border-slate-800/40">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared location/suspect information */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{L.commonJurisdictions}</p>
                    <p className="font-semibold text-slate-300">{compareCase.commonLocations.join(", ") || (language === "Kannada" ? "ಯಾವುದೂ ಇಲ್ಲ" : "None Identified")}</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{L.commonSuspects}</p>
                    <p className="font-semibold text-slate-300 text-red-400">{compareCase.commonSuspects.join(", ") || (language === "Kannada" ? "ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ" : "None Registered")}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                {L.noRecordSelected}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/60 text-[9px] text-slate-500 flex justify-between">
            <span>{L.secureCctnsLink}</span>
            <span>Ref: KSP-SIM-CORR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
