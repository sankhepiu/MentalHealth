const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});