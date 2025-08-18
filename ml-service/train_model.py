# ml-service/train_model.py
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import make_pipeline
import joblib

# Sample training data
data = pd.DataFrame({
    "name": [
        "Design homepage",
        "Write test cases",
        "Setup database",
        "Create login UI",
        "API integration"
    ],
    "duration": [5, 3, 4, 2, 6]
})

X = data["name"]
y = data["duration"]

# Simple model: CountVectorizer + Linear Regression
model = make_pipeline(CountVectorizer(), LinearRegression())
model.fit(X, y)

# Save model
joblib.dump(model, "duration_model.pkl")
print("Model saved as duration_model.pkl")
