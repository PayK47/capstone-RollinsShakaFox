import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({
  beachData,
  loading,
  error,
  selectedVariables,
  toggleVariable,
  weights,
  setWeights,
  showOptions,
  setShowOptions,
  toggleDropdown,
  openBeach,
  isOffshoreWind,
  beachRoutes,
  page = "all"
}) {
  // Filter for Home Beaches if needed
  const filteredBeaches = page === "home"
    ? beachData.filter(b => [
        "new smyrna beach",
        "clearwater beach",
        "daytona beach",
        "jacksonville beach"
      ].includes(b.name.toLowerCase()))
    : beachData;

  return (
    <div className="app">
      <div className="top-bar">
        <div className="nav-bar" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '0 1rem' }}>
        <button
  className="gear-btn"
  onClick={() => setShowOptions(!showOptions)}
  title="Personalize Ranking"
>
  &#x1F50D;
</button>

        </div>
        {showOptions && (
          <div className="options-dropdown below-button">
            <div className="slider-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>Temperature: {weights.temperature}</label>
              <input type="range" min="0" max="10" value={weights.temperature}
                onChange={(e) => setWeights({ ...weights, temperature: parseInt(e.target.value) })} />

              <label>Wave Height: {weights.waveHeight}</label>
              <input type="range" min="0" max="10" value={weights.waveHeight}
                onChange={(e) => setWeights({ ...weights, waveHeight: parseInt(e.target.value) })} />

              <label>Swell Period: {weights.swellPeriod}</label>
              <input type="range" min="0" max="10" value={weights.swellPeriod}
                onChange={(e) => setWeights({ ...weights, swellPeriod: parseInt(e.target.value) })} />

              <label>Wind Speed: {weights.windSpeed}</label>
              <input type="range" min="0" max="10" value={weights.windSpeed}
                onChange={(e) => setWeights({ ...weights, windSpeed: parseInt(e.target.value) })} />
            </div>
          </div>
        )}
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
            {filteredBeaches.map((beach, index) => (
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
                    <p>Wave Height: {(beach.waveSize * 3.28084).toFixed(1)} ft</p>
                    <p>Swell Period: {beach.waveFrequency} sec</p>
                    <p>Wind Speed: {(beach.windSpeed * 2.23694).toFixed(1)} mph</p>
                    <p>Wind Direction: {beach.windDirection}°</p>
                    {beach.windDirection !== undefined && beach.windDirection !== "N/A" && (
                      <p style={{ color: isOffshoreWind(beach.name, beach.windDirection) ? "green" : "red" }}>
                        {isOffshoreWind(beach.name, beach.windDirection)
                          ? "✅ Good Wind Direction"
                          : "❌ Bad Wind Direction"}
                      </p>
                    )}
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
  );
}

export default HomePage;