import { useState } from 'react';
import './App.css';

function App() {
  // List of beaches with their bars and rankings (out of 10)
  const beaches = [
    { name: "Miami Beach", bars: ["Tiki Bar", "Sunset Lounge", "Wave Riders"], rank: 7.0 },
    { name: "Clearwater Beach", bars: ["Beach Club", "Surfer’s Haven", "Cocktail Cove"], rank: 9.0 },
    { name: "Daytona Beach", bars: ["Samba Spirits", "Ocean Breeze", "Golden Sands"], rank: 7.8 },
    { name: "Panama City Beach", bars: ["Aloha Bar", "Hula Hideaway", "Mango Tango"], rank: 10.0 },
    
  ];

  // State to track which beach's bars dropdown is open
  const [openBeach, setOpenBeach] = useState(null);

  // Sort beaches based on rank (highest first)
  const sortedBeaches = [...beaches].sort((a, b) => b.rank - a.rank);

  // Toggle dropdown for a beach
  const toggleDropdown = (beachName) => {
    setOpenBeach(openBeach === beachName ? null : beachName);
  };

  // Check if there is any beach with a perfect rank of 10
  const perfectBeach = beaches.find(beach => beach.rank === 10);

  return (
    <div className="app">
      {/* Display the flashy message if a beach has a rank of 10 */}
      {perfectBeach && (
        <div className="flashy-message">
          10/10 BEACH!
        </div>
      )}

      {/* Top bar */}
      <div className="top-bar">
        {/* Gear button links to external page */}
        <button className="gear-btn" onClick={() => window.location.href = "https://rollinssports.com/sports/wswim/roster/kassy-mccoy/6152"}>
          &#9881;
        </button>
      </div>

      <div className="center-container">
        <h1>ShakaFox</h1>
        <img src="/shakafox.jpg" alt="Shaka Fox" className="shaka-image" />

        {/* Beaches Dropdown */}
        <div className="beach-list">
          {sortedBeaches.map((beach, index) => (
            <div key={index} className="beach">
              <button className="beach-btn" onClick={() => toggleDropdown(beach.name)}>
                {beach.name} ⏷
              </button>
              <span className="beach-rank">{beach.rank.toFixed(1)}</span> {/* Rank displayed here */}
              
              {/* Bars Dropdown (Only shows when openBeach matches) */}
              <div className={`bars-dropdown ${openBeach === beach.name ? 'open' : ''}`}>
                {beach.bars.map((bar, barIndex) => (
                  <div key={barIndex} className="bar-item">{bar}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
