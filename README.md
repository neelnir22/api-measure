# VayuDrishti | Air Quality Index (AQI) Prediction Microservice

A full-stack, containerized Air Quality Index (AQI) prediction web application designed as a Cloud Computing (Semester 7) project. It predicts Indian Air Quality Index (AQI) and categorizes it according to Central Pollution Control Board (CPCB) standards using a Random Forest Regressor trained on multi-city daily environmental records.

---

## 🏛 Architecture Overview

The system is architected as a microservices monorepo managed via **Docker Compose**:

```
                       ┌────────────────────────────────────────┐
                       │          Client Web Browser            │
                       │         http://localhost:3000          │
                       └──────────────────┬─────────────────────┘
                                          │
                                          │ HTTP Requests
                                          ▼
                       ┌────────────────────────────────────────┐
                       │           Frontend Container           │
                       │     (React + Vite + Nginx Alpine)      │
                       │  - Port 3000 (mapped to container :80) │
                       │  - Multi-stage build (Node 20 -> Nginx)│
                       │  - Tailwind CSS + Interactive Gauges   │
                       │  - City Selection & Auto-Fill          │
                       └──────────────────┬─────────────────────┘
                                          │
                        Internal Network  │ API Requests
                          (aqi-network)   │ http://backend:8000
                                          ▼
                       ┌────────────────────────────────────────┐
                       │           Backend Container            │
                       │          (python:3.11-slim)            │
                       │  - FastAPI REST API on Port 8000       │
                       │  - Uvicorn ASGI Server                 │
                       │  - Baked-in model.pkl (R² = 0.9231)    │
                       │  - scikit-learn, pandas, joblib        │
                       └────────────────────────────────────────┘
```

---

## 📂 Monorepo Structure

```
cloud-project-sem-7/
├── backend/
│   ├── city_day.csv             # CPCB India Air Quality Dataset (2015-2020)
│   ├── requirements.txt         # FastAPI, Uvicorn, scikit-learn, pandas, joblib, pydantic
│   ├── train.py                 # Training script: drops NaNs, fits RandomForest, outputs model.pkl
│   ├── main.py                  # FastAPI service with CORS, GET /, and POST /predict
│   ├── model.pkl                # Pre-trained / baked-in RandomForest model (R² = 0.9231)
│   ├── Dockerfile               # Python 3.11-slim container definition
│   └── .dockerignore            # Build context exclusions
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # React single-page UI with City input, sliders, & category badges
│   │   ├── main.jsx             # React DOM entry point
│   │   ├── index.css            # Tailwind directives and custom sliders
│   │   └── data/
│   │       └── cities.js        # 24 Indian cities with CPCB historical benchmark data
│   ├── index.html               # Vite HTML template
│   ├── package.json             # React 18, Vite 5, Tailwind CSS 3
│   ├── vite.config.js           # Vite build & dev server configuration
│   ├── tailwind.config.js       # Tailwind CSS theme configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── nginx.conf               # Nginx reverse proxy & SPA fallback configuration
│   ├── Dockerfile               # Multi-stage build: Node 20 build -> Nginx Alpine serving :80
│   └── .dockerignore            # Build context exclusions
├── docker-compose.yml           # Root multi-container orchestration
├── run_docker.bat               # Windows batch script to launch Docker Compose
├── run_local.bat                # Windows batch script to run locally without Docker
├── .gitignore                   # Git exclusions
└── README.md                    # Project documentation
```

---

## ✨ Features

- **City-Aware AQI Prediction**: Enter any custom city name or choose from 24 Indian cities (Delhi, Mumbai, Bengaluru, Kolkata, Ahmedabad, Chennai, Hyderabad, Jaipur, Patna, etc.).
- **Automatic Benchmark Pre-Filling**: Selecting a city automatically pre-fills historical average CPCB pollutant values for that city from the Kaggle `city_day.csv` dataset.
- **Interactive Form**: Adjust PM2.5, PM10, NO2, CO, SO2, and O3 values using synchronized number inputs and range sliders.
- **Color-Coded Badges**: Color-coded category tags following standard Indian AQI buckets (Green for Good, Lime for Satisfactory, Yellow for Moderate, Orange for Poor, Red for Very Poor, Purple for Severe).
- **Health Advisories**: Actionable recommendations for the public and sensitive groups based on predicted index.
- **Multi-Stage Dockerfile**: Builds React application in a lightweight `node:20-alpine` environment and serves compiled static assets via `nginx:alpine` (<30MB image).

---

## 🔬 Machine Learning Pipeline

1. **Dataset**: `city_day.csv` (CPCB daily air quality observations from major Indian metropolitan cities).
2. **Features**: 6 primary pollutants:
   - **PM2.5**: Fine particulate matter ($\mu g/m^3$)
   - **PM10**: Coarse particulate matter ($\mu g/m^3$)
   - **NO2**: Nitrogen Dioxide ($\mu g/m^3$)
   - **CO**: Carbon Monoxide ($mg/m^3$)
   - **SO2**: Sulfur Dioxide ($\mu g/m^3$)
   - **O3**: Ground-level Ozone ($\mu g/m^3$)
3. **Target**: `AQI` (Air Quality Index)
4. **Data Cleaning**: Rows with missing values across the 6 features + target are dropped (16,010 clean training instances).
5. **Model Architecture**: `RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)`
6. **Performance**: Achieves an **$R^2$ score of $0.9231$** on unseen test data.
7. **Docker Integration**: `python train.py` is executed inside the backend `Dockerfile` build step, baking the trained model directly into the image.

---

## 🇮🇳 Indian CPCB AQI Categories

Predictions are categorized into standard Indian National Air Quality Index buckets:

| AQI Range | Category | Color Badge | Health Advisory / Impact |
| :--- | :--- | :--- | :--- |
| **0 – 50** | **Good** | 🟢 Green | Minimal health impact. Clean mountain or coastal air. |
| **51 – 100** | **Satisfactory** | 🟢 Lime | Minor breathing discomfort to sensitive individuals. |
| **101 – 200** | **Moderate** | 🟡 Yellow | Breathing discomfort to people with asthma and heart disease. |
| **201 – 300** | **Poor** | 🟠 Orange | Breathing discomfort to most people on prolonged exposure. |
| **301 – 400** | **Very Poor** | 🔴 Red | Respiratory illness on prolonged exposure. N95 masks advised. |
| **401+** | **Severe** | 🟣 Purple / Maroon | Severe emergency health warning; affects healthy individuals. |

---

## 🚀 Running with Docker Compose

Ensure Docker Desktop is running on your system.

### 1. Build and Run Containers
```bash
docker compose up --build
```
*(On Windows, you can alternatively double-click `run_docker.bat`)*

### 2. Access the Application
- **Frontend (React UI)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
#   a p i - m e a s u r e  
 