import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Mapping for popular Florida beaches with their latitude and longitude.
const floridaBeaches = {
  "miami-beach": { lat: 25.790654, lon: -80.130045 },
  "daytona-beach": { lat: 29.210814, lon: -81.022833 },
  "clearwater-beach": { lat: 27.9773, lon: -82.8271 },
  "panama-city-beach": { lat: 30.1683, lon: -85.6544 }
};

// Mapping of beaches to closest NOAA buoy stations
const buoyStations = {
  "miami-beach": "41114",
  "daytona-beach": "41009",
  "clearwater-beach": "42036",
  "panama-city-beach": "42039"
};

// In-memory cache for API responses
const cache = {};
const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes

async function getNoaaForecast(lat, lon) {
  const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
  const pointsResponse = await fetch(pointsUrl, { headers: { 'User-Agent': 'ShakaFox Node App (your-email@example.com)' } });
  if (!pointsResponse.ok) throw new Error(`NOAA Points API Error: ${await pointsResponse.text()}`);
  const pointsData = await pointsResponse.json();

  const forecastUrl = pointsData.properties.forecast;
  if (!forecastUrl) throw new Error('Forecast URL not found in NOAA response.');

  const forecastResponse = await fetch(forecastUrl, { headers: { 'User-Agent': 'ShakaFox Node App (your-email@example.com)' } });
  if (!forecastResponse.ok) throw new Error(`NOAA Forecast API Error: ${await forecastResponse.text()}`);

  return await forecastResponse.json();
}

async function fetchBeachData(beach) {
    const { lat, lon } = floridaBeaches[beach];
    const noaaForecast = await getNoaaForecast(lat, lon);

    const stationId = buoyStations[beach];
    if (!stationId) {
        throw new Error("No buoy station found for this beach.");
    }

    const noaaMarineUrl = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    const marineResponse = await fetch(noaaMarineUrl);
    if (!marineResponse.ok) {
        throw new Error(`NOAA Marine API Error: ${await marineResponse.text()}`);
    }
    const marineText = await marineResponse.text();

    const lines = marineText.split("\n");
    let waveHeight = "N/A";
    let windSpeed = "N/A";
    let swellPeriod = "N/A";

    lines.forEach(line => {
        if (line.includes("WVHT")) { waveHeight = line.split(/\s+/)[1] + " m"; }
        if (line.includes("WSPD")) { windSpeed = line.split(/\s+/)[1] + " m/s"; }
        if (line.includes("DPD")) { swellPeriod = line.split(/\s+/)[1] + " s"; }
    });

    return {
        beach,
        location: { lat, lon },
        noaa_forecast: noaaForecast,
        marine_forecast: {
            wave_height: waveHeight,
            wind_speed: windSpeed,
            swell_period: swellPeriod
        }
    };
}

async function getCachedData(beach) {
    const now = Date.now();
    if (cache[beach] && (now - cache[beach].timestamp < CACHE_EXPIRATION)) {
        console.log(`Serving cached data for ${beach}`);
        return cache[beach].data;
    }

    console.log(`Fetching new data for ${beach}`);
    const newData = await fetchBeachData(beach);
    cache[beach] = { timestamp: now, data: newData };
    return newData;
}

app.get('/florida-beaches', async (req, res) => {
    try {
        const beach = (req.query.beach || "miami-beach").toLowerCase();
        if (!floridaBeaches[beach]) {
            return res.status(400).json({ error: "Invalid beach name. Valid options: miami-beach, daytona-beach, clearwater-beach, panama-city-beach." });
        }
        const beachData = await getCachedData(beach);
        res.json(beachData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error.", details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the ShakaFox API!');
});

app.listen(PORT, () => {
    console.log(`ShakaFox backend server is running on port ${PORT}`);
});