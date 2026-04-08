const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.send("MindWell backend is running 🚀");
});

// ✅ Chat API
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: "messages required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate mental health companion. Be warm and supportive.",
        },
        ...messages,
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ Questionnaire API
app.post("/api/submit", (req, res) => {
  const { depression, anxiety, stress } = req.body;

  res.json({
    result: `Depression: ${depression}, Anxiety: ${anxiety}, Stress: ${stress}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
