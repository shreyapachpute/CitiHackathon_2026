# ArthGuard — Real-Time Digital Payment Fraud Intelligence & Fund-Tracing Platform

**ArthGuard** is an enterprise-grade AI-powered digital payment fraud intelligence, fund-tracing, and identity network graph platform prototype. It demonstrates an automated end-to-end fraud defense workflow between a retail bank customer and a bank fraud operations investigator.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Launch
```bash
# 1. Extract the zip archive and navigate into the folder:
cd ArthGuard

# 2. Install dependencies:
npm install

# 3. Launch the development server:
npm run dev

# 4. Open your browser at:
# http://localhost:5173/
```

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🌟 Architecture & Key Capabilities

### 1. Unified Tablet Layout with Vertical Left Navigation
- **Left-Side Navigation Bar:** Vertical tab bar modeled after modern tablet banking systems (Overview, History, Send Money, Graph Visualizers, Fraud Reports, Freeze Ops, Scenario Studio).
- **Personalized Header:** Live search bar, real-time alert notifications counter, role switcher (Customer vs. Investigator), and step-by-step interactive workflow guide toggle.

### 2. Dual Role-Based Portals with Synchronized State
- **Customer Portal:** Log in as **Aditi Sharma** (`Savings A/C 8853 9945 9962 9942`) with balance ₹2,86,450.00.
  - Deep royal navy card with quick actions grid (Send, Scan QR, History, Dispute, Support).
  - Real-time automated safety score evaluation as soon as a recipient is selected.
  - Payment simulation modal with high-risk confirmation warnings.
  - Transaction history table with safety ratings.
  - 1-click **Report Fraud** for disputed or suspicious transactions.
- **Bank Investigator Portal:** Log in as **Inspector Vikram Rao** (`FIN-INV-04`, Lead Cyber Fraud Cell).
  - Operational KPI stats (Active Alerts, Fraud Cases, High-Risk Volume, Frozen Accounts).
  - Risk workspace with simulated Graph Neural Network & Isolation Forest anomaly telemetry.
  - Behavioral anomaly flags (dormancy break, velocity spikes, geolocational mismatches).
  - Assign and adjust risk scores (0–100), risk levels (Low, Medium, High, Critical), customer explanations, and confidential notes.
  - Fraud incident case management with findings editor.
  - Simulated **Account Freeze Request** workflow requiring nodal bank authorization.
- **Shared Reactive State:** Instant intra-app and cross-window sync via React Context, `localStorage` (`arthguard_app_state_v3`), and `BroadcastChannel` (`arthguard_channel_v3`).

### 3. Dual Interactive Graph Visualizers (4 Pre-Seeded Scenarios)
Switch between 4 realistic fraud scenarios:
1. **₹1.00 Crore Layering Hub:** High-velocity distribution into 10 multi-hop mule layers terminating in ATM cashouts and P2P crypto OTC desks.
2. **Telegram Task & Investment Scam:** Fake crypto task group preying on victims with fast dispersal into foreign remittance accounts.
3. **Hidden Mule Ring & Shared Device Farm:** Synthesized identities sharing phone numbers, IMEI devices, and residential addresses across multiple states.
4. **Clean Merchant (Benchmark):** Legitimate high-volume e-commerce payment gateway operating under normal compliance parameters.

#### Graph 1: Multi-Hop Fund-Flow Tracing Visualizer
- Directional money movement with animated flow particles.
- **Timeline Replay Slider:** Scrub through transaction history with Play, Pause, and speed controls.
- Filters by minimum amount, transaction status (Settled, Flagged, Frozen), and account search.
- Interactive node inspection dossier displaying incoming/outgoing totals, bank names, and freezing controls.

#### Graph 2: Identity Link Network Graph
- Visualizes non-monetary correlations: Shared Mobile Numbers, Residential Addresses, PAN Cards, Device Fingerprints, and Aadhaar identifiers.
- Entity type filters and cluster detection for uncovering organized fraud syndicates.
- Red aura indicators for flagged and frozen syndicate nodes.

---

## 🛠 Tech Stack
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS with Lucide React icons
- **State Management:** Custom React Context with `BroadcastChannel` and `localStorage` persistence
- **Visuals:** SVG Interactive Graph Visualizers with physics simulation and animated canvas/SVG paths

---

## 📄 License
This project is an educational and prototype demonstration for digital payment fraud defense and intelligence.
