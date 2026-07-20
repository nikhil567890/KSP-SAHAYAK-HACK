import React, { useState, useRef } from "react";
import { 
  Share2, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Filter, 
  Cpu, 
  Eye, 
  ShieldAlert, 
  Activity 
} from "lucide-react";
import { NetworkNode, NetworkLink } from "../types";

interface CriminalNetworkProps {
  language?: "English" | "Kannada";
}

const TRANSLATIONS = {
  English: {
    title: "Tactical Syndicate Relationship Network",
    badge: "Graph Centrality",
    subtitle: "Linkage Matrix // Spatial Structuring Analytics",
    showMoneyTrail: "Show Money Trail Chain",
    searchPlaceholder: "Search syndicate nodes...",
    legendTitle: "Tactical Legend",
    accusedLegend: "Accused (Suspects)",
    financialLegend: "Financial Accounts",
    imeiLegend: "IMEI Terminals",
    firLegend: "FIR Case File Node",
    tipMessage: "💡 Drag any node to reposition. Hover details will pop up. Click any node to open forensic telemetry.",
    fiuSyncNotice: "🔒 Financial Intelligence Unit (FIU) nodes synchronized with Central Registry dockets.",
    intelligenceDocket: "Node Intelligence Docket",
    noNodeSelected: "No active node selected. Click on any network vertex point or suspect node to query deep CCTNS forensic dockets.",
    centralityMetrics: "Syndicate centrality metrics",
    centralityMetricsDesc: "High centrality nodes indicate mastermind nodes or central mules. Section 106 BNSS triggers automatic freezing on central holding nodes.",
    degreeCentrality: "Syndicate Degree Centrality",
    centralRiskPriority: "Central Risk Priority",
    criticalRisk: "CRITICAL RISK",
    observation: "OBSERVATION",
    forensicDescription: "Forensic Description:",
    linkedNodes: "Linked Nodes",
    all: "All",
    accused: "Accused",
    bankAccount: "Bank Account",
    phone: "Phone",
    vehicle: "Vehicle",
    fir: "FIR",
    crownText: "👑 Central Node"
  },
  Kannada: {
    title: "ಕಾರ್ಯತಂತ್ರದ ಸಿಂಡಿಕೇಟ್ ಸಂಬಂಧಗಳ ಜಾಲ",
    badge: "ಗ್ರಾಫ್ ಕೇಂದ್ರತೆ",
    subtitle: "ಲಿಂಕೇಜ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ // ಪ್ರಾದೇಶಿಕ ರಚನಾ ವಿಶ್ಲೇಷಣೆ",
    showMoneyTrail: "ಹಣದ ಹರಿವಿನ ಸರಪಳಿ ತೋರಿಸಿ",
    searchPlaceholder: "ಸಿಂಡಿಕೇಟ್ ನೋಡ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
    legendTitle: "ಕಾರ್ಯತಂತ್ರದ ವಿವರಣೆ",
    accusedLegend: "ಆರೋಪಿಗಳು (ಶಂಕಿತರು)",
    financialLegend: "ಹಣಕಾಸು ಖಾತೆಗಳು",
    imeiLegend: "IMEI ಟರ್ಮಿನಲ್‌ಗಳು",
    firLegend: "ಎಫ್‌ಐಆರ್ ಕೇಸ್ ಫೈಲ್ ನೋಡ್",
    tipMessage: "💡 ಮರುಸ್ಥಾಪಿಸಲು ಯಾವುದೇ ನೋಡ್ ಅನ್ನು ಎಳೆಯಿರಿ. ಹೋವರ್ ವಿವರಗಳು ಪಾಪ್ ಅಪ್ ಆಗುತ್ತವೆ. ವಿಧಿವಿಜ್ಞಾನ ಟೆಲಿಮೆಟ್ರಿ ತೆರೆಯಲು ಯಾವುದೇ ನೋಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    fiuSyncNotice: "🔒 ಹಣಕಾಸು ಗುಪ್ತಚರ ಸಂಸ್ಥೆ (FIU) ನೋಡ್‌ಗಳು ಕೇಂದ್ರ ನೋಂದಾವಣೆ ದಸ್ತಾವೇಜಿಗೆ ಸಿಂಕ್ ಆಗಿವೆ.",
    intelligenceDocket: "ನೋಡ್ ಗುಪ್ತಚರ ದಸ್ತಾವೇಜು",
    noNodeSelected: "ಯಾವುದೇ ಸಕ್ರಿಯ ನೋಡ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ. ಆಳವಾದ ಸಿ‌ಸಿ‌ಟಿ‌ಎನ್ಎಸ್ ತನಿಖೆ ನಡೆಸಲು ನೆಟ್‌ವರ್ಕ್ ನೋಡ್ ಅಥವಾ ಆರೋಪಿಯ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    centralityMetrics: "ಸಿಂಡಿಕೇಟ್ ಕೇಂದ್ರತೆಯ ಮೆಟ್ರಿಕ್ಸ್",
    centralityMetricsDesc: "ಹೆಚ್ಚಿನ ಕೇಂದ್ರತೆಯ ನೋಡ್‌ಗಳು ಮಾಸ್ಟರ್‌ಮೈಂಡ್ ಅಥವಾ ಪ್ರಮುಖ ಹಣ ವರ್ಗಾವಣೆದಾರರನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಸೆಕ್ಷನ್ ೧೦೬ ಬಿಎನ್‌ಎಸ್‌ಎಸ್ ಕೇಂದ್ರ ಹೋಲ್ಡಿಂಗ್ ನೋಡ್‌ಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಫ್ರೀಜ್ ಮಾಡಲು ಪ್ರಚೋದಿಸುತ್ತದೆ.",
    degreeCentrality: "ಸಿಂಡಿಕೇಟ್ ಲಿಂಕ್ ಕೇಂದ್ರತೆ",
    centralRiskPriority: "ಕೇಂದ್ರ ಅಪಾಯದ ಆದ್ಯತೆ",
    criticalRisk: "ಅಪಾಯಕಾರಿ ಅಪರಾಧಿ",
    observation: "ನಿಗಾ ವಲಯ",
    forensicDescription: "ವಿಧಿವಿಜ್ಞಾನ ವಿವರಣೆ:",
    linkedNodes: "ಸಂಪರ್ಕಿತ ನೋಡ್ಗಳು",
    all: "ಎಲ್ಲಾ",
    accused: "ಆರೋಪಿ",
    bankAccount: "ಬ್ಯಾಂಕ್ ಖಾತೆ",
    phone: "ಮೊಬೈಲ್",
    vehicle: "ವಾಹನ",
    fir: "ಎಫ್ಐಆರ್",
    crownText: "👑 ಕೇಂದ್ರ ನೋಡ್"
  }
};

export function CriminalNetwork({ language = "English" }: CriminalNetworkProps) {
  // Initial beautiful seed nodes representing a multi-layered criminal syndicate
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: "1", label: "Karthik Shettar", type: "Accused", group: "accused", details: "Prime accused, risk score: 92%. Modus operandi: phishing scam controller." },
    { id: "2", label: "Suresh Prasad", type: "Accused", group: "accused", details: "Gold Ponzi kingpin, risk score: 88%. Modus operandi: multi-crore asset schemes." },
    { id: "3", label: "Raju Naik", type: "Accused", group: "accused", details: "Snatcher / highway rider, risk score: 75%. Modus operandi: armed gold snatching." },
    { id: "4", label: "Manjunath Swamy", type: "Accused", group: "accused", details: "Villa assistant / homicide helper, risk score: 85%. Modus operandi: household lock manipulation." },
    { id: "5", label: "SBI-9081234510", type: "Bank Account", group: "financial", details: "Syndicate core holding account. Flagged by FIU for structuring transactions." },
    { id: "6", label: "UPI-MULE-4411", type: "Bank Account", group: "financial", details: "Secondary mule account, holding ₹1.5 Lakhs. Fast cashout node." },
    { id: "7", label: "UPI-MULE-8812", type: "Bank Account", group: "financial", details: "Mule cashout node in Mangaluru, holding ₹1.5 Lakhs." },
    { id: "8", label: "UPI-MULE-9900", type: "Bank Account", group: "financial", details: "High risk cashout gateway account, frozen on Section 106 BNSS order." },
    { id: "9", label: "KA-05-MJ-4820", type: "Vehicle", group: "vehicle", details: "Silver Maruti Swift registered under Karthik Shettar, spotted at 4 scene routes." },
    { id: "10", label: "IMEI-84201990", type: "Phone", group: "phone", details: "Device used in calling SBI phishing victims. Location matched Koramangala tower." },
    { id: "11", label: "FIR 0045", type: "FIR", group: "fir", details: "Active phishing and banking fraud case filed at Koramangala Police Station." },
    { id: "12", label: "FIR 0082", type: "FIR", group: "fir", details: "Ponzi scheme scam docket under active supervisor investigation." }
  ]);

  const [links, setLinks] = useState<NetworkLink[]>([
    { source: "1", target: "11", label: "Charged in" },
    { source: "2", target: "12", label: "Charged in" },
    { source: "1", target: "9", label: "Drives vehicle" },
    { source: "1", target: "10", label: "Operates device" },
    { source: "1", target: "5", label: "Controls funds" },
    { source: "2", target: "5", label: "Launders in" },
    { source: "5", target: "6", label: "Structured transfer" },
    { source: "5", target: "7", label: "Structured transfer" },
    { source: "5", target: "8", label: "Direct withdrawal" },
    { source: "3", target: "9", label: "Borrower of" }
  ]);

  // Node position coordinates for SVG
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
    "1": { x: 200, y: 150 },
    "2": { x: 600, y: 150 },
    "3": { x: 400, y: 280 },
    "4": { x: 500, y: 80 },
    "5": { x: 400, y: 380 },
    "6": { x: 280, y: 410 },
    "7": { x: 520, y: 410 },
    "8": { x: 400, y: 470 },
    "9": { x: 180, y: 290 },
    "10": { x: 140, y: 90 },
    "11": { x: 280, y: 230 },
    "12": { x: 500, y: 230 }
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLaunderingChains, setShowLaunderingChains] = useState<boolean>(false);

  // Drag-and-drop state variables
  const dragNodeIdRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const L_LANG = TRANSLATIONS[language];

  // Map nodes to localized properties
  const localizedNodes = nodes.map(node => {
    if (language === "Kannada") {
      let localizedType = node.type;
      if (node.type === "Accused") localizedType = "ಆರೋಪಿ";
      else if (node.type === "Bank Account") localizedType = "ಬ್ಯಾಂಕ್ ಖಾತೆ";
      else if (node.type === "Phone") localizedType = "ಮೊಬೈಲ್";
      else if (node.type === "Vehicle") localizedType = "ವಾಹನ";
      else if (node.type === "FIR") localizedType = "ಎಫ್ಐಆರ್";

      let localizedDetails = node.details;
      if (node.id === "1") localizedDetails = "ಪ್ರಮುಖ ಆರೋಪಿ, ಅಪಾಯದ ಸ್ಕೋರ್: ೯೨%. ಕಾರ್ಯ ವಿಧಾನ: ಫಿಶಿಂಗ್ ಹಗರಣ ನಿಯಂತ್ರಕ.";
      else if (node.id === "2") localizedDetails = "ಚಿನ್ನದ ಪೋಂಜಿ ಕಿಂಗ್‌ಪಿನ್, ಅಪಾಯದ ಸ್ಕೋರ್: ೮೮%. ಕಾರ್ಯ ವಿಧಾನ: ಕೋಟಿಗಟ್ಟಲೆ ಆಸ್ತಿ ವಂಚನೆ ಯೋಜನೆಗಳು.";
      else if (node.id === "3") localizedDetails = "ಸರಗಳ್ಳ / ಹೆದ್ದಾರಿ ದರೋಡೆಕೋರ, ಅಪಾಯದ ಸ್ಕೋರ್: ೭೫%. ಕಾರ್ಯ ವಿಧಾನ: ಮಾರಕಾಸ್ತ್ರಗಳಿಂದ ಚಿನ್ನದ ಸರಗಳ್ಳತನ.";
      else if (node.id === "4") localizedDetails = "ವಿಲ್ಲಾ ಸಹಾಯಕ / ನರಹತ್ಯೆ ಸಹಚರ, ಅಪಾಯದ ಸ್ಕೋರ್: ೮೫%. ಕಾರ್ಯ ವಿಧಾನ: ಮನೆಯ ಲಾಕ್ ತಿರುಚುವಿಕೆ.";
      else if (node.id === "5") localizedDetails = "ಸಿಂಡಿಕೇಟ್ ಪ್ರಮುಖ ಹೋಲ್ಡಿಂಗ್ ಖಾತೆ. ವ್ಯವಹಾರಗಳ ಸಂರಚನೆಗಾಗಿ FIU ನಿಂದ ಧ್ವಜ ಗುರುತು ಮಾಡಲಾಗಿದೆ.";
      else if (node.id === "6") localizedDetails = "ದ್ವಿತೀಯ ಮ್ಯೂಲ್ ಖಾತೆ, ₹೧.೫ ಲಕ್ಷ ಹಣ ಹೊಂದಿದೆ. ತ್ವರಿತ ನಗದು ಹಿಂಪಡೆಯುವಿಕೆ ನೋಡ್.";
      else if (node.id === "7") localizedDetails = "ಮಂಗಳೂರಿನಲ್ಲಿರುವ ಮ್ಯೂಲ್ ನಗದು ಹಿಂಪಡೆಯುವಿಕೆ ನೋಡ್, ₹೧.೫ ಲಕ್ಷ ಹಣ ಹೊಂದಿದೆ.";
      else if (node.id === "8") localizedDetails = "ಹೆಚ್ಚಿನ ಅಪಾಯದ ನಗದು ಹಿಂಪಡೆಯುವಿಕೆ ಗೇಟ್‌ವೇ ಖಾತೆ, ಸೆಕ್ಷನ್ ೧೦೬ ಬಿಎನ್‌ಎಸ್‌ಎಸ್ ಅಡಿಯಲ್ಲಿ ಫ್ರೀಜ್ ಮಾಡಲಾಗಿದೆ.";
      else if (node.id === "9") localizedDetails = "ಕಾರ್ತಿಕ್ ಶೆಟ್ಟರ್ ಹೆಸರಿನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾದ ಸಿಲ್ವರ್ ಮಾರುತಿ ಸ್ವಿಫ್ಟ್, ೪ ಅಪರಾಧ ಸ್ಥಳದ ಮಾರ್ಗಗಳಲ್ಲಿ ಪತ್ತೆಯಾಗಿದೆ.";
      else if (node.id === "10") localizedDetails = "ಸಿಬಿಐ ಫಿಶಿಂಗ್ ಬಲಿಪಶುಗಳಿಗೆ ಕರೆ ಮಾಡಲು ಬಳಸಿದ ಸಾಧನ. ಕೋರಮಂಗಲ ಟವರ್‌ನೊಂದಿಗೆ ಸ್ಥಳ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ.";
      else if (node.id === "11") localizedDetails = "ಕೋರಮಂಗಲ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ ದಾಖಲಾದ ಸಕ್ರಿಯ ಫಿಶಿಂಗ್ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆ ಪ್ರಕರಣ.";
      else if (node.id === "12") localizedDetails = "ಸಕ್ರಿಯ ಮೇಲ್ವಿಚಾರಕರ ತನಿಖೆಯ ಅಡಿಯಲ್ಲಿರುವ ಪೋಂಜಿ ಸ್ಕೀಮ್ ಹಗರಣದ ಡಾಕೆಟ್.";

      return {
        ...node,
        type: localizedType,
        details: localizedDetails
      };
    }
    return node;
  });

  const selectedNode = localizedNodes.find(n => n.id === selectedNodeId) || null;

  const handleMouseDown = (nodeId: string, e: React.MouseEvent<SVGGElement>) => {
    e.preventDefault();
    dragNodeIdRef.current = nodeId;
    const pos = positions[nodeId];
    if (pos) {
      dragStartPosRef.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragNodeIdRef.current) {
      const nodeId = dragNodeIdRef.current;
      const newX = e.clientX - dragStartPosRef.current.x;
      const newY = e.clientY - dragStartPosRef.current.y;

      setPositions(prev => ({
        ...prev,
        [nodeId]: { x: Math.max(20, Math.min(newX, 780)), y: Math.max(20, Math.min(newY, 480)) }
      }));
    }
  };

  const handleMouseUp = () => {
    dragNodeIdRef.current = null;
  };

  const handleResetGraph = () => {
    setPositions({
      "1": { x: 200, y: 150 },
      "2": { x: 600, y: 150 },
      "3": { x: 400, y: 280 },
      "4": { x: 500, y: 80 },
      "5": { x: 400, y: 380 },
      "6": { x: 280, y: 410 },
      "7": { x: 520, y: 410 },
      "8": { x: 400, y: 470 },
      "9": { x: 180, y: 290 },
      "10": { x: 140, y: 90 },
      "11": { x: 280, y: 230 },
      "12": { x: 500, y: 230 }
    });
    setSelectedNodeId(null);
    setShowLaunderingChains(false);
  };

  // Centrality Analysis (Degree count)
  const getNodeCentrality = (nodeId: string) => {
    return links.filter(l => l.source === nodeId || l.target === nodeId).length;
  };

  // Filter logic
  const isNodeVisible = (node: NetworkNode) => {
    const rawFilter = activeFilter;
    const matchesFilter = rawFilter === "All" || node.type === rawFilter;
    const matchesSearch = searchQuery === "" || node.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  };

  // Color mapper based on node type and risk criteria
  const getNodeVisuals = (node: NetworkNode) => {
    let color = "#3b82f6"; // default blue
    let icon = "🌐";
    const typeStr = node.type as string;

    if (typeStr === "Accused" || typeStr === "ಆರೋಪಿ") {
      color = "#ef4444"; // Red for suspects
      icon = "👤";
    } else if (typeStr === "Bank Account" || typeStr === "ಬ್ಯಾಂಕ್ ಖಾತೆ") {
      color = "#f59e0b"; // Orange for financial
      icon = "🏦";
    } else if (typeStr === "Vehicle" || typeStr === "ವಾಹನ") {
      color = "#64748b"; // slate
      icon = "🚗";
    } else if (typeStr === "Phone" || typeStr === "ಮೊಬೈಲ್") {
      color = "#6366f1"; // indigo
      icon = "📱";
    } else if (typeStr === "FIR" || typeStr === "ಎಫ್ಐಆರ್") {
      color = "#10b981"; // emerald
      icon = "📄";
    }

    const isCentral = getNodeCentrality(node.id) >= 3;

    return { color, icon, isCentral };
  };

  const getLocalizedLinkLabel = (engLabel: string) => {
    if (language !== "Kannada") return engLabel;
    if (engLabel === "Charged in") return "ಪ್ರಕರಣ ದಾಖಲು";
    if (engLabel === "Drives vehicle") return "ವಾಹನ ಚಾಲನೆ";
    if (engLabel === "Operates device") return "ಮೊಬೈಲ್ ಬಳಕೆ";
    if (engLabel === "Controls funds") return "ಹಣ ನಿಯಂತ್ರಣ";
    if (engLabel === "Launders in") return "ಹಣ ವರ್ಗಾವಣೆ";
    if (engLabel === "Structured transfer") return "ರಚನಾತ್ಮಕ ವರ್ಗಾವಣೆ";
    if (engLabel === "Direct withdrawal") return "ನೇರ ಹಿಂಪಡೆಯುವಿಕೆ";
    if (engLabel === "Borrower of") return "ಸಾಲ ಪಡೆದವರು";
    return engLabel;
  };

  const filterOptions = [
    { key: "All", label: L_LANG.all },
    { key: "Accused", label: L_LANG.accused },
    { key: "Bank Account", label: L_LANG.bankAccount },
    { key: "Phone", label: L_LANG.phone },
    { key: "Vehicle", label: L_LANG.vehicle },
    { key: "FIR", label: L_LANG.fir }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="network-intelligence-panel">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Share2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {L_LANG.title}
              <span className="px-2 py-0.5 text-[9px] font-black bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 uppercase tracking-wider">
                {L_LANG.badge}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">{L_LANG.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLaunderingChains(!showLaunderingChains)}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-800 transition-all ${
              showLaunderingChains ? "bg-amber-600/25 text-amber-300 border-amber-500/30" : "bg-slate-900 text-slate-400"
            }`}
          >
            {L_LANG.showMoneyTrail}
          </button>
          <button
            onClick={handleResetGraph}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-lg transition-colors"
            title="Reset Position"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Filters Toolbar */}
      <div className="px-4 py-2 border-b border-slate-850 bg-slate-950/40 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex gap-1">
            {filterOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => {
                  setActiveFilter(opt.key);
                  setSelectedNodeId(null);
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  activeFilter === opt.key ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-44">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={L_LANG.searchPlaceholder}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 pl-8 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-slate-950">
        {/* Central interactive network panel */}
        <div className="col-span-12 lg:col-span-8 relative flex flex-col justify-between overflow-hidden">
          {/* Zoom Overlay panel */}
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-800 rounded-xl p-3 z-10 space-y-2 text-[10px] text-slate-300">
            <p className="font-bold border-b border-slate-800 pb-1 text-blue-400">{L_LANG.legendTitle}</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              {L_LANG.accusedLegend}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              {L_LANG.financialLegend}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              {L_LANG.imeiLegend}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              {L_LANG.firLegend}
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-blue-950/80 border border-blue-500/20 text-blue-300 p-2.5 rounded-lg text-[10px] max-w-[200px] font-semibold leading-relaxed z-10 text-justify">
            {L_LANG.tipMessage}
          </div>

          {/* SVG Canvas Map */}
          <div className="flex-1 relative cursor-crosshair">
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Glow filter */}
              <defs>
                <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connecting lines link layer */}
              {links.map((link, idx) => {
                const sourceNode = localizedNodes.find(n => n.id === link.source);
                const targetNode = localizedNodes.find(n => n.id === link.target);

                if (!sourceNode || !targetNode) return null;
                if (!isNodeVisible(sourceNode) || !isNodeVisible(targetNode)) return null;

                const pos1 = positions[link.source];
                const pos2 = positions[link.target];

                if (!pos1 || !pos2) return null;

                // Highlight status
                const isLaunderingPath = showLaunderingChains && 
                  (link.source === "5" || link.target === "5" || link.source === "1" || link.target === "1" || link.source === "2" || link.target === "2") &&
                  (sourceNode.type === "Bank Account" || sourceNode.type === "ಬ್ಯಾಂಕ್ ಖಾತೆ" || targetNode.type === "Bank Account" || targetNode.type === "ಬ್ಯಾಂಕ್ ಖಾತೆ");

                return (
                  <g key={idx}>
                    <line
                      x1={pos1.x}
                      y1={pos1.y}
                      x2={pos2.x}
                      y2={pos2.y}
                      stroke={isLaunderingPath ? "#f59e0b" : "#475569"}
                      strokeWidth={isLaunderingPath ? "3" : "1.5"}
                      strokeDasharray={isLaunderingPath ? "4,2" : ""}
                      filter={isLaunderingPath ? "url(#glow-effect)" : ""}
                      className="transition-all"
                    />
                    {/* Floating relationship text labels */}
                    <text
                      x={(pos1.x + pos2.x) / 2}
                      y={(pos1.y + pos2.y) / 2 - 4}
                      fill={isLaunderingPath ? "#fbbf24" : "#94a3b8"}
                      fontSize="8"
                      textAnchor="middle"
                      className="font-mono tracking-tight font-bold select-none"
                    >
                      {getLocalizedLinkLabel(link.label)}
                    </text>
                  </g>
                );
              })}

              {/* Node Circle element layer */}
              {localizedNodes.filter(isNodeVisible).map(node => {
                const pos = positions[node.id];
                if (!pos) return null;

                const { color, icon, isCentral } = getNodeVisuals(node);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-grab active:cursor-grabbing group"
                  >
                    {/* Ring highlight halo if selected or high degree centrality */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="28"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                        filter="url(#glow-effect)"
                      />
                    )}

                    {isCentral && !isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="26"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="20"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "3" : "1.5"}
                      className="transition-all group-hover:scale-110"
                    />

                    {/* Center Icon */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize="12"
                      className="select-none"
                    >
                      {icon}
                    </text>

                    {/* Centrality gold crown */}
                    {isCentral && (
                      <text
                        x={pos.x}
                        y={pos.y - 20}
                        textAnchor="middle"
                        fontSize="9"
                        className="font-bold fill-amber-400 animate-bounce select-none"
                      >
                        {L_LANG.crownText}
                      </text>
                    )}

                    {/* Node text label below */}
                    <text
                      x={pos.x}
                      y={pos.y + 35}
                      fill="#ffffff"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      className="select-none text-shadow font-sans"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 m-4 text-[10px] text-slate-400 font-semibold leading-tight text-justify">
            {L_LANG.fiuSyncNotice}
          </div>
        </div>

        {/* Right Column details panel */}
        <div className="col-span-12 lg:col-span-4 p-5 bg-slate-950/20 border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              {L_LANG.intelligenceDocket}
            </h3>

            {selectedNode ? (
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg text-white font-bold text-lg ${
                    (selectedNode.type === "Accused" || selectedNode.type === "ಆರೋಪಿ") ? "bg-red-600" :
                    (selectedNode.type === "Bank Account" || selectedNode.type === "ಬ್ಯಾಂಕ್ ಖಾತೆ") ? "bg-amber-600" :
                    (selectedNode.type === "FIR" || selectedNode.type === "ಎಫ್ಐಆರ್") ? "bg-emerald-600" : "bg-blue-600"
                  }`}>
                    {(selectedNode.type === "Accused" || selectedNode.type === "ಆರೋಪಿ") ? "👤" :
                     (selectedNode.type === "Bank Account" || selectedNode.type === "ಬ್ಯಾಂಕ್ ಖಾತೆ") ? "🏦" :
                     (selectedNode.type === "FIR" || selectedNode.type === "ಎಫ್ಐಆರ್") ? "📄" : "🌐"}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{selectedNode.label}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedNode.type}</p>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <p className="text-slate-400 leading-relaxed font-semibold">{L_LANG.forensicDescription}</p>
                  <p className="p-3 bg-slate-950/40 border border-slate-850 rounded text-slate-300 leading-relaxed italic text-justify">
                    "{selectedNode.details}"
                  </p>
                </div>

                {/* CENTRAL CENTRALITY INSIGHT */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">{L_LANG.degreeCentrality}</p>
                    <p className="font-bold text-slate-300">{getNodeCentrality(selectedNode.id)} {L_LANG.linkedNodes}</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">{L_LANG.centralRiskPriority}</p>
                    <p className={`font-black uppercase ${
                      getNodeCentrality(selectedNode.id) >= 3 ? "text-red-500" : "text-slate-400"
                    }`}>
                      {getNodeCentrality(selectedNode.id) >= 3 ? L_LANG.criticalRisk : L_LANG.observation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                {L_LANG.noNodeSelected}
              </div>
            )}
          </div>

          <div className="p-3.5 bg-blue-950/20 border border-blue-900/20 rounded-xl">
            <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              {L_LANG.centralityMetrics}
            </h4>
            <p className="text-[10px] text-blue-300 leading-normal text-justify">
              {L_LANG.centralityMetricsDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
