const express = require("express");
const axios = require("axios");

const app = express();

// Backend servers list
const servers = [
  "http://localhost:4001", // India
  "http://localhost:4002", // USA
];

let currentIndex = 0;

// Round Robin Logic
app.get("/", async (req, res) => {
  const targetServer = servers[currentIndex];
  currentIndex = (currentIndex + 1) % servers.length;

  try {
    const response = await axios.get(targetServer);
    res.json({
      message: "Response from Load Balancer",
      routedTo: targetServer,
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server not reachable" });
  }
});

app.listen(3000, () => {
  console.log("⚖️ Load Balancer running on port 3000");
});
