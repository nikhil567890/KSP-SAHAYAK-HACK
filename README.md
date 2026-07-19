# KSP CCTNS Intelligence Suite 🛡️🚔
### Court-Ready Case Management & AI-Powered Forensic Analytics

An advanced tactical dashboard and AI-powered investigation intelligence system engineered for the **Karnataka State Police (KSP)**. This suite integrates directly with the **Crime and Criminal Tracking Network & Systems (CCTNS)** paradigms, equipping law enforcement officers, investigators, supervisors, and policymakers with powerful spatial, relationship, and cognitive AI-driven analytical capabilities.

---

## 🌟 Key Capabilities & Modules

### 1. 👥 Tactical Syndicate Relationship Network
* **Graph Centrality & Linkage Matrix**: An interactive, dynamic SVG relationship map linking prime accused suspects, digital dockets (FIRs), financial assets (SBI/UPI mule accounts), phone terminals (IMEI), and vehicles.
* **Money Trail Analysis**: Trace structured financial transaction paths and layered money transfers. Detect high-risk cashout gateway accounts flagged for frozen action under Section 106 of the Bharatiya Nagarik Suraksha Sanhita (BNSS).
* **Repositionable Graph Vertices**: Drag-and-drop mechanics to custom-structure and organize complex criminal syndicates.

### 2. 📝 AI Court Case Docket Generator
* **Auto-Synthesized Prosecution Briefs**: Automatically generates magistrate-ready judicial briefs, complete with executive summaries, modus operandi profiling, occurrence chronicles, and forensic checklists.
* **Legal Administrative Sign-Off**: Secure, role-restricted authorization stamps for supervisors and administrators to digitally approve case files before court-compilation.
* **Pro-Grade PDF Export**: Seamlessly downloads high-contrast, official letterhead KSP court-docket documents with unique digital footprint hashes for evidence integrity validation.

### 3. 🔍 CCTNS Similar Case Finder
* **Modus Operandi Correlation Matrix**: Detect crime pattern links by comparing current investigations against legacy dockets in the crime database.
* **Side-by-Side Verification Split-View**: Compares two cases directly—analyzing common locations, common suspect aliases, and shared characteristic parameters to identify organized syndicates.

### 4. 🗺️ GIS Geographic Heatmap
* **Crime Hotspot Mapping**: Visualize crime density clusters, spatial heat maps, and high-incident patrol zones using custom coordinates and radius sliders.
* **Spatial Filters**: Segment spatial data by crime type, season, hour-of-occurrence, and police precinct jurisdictions.

### 5. 💬 AI Investigation Copilot
* **Contextually Grounded Cognitive Assistant**: An interactive conversational partner with direct awareness of FIR dossiers, suspect profiles, forensic materials, and legal statutes.
* **Robust Core Reliability**: Powered by a highly resilient multi-retry backend engine with auto-recovering parser routines designed to handle transient API issues elegantly.

---

## 🛠️ Technical Stack & Architecture

* **Frontend**: React (Vite, TypeScript, Tailwind CSS, Lucide Icons)
* **Animations**: Framer Motion
* **Backend**: Node.js & Express (TypeScript, tsx compiler, bundling with esbuild)
* **AI Core**: Google GenAI SDK (Gemini Integration)
* **PDF Export**: jsPDF

---

## 🚀 Getting Started

To run and run this application locally, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Run Locally

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 🔒 Security & Administrative Controls

The system provides robust Role-Based Access Controls (RBAC) supporting the following roles:
* **Investigator**: Handles initial record data entry, case filing, and general copilot chats.
* **Analyst**: Deep-dives into network relationship charts, visual correlation graphs, and spatial maps.
* **Supervisor / Admin**: Grants official administrative sign-offs, case review approvals, and dossier audits.
* **Policymaker**: Reviews high-level GIS maps and regional crime trends.

---

*Disclaimer: This is an advanced conceptual suite built to demonstrate modernized law enforcement, forensic search matching, and court brief generation workflows under CCTNS and BNSS compliance guidelines.*
