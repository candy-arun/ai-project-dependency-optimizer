// server/routes/mlRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// 🔗 your deployed ML service URL
const ML_SERVICE_URL = "https://ai-project-dependency-optimizer-ml.onrender.com";

router.post("/predict-duration", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Task name is required" });
    }

    // Forward request to ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict-duration`, {
      name,
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error calling ML service:", error.message);
    res.status(500).json({ error: "ML service failed" });
  }
});

export default router;
