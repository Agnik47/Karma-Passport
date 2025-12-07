# ai_backend/service/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .inference import predict_karma

app = FastAPI(title="Karma Passport AI Backend")

# CORS so React (localhost:3000 / 5173) can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for hackathon ok, later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class KarmaInput(BaseModel):
    work_frequency: float
    task_success_rate: float
    verified_hours_worked: float
    profile_age: float
    platform_activity_score: float
    task_variety: float
    repayment_history: float
    default_history: float
    company_rating: float


@app.get("/")
def health():
    return {"status": "ok", "message": "Karma Passport AI backend running"}


@app.post("/predict")
def predict(data: KarmaInput):
    """
    Body example (JSON):

    {
      "work_frequency": 12,
      "task_success_rate": 0.92,
      "verified_hours_worked": 160,
      "profile_age": 14,
      "platform_activity_score": 45,
      "task_variety": 18,
      "repayment_history": 10,
      "default_history": 0,
      "company_rating": 4.8
    }
    """
    result = predict_karma(data.dict())
    return result
