const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Debug: check if key is loading
console.log("KEY:", process.env.GROQ_API_KEY);

// ✅ Questionnaire scoring route
app.post("/submit", (req, res) => {
  const { depression, anxiety, stress } = req.body;

  const total = depression + anxiety + stress;

  const avg = total / 3;

  let result = "";

  if (avg <= 2) result = "Low";
  else if (avg <= 5) result = "Moderate";
  else result = "High";

  console.log("Scores:", { depression, anxiety, stress, avg, result });

  res.json({ result });
});

// ✅ AI Companion chat route
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
            "You are a compassionate mental health companion. Be warm, empathetic, and supportive. Do not give medical diagnosis. Encourage healthy coping.",
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
    // 🔥 IMPORTANT: full error debug
    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: "Failed to get AI response",
      details: error.message,
    });
  }
});

// ✅ Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
