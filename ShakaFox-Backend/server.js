const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Default welcome message at root "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Surf Ranking API! Use /api/surfdata to get surf data.');
});

// API Route: Now explicitly under "/api"
app.get('/api/surfdata', (req, res) => {
    res.json({ message: 'Hello, your backend is working in Codespaces!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
