const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to get radio stations based on a country
app.get('/api/stations', async (req, res) => {
  try {
    const response = await axios.get('https://de1.api.radio-browser.info/json/stations/bycountry/Israel');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching radio stations');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
