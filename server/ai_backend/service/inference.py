# ai_backend/service/inference.py
import joblib
import numpy as np
import pandas as pd
from .config import MODEL_PATH, FEATURE_COLUMNS


_model = None


def load_model():
    """Lazy-load the trained model."""
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def _to_dataframe(payload: dict) -> pd.DataFrame:
    """
    Convert incoming JSON into a pandas DataFrame
    with the exact same column order used in training.
    """
    row = []
    for col in FEATURE_COLUMNS:
        value = payload.get(col, 0)
        row.append(float(value))
    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


def _compute_agent_scores(features: dict) -> dict:
    """
    Compute the 4 'AI Agent Scores' for the dashboard, in %
    (these are UI helpers derived from raw inputs).
    """
    wf = float(features.get("work_frequency", 0))          # 0–20
    ts = float(features.get("task_success_rate", 0)) * 100 # already 0–1
    rh = float(features.get("repayment_history", 0))       # 0–20
    dh = float(features.get("default_history", 0))         # 0–10
    act = float(features.get("platform_activity_score", 0))  # 0–100

    # Simple normalisations just for demo
    work_freq_score = max(0, min(100, wf / 20 * 100))
    task_success_score = max(0, min(100, ts))
    repay_score = max(0, min(100, (rh - dh + 10) / 20 * 100))
    activity_score = max(0, min(100, act))

    return {
        "work_frequency_agent": round(work_freq_score, 1),
        "task_success_rate_agent": round(task_success_score, 1),
        "repayment_history_agent": round(repay_score, 1),
        "activity_agent": round(activity_score, 1),
    }


def _risk_from_score(score: float) -> str:
    if score >= 75:
        return "Low Risk"
    if score >= 50:
        return "Medium Risk"
    return "High Risk"


def _loan_limit_from_score(score: float) -> int:
    """
    Very simple rule: 0–100 score → 0–1000 loan.
    """
    return int(max(0, min(1000, score * 10)))


def predict_karma(payload: dict) -> dict:
    """
    Main function called by FastAPI.
    Returns everything the dashboard needs.
    """
    model = load_model()
    df = _to_dataframe(payload)
    karma_score = float(model.predict(df)[0])

    risk_category = _risk_from_score(karma_score)
    loan_limit = _loan_limit_from_score(karma_score)
    agent_scores = _compute_agent_scores(payload)

    # Optional summary cards for the top section of UI
    tasks_completed = int(payload.get("work_frequency", 10) * 3)
    total_earnings = round(tasks_completed * 75, 2)
    active_streak = max(1, int(payload.get("profile_age", 3)))
    avg_rating = float(payload.get("company_rating", 4.3))

    return {
        "karma_score": round(karma_score, 2),
        "risk_category": risk_category,
        "loan_limit": loan_limit,
        "agent_scores": agent_scores,
        "summary": {
            "tasks_completed": tasks_completed,
            "total_earnings": total_earnings,
            "active_streak_days": active_streak,
            "average_rating": avg_rating,
        },
    }
