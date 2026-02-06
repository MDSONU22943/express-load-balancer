const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    country: "USA 🇺🇸",
    server: "USA Server",
    port: 4002,
  });
});



app.listen(4002, () => {
  console.log("🇺🇸 USA Server running on port 4002");
});
