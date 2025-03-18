import { useState } from 'react';
import './App.css';

function App() {
  const beachData = [
    { name: "Miami Beach", bars: ["Tiki Bar", "Sunset Lounge", "Wave Riders"], temperature: 95, waveSize: 6, waveFrequency: 10 },
    { name: "Clearwater Beach", bars: ["Beach Club", "Surfer’s Haven", "Cocktail Cove"], temperature: 90, waveSize: 2, waveFrequency: 4 },
    { name: "Daytona Beach", bars: ["Samba Spirits", "Ocean Breeze", "Golden Sands"], temperature: 80, waveSize: 5, waveFrequency: 6 },
    { name: "Panama City Beach", bars: ["Aloha Bar", "Hula Hideaway", "Mango Tango"], temperature: 88, waveSize: 4, waveFrequency: 7 },
  ];

  const [selectedVariables, setSelectedVariables] = useState(["temperature", "waveSize", "waveFrequency"]);

  const toggleVariable = (variable) => {
    setSelectedVariables((prev) =>
      prev.includes(variable)
        ? prev.filter((item) => item !== variable)
        : [...prev, variable]
    );
  };

  const minTemp = 75, maxTemp = 95;
  const minWaveSize = 1, maxWaveSize = 6;
  const minWaveFreq = 1, maxWaveFreq = 10;

  const calculateRank = (beach) => {
    const tempScore = selectedVariables.includes("temperature")
      ? ((beach.temperature - minTemp) / (maxTemp - minTemp)) * 10
      : 0;
    const waveSizeScore = selectedVariables.includes("waveSize")
      ? ((beach.waveSize - minWaveSize) / (maxWaveSize - minWaveSize)) * 10
      : 0;
    const waveFreqScore = selectedVariables.includes("waveFrequency")
      ? ((beach.waveFrequency - minWaveFreq) / (maxWaveFreq - minWaveFreq)) * 10
      : 0;
    const activeVars = selectedVariables.length || 1; // Avoid division by zero

    return (tempScore + waveSizeScore + waveFreqScore) / activeVars;
  };

  const beaches = beachData.map(beach => ({
    ...beach,
    rank: calculateRank(beach)
  })).sort((a, b) => b.rank - a.rank);

  const [openBeach, setOpenBeach] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const toggleDropdown = (beachName) => {
    setOpenBeach(openBeach === beachName ? null : beachName);
  };

  const perfectBeach = beaches.find(beach => beach.rank === 10);

  return (
    <div className="app">
      {perfectBeach && (
        <div className="flashy-message">
          10/10 BEACH!
        </div>
      )}

      <div className="top-bar">
        <div className="gear-container">
          <button 
            className="gear-btn" 
            onClick={() => setShowOptions(!showOptions)}
          >
          &#x1F50D;
          </button>

          {showOptions && (
            <div className="options-dropdown below-button">
              {["temperature", "waveSize", "waveFrequency"].map((variable, index) => (
                <div key={index} className="option-item">
                  <input
                    type="checkbox"
                    checked={selectedVariables.includes(variable)}
                    onChange={() => toggleVariable(variable)}
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
        <img src="/Wide-Fox.webp" alt="Shaka Fox" className="shaka-image" />

        <div className="beach-list">
          {beaches.map((beach, index) => (
            <div 
              key={index} 
              className={`beach ${beach.rank === 10 ? 'perfect-beach' : ''}`}
            >
              <button 
                className={`beach-btn ${beach.rank >= 9 ? 'high-rank' : ''}`} 
                onClick={() => toggleDropdown(beach.name)}
              >
                {beach.name} ⏷
              </button>
              <span className="beach-rank">{beach.rank.toFixed(1)}</span>
              <div className={`bars-dropdown ${openBeach === beach.name ? 'open' : ''}`}>
                <div className="weather-placeholder">Weather data coming soon...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
