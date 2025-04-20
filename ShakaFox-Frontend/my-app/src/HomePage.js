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
  toggleRow,
  openRowIndex,
  isOffshoreWind,
  beachRoutes,
  page = "all"
}) {
  const filteredBeaches = page === "home"
    ? beachData.filter(b => [
        "new smyrna beach",
        "clearwater beach",
        "daytona beach",
        "jacksonville beach"
      ].includes(b.name.toLowerCase()))
    : beachData;

  const beachRows = [];
  for (let i = 0; i < filteredBeaches.length; i += 3) {
    beachRows.push(filteredBeaches.slice(i, i + 3));
  }

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/assets/0_Beach_Summer_3840x2160.mp4" type="video/mp4" />
      </video>

      <div className="app">
        <div style={{ position: 'relative' }}>
          {showOptions && (
            <div style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              transform: 'translateY(0)',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              width: '250px'
            }}>
              <div className="slider-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Temperature: {weights.temperature}</label>
                <input type="range" min="0" max="10" value={weights.temperature} onChange={(e) => setWeights({ ...weights, temperature: parseInt(e.target.value) })} />

                <label>Wave Height: {weights.waveHeight}</label>
                <input type="range" min="0" max="10" value={weights.waveHeight} onChange={(e) => setWeights({ ...weights, waveHeight: parseInt(e.target.value) })} />

                <label>Swell Period: {weights.swellPeriod}</label>
                <input type="range" min="0" max="10" value={weights.swellPeriod} onChange={(e) => setWeights({ ...weights, swellPeriod: parseInt(e.target.value) })} />

                <label>Wind Speed: {weights.windSpeed}</label>
                <input type="range" min="0" max="10" value={weights.windSpeed} onChange={(e) => setWeights({ ...weights, windSpeed: parseInt(e.target.value) })} />
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
              {beachRows.map((row, rowIndex) => (
                <div className="beach-row" key={rowIndex} style={{ display: 'flex', gap: '20px', width: '100%' }}>
                  {row.map((beach, index) => (
                    <div key={index} className={`beach ${beach.rank === 10 ? 'perfect-beach' : ''}`}>
                      <button className={`beach-btn ${beach.rank >= 9 ? 'high-rank' : ''}`} onClick={() => toggleRow(rowIndex)}>
                        <span className="beach-score">{isNaN(beach.rank) ? "N/A" : beach.rank.toFixed(1)}</span>
                        <span>{beach.name}</span>
                        <span className="dropdown-arrow">{openRowIndex === rowIndex ? '⏶' : '⏷'}</span>
                      </button>
                      {openRowIndex === rowIndex && (
                        <div className="beach-details">
                          <p>🌡️ Temperature: {beach.temperature}°F</p>
                          <p>📐 Wave Height: <span style={{ fontSize: `${Math.min(beach.waveSize * 6, 36)}px` }}>🌊</span> {beach.waveSize.toFixed(1)} ft</p>
                          <p>⌛ Swell Period: {beach.waveFrequency} sec</p>
                          <p>💨 Wind Speed: {(beach.windSpeed * 2.23694).toFixed(1)} mph</p>
                          {beach.windDirection !== undefined && beach.windDirection !== "N/A" && (
                            <p style={{ color: isOffshoreWind(beach.name, beach.windDirection) ? "green" : "red" }}>
                              Wind Direction: {isOffshoreWind(beach.name, beach.windDirection) ? "Offshore" : "Onshore"}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
