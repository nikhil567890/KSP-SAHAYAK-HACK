import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ShieldAlert, Layers, Filter, RefreshCw, Compass } from "lucide-react";
import { FIR } from "../types";

interface CrimeHeatmapProps {
  firs: FIR[];
  language?: "English" | "Kannada";
}

const TRANSLATIONS = {
  English: {
    title: "GIS Geographic Intelligence Module",
    badge: "Pred Pol v4.0",
    subtitle: "Predictive Spatial Engine // Real-Time Patrol Overlay",
    spatialFilters: "Spatial Filters",
    policeDistrict: "Police District",
    allDistricts: "All Districts",
    crimeCategory: "Crime Category",
    allCategories: "All Categories",
    forecastHeatZones: "Forecast Heat Zones",
    patrolRecommendations: "Patrol Recommendations",
    patrolTitle: "Patrol Recommendations",
    resourceDeployment: "Resource deployment check",
    resourceDeploymentDesc: "Submit patrol deployment commands to HQ central control with one-click dispatch verification codes.",
    mapOffline: "Leaflet Map Engine Offline",
    mapOfflineDesc: "Unable to reach unpkg CDN for OpenStreetMap rendering. Verify connection parameters or proxy controls.",
    loadingMap: "Loading Geospatial Leaflet Engine...",
    coordinatesCount: "Total Visualized Coordinates",
    activeHotspots: "Active Hotspots Loaded"
  },
  Kannada: {
    title: "ಜಿಐಎಸ್ ಭೌಗೋಳಿಕ ತೀವ್ರತೆಯ ನಕ್ಷೆ",
    badge: "ಪ್ರೆಡ್ ಪೋಲ್ v4.0",
    subtitle: "ಸ್ಥಳೀಯ ಅಪರಾಧ ಸಾಂದ್ರತೆಯ ಓವರ್ಲೇ // ನೈಜ-ಸಮಯದ ಘಟನೆಗಳ ಕ್ಲಸ್ಟರಿಂಗ್",
    spatialFilters: "ಸ್ಥಳೀಯ ಫಿಲ್ಟರ್‌ಗಳು",
    policeDistrict: "ಪೊಲೀಸ್ ಜಿಲ್ಲೆ",
    allDistricts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    crimeCategory: "ಅಪರಾಧದ ವರ್ಗ",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    forecastHeatZones: "ಮುನ್ಸೂಚನೆ ತೀವ್ರತೆಯ ವಲಯಗಳು",
    patrolRecommendations: "ಗಸ್ತು ಶಿಫಾರಸುಗಳು",
    patrolTitle: "ಸ್ಥಳೀಯ ಗಸ್ತು ಶಿಫಾರಸುಗಳ ಫಲಕ",
    resourceDeployment: "ಸಂಪನ್ಮೂಲ ನಿಯೋಜನೆ ಪರಿಶೀಲನೆ",
    resourceDeploymentDesc: "ಒನ್-ಕ್ಲಿಕ್ ರವಾನೆ ಪರಿಶೀಲನಾ ಕೋಡ್‌ಗಳೊಂದಿಗೆ ಪ್ರಧಾನ ಕಚೇರಿಯ ಕೇಂದ್ರ ನಿಯಂತ್ರಣಕ್ಕೆ ಗಸ್ತು ನಿಯೋಜನೆ ಆಜ್ಞೆಗಳನ್ನು ಸಲ್ಲಿಸಿ.",
    mapOffline: "ಲೀವ್ಲೆಟ್ ಮ್ಯಾಪ್ ಇಂಜಿನ್ ಆಫ್ಲೈನ್ ಆಗಿದೆ",
    mapOfflineDesc: "ನಕ್ಷೆ ಚಿತ್ರಣಕ್ಕಾಗಿ unpkg CDN ಅನ್ನು ತಲುಪಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಸಂಪರ್ಕ ನಿಯತಾಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    loadingMap: "ಭೌಗೋಳಿಕ ಲೀವ್ಲೆಟ್ ಇಂಜಿನ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    coordinatesCount: "ಒಟ್ಟು ದೃಶ್ಯೀಕರಿಸಿದ ನಿರ್ದೇಶಾಂಕಗಳು",
    activeHotspots: "ಸಕ್ರಿಯ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ"
  }
};

export function CrimeHeatmap({ firs, language = "English" }: CrimeHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showForecastOverlay, setShowForecastOverlay] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [leafletLoadingError, setLeafletLoadingError] = useState<boolean>(false);

  const L_LANG = TRANSLATIONS[language];

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
      if (cssLink && document.head.contains(cssLink)) {
        document.head.removeChild(cssLink);
      }
      if (jsScript && document.body.contains(jsScript)) {
        document.body.removeChild(jsScript);
      }
    };
  }, []);

  // Map configuration and initialization
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy existing map instance to prevent leaks on tab switches
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Dark Mode Map tiles for clean, tactical aesthetic
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19
      }).addTo(map);

      // Filter and render FIR incident pin nodes
      const filteredFirs = firs.filter(f => {
        const matchesDistrict = selectedDistrict === "All" || f.policeStation.includes(selectedDistrict.split(" ")[0]);
        const matchesCategory = selectedCategory === "All" || f.crimeCategory === selectedCategory;
        return matchesDistrict && matchesCategory;
      });

      // Custom icon mapping for tactical display
      const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [20, 32],
        iconAnchor: [10, 32],
        popupAnchor: [1, -26],
        shadowSize: [32, 32]
      });

      filteredFirs.forEach(f => {
        const coords = locationCoordinates[f.policeStation] || defaultCenter;
        
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

  const recommendedDeployments = language === "Kannada" ? [
    {
      location: "ಮೆಜೆಸ್ಟಿಕ್ ಜಂಕ್ಷನ್ ಬ್ಲಾಕ್",
      reason: "ರಾತ್ರಿ ೨೦:೦೦ ರಿಂದ ೨೩:೦೦ ರ ನಡುವೆ ಸರಗಳ್ಳತನದ ಹೆಚ್ಚಿನ ಭೀತಿ ಸೂಚ್ಯಂಕ ಮುನ್ಸೂಚನೆ ನೀಡಲಾಗಿದೆ.",
      action: "೨ ಹೆಚ್ಚುವರಿ ಚೀತಾ ಗಸ್ತು ಘಟಕಗಳನ್ನು ನಿಯೋಜಿಸಿ ಮತ್ತು ಮೊಬೈಲ್ ಚೆಕ್‌ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
      threat: "ಅಪಾಯಕಾರಿ (೯೪/೧೦೦)"
    },
    {
      location: "ಕೋರಮಂಗಲ ೪ನೇ ಬ್ಲಾಕ್",
      reason: "ಸಾಮಾಜಿಕ-ಡಿಜಿಟಲ್ ಜಾಡು ಸೈಬರ್ ವಂಚನೆ ಕಾರ್ಯಾಚರಣೆಯ ಕೇಂದ್ರವನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
      action: "ಸೈಬರ್ ಕ್ರೈಮ್ ವಿಭಾಗದ ನಿಗಾ ಮತ್ತು ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ.",
      threat: "ಮಧ್ಯಮ (೭೨/೧೦೦)"
    }
  ] : [
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
              {L_LANG.title}
              <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500/20 text-rose-300 rounded border border-rose-500/30 uppercase tracking-wider">
                {L_LANG.badge}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">{L_LANG.subtitle}</p>
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
            {L_LANG.forecastHeatZones}
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
                {L_LANG.spatialFilters}
              </span>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">{L_LANG.policeDistrict}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">{L_LANG.allDistricts}</option>
                  <option value="Bengaluru City">Bengaluru City</option>
                  <option value="Mysuru City">Mysuru City</option>
                  <option value="Mangaluru City">Mangaluru City</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">{L_LANG.crimeCategory}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">{L_LANG.allCategories}</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Financial Fraud">Financial Fraud</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Homicide">Homicide</option>
                </select>
              </div>
            </div>

            {/* Geographical Stats Panel */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3.5">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{L_LANG.coordinatesCount}</span>
                <div className="text-xl font-black text-slate-100 font-mono">
                  {Object.keys(locationCoordinates).length} Node Pins
                </div>
              </div>
              <div className="border-t border-slate-800/80 pt-2.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{L_LANG.activeHotspots}</span>
                <div className="text-sm font-extrabold text-red-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse block"></span>
                  4 Overlays Detected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Leaflet GIS Canvas Map */}
        <div className="col-span-12 lg:col-span-6 relative bg-slate-950 overflow-hidden h-[450px] lg:h-auto">
          {leafletLoadingError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-red-500" />
              <p className="text-xs font-bold text-slate-300">{L_LANG.mapOffline}</p>
              <p className="text-[10px] text-slate-500 max-w-sm">
                {L_LANG.mapOfflineDesc}
              </p>
            </div>
          ) : !mapLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-400">{L_LANG.loadingMap}</p>
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
              {L_LANG.patrolRecommendations}
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
                  <p className="text-[10px] text-slate-400 leading-relaxed text-justify">{dep.reason}</p>
                  <div className="p-2 bg-emerald-950/20 border border-emerald-900/30 rounded text-[10px] text-emerald-300 font-semibold flex items-start gap-1">
                    <span className="text-emerald-400 shrink-0">⚡</span>
                    <span className="text-justify">{dep.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl mt-4">
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">{L_LANG.resourceDeployment}</p>
            <p className="text-[10px] text-blue-300 text-justify">
              {L_LANG.resourceDeploymentDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
