from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load model
MODEL_PATH = os.path.join("ml-service", "duration_model.pkl")
print("Looking for model at:", os.path.abspath(MODEL_PATH))

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully.")
except FileNotFoundError:
    raise Exception(f"❌ Model file not found at {MODEL_PATH}")
except Exception as e:
    raise Exception(f"❌ Error loading model: {str(e)}")

@app.route("/predict-duration", methods=["POST"])
def predict_duration():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    task_name = data.get("name")

    if not task_name:
        return jsonify({"error": "Task name is required"}), 400

    try:
        predicted = model.predict([task_name])[0]
        return jsonify({
            "duration": round(predicted, 2),  # 🔥 KEY FIX: renamed key to "duration"
            "task_name": task_name
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": bool(model)})

if __name__ == "__main__":
    app.run(port=5001, debug=False, use_reloader=False)
