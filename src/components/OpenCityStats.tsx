import React, { useState, useEffect } from "react";
import { Search, BarChart3, TrendingUp, AlertCircle, RefreshCw, Sparkles, BookOpen, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface OpenCityRecord {
  _id: number;
  "Sl. No.": string | null;
  "Heads of Crime": string;
  "For 2025": string | null;
}

interface OpenCityStatsProps {
  language: string;
}

export const OpenCityStats: React.FC<OpenCityStatsProps> = ({ language }) => {
  const isKannada = language === "Kannada";
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<OpenCityRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [limit, setLimit] = useState<number>(1000);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [generatingInsight, setGeneratingInsight] = useState<boolean>(false);

  // Initial fetch from our local imported registry
  const fetchStats = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/state-stats");

      if (!response.ok) {
        throw new Error(isKannada ? "ಅಧಿಕೃತ ಡೇಟಾಬೇಸ್ನಿಂದ ಮಾಹಿತಿ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ." : "Failed to retrieve data from local imported registry.");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        // Filter out categories that don't have valid Heads of Crime or values
        let validRecords = data
          .map((r: any) => ({
            _id: r._id,
            "Sl. No.": r["Sl. No."],
            "Heads of Crime": r["Heads of Crime"] || "",
            "For 2025": r["For 2025"],
          }))
          .filter(r => r["Heads of Crime"] && r["For 2025"] !== null && r["For 2025"] !== undefined);

        if (query.trim()) {
          const qLower = query.toLowerCase();
          validRecords = validRecords.filter(r => 
            r["Heads of Crime"].toLowerCase().includes(qLower)
          );
        }

        setRecords(validRecords.slice(0, limit));
      } else {
        throw new Error(isKannada ? "ಅಮಾನ್ಯ ಡೇಟಾ ಸ್ವರೂಪ ಸ್ವೀಕರಿಸಲಾಗಿದೆ." : "Invalid data format received.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(searchQuery);
  }, [limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(searchQuery);
  };

  // Process data for the chart
  const chartData = records
    .map(r => ({
      name: r["Heads of Crime"].split("(")[0].trim(), // shorten for labels
      count: parseInt(r["For 2025"] || "0", 10),
      fullName: r["Heads of Crime"],
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // show top 10 in chart for clean layout

  // Generate AI Insights from stats using Gemini
  const generateAIInsights = async () => {
    setGeneratingInsight(true);
    setAiInsight("");
    try {
      const statsSummary = records
        .map(r => `${r["Heads of Crime"]}: ${r["For 2025"]} cases`)
        .join("\n");

      const prompt = `You are a Senior Crime Analyst for the Karnataka State Police.
Analyze the following official Bengaluru City crime statistics for 2025:
${statsSummary}

Please provide a highly professional, strategic intelligence briefing of these statistics:
1. KEY FINDINGS: Identify the highest volume crime heads and noteworthy trends.
2. POLICING RECOMMENDATIONS: Give actionable next-steps for the State Police to address these prominent trends.
3. PREVENTATIVE ACTIONS: Community or system-wide changes to reduce occurrences.

Respond strictly in ${language}. Keep the tone authoritative, formal, and analytical. Use clear markdown formatting.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI insights.");
      }

      const data = await response.json();
      if (data && data.text) {
        setAiInsight(data.text);
      } else {
        throw new Error("No text returned from AI server.");
      }
    } catch (err: any) {
      console.error(err);
      setAiInsight(isKannada 
        ? "ಎಐ ಒಳನೋಟಗಳನ್ನು ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ." 
        : "Failed to generate AI analysis. Please ensure Gemini API is online and try again.");
    } finally {
      setGeneratingInsight(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded">
              {isKannada ? "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಡೇಟಾ" : "OFFICIAL DATA INTEGRATION"}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
              {isKannada ? "ಲೈವ್ ಜಾಲ" : "OPENCITY.IN API"}
            </span>
          </div>
          <h1 className="text-xl font-bold mt-1 tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            {isKannada ? "ಬೆಂಗಳೂರು ಅಪರಾಧ ಅಂಕಿಅಂಶಗಳು (೨೦೨೫)" : "Bengaluru City Crime Statistics (2025)"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isKannada 
              ? "ಕಡತ ಸಂಗ್ರಹಣೆಯಿಂದ ನೇರವಾಗಿ ಲೋಡ್ ಮಾಡಲಾದ ಅಧಿಕೃತ ಅಪರಾಧ ವರ್ಗಗಳ ಡೇಟಾಬೇಸ್ ನೋಂದಣಿ." 
              : "Official 2025 crime category statistical dataset imported and hosted locally inside the secure KSP registry."}
          </p>
        </div>

        <button
          onClick={() => fetchStats(searchQuery)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          {isKannada ? "ಲೋಡ್ ರಜಿಸ್ಟ್ರಿ" : "Reload Registry"}
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search and Limit Controls */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950/35 p-4 rounded-xl border border-slate-800">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKannada ? "ಅಪರಾಧ ವರ್ಗ ಹುಡುಕಿ (ಉದಾ: Murder, Rape, Gain)..." : "Filter crime categories (e.g., 'Murder', 'Rape', 'Gain')..."}
              className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none placeholder-slate-500 transition-colors"
            />
          </div>
          
          <div className="md:col-span-4 flex items-center gap-2">
            <label className="text-xs text-slate-400 whitespace-nowrap">{isKannada ? "ಮಿತಿ:" : "Limit:"}</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors"
            >
              <option value="10">10 {isKannada ? "ದಾಖಲೆಗಳು" : "Records"}</option>
              <option value="30">30 {isKannada ? "ದಾಖಲೆಗಳು" : "Records"}</option>
              <option value="100">100 {isKannada ? "ದಾಖಲೆಗಳು" : "Records"}</option>
              <option value="300">300 {isKannada ? "ದಾಖಲೆಗಳು" : "Records"}</option>
              <option value="500">500 {isKannada ? "ದಾಖಲೆಗಳು" : "Records"}</option>
              <option value="1000">1000 ({isKannada ? "ಎಲ್ಲಾ" : "All"} {isKannada ? "ದಾಖಲೆಗಳು" : "Records"})</option>
            </select>
          </div>

          <button
            type="submit"
            className="md:col-span-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            {isKannada ? "ಹುಡುಕಿ" : "Search"}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{isKannada ? "ದೋಷ ಸಂಭವಿಸಿದೆ" : "Network Integration Error"}</p>
              <p className="mt-0.5 text-slate-300">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono">{isKannada ? "ಓಪನ್‌ಸಿಟಿ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ..." : "Querying OpenCity datastore catalog..."}</p>
          </div>
        ) : records.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-300">{isKannada ? "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ" : "No matching statistical records found"}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {isKannada ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹುಡುಕಾಟ ಪದವನ್ನು ಬದಲಾಯಿಸಿ ಅಥವಾ ಮಿತಿ ಹೆಚ್ಚಿಸಿ." : "Please check your search query or try a different filter word."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Recharts Bar Visualization */}
            <div className="xl:col-span-7 bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  {isKannada ? "ಟಾಪ್ ಅಪರಾಧ ವಿಭಾಗಗಳ ವಿಶ್ಲೇಷಣೆ" : "Top Crime Volume Distribution (2025)"}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {chartData.length} {isKannada ? "ವಿಭಾಗಗಳು ಪ್ರದರ್ಶಿತ" : "categories plotted"}
                </span>
              </div>
              
              <div className="flex-1 w-full text-xs min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#64748b"
                      fontSize={9}
                      width={120}
                      tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 18)}...` : value}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                      labelStyle={{ color: "#fff", fontWeight: "bold" }}
                      itemStyle={{ color: "#3b82f6" }}
                      formatter={(value, name, props) => [value, isKannada ? "ಪ್ರಕರಣಗಳು" : "Cases"]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => {
                        // Color spectrum based on count volume
                        const colors = ["#ef4444", "#f57c00", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];
                        const color = colors[index % colors.length];
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Detailed List of matching categories */}
            <div className="xl:col-span-5 bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col h-[400px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {isKannada ? "ಅಂಕಿಅಂಶಗಳ ವಿವರ ಪಟ್ಟಿ" : "Detailed Statistical Catalog"}
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {records.map((rec) => {
                  const count = parseInt(rec["For 2025"] || "0", 10);
                  return (
                    <div
                      key={rec._id}
                      className="p-3 bg-slate-900/60 hover:bg-slate-800/60 rounded-lg border border-slate-800/80 flex justify-between items-center transition-all group"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          #{rec["Sl. No."] || rec._id}
                        </span>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-snug">
                          {rec["Heads of Crime"]}
                        </p>
                      </div>
                      <div className="text-right pl-3">
                        <span className="px-2.5 py-1 bg-slate-950 text-emerald-400 font-mono font-black text-xs rounded border border-slate-800 block shadow">
                          {count.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {isKannada ? "ಪ್ರಕರಣಗಳು" : "cases"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI Analytics & Insights Panel */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {isKannada ? "ಸ್ಮಾರ್ಟ್ ಎಐ ಅಂಕಿಅಂಶ ವಿಶ್ಲೇಷಣೆ" : "AI Tactical Statistical Analyst"}
              </h3>
              <p className="text-xs text-slate-400">
                {isKannada 
                  ? "ಲೈವ್ ಓಪನ್‌ಸಿಟಿ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಮತ್ತು ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ಒಳನೋಟಗಳನ್ನು ನೀಡಲು Gemini ಎಐ ಸಹಾಯ ಪಡೆಯಿರಿ." 
                  : "Let Gemini analyze the retrieved OpenCity statistical catalog to draw key state intelligence points."}
              </p>
            </div>

            <button
              onClick={generateAIInsights}
              disabled={loading || records.length === 0 || generatingInsight}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl border border-blue-500/30 transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generatingInsight ? "animate-pulse text-amber-300" : ""}`} />
              {generatingInsight 
                ? (isKannada ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." : "Synthesizing Brief...") 
                : (isKannada ? "ಎಐ ಒಳನೋಟ ಪಡೆಯಿರಿ" : "Analyze with Gemini")}
            </button>
          </div>

          {generatingInsight ? (
            <div className="p-8 bg-slate-900/40 rounded-xl border border-slate-800/60 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-xs text-slate-400 font-mono text-center">
                {isKannada 
                  ? "ಜೆಮಿನಿ ೩.೫ ಫ್ಲ್ಯಾಶ್ ಮಾದರಿಯು ವರ್ಗ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಐಪಿಸಿ ಸೆಕ್ಷನ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ..." 
                  : "Gemini 3.5 Flash is parsing crime heads & correlating BNS statutes..."}
              </p>
            </div>
          ) : aiInsight ? (
            <div className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans max-h-72 overflow-y-auto whitespace-pre-wrap">
              {aiInsight}
            </div>
          ) : (
            <div className="p-6 bg-slate-900/20 rounded-xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center text-slate-500">
              <BookOpen className="w-8 h-8 text-slate-600 mb-1.5" />
              <p className="text-xs">
                {isKannada 
                  ? "ವಿಭಾಗ ಅಂಕಿಅಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಿದ ನಂತರ ಎಐ ಒಳನೋಟ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ." 
                  : "Fetch or filter the data first, then click 'Analyze with Gemini' to get real strategic safety insights."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
