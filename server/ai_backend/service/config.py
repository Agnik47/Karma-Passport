# ai_backend/service/config.py
from pathlib import Path

# ai_backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# ai_backend/model/trained_model.pkl
MODEL_PATH = BASE_DIR / "model" / "trained_model.pkl"

# feature order used by the model
FEATURE_COLUMNS = [
    "work_frequency",
    "task_success_rate",
    "verified_hours_worked",
    "profile_age",
    "platform_activity_score",
    "task_variety",
    "repayment_history",
    "default_history",
    "company_rating",
]
