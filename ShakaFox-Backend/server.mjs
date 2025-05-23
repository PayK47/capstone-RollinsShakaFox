// Enhanced Backend with Caching Mechanism
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
import cors from "cors";
const allowedOrigins = [
  "https://backend-production-8c35.up.railway.app",
  "http://localhost:3000" // Optional for local development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Cache object to store data with timestamps
let cache = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Mapping for popular Florida beaches with their latitude and longitude.
// --- PARTIAL: UPDATED server.mjs (Added Beaches) ---

const floridaBeaches = {
  "miami-beach": { lat: 25.790654, lon: -80.130045 },
  "daytona-beach": { lat: 29.210814, lon: -81.022833 },
  "clearwater-beach": { lat: 27.9773, lon: -82.8271 },
  "panama-city-beach": { lat: 30.1683, lon: -85.6544 },
  "fort-lauderdale": { lat: 26.1224, lon: -80.1373 },
  "jacksonville-beach": { lat: 30.2947, lon: -81.3931 },
  "naples-beach": { lat: 26.1420, lon: -81.7948 },
  "siesta-key": { lat: 27.2670, lon: -82.5461 },
  "key-west": { lat: 24.5551, lon: -81.7800 },
  "venice-beach": { lat: 27.0998, lon: -82.4543 },
  "new-smyrna-beach": { lat: 29.0258, lon: -80.9270 },
  "cocoa-beach": { lat: 28.3200, lon: -80.6076 },
  "playa-linda": { lat: 28.6555, lon: -80.6397 },
  "sebastian-inlet": { lat: 28.0684, lon: -80.5603 },
  "st-augustine": { lat: 29.9012, lon: -81.3124 },
  "fort-pierce-inlet": { lat: 27.4686, lon: -80.2960 },
};

const buoyStations = {
  "miami-beach": { wave: "41114", wind: "41009" },
  "daytona-beach": { wave: "41113", wind: "41009" },
  "clearwater-beach": { wave: "42036", wind: "CWBF1" },
  "panama-city-beach": { wave: "42040", wind: "PCBF1" },
  "fort-lauderdale": { wave: "41114", wind: "41009" },
  "jacksonville-beach": { wave: "41112", wind: "BKBF1" },
  "naples-beach": { wave: "42036", wind: "42023" },
  "siesta-key": { wave: "42036", wind: "42013" },
  "key-west": { wave: "42095", wind: "KYWF1" },
  "venice-beach": { wave: "42036", wind: "42013" },
  "new-smyrna-beach": { wave: "41113", wind: "41009" },
  "cocoa-beach": { wave: "41113", wind: "41009" },
  "playa-linda": { wave: "41113", wind: "41009" },
  "sebastian-inlet": { wave: "41113", wind: "41009" },
  "st-augustine": { wave: "41117", wind: "SAUF1" },
  "fort-pierce-inlet": { wave: "41114", wind: "41009" },
};

async function fetchBuoyData(stationId) {
  try {
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Buoy ${stationId} fetch failed: ${response.status}`);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error fetching buoy data: ${error.message}`);
    return null;
  }
}

async function fetchAirTemperature(lat, lon) {
  try {
    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointsRes = await fetch(pointsUrl);
    if (!pointsRes.ok) throw new Error(`NWS Point API failed: ${pointsRes.status}`);
    const pointsData = await pointsRes.json();

    const stationsUrl = pointsData.properties.observationStations;
    if (!stationsUrl) throw new Error(`No observation stations URL found for (${lat}, ${lon})`);

    const stationsRes = await fetch(stationsUrl);
    if (!stationsRes.ok) throw new Error(`NWS Stations API failed: ${stationsRes.status}`);
    const stationsData = await stationsRes.json();

    const stationId = stationsData.features[0]?.properties.stationIdentifier;
    if (!stationId) throw new Error(`No valid station found near (${lat}, ${lon})`);

    const latestObsUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;
    const obsRes = await fetch(latestObsUrl);
    if (!obsRes.ok) throw new Error(`Latest observation fetch failed: ${obsRes.status}`);
    const obsData = await obsRes.json();

    const tempCelsius = obsData.properties.temperature.value;
    if (tempCelsius === null) throw new Error(`Temperature value is null at station ${stationId}`);

    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    return Math.round(tempFahrenheit);
  } catch (error) {
    console.error(`Error fetching air temperature: ${error.message}`);
    return "N/A";
  }
}





function parseBuoyData(rawData) {
  const lines = rawData.split("\n").filter(line => line.trim());
  const headers = lines[0].split(/\s+/);
  let waveHeight = "N/A";
  let windSpeed = "N/A";
  let swellPeriod = "N/A";
  let windDirection = "N/A";

  for (let i = 2; i < lines.length; i++) {
    const currentData = lines[i].split(/\s+/);
    if (currentData.length === headers.length) {
      const waveIndex = headers.indexOf("WVHT");
      const windIndex = headers.indexOf("WSPD");
  const windDirIndex = headers.indexOf("WDIR");
      const swellIndex = headers.indexOf("DPD");

      if (waveHeight === "N/A" && currentData[waveIndex] !== "MM") {
        waveHeight = parseFloat(currentData[waveIndex]);
      }

      if (windSpeed === "N/A" && currentData[windIndex] !== "MM") {
        windSpeed = parseFloat(currentData[windIndex]);
      }

      if (windDirection === "N/A" && currentData[windDirIndex] !== "MM") {
        windDirection = parseFloat(currentData[windDirIndex]);
      }

      if (swellPeriod === "N/A" && currentData[swellIndex] !== "MM") {
        swellPeriod = parseFloat(currentData[swellIndex]);
      }

      if (waveHeight !== "N/A" && windSpeed !== "N/A" && swellPeriod !== "N/A") {
        break;
      }
    }
  }

  return {
    waveHeight,
    windSpeed,
    swellPeriod,
    windDirection
  };
}

async function fetchCombinedBuoyData(beach) {
  const cacheEntry = cache[beach];
  const now = Date.now();

  if (cacheEntry && (now - cacheEntry.timestamp < CACHE_DURATION)) {
    console.log(`Serving cached data for ${beach}`);
    return cacheEntry.data;
  }

  console.log(`Fetching new data for ${beach}`);
  const { wave, wind } = buoyStations[beach];
  const { lat, lon } = floridaBeaches[beach];

  const waveData = await fetchBuoyData(wave);
  const windData = await fetchBuoyData(wind);
  const airTemperature = await fetchAirTemperature(lat, lon);

  const waveParsed = waveData ? parseBuoyData(waveData) : { waveHeight: "N/A", swellPeriod: "N/A" };
  const windParsed = windData ? parseBuoyData(windData) : { windSpeed: "N/A" };

  const combinedData = {
    waveHeight: waveParsed.waveHeight,
    windSpeed: windParsed.windSpeed,
    temperature: airTemperature,
    swellPeriod: waveParsed.swellPeriod,
    windDirection: windParsed.windDirection
  };

  cache[beach] = { data: combinedData, timestamp: now };
  return combinedData;
}

app.get('/florida-beaches', async (req, res) => {
  try {
    const beach = (req.query.beach || "miami-beach").toLowerCase();
    if (!floridaBeaches[beach]) {
      return res.status(400).json({ error: "Invalid beach name." });
    }

    const combinedData = await fetchCombinedBuoyData(beach);
    res.json({ beach, ...combinedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ShakaFox backend server is running on port ${PORT}`);
});
