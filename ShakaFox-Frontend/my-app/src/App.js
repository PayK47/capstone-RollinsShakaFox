import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Miami from './Miami';
import Daytona from './Daytona';
import Clearwater from './Clearwater';
import PanamaCity from './PanamaCity';

function App() {
  const [beachData, setBeachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBeach, setOpenBeach] = useState(null);

  useEffect(() => {
    async function fetchBeachData() {
      try {
        const beaches = ["miami-beach", "daytona-beach", "clearwater-beach", "panama-city-beach"];
        const responses = await Promise.all(
          beaches.map(beach =>
            fetch(`/florida-beaches?beach=${beach}`)
              .then(response => response.ok ? response.json() : { name: beach, rank: 0 })
          )
        );

        const formattedData = responses.map((item, index) => ({
          name: beaches[index].replace(/-/g, " "),
          rank: item.rank || 0
        }));

        setBeachData(formattedData.sort((a, b) => b.rank - a.rank));
      } catch (error) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchBeachData();
  }, []);

  const toggleDropdown = (beachName) => {
    setOpenBeach(openBeach === beachName ? null : beachName);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <h1>ShakaFox</h1>
            {loading ? <p>Loading beach data...</p> : error ? <p>{error}</p> : (
              <div className="beach-list">
                {beachData.map((beach, index) => (
                  <div key={index} className="beach">
                    <button className="beach-btn" onClick={() => toggleDropdown(beach.name)}>
                      {beach.name} ⏷
                    </button>
                    {openBeach === beach.name && (
                      <div className="beach-details">
                        <p>Rank: {beach.rank.toFixed(1)}</p>
                        <Link to={`/${beach.name.replace(/ /g, "").toLowerCase()}`} className="beach-link">
                          View More About {beach.name}
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
