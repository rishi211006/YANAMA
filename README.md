# YANAMA – Vehicle Intelligence & Analytics

**YANAMA** is a full-stack automotive intelligence and analytics web application designed to analyze operational data collected from **petrol and diesel vehicles**.

The platform processes hardware-generated CSV files, computes derived performance metrics, evaluates rule-based diagnostic alerts, executes statistical frequency spectrum models with AI agent narratives, simulates road trips under varying terrain and payload conditions, and delivers actionable mileage optimization intelligence.

---

## Brand Identity & Design System

The platform strictly uses the official YANAMA color palette:
- **Main application background:** Deep charcoal (`#1D1D1D`)
- **Sidebar background:** Pure black (`#000000`)
- **Dashboard cards & panels:** Charcoal brown (`#4C4643`)
- **Main text / Warm white:** (`#F0EFED`)
- **Secondary text & Accents:** Sage grey (`#A5A78F`)
- **Report & Document backgrounds:** Soft ivory (`#F9F8F3`)

Dual Persona Support:
- **Owner View:** Simplified, non-jargon language explaining car condition and everyday actions.
- **Mechanic View:** Deep parametric diagnostics, component thresholds, and technical fault root-cause analysis. Both views use the same underlying vehicle data.

---

## Core Capabilities

1. **Dashboard & Fleet Health Score (0-100)**
   - Weighted multi-factor health grade across Powertrain, Electrical, Maintenance, Diagnostics, and Fuel.
2. **CSV Data Processing & Ingestion Engine**
   - Direct CSV upload and schema validation for:
     - Engine Data (`rpm`, `torque_nm`, `horsepower`, `coolant_temp_c`, etc.)
     - Fuel Data (`fuel_rate_lph`, `speed_kmph`, `fuel_consumed_liters`, `mileage_kmpl`)
     - Electrical Data (`battery_voltage`, `alternator_voltage`, `current_draw_amps`, `battery_soc_pct`)
     - Maintenance Records (`service_name`, `odometer_km`, `cost`, `status`, etc.)
     - Diagnostic Alerts (`rule_code`, `component`, `severity`, `threshold_value`)
3. **Statistical Engine Performance Report**
   - Parametric frequency distribution histograms (8-bin classification)
   - Percentile spectrum: P25, P50 (median), P75, P95, Min, Max, Mean ($\mu$), Standard Deviation ($\sigma$)
   - Ordinary Least Squares (OLS) regression slope and drift direction
   - **Interactive AI Text Box Agent**: Contextual natural language analysis dynamically generated for the active metric and visualization technique.
4. **Road Trip Planning Simulation**
   - Simulates mechanical durability, fuel burn, and thermal strain comparing the vehicle's **Current Condition** against a **Serviced Condition**.
   - Adjustable terrain (Highway, City, Mountain, Mixed) and payload (Light, Medium, Heavy).
   - Side-by-side fuel consumption, monetary savings, and readiness index.
   - **AI Agent Trip Strategy & Pre-Trip Service Checklist**: Mandatory and recommended service recommendations tailored for the route.
5. **Mileage Intelligence & Optimization Dashboard**
   - Telemetry-derived km/L tracking against road speed.
   - **Drop & Rise Factor Attribution**: Quantifies impact from aggressive throttle, lubrication drag, and thermal non-equilibrium.
   - **AI Recommended Actions**: Prioritized steps with quantified fuel recovery potential (up to +3.5 km/L).
6. **Rule-Based Vehicle Diagnostics**
   - Threshold monitoring (Coolant overtemp >102°C, Battery dip <11.9V, Alternator undercharging <13.2V, High RPM stress).
   - Active fault catalog with dual Owner and Mechanic explanations.
7. **Maintenance & Financial Tracking**
   - Factory maintenance interval scheduler (oil, filters, brake fluid, coolant).
   - Total Cost of Ownership (TCO) breakdown and cost per kilometer.
8. **Automotive Audit Reports**
   - One-click branded PDF health audit export.
   - Processed CSV telemetry dataset exports.

---

## Quick Start & Verification

### Backend (FastAPI + Python 3.13)
```powershell
Set-Location E:\YANAMA\backend
E:\YANAMA\backend\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000
```
- Health Check: `http://127.0.0.1:8000/health`
- Swagger API Docs: `http://127.0.0.1:8000/docs`

### Frontend (React + Vite + TypeScript)
```powershell
Set-Location E:\YANAMA\frontend
npm.cmd run dev
```
- Web Application: `http://localhost:3000`

### Demo Credentials
- **Car Owner:** `demo@yanama.ai` / `password123` (or click "Owner Demo" button)
- **Trainee Mechanic:** `mechanic@yanama.ai` / `password123` (or click "Mechanic Demo" button)
