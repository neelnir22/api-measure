import os
from typing import Optional
import joblib
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Global model reference
model = None

def get_model_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, "model.pkl")

def load_aqi_model():
    global model
    path = get_model_path()
    if os.path.exists(path):
        model = joblib.load(path)
        print(f"Model loaded successfully from {path}")
    else:
        print(f"Warning: model file not found at {path}. Model will be loaded on first availability.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    load_aqi_model()
    yield

app = FastAPI(
    title="India Air Quality Index (AQI) Predictor API",
    description="FastAPI service serving a RandomForestRegressor trained on CPCB India Air Quality data.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    city: Optional[str] = Field(None, description="Optional city name")
    pm25: float = Field(..., description="PM2.5 concentration in µg/m³")
    pm10: float = Field(..., description="PM10 concentration in µg/m³")
    no2: float = Field(..., description="NO2 concentration in µg/m³")
    co: float = Field(..., description="CO concentration in mg/m³")
    so2: float = Field(..., description="SO2 concentration in µg/m³")
    o3: float = Field(..., description="O3 concentration in µg/m³")

    model_config = {
        "json_schema_extra": {
            "example": {
                "city": "Delhi",
                "pm25": 85.5,
                "pm10": 160.2,
                "no2": 42.1,
                "co": 1.8,
                "so2": 15.4,
                "o3": 38.0
            }
        }
    }

class PredictResponse(BaseModel):
    city: Optional[str] = None
    predicted_aqi: float
    category: str

def get_aqi_category(aqi: float) -> str:
    """Standard Indian Central Pollution Control Board (CPCB) AQI buckets."""
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"

@app.get("/")
def read_root():
    """Health check and service status."""
    return {
        "status": "Live",
        "model": "India AQI RandomForest"
    }

@app.post("/predict", response_model=PredictResponse)
def predict_aqi(payload: PredictRequest):
    """Predict Air Quality Index (AQI) based on 6 core pollutant levels."""
    global model
    if model is None:
        load_aqi_model()
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="Model file (model.pkl) not found. Please run train.py first."
            )

    # Prepare DataFrame matching the exact feature names used during training
    input_data = pd.DataFrame([{
        "PM2.5": payload.pm25,
        "PM10": payload.pm10,
        "NO2": payload.no2,
        "CO": payload.co,
        "SO2": payload.so2,
        "O3": payload.o3
    }])

    raw_prediction = float(model.predict(input_data)[0])
    # AQI values are non-negative
    predicted_aqi = round(max(0.0, raw_prediction), 2)
    category = get_aqi_category(predicted_aqi)

    return PredictResponse(
        city=payload.city,
        predicted_aqi=predicted_aqi,
        category=category
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
