"""
AgroSmart — Train a Random Forest Classifier for Crop Recommendation.

This script:
  1. Loads the crop recommendation dataset from data/crop_data.csv
  2. Trains a Random Forest model
  3. Evaluates accuracy
  4. Saves the model as model.pkl
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ── Paths ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "crop_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")


def main():
    print("=" * 60)
    print("  AgroSmart — Crop Recommendation Model Training")
    print("=" * 60)

    # 1. Load data
    print("\n[1/4] Loading dataset …")
    df = pd.read_csv(DATA_PATH)
    print(f"  → {len(df)} samples, {df['label'].nunique()} crops")
    print(f"  → Crops: {', '.join(sorted(df['label'].unique()))}")

    # 2. Prepare features / labels
    print("\n[2/4] Preparing features …")
    feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = df[feature_cols].values
    y = df["label"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"  → Train: {len(X_train)}, Test: {len(X_test)}")

    # 3. Train Random Forest
    print("\n[3/4] Training Random Forest (n_estimators=100) …")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"  → Accuracy: {accuracy * 100:.2f}%")
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred))

    # 4. Save model
    print(f"[4/4] Saving model to {MODEL_PATH} …")
    joblib.dump(model, MODEL_PATH)
    print("  → Done!\n")

    # Quick prediction demo
    demo_input = np.array([[90, 42, 43, 20.8, 82.0, 6.5, 202.9]])
    demo_pred = model.predict(demo_input)[0]
    demo_proba = model.predict_proba(demo_input).max()
    print(f"Demo prediction: {demo_pred} (confidence: {demo_proba:.2%})")


if __name__ == "__main__":
    main()
