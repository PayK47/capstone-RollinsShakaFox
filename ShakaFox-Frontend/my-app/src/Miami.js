// BeachDetail.js - A single beach detail page
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BeachDetails.css';

function BeachDetail() {
  const { beachName } = useParams();
  const [beachData, setBeachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBeachDetails() {
      try {
        const response = await fetch(`/florida-beaches?beach=${beachName.replace(/ /g, '-')}`);
        if (!response.ok) throw new Error(`Error fetching ${beachName}: ${response.status}`);
        const data = await response.json();
        setBeachData({
          name: beachName.replace(/-/g, ' '),
          temperature: data.temperature || 'N/A',
          waveSize: data.waveHeight || 'N/A',
          waveFrequency: data.swellPeriod || 'N/A',
          windSpeed: data.windSpeed || 'N/A',
          rank: data.rank || 0,
        });
      } catch (err) {
        setError('Failed to load beach data.');
      } finally {
        setLoading(false);
      }
    }
    fetchBeachDetails();
  }, [beachName]);

  if (loading) return <p>Loading beach data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="beach-detail">
      <h1>{beachData.name}</h1>
      <p>Temperature: {beachData.temperature}°F</p>
      <p>Wave Height: {beachData.waveSize} m</p>
      <p>Swell Period: {beachData.waveFrequency} sec</p>
      <p>Wind Speed: {beachData.windSpeed} m/s</p>
      <p>Rank: {beachData.rank.toFixed(1)}</p>
      <img src={`/images/${beachName.replace(/ /g, '-')}.jpg`} alt={beachData.name} className="beach-image" />
    </div>
  );
}

export default BeachDetail;
