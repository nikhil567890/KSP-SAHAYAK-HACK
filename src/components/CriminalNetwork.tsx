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

export function CriminalNetwork() {
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

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLaunderingChains, setShowLaunderingChains] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag-and-drop state variables
  const dragNodeIdRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
    setSelectedNode(null);
    setShowLaunderingChains(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Centrality Analysis (Degree count)
  const getNodeCentrality = (nodeId: string) => {
    return links.filter(l => l.source === nodeId || l.target === nodeId).length;
  };

  // Filter logic
  const isNodeVisible = (node: NetworkNode) => {
    const matchesFilter = activeFilter === "All" || node.type === activeFilter;
    const matchesSearch = searchQuery === "" || node.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  };

  // Color mapper based on node type and risk criteria
  const getNodeVisuals = (node: NetworkNode) => {
    let color = "#3b82f6"; // default blue
    let icon = "🌐";

    if (node.type === "Accused") {
      color = "#ef4444"; // Red for suspects
      icon = "👤";
    } else if (node.type === "Bank Account") {
      color = "#f59e0b"; // Orange for financial
      icon = "🏦";
    } else if (node.type === "Vehicle") {
      color = "#64748b"; // slate
      icon = "🚗";
    } else if (node.type === "Phone") {
      color = "#6366f1"; // indigo
      icon = "📱";
    } else if (node.type === "FIR") {
      color = "#10b981"; // emerald
      icon = "📄";
    }

    const isCentral = getNodeCentrality(node.id) >= 3;

    return { color, icon, isCentral };
  };

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
              Tactical Syndicate Relationship Network
              <span className="px-2 py-0.5 text-[9px] font-black bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 uppercase tracking-wider">
                Graph Centrality
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Linkage Matrix // Spatial Structuring Analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLaunderingChains(!showLaunderingChains)}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-800 transition-all ${
              showLaunderingChains ? "bg-amber-600/25 text-amber-300 border-amber-500/30" : "bg-slate-900 text-slate-400"
            }`}
          >
            Show Money Trail Chain
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
            {["All", "Accused", "Bank Account", "Phone", "Vehicle", "FIR"].map(type => (
              <button
                key={type}
                onClick={() => {
                  setActiveFilter(type);
                  setSelectedNode(null);
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  activeFilter === type ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {type}s
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
            placeholder="Search syndicate nodes..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 pl-8 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-slate-950">
        {/* Central interactive network panel */}
        <div className="col-span-12 lg:col-span-8 relative flex flex-col justify-between overflow-hidden">
          {/* Zoom Overlay panel */}
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-800 rounded-xl p-3 z-10 space-y-2 text-[10px] text-slate-300">
            <p className="font-bold border-b border-slate-800 pb-1 text-blue-400">Tactical Legend</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              Accused (Suspects)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              Financial Accounts
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              IMEI Terminals
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              FIR Case File Node
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-blue-950/80 border border-blue-500/20 text-blue-300 p-2.5 rounded-lg text-[10px] max-w-[200px] font-semibold leading-relaxed z-10">
            💡 Drag any node to reposition. Hover details will pop up. Click any node to open forensic telemetry.
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
                const sourceNode = nodes.find(n => n.id === link.source);
                const targetNode = nodes.find(n => n.id === link.target);

                if (!sourceNode || !targetNode) return null;
                if (!isNodeVisible(sourceNode) || !isNodeVisible(targetNode)) return null;

                const pos1 = positions[link.source];
                const pos2 = positions[link.target];

                if (!pos1 || !pos2) return null;

                // Highlight status
                const isLaunderingPath = showLaunderingChains && 
                  (link.source === "5" || link.target === "5" || link.source === "1" || link.target === "1" || link.source === "2" || link.target === "2") &&
                  (sourceNode.type === "Bank Account" || targetNode.type === "Bank Account");

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
                      {link.label}
                    </text>
                  </g>
                );
              })}

              {/* Node Circle element layer */}
              {nodes.filter(isNodeVisible).map(node => {
                const pos = positions[node.id];
                if (!pos) return null;

                const { color, icon, isCentral } = getNodeVisuals(node);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    onClick={() => setSelectedNode(node)}
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
                        👑 Central Node
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

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 m-4 text-[10px] text-slate-400 font-semibold leading-tight">
            🔒 Financial Intelligence Unit (FIU) nodes synchronized with Central Registry dockets.
          </div>
        </div>

        {/* Right Column details panel */}
        <div className="col-span-12 lg:col-span-4 p-5 bg-slate-950/20 border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Node Intelligence Docket
            </h3>

            {selectedNode ? (
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg text-white font-bold text-lg ${
                    selectedNode.type === "Accused" ? "bg-red-600" :
                    selectedNode.type === "Bank Account" ? "bg-amber-600" :
                    selectedNode.type === "FIR" ? "bg-emerald-600" : "bg-blue-600"
                  }`}>
                    {selectedNode.type === "Accused" ? "👤" :
                     selectedNode.type === "Bank Account" ? "🏦" :
                     selectedNode.type === "FIR" ? "📄" : "🌐"}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{selectedNode.label}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedNode.type} Node</p>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <p className="text-slate-400 leading-relaxed font-semibold">Forensic Description:</p>
                  <p className="p-3 bg-slate-950/40 border border-slate-850 rounded text-slate-300 leading-relaxed italic">
                    "{selectedNode.details}"
                  </p>
                </div>

                {/* CENTRAL CENTRALITY INSIGHT */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Syndicate Degree Centrality</p>
                    <p className="font-bold text-slate-300">{getNodeCentrality(selectedNode.id)} Linked Nodes</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Central Risk Priority</p>
                    <p className={`font-black uppercase ${
                      getNodeCentrality(selectedNode.id) >= 3 ? "text-red-500" : "text-slate-400"
                    }`}>
                      {getNodeCentrality(selectedNode.id) >= 3 ? "CRITICAL RISK" : "OBSERVATION"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                No active node selected. Click on any network vertex point or suspect node to query deep CCTNS forensic dockets.
              </div>
            )}
          </div>

          <div className="p-3.5 bg-blue-950/20 border border-blue-900/20 rounded-xl">
            <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Syndicate centrality metrics
            </h4>
            <p className="text-[10px] text-blue-300 leading-normal">
              High centrality nodes indicate mastermind nodes or central mules. Section 106 BNSS triggers automatic freezing on central holding nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
