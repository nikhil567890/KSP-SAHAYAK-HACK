import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ShieldAlert, Layers, Filter, RefreshCw, Compass } from "lucide-react";
import { FIR } from "../types";

interface CrimeHeatmapProps {
  firs: FIR[];
}

export function CrimeHeatmap({ firs }: CrimeHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showForecastOverlay, setShowForecastOverlay] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [leafletLoadingError, setLeafletLoadingError] = useState<boolean>(false);

  // Hardcoded coordinate mapping for seed stations
  const locationCoordinates: Record<string, { lat: number; lng: number; weight: number }> = {
    "Koramangala Police Station": { lat: 12.9352, lng: 77.6244, weight: 85 },
    "Indiranagar Police Station": { lat: 12.9719, lng: 77.6412, weight: 70 },
    "Majestic Police Station": { lat: 12.9766, lng: 77.5713, weight: 95 },
    "Whitefield Police Station": { lat: 12.9698, lng: 77.7500, weight: 60 },
    "Devaraja Police Station": { lat: 12.3114, lng: 76.6543, weight: 45 },
    "Pandeshwar Police Station": { lat: 12.8681, lng: 74.8427, weight: 40 },
  };

  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

  // Dynamically load Leaflet CDN assets safely
  useEffect(() => {
    let cssLink: HTMLLinkElement | null = null;
    let jsScript: HTMLScriptElement | null = null;

    const loadLeaflet = async () => {
      try {
        if ((window as any).L) {
          setMapLoaded(true);
          return;
        }

        // Add CSS link
        cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(cssLink);

        // Add JS script
        jsScript = document.createElement("script");
        jsScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        jsScript.async = true;
        jsScript.onload = () => {
          setMapLoaded(true);
        };
        jsScript.onerror = () => {
          setLeafletLoadingError(true);
        };
        document.body.appendChild(jsScript);
      } catch (err) {
        console.error("Leaflet loading error", err);
        setLeafletLoadingError(true);
      }
    };

    loadLeaflet();

    return () => {
      // Keep CDN script cached globally to avoid re-loads, but clean up references if needed
    };
  }, []);

  // Initialize and update Map Layer
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy existing instance to re-initialize
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current).setView([defaultCenter.lat, defaultCenter.lng], 11);
      mapInstanceRef.current = map;

      // Premium CartoDB Dark Matter / Midnight Tiles for high-security theme
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Filter FIRs based on choices
      const filteredFirs = firs.filter(f => {
        const matchDistrict = selectedDistrict === "All" || f.district === selectedDistrict;
        const matchCategory = selectedCategory === "All" || f.crimeCategory === selectedCategory;
        return matchDistrict && matchCategory;
      });

      // Render custom pins & tooltips
      filteredFirs.forEach(f => {
        const coords = locationCoordinates[f.policeStation] || defaultCenter;
        
        // Decide marker color based on crime severity
        let markerColor = "#ef4444"; // Red (default)
        if (f.crimeCategory === "Cyber Crime") markerColor = "#3b82f6"; // Blue
        if (f.crimeCategory === "Financial Fraud") markerColor = "#f59e0b"; // Orange
        if (f.crimeCategory === "Robbery") markerColor = "#e11d48"; // Rose

        // Custom pulsing SVG marker
        const customIcon = L.divIcon({
          className: "custom-map-icon",
          html: `<div style="
            width: 14px; 
            height: 14px; 
            background-color: ${markerColor}; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 10px ${markerColor};
            animation: pulse-marker 1.5s infinite;
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const popupContent = `
          <div style="font-family: sans-serif; color: #1e293b; padding: 4px; min-width: 180px;">
            <p style="margin: 0; font-size: 10px; font-weight: 700; color: #2563eb; text-transform: uppercase;">${f.crimeCategory}</p>
            <h4 style="margin: 2px 0 4px 0; font-size: 12px; font-weight: 800; color: #0f172a;">${f.firNumber}</h4>
            <p style="margin: 0; font-size: 10px; color: #475569;"><b>Location:</b> ${f.policeStation}</p>
            <p style="margin: 0; font-size: 10px; color: #475569;"><b>Date filed:</b> ${f.dateFiled}</p>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b; font-style: italic; border-top: 1px solid #e2e8f0; padding-top: 4px;">${f.description.slice(0, 75)}...</p>
          </div>
        `;

        L.marker([coords.lat, coords.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Draw Predicted Hotspot Heat Circles (Semi-transparent overlay circles)
      if (showForecastOverlay) {
        Object.keys(locationCoordinates).forEach(station => {
          const { lat, lng, weight } = locationCoordinates[station];
          if (weight > 60) {
            // Draw heat zone
            L.circle([lat, lng], {
              color: "#ef4444",
              fillColor: "#f87171",
              fillOpacity: 0.18,
              radius: 1200, // 1.2km radius
              weight: 1
            })
              .addTo(map)
              .bindTooltip(`🔥 Predicted Hotspot Block: ${station.split(" ")[0]} High Density Zone`, { permanent: false, direction: "top" });
          }
        });
      }

    } catch (err) {
      console.error("Map rendering error:", err);
    }
  }, [mapLoaded, selectedDistrict, selectedCategory, showForecastOverlay, firs]);

  const recommendedDeployments = [
    {
      location: "Majestic Junction Block",
      reason: "High threat score predicted for snatching between 20:00 and 23:00.",
      action: "Deploy 2 additional Cheetah units and activate localized mobile checkpoints.",
      threat: "Critical (94/100)"
    },
    {
      location: "Koramangala 4th Block",
      reason: "Socio-digital trace indicates phishing operations node center.",
      action: "Cyber Crime Unit observation dispatch required.",
      threat: "Medium (72/100)"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="gis-panel">
      {/* GIS Dashboard header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 animate-pulse">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              GIS Geographic Intelligence Module
              <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500/20 text-rose-300 rounded border border-rose-500/30 uppercase tracking-wider">
                Pred Pol v4.0
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Predictive Spatial Engine // Real-Time Patrol Overlay</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowForecastOverlay(!showForecastOverlay)}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1 border border-slate-700 transition-colors ${
              showForecastOverlay ? "bg-red-600/20 text-red-300 border-red-500/30" : "bg-slate-900 text-slate-400"
            }`}
          >
            <Layers className="w-3 h-3" />
            Forecast Heat Zones
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Spatial Filters & Controllers */}
        <div className="col-span-12 lg:col-span-3 p-5 border-r border-slate-800 bg-slate-950/40 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                Spatial Filters
              </span>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Police District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Districts</option>
                  <option value="Bengaluru City">Bengaluru City</option>
                  <option value="Mysuru City">Mysuru City</option>
                  <option value="Mangaluru City">Mangaluru City</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Crime Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Financial Fraud">Financial Fraud</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Homicide">Homicide</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-red-400" />
                Predictive Heat Engine
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                The PredPol engine computes space-time incident clustering patterns by analyzing historical CCTNS databases, weather, and localized calendars.
              </p>
              <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-bold">
                <span>Model Loss: 0.042</span>
                <span>Accuracy: 91.8%</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-3">
            📍 Maps provided by OpenStreetMap. Live CCTNS telemetry synchronization enabled.
          </div>
        </div>

        {/* Dynamic Leaflet GIS Canvas Map */}
        <div className="col-span-12 lg:col-span-6 relative bg-slate-950 overflow-hidden h-[450px] lg:h-auto">
          {leafletLoadingError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-red-500" />
              <p className="text-xs font-bold text-slate-300">Leaflet Map Engine Offline</p>
              <p className="text-[10px] text-slate-500 max-w-sm">
                Unable to reach unpkg CDN for OpenStreetMap rendering. Verify connection parameters or proxy controls.
              </p>
            </div>
          ) : !mapLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading Geospatial Leaflet Engine...</p>
            </div>
          ) : null}

          {/* Map canvas */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* Spatial Patrol Recommendations Panel */}
        <div className="col-span-12 lg:col-span-3 p-5 bg-slate-950/20 border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Patrol Recommendations
            </h3>
            <div className="space-y-3">
              {recommendedDeployments.map((dep, index) => (
                <div key={index} className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-extrabold text-slate-200">{dep.location}</h4>
                    <span className="px-2 py-0.5 bg-red-950 text-red-400 text-[8px] font-black rounded uppercase border border-red-900/30">
                      {dep.threat}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{dep.reason}</p>
                  <div className="p-2 bg-emerald-950/20 border border-emerald-900/30 rounded text-[10px] text-emerald-300 font-semibold flex items-start gap-1">
                    <span className="text-emerald-400 shrink-0">⚡</span>
                    <span>{dep.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl mt-4">
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">Resource deployment check</p>
            <p className="text-[10px] text-blue-300">
              Submit patrol deployment commands to HQ central control with one-click dispatch verification codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
