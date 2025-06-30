const app = require('./src/app');
const axios = require('axios');

// Use environment variable for port, with a fallback for local development
const PORT = process.env.PORT || 3000; 

// Use the external URL provided by Render for self-ping
// Replace "https://codeaireview.onrender.com/" with your actual Render service URL if it changes.
const PING_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || "https://codeaireview.onrender.com/"; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Application URL for self-ping: ${PING_EXTERNAL_URL}`); // Confirm URL

  const PING_INTERVAL_MS = (14 * 60 + 30) * 1000; // 14 minutes 30 seconds

  console.log(`Scheduling self-ping every ${PING_INTERVAL_MS / 1000} seconds (${PING_INTERVAL_MS / 60000} minutes).`);

  setInterval(async () => {
    try {
      const response = await axios.get(PING_EXTERNAL_URL); // Ping the external URL
      console.log(`Self-ping successful to ${PING_EXTERNAL_URL}: Status ${response.status} at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error(`Self-ping failed at ${new Date().toLocaleTimeString()} to ${PING_EXTERNAL_URL}: ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error(`   No response received. Request made but no response.`);
      }
    }
  }, PING_INTERVAL_MS);
});