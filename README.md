# BreatheWise AI – Your Smart Urban Air Quality Assistant 🌿

> **Competition-Ready GenAI Web Application for Winter Smog Navigation, Sustainable Routines & Verified Environmental Impact Tracking**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Gemini API](https://img.shields.io/badge/AI-Google_Gemini_API-4285F4?logo=google&logoColor=white)](https://aistudio.google.com)
[![Open-Meteo](https://img.shields.io/badge/AQI_Data-Open--Meteo_%26_Copernicus_CAMS-10b981)](https://open-meteo.com)

---

## 📌 Problem Statement & Overview

Severe winter smog and urban air pollution pose an escalating health crisis across major metropolitan basins worldwide. Due to the **diurnal winter thermal inversion layer**, ground-level temperatures drop sharply during nocturnal and early morning hours, trapping fine particulate matter (**PM2.5** and **PM10**), vehicular nitrogen oxides (**NO2**), and combustion gases directly in the human breathing zone.

Standard surgical and cloth masks fail to filter particles under 3 microns, while outdoor hyperventilation during morning jogging or cycling can deliver an alveolar particulate dose exceeding 20 cigarettes per hour.

**BreatheWise AI** is a full-stack, commercial-grade GenAI application designed to empower individuals, families, and commuters to safely navigate smog episodes through:
1. **Real-time Air Quality Intelligence**: Live AQI, PM2.5, PM10, trace gases, and 24-hour predictive curves powered by Open-Meteo and Copernicus CAMS.
2. **Google Gemini Copilot**: Atmospheric science and epidemiology explained in warm, actionable language with instant fallbacks.
3. **Diurnal Smart Routine Generator**: Hour-by-hour schedules mapped to solar convection cycles, shifting outdoor activities to clean midday windows.
4. **Indoor Air Quality (IAQ) Masterplan**: Room-by-room audit (bedroom nocturnal sealing, kitchen exhaust & induction guidance, damp mopping protocols, NASA-proven flora).
5. **Eco-Friendly Travel Matrix**: Balances carbon emissions against lung inhalation dosage across Metro, electric bus, carpool, and active travel.
6. **Verified Carbon Avoidance Tracker**: Log daily sustainable actions, earn eco badges, maintain streaks, and audit mathematical carbon calculations.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with fast hot module replacement |
| **Styling** | Tailwind CSS | Sleek emerald, dark-blue, and clean glassmorphism UI |
| **Charts** | Recharts & SVG | 24-hour diurnal pollution curve with AQI thresholds |
| **Icons** | Lucide React | Modern, lightweight iconography |
| **Backend** | Python 3.11+ / 3.14+, FastAPI, Uvicorn | Async REST API with automatic Swagger docs |
| **GenAI** | Google Gemini API (1.5 / 2.0 / 2.5 Flash) | Context-aware reasoning on smog and epidemiology |
| **AQI Data** | Open-Meteo & Copernicus CAMS | Global real-time air quality & geocoding without API keys |
| **Deployment** | Vercel (Frontend), Render (Backend) | Production-ready cloud orchestration |

---

## 📂 Project Architecture

```
BreatheWise-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app with CORS & static app server
│   │   ├── config.py                   # Environment settings & Gemini API keys
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py              # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── air_quality_service.py  # Open-Meteo & geocoding integration
│   │   │   ├── gemini_service.py       # Google Gemini client + autonomous engine
│   │   │   ├── routine_service.py      # Diurnal routine schedule generator
│   │   │   ├── travel_service.py       # Modal CO2 vs inhalation risk matrix
│   │   │   └── impact_service.py       # Verified carbon mitigation & IAQ tips
│   │   ├── data/
│   │   │   └── default_cities.json     # Smog hotspots (Delhi, Lahore, Beijing, etc.)
│   │   └── static/
│   │       └── index.html              # Standalone embedded web client
│   ├── requirements.txt
│   ├── .env.example
│   ├── .env
│   └── Procfile
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json                     # Vercel deployment rewrite rules
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── client.js               # Centralized API fetcher
│       ├── context/
│       │   ├── AirQualityContext.jsx   # City selection & AQI state
│       │   └── ImpactContext.jsx       # Carbon tracker & streak state
│       ├── utils/
│       │   ├── aqiUtils.js             # EPA AQI color/health categorizer
│       │   └── formatters.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── CitySearchModal.jsx
│       │   ├── HealthAlertBanner.jsx
│       │   └── Common/ (Card, Badge, Button, StatMetric)
│       └── views/
│           ├── LandingPage.jsx         # Modern hero landing section
│           ├── DashboardView.jsx       # Circular AQI gauge & 24h trend chart
│           ├── AssistantView.jsx       # Gemini AI Copilot chat interface
│           ├── RoutineView.jsx         # Persona-tailored diurnal routine
│           ├── IndoorView.jsx          # Room-by-room IAQ masterplan
│           ├── TravelView.jsx          # Eco travel & inhalation risk matrix
│           ├── ImpactView.jsx          # Verified carbon tracker & badges
│           └── LearnView.jsx           # Winter inversion & mask guide
├── render.yaml                         # Render Infrastructure as Code
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Local Execution

### 1. Prerequisites
- Python 3.10+ (Python 3.11, 3.12, 3.13, 3.14 verified)
- Node.js 18+ and npm (for React Vite development)
- *(Optional)* Google Gemini API Key: [Get a free key here](https://aistudio.google.com/app/apikey)

### 2. Backend Setup & Instant Preview
```bash
# Clone or navigate to the repository
cd BreatheWise-AI

# Create and activate Python virtual environment
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Configure your Gemini API key (optional - autonomous fallback engine active by default)
# Edit .env file:
# GEMINI_API_KEY=your_gemini_key_here

# Run the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Open **`http://localhost:8000`** in your browser. The embedded BreatheWise AI web application and Swagger API documentation at `/docs` will immediately load!

---

### 3. Frontend Development (React + Vite)
```bash
# Open a new terminal and navigate to frontend
cd BreatheWise-AI/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open **`http://localhost:5173`** to access the hot-reloading React + Tailwind CSS dashboard connected to the backend.

---

## 🧪 Testing the API Suite

Run the automated end-to-end test suite inside the backend virtual environment:
```bash
cd backend
.\venv\Scripts\python -c "
import asyncio, httpx
from app.main import app

async def run_tests():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url='http://test') as client:
        print('Testing /api/health...', (await client.get('/api/health')).status_code)
        print('Testing /api/air-quality...', (await client.get('/api/air-quality?city=Delhi')).status_code)
        print('Testing /api/chat...', (await client.post('/api/chat', json={'message': 'Why does smog peak in mornings?'})).status_code)
        print('Testing /api/routine...', (await client.post('/api/routine', json={'city': 'Delhi', 'aqi': 240, 'lifestyle': 'office_worker'})).status_code)
        print('Testing /api/travel...', (await client.post('/api/travel', json={'city': 'Delhi', 'distance_km': 15.0, 'current_aqi': 200})).status_code)

asyncio.run(run_tests())
"
```

---

## 🚀 Deployment Instructions

### A. Deploy Backend to Render
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Select your repository.
4. Set root directory to `backend`.
5. Environment: **Python 3**.
6. Build Command: `pip install -r requirements.txt`
7. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `ALLOWED_ORIGINS`: `*` (or your Vercel frontend URL).
9. Click **Deploy**. Your API will be live at `https://your-app.onrender.com`.

### B. Deploy Frontend to Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository and set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. In **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://your-app.onrender.com`).
5. Click **Deploy**. Your app will be live globally on Vercel's Edge CDN.

---

## 🔬 Scientific Methodology & Calculation Standards

### 1. Inhalation Dosage vs Physical Exertion
Normal resting respiration is approximately **6 to 8 liters of air per minute**. During vigorous outdoor cycling or running, minute ventilation surges to **50 to 80 liters per minute**. In an AQI environment of 250+ (PM2.5 &gt; 150 µg/m³), an athlete inhales over **750 µg of fine particulate matter per hour**, equivalent to smoking an entire pack of cigarettes. For this reason, BreatheWise AI explicitly marks active transit as **Critical Risk** during severe smog alerts and recommends filtered electric rail transit.

### 2. Carbon Avoidance Benchmarks
Emissions calculations conform to **DEFRA 2024 Passenger Transport Standards**:
- **Solo Petrol Car**: `0.192 kg CO2e / km`
- **Carpool (3 passengers)**: `0.064 kg CO2e / passenger-km`
- **Electric Metro Rail**: `0.018 kg CO2e / passenger-km`
- **Electric Bus (BRT)**: `0.038 kg CO2e / passenger-km`

A daily 15 km round-trip switch from driving to Metro avoids:
$$\text{CO}_2 \text{ Avoided} = 15 \times (0.192 - 0.018) \approx 2.61 \text{ kg CO}_2\text{e / day}$$

---

## 📄 License
MIT License. Free for educational, academic, and competition use.
Built with ❤️ for clean urban air and resilient communities.
