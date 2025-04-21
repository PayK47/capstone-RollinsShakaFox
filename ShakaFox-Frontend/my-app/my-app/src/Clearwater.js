import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaStar, FaWater } from 'react-icons/fa';
import './BeachDetail.css';

const Clearwater = () => {
  const beachName = "clearwater-beach";
  const [beachData, setBeachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch beach data
  useEffect(() => {
    const fetchBeachDetails = async () => {
      try {
        const response = await fetch(`/florida-beaches?beach=${beachName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${beachName}: ${response.status}`);
        }
        const data = await response.json();

        // Set beach data with fallback values
        setBeachData({
          name: "Clearwater Beach",
          temperature: data.temperature || 0,
          waveSize: data.waveHeight || 0,
          waveFrequency: data.swellPeriod || 0,
          windSpeed: data.windSpeed || 0,
          rank: data.rank || 0,
        });
      } catch (err) {
        console.error(err);
        setError('Unable to load beach data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBeachDetails();
  }, [beachName]);

  // Loading and error states
  if (loading) {
    return <p className="loading-message">Loading beach data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Chart data
  const chartData = [
    { name: 'Wave Height (m)', value: beachData.waveSize },
    { name: 'Swell Period (s)', value: beachData.waveFrequency },
    { name: 'Wind Speed (m/s)', value: beachData.windSpeed },
  ];

  // Rank color logic
  const getRankColor = (rank) => {
    if (rank === 10) return 'gold';
    if (rank >= 7) return 'limegreen';
    if (rank >= 4) return 'orange';
    return 'gray';
  };

  const rankColor = getRankColor(beachData.rank);

  // Temperature bar styles
  const tempWidth = `${beachData.temperature}%`;
  const tempDisplay = beachData.temperature ? `${beachData.temperature}°F` : 'N/A';

  return (
    <div className={`beach-detail-container ${beachData.rank === 10 ? 'sparkle' : ''}`}>
      <h1 className="beach-detail-title">{beachData.name}</h1>

      <div className="animated-background">
        <div className="beach-graph-wrapper">
          {/* Temperature Display */}
          <div className="temperature-display">
            <p className="temp-label">Temperature</p>
            <div className="temp-bar">
              <div className="temp-fill" style={{ width: tempWidth }}>
                {tempDisplay}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#00bcd4" />
            </BarChart>
          </ResponsiveContainer>

          {/* Rank Display */}
          <div className="rank-display" style={{ color: rankColor }}>
            <FaWater className="surf-icon" title="Surf Quality" />
            Beach Rank: <strong>{beachData.rank}/10</strong>
            {Array.from({ length: beachData.rank }, (_, i) => (
              <FaStar key={i} className="rank-star" title={`Star ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Beach Image */}
      <img
        src="clearwater-beach.jpg"
        alt={beachData.name}
        className="beach-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/default-beach.jpg';
          e.target.alt = 'Default beach image';
        }}
      />
    </div>
  );
};

export default Clearwater;