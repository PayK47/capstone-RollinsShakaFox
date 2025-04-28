// Enhanced App.js with Dropdown Fix
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Miami from './Miami';
import Daytona from './Daytona';
import Clearwater from './Clearwater';
import PanamaCity from './PanamaCity';

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

function App() {
  const [beachData, setBeachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariables, setSelectedVariables] = useState(["temperature", "waveSize", "windSpeed", "swellPeriod"]);
  const [openBeach, setOpenBeach] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const beachRoutes = {
    "miami beach": "/miami",
    "daytona beach": "/daytona",
    "clearwater beach": "/clearwater",
    "panama city beach": "/panamacity"
  };


  const calculateRank = (temperature, waveSize, waveFrequency, windSpeed) => {
    const ranks = [];
    let totalWeight = 0;

    if (selectedVariables.includes("temperature")) {
      const tempRank = Math.min(Math.max((temperature - 70) / 15 * 10, 0), 10); // 70°F to 85°F is 0 to 10
      ranks.push(tempRank);
      totalWeight++;
    }

    if (selectedVariables.includes("waveSize")) {
      const waveHeightRank = Math.min(Math.max((waveSize - 0.5) / 4 * 10, 0), 10); // 0.5m to 5m is 0 to 10
      ranks.push(waveHeightRank);
      totalWeight++;
    }

    if (selectedVariables.includes("swellPeriod")) {
      const waveFrequencyRank = Math.min(Math.max((waveFrequency - 2) / 5 * 10, 0), 10); // 2s to 10s is 0 to 10
      ranks.push(waveFrequencyRank);
      totalWeight++;
    }

    if (selectedVariables.includes("windSpeed")) {
      const windSpeedRank = Math.min(Math.max((15 - windSpeed) / 15 * 10, 0), 10); // 0m/s to 15m/s is 10 to 0
      ranks.push(windSpeedRank);
      totalWeight++;
    }

    if (ranks.length === 0) return 0;
    const totalRank = ranks.reduce((a, b) => a + b, 0) / totalWeight;
    return totalRank;
  };

  useEffect(() => {
    async function fetchBeachData() {
      try {
        console.log("Starting to fetch beach data...");
        const beaches = ["miami-beach", "daytona-beach", "clearwater-beach", "panama-city-beach"];
        const responses = await Promise.all(
          beaches.map(beach =>
            fetch(`${baseUrl}/florida-beaches?beach=${beach}`)
              .then(response => {
                if (!response.ok) throw new Error(`Error fetching ${beach}: ${response.status}`);
                return response.json();
              })
              .catch(err => {
                console.error(`Fetch error for ${beach}:`, err);
                return { name: beach.replace(/-/g, " "), temperature: "N/A", waveSize: "N/A", waveFrequency: "N/A", windSpeed: "N/A", rank: 0 };
              })
          )
        );

        console.log("Raw responses:", responses);

        const formattedData = responses
          .map((item, index) => {
            const temperature = isNaN(parseFloat(item.temperature)) ? "N/A" : parseFloat(item.temperature);
            const waveSize = isNaN(parseFloat(item.waveHeight)) ? "N/A" : parseFloat(item.waveHeight);
            const waveFrequency = isNaN(parseFloat(item.swellPeriod)) ? "N/A" : parseFloat(item.swellPeriod);
            const windSpeed = isNaN(parseFloat(item.windSpeed)) ? "N/A" : parseFloat(item.windSpeed);
            const rank = calculateRank(temperature, waveSize, waveFrequency, windSpeed);
            return {
              name: beaches[index].replace(/-/g, " "),
              temperature,
              waveSize,
              waveFrequency,
              windSpeed,
              rank
            };
          })
          .sort((a, b) => b.rank - a.rank); // Sort from best to worst

        console.log("Formatted data with ranks:", formattedData);

        setBeachData(formattedData);
      } catch (error) {
        console.error("General error fetching beach data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchBeachData();
  }, [selectedVariables]);

  const toggleDropdown = (beachName) => {
    setOpenBeach(openBeach === beachName ? null : beachName);
  };

  const toggleVariable = (variable) => {
    setSelectedVariables((prev) =>
      prev.includes(variable) ? prev.filter((item) => item !== variable) : [...prev, variable]
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <div className="top-bar">
              <div className="gear-container">
                <button className="gear-btn" onClick={() => setShowOptions(!showOptions)}>&#x1F50D;</button>
                {showOptions && (
                  <div className="options-dropdown below-button">
                    {["Temperature", "Wave Size", "Windspeed", "Swell Duration"].map((variable, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="checkbox"
                          checked={selectedVariables.includes(variable.toLowerCase().replace(" ", ""))}
                          onChange={() => toggleVariable(variable.toLowerCase().replace(" ", ""))}
                        />
                        {variable}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="center-container">
              <h1>ShakaFox</h1>
              <div className="subtitle">Where is the best place to surf today?</div>
              <img src="/Wide-Fox.webp" alt="Shaka Fox" className="shaka-image" />

              {loading ? (
                <p>Loading beach data...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <div className="beach-list">
                  {beachData.map((beach, index) => (
                    <div key={index} className={`beach ${beach.rank === 10 ? 'perfect-beach' : ''}`}>
                      <button
                        className={`beach-btn ${beach.rank >= 9 ? 'high-rank' : ''}`}
                        onClick={() => toggleDropdown(beach.name)}
                      >
                        <span className="beach-score">{isNaN(beach.rank) ? "N/A" : beach.rank.toFixed(0)}</span>
                        <span>{beach.name}</span>
                        <span className="dropdown-arrow">
                          {openBeach === beach.name ? '⏶' : '⏷'}
                        </span>
                      </button>
                      {openBeach === beach.name && (
                        <div className="beach-details">
                          <p>Temperature: {beach.temperature}°F</p>
                          <p>Wave Height: {beach.waveSize} m</p>
                          <p>Swell Period: {beach.waveFrequency} sec</p>
                          <p>Wind Speed: {beach.windSpeed} m/s</p>
                          <Link to={beachRoutes[beach.name.toLowerCase()] || "#"} className="more-details-link">
                            More Details →
                          </Link>

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        } />
        <Route path="/miami" element={<Miami />} />
        <Route path="/daytona" element={<Daytona />} />
        <Route path="/clearwater" element={<Clearwater />} />
        <Route path="/panamacity" element={<PanamaCity />} />
      </Routes>
    </Router>
  );
}

export default App;