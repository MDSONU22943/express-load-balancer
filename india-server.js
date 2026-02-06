const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    country: "India 🇮🇳",
    server: "India Server",
    port: 4001,
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});



app.listen(4001, () => {
  console.log("🇮🇳 India Server running on port 4001");
});
