# 🛡️ ARTHGUARD
### Intelligent Financial Fraud Detection, Investigation & Fund-Flow Analysis

**CitiHackathon 2026**

> Transforming complex financial fraud investigations into structured, visual, and actionable intelligence.

## 🔗 Project Links

- **Live Prototype:** https://lume-rouge-ten.vercel.app
- **GitHub Repository:** https://github.com/shreyapachpute/CitiHackathon_2026

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Project Objectives](#-project-objectives)
- [How ARTHGUARD Works](#️-how-arthguard-works)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Build and Validation](#-build-and-validation)
- [Future Scope](#-future-scope)
- [Security & Responsible Use](#-security--responsible-use)
- [Contributing](#-contributing)
- [Project Status](#-project-status)

---

## 🚨 1. Problem Statement

Financial fraud is becoming increasingly complex as suspicious transactions, interconnected accounts, identity misuse, and multiple layers of fund transfers make investigations more challenging.

Traditional investigation workflows may require analysts to examine transaction records, identify suspicious patterns, trace the movement of money, and establish relationships between potentially connected entities across multiple sources.

This creates several challenges:

- **Fragmented information:** Relevant transaction and identity information can be difficult to examine together.
- **Complex fund tracing:** Following the movement of money across multiple transactions and connected entities can be time-consuming.
- **Hidden relationships:** Connections between accounts, identities, and suspicious activities may not be immediately apparent in tabular records.
- **Investigation overhead:** Manually reviewing suspicious activity and organizing supporting evidence can increase investigation time.
- **Limited visual context:** Transaction lists alone may not clearly communicate the relationships and patterns involved in a potential fraud case.

### Core Problem

How can financial institutions and investigators use a unified, visual, and structured platform to identify suspicious financial activity, explore fund flows, examine connected identities, and support more efficient fraud investigations?

---

## 💡 2. Proposed Solution

**ARTHGUARD** is a financial fraud detection and investigation platform designed to bring customer-facing fraud reporting and investigator-focused analysis into a unified interface.

The platform provides workflows for reporting suspicious activity, reviewing fraud cases, examining risk-related information, and exploring relationships through graph-based visualizations.

Instead of relying exclusively on transaction tables, ARTHGUARD aims to help users understand potential fraud patterns by organizing relevant information into connected investigation views.

### How ARTHGUARD Addresses the Problem

| Problem | ARTHGUARD's Approach |
|---|---|
| Suspicious activity is difficult to review | Structured customer fraud-reporting and investigator workflows |
| Fund movement is complex to trace | Fund-flow graph visualization |
| Relationships between identities are difficult to identify | Identity-link graph visualization |
| Investigation information is spread across different views | Unified customer and investigator interfaces |
| Risk information requires contextual review | Investigation workspaces and fraud-case review interfaces |
| Repetitive interface development | Reusable React components and shared application state |

*The capabilities described above represent the platform's intended purpose and implemented interface workflows. Live banking integrations, automated fraud detection, and production data processing depend on the actual connected services and implementation.*

---

## 🎯 3. Project Objectives

- Provide a unified interface for financial fraud reporting and investigation.
- Make potential fund movement patterns easier to explore visually.
- Represent relationships between identities and related entities.
- Support structured review of suspicious activity and fraud cases.
- Improve the usability of investigation workflows through modular dashboards.
- Establish a foundation for future integration with fraud detection models, backend services, and secure databases.

---

## ⚙️ 4. How ARTHGUARD Works

The prototype is organized around the following investigation workflow:

**Customer Activity → Fraud Reporting → Investigation Review → Risk Analysis → Relationship Exploration → Investigation Support**

### Step 1 — Customer Activity

The customer-facing interface provides access to payment-related workflows and fraud reporting.

### Step 2 — Fraud Reporting

Users can access the fraud-reporting interface to submit information about suspicious activity.

### Step 3 — Investigation Review

The investigator dashboard provides an investigation-focused workspace for reviewing fraud cases and related information.

### Step 4 — Risk Analysis

Risk-related views and investigation modals help organize information for further examination.

### Step 5 — Graph-Based Exploration

The graph components support visual exploration of:

- Fund flows between related entities.
- Connections between identities and associated entities.

### Step 6 — Investigation Support

The platform brings the relevant interface elements together to support case review and help investigators examine potential relationships.

**Note:** This workflow describes the prototype's intended functionality. It does not imply that every stage is connected to a live backend or automated fraud detection engine.

---

## ✨ 5. Key Features

### 👤 Customer Dashboard

- Customer-facing dashboard
- Payment initiation workflow
- Fraud-reporting interface

### 🔎 Investigator Dashboard

- Investigation-focused dashboard
- Fraud case review
- Risk workspace
- Investigation-related modal interfaces

### 🕸️ Graph-Based Investigation

- **Fund Flow Graph:** Visual representation of fund movement and related entities.
- **Identity Link Graph:** Visual exploration of connections between identities and entities.

### 🧩 Modular Application Architecture

- Reusable React components
- Shared application state
- TypeScript data models
- Centralized formatting utilities
- Organized customer and investigator components

### 🔐 Security-Conscious Development

- Separation of application components and data models
- Git-based version control
- Scope for future authentication, authorization, audit trails, and secure backend integration

---

## 🛠️ 6. Technology Stack

The following technologies are used in the current frontend repository and support its development.

| Technology | Purpose |
|---|---|
| React | Builds the interactive customer and investigator interfaces |
| TypeScript | Provides typed application code and data models |
| Vite | Runs the development server and builds the frontend |
| CSS | Styles dashboards, modals, and other interface components |
| npm | Installs and manages JavaScript dependencies |
| Git | Tracks code changes and supports collaborative development |
| GitHub | Hosts the repository and supports version control |

### Technology Usage by Application Layer

| Layer | Technology | Usage |
|---|---|---|
| User Interface | React | Customer and investigator dashboards |
| Application Logic | TypeScript | UI logic, data structures, and component behaviour |
| Styling | CSS | Layout, visual hierarchy, and interface styling |
| Visualization | React graph components | Fund-flow and identity-link views |
| Development Tooling | Vite | Local development and production builds |
| Dependency Management | npm | Package installation and scripts |
| Version Control | Git and GitHub | Branches, commits, and collaboration |

Additional libraries may be present in `package.json`. Backend frameworks, databases, and AI/ML tools should be documented as implemented technologies only after their integration has been verified.

---

## 🏗️ 7. System Architecture

The current repository is organized as a React and TypeScript frontend.

```text
                 ┌────────────────────────┐
                 │       ARTHGUARD        │
                 │    User Interface      │
                 └───────────┬────────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
      ┌────────▼────────┐       ┌──────────▼─────────┐
      │    Customer     │       │    Investigator   │
      │    Dashboard    │       │    Dashboard      │
      └────────┬────────┘       └──────────┬─────────┘
               │                           │
      ┌────────▼────────┐       ┌──────────▼─────────┐
      │ Payment and     │       │ Fraud Case and    │
      │ Fraud Reporting │       │ Risk Workspaces   │
      └─────────────────┘       └──────────┬─────────┘
                                           │
                                ┌──────────▼─────────┐
                                │ Graph Visualizations│
                                │ Fund Flow & Identity│
                                └────────────────────┘
```

This diagram illustrates the major interface areas, not a verified end-to-end production architecture. Backend services, database persistence, and AI/ML processing should be added to the architecture when their actual integration is available.

---

## 📁 8. Project Structure

```text
ARTHGUARD/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── customer/
│   │   ├── graphs/
│   │   └── investigator/
│   ├── context/
│   ├── data/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Directory Responsibilities

- `components/common/` — Shared interface elements and navigation
- `components/customer/` — Customer dashboard and customer workflows
- `components/investigator/` — Investigation dashboards and case-related interfaces
- `components/graphs/` — Fund-flow and identity-link visualizations
- `context/` — Shared application state
- `data/` — Seed data
- `types/` — TypeScript interfaces and type definitions
- `utils/` — Formatting and reusable utility functions

---

## 🚀 9. Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/shreyapachpute/CitiHackathon_2026.git
```

### Step 2 — Navigate to the Project

```bash
cd CitiHackathon_2026
```

### Step 3 — Install Dependencies

```bash
npm install
```

### Step 4 — Start the Development Server

```bash
npm run dev
```

### Step 5 — Open the Application

Open the local URL displayed in the terminal. The default Vite URL is commonly:

`http://localhost:5173/`

The actual URL may differ if the default port is already in use.

---

## 🧪 10. Build and Validation

### Create a Production Build

```bash
npm run build
```

### Run the Configured Linter

```bash
npm run lint
```

These commands use the scripts configured in `package.json`. Review any errors before considering the build ready for deployment.

---

## 🔮 11. Future Scope

Potential future enhancements include:

- Integration with backend APIs and persistent storage.
- Transaction risk scoring and evaluated fraud detection models.
- More advanced fund-flow tracing across connected entities.
- Improved identity relationship analysis.
- Real-time alerts for suspicious activity.
- Investigation reports and evidence audit trails.
- Authentication, role-based authorization, and stronger data protection.
- Testing against representative, appropriately anonymized datasets.
- Deployment with monitoring, logging, and operational safeguards.

---

## 🔐 12. Security & Responsible Use

ARTHGUARD is intended to support fraud investigation, not replace professional judgment.

- Never commit API keys, passwords, access tokens, or confidential environment files.
- Use synthetic or appropriately anonymized financial data during development.
- Apply access controls before exposing sensitive investigation information.
- Validate permissions and inputs on the server when backend services are integrated.
- Treat risk indicators as signals for further investigation, not conclusive proof of fraud.
- Evaluate automated models for accuracy, bias, and false positives before real-world use.

---

## 🤝 13. Contributing

ARTHGUARD is developed collaboratively using Git and GitHub.

1. Work on your assigned feature branch.
2. Make changes within your assigned area.
3. Test your changes locally.
4. Stage only the files you personally modified.
5. Commit with a clear, descriptive message.
6. Push your branch and open a pull request for review.

Example:

```bash
git switch feature/frontend
git add src/App.tsx
git commit -m "Improve frontend interface"
git push -u origin feature/frontend
```

Replace `src/App.tsx` with the actual file you modified. Avoid staging unrelated changes from other contributors.

---

## 📍 14. Project Status

ARTHGUARD is a hackathon project under active development. The current repository provides a modular React and TypeScript frontend with customer workflows, investigator interfaces, graph components, and shared application state.

The completeness of backend integration, persistent data storage, automated fraud detection, and production deployment depends on the implementation of those components.

---

### Built for CitiHackathon 2026

**ARTHGUARD — Making financial fraud investigation more visual, structured, and actionable.**
