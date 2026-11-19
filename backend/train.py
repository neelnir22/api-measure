import os
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import joblib

def train_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "city_day.csv")
    model_path = os.path.join(current_dir, "model.pkl")

    print(f"Loading dataset from: {csv_path}")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    # Read city_day.csv from the same folder
    df = pd.read_csv(csv_path)

    # Select 6 features and target "AQI"
    features = ["PM2.5", "PM10", "NO2", "CO", "SO2", "O3"]
    target = "AQI"
    cols_to_use = features + [target]

    print(f"Original records: {len(df)}")

    # Drop rows with missing values in these columns
    df_clean = df[cols_to_use].dropna()
    print(f"Cleaned records for training: {len(df_clean)}")

    X = df_clean[features]
    y = df_clean[target]

    # Split dataset into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train RandomForestRegressor with specified hyperparameters
    print("Training RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)...")
    model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate predictions on test set
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    print(f"R2 score: {r2:.4f}")

    # Save trained model as model.pkl using joblib
    joblib.dump(model, model_path)
    print(f"Model successfully saved to: {model_path}")

    return model, r2

if __name__ == "__main__":
    train_model()
