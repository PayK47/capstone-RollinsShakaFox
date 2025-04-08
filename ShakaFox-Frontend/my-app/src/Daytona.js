import { useEffect, useState } from 'react';
import './BeachDetail.css';

function Daytona() {
  const beachName = "daytona-beach"; // Hardcoded name
  const [beachData, setBeachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBeachDetails() {
      try {
        const response = await fetch(`/florida-beaches?beach=${beachName}`);
        if (!response.ok) throw new Error(`Error fetching ${beachName}: ${response.status}`);
        const data = await response.json();
        setBeachData({
          name: "Daytona Beach",
          temperature: data.temperature ?? 'N/A',
          waveSize: data.waveHeight ?? 'N/A',
          waveFrequency: data.swellPeriod ?? 'N/A',
          windSpeed: data.windSpeed ?? 'N/A',
          rank: data.rank ?? 0,
        });
      } catch (err) {
        setError('Failed to load beach data.');
      } finally {
        setLoading(false);
      }
    }
    fetchBeachDetails();
  }, []);

  if (loading) return <p className="loading-message">Loading beach data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="beach-detail-container">
      <h1 className="beach-detail-title">{beachData.name}</h1>
      <div className="beach-detail-data">
        <p>Temperature: {beachData.temperature}°F</p>
        <p>Wave Height: {beachData.waveSize} m</p>
        <p>Swell Period: {beachData.waveFrequency} sec</p>
        <p>Wind Speed: {beachData.windSpeed} m/s</p>

      </div>
      <img 
        src={`/images/daytona-beach.jpg`} 
        alt={beachData.name} 
        className="beach-image" 
        onError={(e) => e.target.src = '/images/default-beach.jpg'}
      />
    </div>
  );
}

export default Daytona;
