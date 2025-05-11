let ws;
let connectionId = null;
const statusEl = document.getElementById("status");

function createWebSocket() {
  ws = new WebSocket("wss://s135pdnht8.execute-api.eu-west-2.amazonaws.com/production?user=tom");

  ws.onopen = () => {
    statusEl.textContent = "✅ Connected";
    console.log("WebSocket connected");
  };

  ws.onclose = () => {
    statusEl.textContent = "❌ Disconnected. Reconnecting...";
    console.warn("WebSocket disconnected, attempting reconnect...");
    setTimeout(createWebSocket, 5000);
  };

  ws.onerror = (err) => {
    statusEl.textContent = "⚠️ WebSocket error";
    console.error("WebSocket Error:", err);
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      console.log("Received:", data);

      if (data.action === "connected" && data.connectionId) {
        connectionId = data.connectionId;
        statusEl.textContent = `✅ Connected (ID: ${connectionId})`;
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  };
}

document.getElementById("langForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const Name = document.getElementById("name").value.trim();
  const StartedLearningDate = document.getElementById("startDate").value;
  const AbilityRating = parseInt(document.getElementById("ability").value, 10);

  if (!Name || !StartedLearningDate || isNaN(AbilityRating)) {
    statusEl.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  const payload = {
    action: "sendMessage",
    Name,
    StartedLearningDate,
    AbilityRating,
    connectionId
  };

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
    statusEl.textContent = "📤 Message sent!";
  } else {
    statusEl.textContent = "⚠️ WebSocket not open.";
  }
});

// Start connection
createWebSocket();
