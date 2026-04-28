"""
AgroSmart — ML Prediction API (FastAPI).

Endpoints:
  POST /predict   → Accepts soil/climate params, returns crop + confidence
  GET  /health    → Health check
"""

import os
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── Setup ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

app = FastAPI(title="AgroSmart ML Service", version="1.0.0")

# CORS — allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
model = None


@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"WARNING: Model not found at {MODEL_PATH}. Run train.py first.")
        return
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")


# ── Schemas ────────────────────────────────────────────

class PredictionInput(BaseModel):
    """Input parameters for crop prediction."""
    N: float = Field(..., ge=0, le=200, description="Nitrogen content in soil")
    P: float = Field(..., ge=0, le=200, description="Phosphorus content in soil")
    K: float = Field(..., ge=0, le=300, description="Potassium content in soil")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in °C")
    humidity: float = Field(..., ge=0, le=100, description="Humidity in %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")


class PredictionOutput(BaseModel):
    """Prediction result."""
    crop: str
    confidence: float
    all_predictions: list[dict]


# ── Routes ─────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
    }


@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    """Predict the best crop given soil and climate parameters."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train.py first.")

    try:
        features = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])

        # Get prediction and probabilities
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        classes = model.classes_

        # Sort by probability descending
        sorted_indices = np.argsort(probabilities)[::-1]

        # Top 5 predictions
        all_predictions = []
        for idx in sorted_indices[:5]:
            all_predictions.append({
                "crop": str(classes[idx]),
                "confidence": round(float(probabilities[idx]), 4),
            })

        return PredictionOutput(
            crop=prediction,
            confidence=round(float(probabilities[sorted_indices[0]]), 4),
            all_predictions=all_predictions,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
