const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/submit", (req, res) => {
  const { stress } = req.body;

  let result = "Normal";

  if (stress > 3) result = "High Stress";

  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));