const express = require("express");
const axios = require("axios");

const app = express();

let servers = [
  { url: "http://localhost:4001", healthy: true },
  { url: "http://localhost:4002", healthy: true },
];

let index = 0;

// 🔁 Health check every 5 seconds
setInterval(async () => {
  for (let server of servers) {
    try {
      await axios.get(server.url + "/health", { timeout: 2000 });
      server.healthy = true;
    } catch (err) {
      server.healthy = false;
    }
  }
  console.log("Health status:", servers);
}, 5000);

// 🎯 Request routing
app.get("/", async (req, res) => {
  const healthyServers = servers.filter(s => s.healthy);

  if (healthyServers.length === 0) {
    return res.status(503).json({ error: "No healthy servers available" });
  }

  const target = healthyServers[index % healthyServers.length];
  index++;

  try {
    const response = await axios.get(target.url);
    res.json({
      routedTo: target.url,
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Request failed" });
  }
});

app.listen(3000, () => {
  console.log("⚖️ Load Balancer with Health Check running on 3000");
});
