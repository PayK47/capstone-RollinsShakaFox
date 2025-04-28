import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({
  beachData,
  loading,
  error,
  weights,
  toggleBeach,
  openBeachIndex,
  isOffshoreWind,
  beachRoutes,
  page = "all"
}) {
  const filteredBeaches = page === "home"
    ? beachData.filter(b => [
        "new smyrna beach",
        "cocoa beach",
        "playa linda",
        "sebastian inlet",
        "jacksonville beach"
      ].includes(b.name.toLowerCase()))
    : beachData;

  return (
    <>
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/assets/0_Beach_Summer_3840x2160.mp4" type="video/mp4" />
      </video>

      <div className="center-container" style={page === "home" ? { marginTop: '30px' } : {}}>
        <h1>ShakaFox</h1>
        <div className="subtitle">
          {page === "home"
            ? "Rollins College surf ranked for you instantly!"
            : "Florida surfing ranked for you instantly!"}
        </div>
        <img src="/Wide-Fox.webp" alt="Shaka Fox" className="shaka-image" />

        {loading ? (
          <p>Loading beach data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="beach-list">
            <div className="beach-row">
              {filteredBeaches
                .sort((a, b) => (b.rank || 0) - (a.rank || 0))
                .map((beach, beachIndex) => {
                  let normalizedTemp = (beach.temperature - 70) / 30;
                  let normalizedWaveHeight = (beach.waveSize * 3.28084) / 10;
                  let normalizedSwellPeriod = beach.waveFrequency / 20;
                  let normalizedWindSpeed = (beach.windSpeed * 2.23694) / 30;

                  let score =
                    (normalizedTemp * weights.temperature) +
                    (normalizedWaveHeight * weights.waveHeight) +
                    (normalizedSwellPeriod * weights.swellPeriod) +
                    (normalizedWindSpeed * weights.windSpeed);

                  beach.rank = isNaN(score) ? 0 : Math.min(score, 10);

                  return (
                    <div key={beachIndex} className={`beach ${beach.rank === 10 ? 'perfect-beach' : ''}`}>
                      <button
                        className={`beach-btn ${beach.rank >= 9 ? 'high-rank' : ''}`}
                        onClick={() => toggleBeach(beachIndex)}
                      >
                        <span className="beach-score">{isNaN(beach.rank) ? "N/A" : beach.rank.toFixed(1)}</span>
                        <span>{beach.name}</span>
                        <span className="dropdown-arrow">{openBeachIndex === beachIndex ? '⏶' : '⏷'}</span>
                      </button>

                      <div className={`beach-details ${openBeachIndex === beachIndex ? 'open' : ''}`}>
                        {openBeachIndex === beachIndex && (
                          <div className="beach-details-content fade-in">
                            <p>🌡️ Temperature: {beach.temperature}°F</p>
                            <p>
                              📐 Wave Height:
                              <span style={{ fontSize: `${Math.min(beach.waveSize * 3.28084 * 6, 36)}px` }}> 🌊</span>
                              {beach.waveSize * 3.28084 < 1
                                ? "< 1"
                                : (beach.waveSize * 3.28084).toFixed(1)
                              } ft
                            </p>
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
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
