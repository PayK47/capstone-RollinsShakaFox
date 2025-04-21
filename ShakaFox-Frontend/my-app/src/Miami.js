import React, { useEffect, useState } from 'react';
import { FaSun, FaWater, FaWind } from 'react-icons/fa'; // Import icons
import './BeachDetail.css';

function Miami() {
  const beachName = "miami-beach"; // Hardcoded for this specific page
  const [beachData, setBeachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // State for photo carousel

  const mainPhoto = '/images/Miami1.jpg'; // Main image to display
  const additionalPhotos = [
    '/images/Miami2.jpg',
    '/images/Miami3.jpg',
    '/images/Miami4.jpg',
  ]; // Additional photos for the carousel

  useEffect(() => {
    async function fetchBeachDetails() {
      try {
        const response = await fetch(`/florida-beaches?beach=${beachName}`);
        if (!response.ok) throw new Error(`Error fetching ${beachName}: ${response.status}`);
        const data = await response.json();
        setBeachData({
          name: "Miami Beach", // Static name
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

  const calculateBrightness = (temperature) => {
    const temp = temperature !== 'N/A' ? temperature : 0;
    return Math.min(Math.max((temp / 100) * 2, 0.5), 2); // Scale brightness between 0.5 and 2
  };

  const calculateWaveSize = (waveHeight) => {
    const height = waveHeight !== 'N/A' ? waveHeight : 0;
    return Math.min(Math.max(height * 10, 20), 100); // Scale font size between 20px and 100px
  };

  const calculateWindSize = (windSpeed) => {
    const speed = windSpeed !== 'N/A' ? windSpeed : 0;
    return Math.min(Math.max(speed * 5, 20), 100); // Scale font size between 20px and 100px
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % additionalPhotos.length);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + additionalPhotos.length) % additionalPhotos.length);
  };

  return (
    <div className="beach-detail-container">
      {/* Title Section */}
      <h1 className="beach-detail-title">{beachData.name}</h1>

      <div className="top-section">
        {/* Main Photo Section */}
        <div className="main-photo">
          <a
            href="https://www.google.com/maps/place/Miami+Beach,+FL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={mainPhoto}
              alt="Miami Beach"
              className="main-photo-image"
              onError={(e) => (e.target.src = '/images/default-beach.jpg')}
            />
            <span className="hover-message">View on Google Maps</span>
          </a>
        </div>

        {/* Carousel for Additional Photos */}
        <div className="photo-carousel">
          <img
            src={additionalPhotos[currentPhotoIndex]}
            alt={`Miami Beach ${currentPhotoIndex + 2}`}
            className="carousel-image"
            onError={(e) => (e.target.src = '/images/default-beach.jpg')}
          />
          <div className="carousel-controls">
            <button onClick={handlePreviousPhoto}>&lt;</button>
            <button onClick={handleNextPhoto}>&gt;</button>
          </div>
        </div>
      </div>

      <div className="grid-container">
        {/* Temperature Section */}
        <div className="grid-item temperature-section">
          <p>Temperature:</p>
          <FaSun
            className="sun-icon"
            style={{
              color: '#FFD700', // Gold color for the sun
              fontSize: '50px',
              filter: `brightness(${calculateBrightness(beachData.temperature)})`, // Adjust brightness dynamically
            }}
          />
          <p>{beachData.temperature}°F</p>
        </div>

        {/* Wave Height Section */}
        <div className="grid-item wave-section">
          <p>Wave Height:</p>
          <FaWater
            className="wave-icon"
            style={{
              color: '#00bcd4', // Blue color for the wave
              fontSize: `${calculateWaveSize(beachData.waveSize)}px`, // Adjust size dynamically
            }}
          />
          <p>{beachData.waveSize} m</p>
        </div>

        {/* Swell Period Section */}
        <div className="grid-item swell-section">
          <p>Swell Period:</p>
          <p>{beachData.waveFrequency} sec</p>
        </div>

        {/* Wind Speed Section */}
        <div className="grid-item wind-section">
          <p>Wind Speed:</p>
          <FaWind
            className="wind-icon"
            style={{
              color: '#4caf50', // Green color for the wind
              fontSize: `${calculateWindSize(beachData.windSpeed)}px`, // Adjust size dynamically
            }}
          />
          <p>{beachData.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default Miami;
