import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import About from './About';
import BeachDetail from './BeachDetail'; // Generic beach detail page
import foxLogo from './assets/Removal-952.png';

const offshoreDirections = {
  "miami beach": 270,
  "daytona beach": 270,
  "clearwater beach": 90,
  "panama city beach": 90,
  "fort lauderdale": 270,
  "west palm beach": 270,
  "jacksonville beach": 270,
  "naples beach": 90,
  "siesta key": 90,
  "key west": 90,
  "venice beach": 90,
  "new smyrna beach": 270,
  "cocoa beach": 270,
  "playa linda": 270,
  "sebastian inlet": 270,
  "st augustine": 270,
  "fort pierce inlet": 270,
};

function isOffshoreWind(beachName, windDir) {
  const offshoreDir = offshoreDirections[beachName.toLowerCase()];
  if (offshoreDir === undefined || windDir === "N/A") return false;
  const diff = Math.abs(offshoreDir - windDir);
  return diff <= 45 || diff >= 315;
}

function App() {
  const [beachData, setBeachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariables, setSelectedVariables] = useState(["temperature", "waveSize", "windSpeed", "swellPeriod"]);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [weights, setWeights] = useState({
    temperature: 5,
    waveHeight: 5,
    swellPeriod: 5,
    windSpeed: 5
  });
  const [showOptions, setShowOptions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const calculateRank = (temperature, waveSize, waveFrequency, windSpeed, windDirection, beachName) => {
    const ranks = [];
    let totalWeight = 0;
    const scaleFactor = 2;
    const power = 1.5;

    const tempRank = Math.min(Math.max((temperature - 65) / 25 * 10, 0), 10);
    ranks.push(Math.pow(tempRank, 1.1) * Math.pow(weights.temperature, power) * scaleFactor);
    totalWeight += Math.pow(weights.temperature, power) * scaleFactor;
    
    const waveSizeFT = waveSize * 3.28084;
    const waveRank = Math.min(Math.max((waveSizeFT - 0.01) / 7.99 * 10, 0), 10);
    ranks.push(Math.pow(waveRank, 1.1) * Math.pow(weights.waveHeight, power) * scaleFactor);
    totalWeight += Math.pow(weights.waveHeight, power) * scaleFactor;

    const swellRank = Math.min(Math.max((waveFrequency - 1) / 17 * 10, 0), 10);
    ranks.push(Math.pow(swellRank, 1.1) * Math.pow(weights.swellPeriod, power) * scaleFactor);
    totalWeight += Math.pow(weights.swellPeriod, power) * scaleFactor;

    const windMph = windSpeed * 2.23694;
    let windBase = Math.min(Math.max((25 - windMph) / 25 * 10, 0), 10);
    windBase += isOffshoreWind(beachName, windDirection) ? 2 : -2;
    windBase = Math.min(Math.max(windBase, 0), 10);
    ranks.push(Math.pow(windBase, 1.1) * Math.pow(weights.windSpeed, power) * scaleFactor);
    totalWeight += Math.pow(weights.windSpeed, power) * scaleFactor;

    if (totalWeight === 0) return 0;
    return ranks.reduce((a, b) => a + b, 0) / totalWeight;
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    async function fetchBeachData() {
      try {
        const beaches = [
          "Miami-Beach", "Daytona-Beach", "Clearwater-Beach", "Panama-City-Beach",
          "Fort-Lauderdale", "Jacksonville-Beach", "Naples-Beach", "Siesta-Key", "Key-West",
          "Venice-Beach", "New-Smyrna-Beach", "Cocoa-Beach", "Playa-Linda", "Sebastian-Inlet",
          "St-Augustine", "Fort-Pierce-Inlet"
        ];

        const responses = await Promise.all(
          beaches.map(beach =>
            fetch(`/florida-beaches?beach=${beach}`)
              .then(response => {
                if (!response.ok) throw new Error(`Error fetching ${beach}: ${response.status}`);
                return response.json();
              })
              .catch(err => {
                console.error(`Fetch error for ${beach}:`, err);
                return {
                  name: beach.replace(/-/g, " "),
                  temperature: "N/A",
                  waveSize: "N/A",
                  waveFrequency: "N/A",
                  windSpeed: "N/A",
                  windDirection: "N/A",
                  rank: 0
                };
              })
          )
        );

        const formattedData = responses.map((item, index) => {
          const temperature = isNaN(parseFloat(item.temperature)) ? "N/A" : parseFloat(item.temperature);
          const waveSize = isNaN(parseFloat(item.waveHeight)) ? "N/A" : parseFloat(item.waveHeight);
          const waveFrequency = isNaN(parseFloat(item.swellPeriod)) ? "N/A" : parseFloat(item.swellPeriod);
          const windSpeed = isNaN(parseFloat(item.windSpeed)) ? "N/A" : parseFloat(item.windSpeed);
          const windDirection = isNaN(parseFloat(item.windDirection)) ? "N/A" : parseFloat(item.windDirection);

          const rank = calculateRank(temperature, waveSize, waveFrequency, windSpeed, windDirection, beaches[index].replace(/-/g, " "));

          return {
            name: beaches[index].replace(/-/g, " "),
            temperature,
            waveSize,
            waveFrequency,
            windSpeed,
            windDirection,
            rank
          };
        }).sort((a, b) => b.rank - a.rank);

        setBeachData(formattedData);
      } catch (error) {
        console.error("General error fetching beach data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchBeachData();
  }, [selectedVariables, weights]);

  const toggleVariable = (variable) => {
    setSelectedVariables((prev) =>
      prev.includes(variable)
        ? prev.filter((item) => item !== variable)
        : [...prev, variable]
    );
  };

  const beachRoutes = {
    "key west": "/key-west",
    "miami beach": "/miami-beach",
    "clearwater beach": "/clearwater-beach",
    "daytona beach": "/daytona-beach",
    "panama city beach": "/panama-city-beach",
    "fort lauderdale": "/fort-lauderdale",
    "jacksonville beach": "/jacksonville-beach",
    "naples beach": "/naples-beach",
    "siesta key": "/siesta-key",
    "venice beach": "/venice-beach",
    "new smyrna beach": "/new-smyrna-beach",
    "cocoa beach": "/cocoa-beach",
    "playa linda": "/playa-linda",
    "sebastian inlet": "/sebastian-inlet",
    "st augustine": "/st-augustine",
    "fort pierce inlet": "/fort-pierce-inlet"
  };
  

  const sharedProps = {
    beachData,
    loading,
    error,
    selectedVariables,
    toggleVariable,
    weights,
    setWeights,
    showOptions,
    setShowOptions,
    toggleRow,
    openRowIndex,
    isOffshoreWind,
    beachRoutes
  };

  return (
    <Router>
      <div className="floating-nav">
        <div className="floating-nav-left">
          <img
            src={foxLogo}
            alt="Fox Logo"
            className="nav-icon"
            onClick={() => window.location.href = "/"}
          />
          <div className="nav-links-desktop">
            <button className="nav-btn" onClick={() => window.location.href = "/about"}>About</button>
          </div>
          <button className="hamburger-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
        </div>

        <div className="floating-nav-center">
          <div className="nav-links-desktop">
            <NavLink to="/" className="nav-btn">All Rankings</NavLink>
            <NavLink to="/home" className="nav-btn">Home Beaches</NavLink>
          </div>
        </div>

        <div className="floating-nav-right">
          <button className="gear-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="gear-btn" onClick={() => setShowOptions(!showOptions)}>⚙️</button>
        </div>

        {showMobileMenu && (
          <div className="mobile-dropdown">
            <NavLink to="/about" className="nav-btn" onClick={() => setShowMobileMenu(false)}>About</NavLink>
            <NavLink to="/" className="nav-btn" onClick={() => setShowMobileMenu(false)}>All Rankings</NavLink>
            <NavLink to="/home" className="nav-btn" onClick={() => setShowMobileMenu(false)}>Home Beaches</NavLink>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<HomePage {...sharedProps} page="all" />} />
        <Route path="/home" element={<HomePage {...sharedProps} page="home" />} />
        <Route path="/about" element={<About />} />
        <Route path="/homepage" element={<HomePage {...sharedProps} page="home" />} />
        <Route path="/:beachId" element={<BeachDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
