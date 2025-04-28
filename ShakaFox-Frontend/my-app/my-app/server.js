

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'build')));

// Proxy API requests to backend
app.use('/florida-beaches', async (req, res) => {
  try {
    const backendUrl = `${process.env.REACT_APP_API_BASE_URL}${req.originalUrl}`;
    const response = await fetch(backendUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Catch-all handler: send back React's index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});