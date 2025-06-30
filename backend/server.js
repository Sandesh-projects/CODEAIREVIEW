const app = require('./src/app');
const axios = require('axios'); // Import axios for making HTTP requests

const PORT = 3000; // Define the port number

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Calculate the interval time: 14 minutes and 30 seconds in milliseconds
  // (14 minutes * 60 seconds/minute + 30 seconds) * 1000 milliseconds/second
  const PING_INTERVAL_MS = (14 * 60 + 30) * 1000; // 870,000 milliseconds

  console.log(`Scheduling self-ping every ${PING_INTERVAL_MS / 1000} seconds (${PING_INTERVAL_MS / 60000} minutes).`);

  // Set up an interval to send a GET request to the server itself
  setInterval(async () => {
    try {
      // The URL to ping. It's common practice to use a dedicated health check
      // endpoint like '/health' or '/ping' if available in your app,
      // but for this example, we'll hit the root '/'.
      const pingUrl = `http://localhost:${PORT}/`;
      
      const response = await axios.get(pingUrl);
      
      // Log successful ping
      console.log(`Self-ping successful to ${pingUrl}: Status ${response.status} at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      // Log failed ping, including response status and data if available
      console.error(`Self-ping failed at ${new Date().toLocaleTimeString()}: ${error.message}`);
      if (error.response) {
        console.error(`  Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error(`  No response received. Request made but no response.`, error.request);
      }
    }
  }, PING_INTERVAL_MS);
});
