const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ AWS PORT FIX
const PORT = process.env.PORT || 3000;

// ✅ Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Health check route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("MindWell backend is running 🚀");
});

// ✅ Questionnaire route
app.post("/submit", (req, res) => {
  const { depression, anxiety, stress } = req.body;

  const total = depression + anxiety + stress;

  const avg = total / 3;

  let result = "";

  if (avg <= 2) result = "Low";
  else if (avg <= 5) result = "Moderate";
  else result = "High";
  

  res.json({ result });
});

// ✅ Chat route
app.post("/api/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            "You are a compassionate mental health companion. Be warm, empathetic and supportive.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm here for you.";

    res.json({ reply });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: "Failed to get AI response",
      details: error.message,
    });
  }
});

// ✅ START SERVER (FIXED)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
