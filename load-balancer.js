const express = require("express");
const axios = require("axios");

const app = express();

const servers = {
  india: [{ url: "http://localhost:4001", healthy: true }],
  usa: [{ url: "http://localhost:4002", healthy: true }]
};

// health check
setInterval(async () => {
  for (let region in servers) {
    for (let server of servers[region]) {
      try {
        await axios.get(server.url + "/health");
        server.healthy = true;
      } catch {
        server.healthy = false;
      }
    }
  }
}, 5000);

app.get("/", async (req, res) => {
  const region = req.headers["x-region"] || "india";

  const regionServers = servers[region];
  if (!regionServers) {
    return res.status(400).json({ error: "Invalid region" });
  }

  const healthyServers = regionServers.filter(s => s.healthy);
  if (healthyServers.length === 0) {
    return res.status(503).json({ error: "No healthy servers in region" });
  }

  try {
    const response = await axios.get(healthyServers[0].url);
    res.json({
      userRegion: region,
      routedTo: healthyServers[0].url,
      data: response.data
    });
  } catch {
    res.status(500).json({ error: "Request failed" });
  }
});

app.listen(3000, () => {
  console.log("Region-based Load Balancer running on 3000");
});
