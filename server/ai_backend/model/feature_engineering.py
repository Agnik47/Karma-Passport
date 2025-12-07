import pandas as pd
from sklearn.model_selection import train_test_split
import joblib

def load_data(csv_path="C:/Users/smile/PycharmProjects/Karma_passport/ai_backend/data/karma_dataset.csv"):
    return pd.read_csv(csv_path)


def preprocess(df):
    """Clean & prepare dataset."""
    df = df.drop_duplicates()
    df = df.fillna(0)
    return df

def train_model(df):
    """Train simple model."""
    from sklearn.ensemble import RandomForestRegressor

    X = df.drop("karma_score", axis=1)
    y = df["karma_score"]

    model = RandomForestRegressor(n_estimators=100)
    model.fit(X, y)

    return model

if __name__ == "__main__":
    input_csv = "C:/Users/smile/PycharmProjects/Karma_passport/ai_backend/data/karma_dataset.csv"   # <-- Correct path
    df = load_data(input_csv)
    df = preprocess(df)

    model = train_model(df)

    joblib.dump(model, "C:/Users/smile/PycharmProjects/Karma_passport/ai_backend/model/trained_model.pkl")
    print("Model saved successfully!")
