// Enhanced Backend to Include Air Temperature from NWS API
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
import cors from "cors";
app.use(cors());

// Mapping for popular Florida beaches with their latitude and longitude.
const floridaBeaches = {
  "miami-beach": { lat: 25.790654, lon: -80.130045 },
  "daytona-beach": { lat: 29.210814, lon: -81.022833 },
  "clearwater-beach": { lat: 27.9773, lon: -82.8271 },
  "panama-city-beach": { lat: 30.1683, lon: -85.6544 }
};

// Mapping of beaches to closest NOAA buoy stations for wave height and wind speed
const buoyStations = {
  "miami-beach": { wave: "41114", wind: "41009" },
  "daytona-beach": { wave: "41113", wind: "41009" },
  "clearwater-beach": { wave: "42036", wind: "CWBF1" },
  "panama-city-beach": { wave: "42040", wind: "PCBF1" }
};

async function fetchBuoyData(stationId) {
  try {
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    console.log(`Fetching buoy data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Buoy ${stationId} fetch failed: ${response.status}`);
    const data = await response.text();
    console.log(`Raw data from buoy ${stationId}:
${data}`);
    return data;
  } catch (error) {
    console.error(`Error fetching buoy data: ${error.message}`);
    return null;
  }
}

async function fetchAirTemperature(lat, lon) {
  try {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`NWS Point API failed: ${response.status}`);
    const data = await response.json();
    const forecastUrl = data.properties.forecast;
    console.log(`Fetching forecast from: ${forecastUrl}`);
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error(`NWS Forecast API failed: ${forecastResponse.status}`);
    const forecastData = await forecastResponse.json();
    const temperature = forecastData.properties.periods[0].temperature;
    console.log(`Air temperature found: ${temperature}°F`);
    return temperature;
  } catch (error) {
    console.error(`Error fetching air temperature: ${error.message}`);
    return "N/A";
  }
}

function parseBuoyData(rawData) {
  const lines = rawData.split("\n").filter(line => line.trim());
  console.log("Parsing buoy data:", lines.slice(0, 5));

  const headers = lines[0].split(/\s+/);
  let waveHeight = "N/A";
  let windSpeed = "N/A";
  let swellPeriod = "N/A";

  for (let i = 2; i < lines.length; i++) {
    const currentData = lines[i].split(/\s+/);
    if (currentData.length === headers.length) {
      const waveIndex = headers.indexOf("WVHT");
      const windIndex = headers.indexOf("WSPD");
      const swellIndex = headers.indexOf("DPD");

      if (waveHeight === "N/A" && currentData[waveIndex] !== "MM") {
        waveHeight = parseFloat(currentData[waveIndex]);
        console.log(`Found wave height: ${waveHeight} at row ${i}`);
      }

      if (windSpeed === "N/A" && currentData[windIndex] !== "MM") {
        windSpeed = parseFloat(currentData[windIndex]);
        console.log(`Found wind speed: ${windSpeed} at row ${i}`);
      }

      if (swellPeriod === "N/A" && currentData[swellIndex] !== "MM") {
        swellPeriod = parseFloat(currentData[swellIndex]);
        console.log(`Found swell period: ${swellPeriod} at row ${i}`);
      }

      if (waveHeight !== "N/A" && windSpeed !== "N/A" && swellPeriod !== "N/A") {
        break;
      }
    }
  }

  console.log("Final parsed data:", { waveHeight, windSpeed, swellPeriod });
  return {
    waveHeight,
    windSpeed,
    swellPeriod
  };
}

async function fetchCombinedBuoyData(beach) {
  const { wave, wind } = buoyStations[beach];
  const { lat, lon } = floridaBeaches[beach];

  const waveData = await fetchBuoyData(wave);
  const windData = await fetchBuoyData(wind);
  const airTemperature = await fetchAirTemperature(lat, lon);

  const waveParsed = waveData ? parseBuoyData(waveData) : { waveHeight: "N/A", swellPeriod: "N/A" };
  const windParsed = windData ? parseBuoyData(windData) : { windSpeed: "N/A" };

  return {
    waveHeight: waveParsed.waveHeight,
    windSpeed: windParsed.windSpeed,
    temperature: airTemperature,
    swellPeriod: waveParsed.swellPeriod
  };
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
