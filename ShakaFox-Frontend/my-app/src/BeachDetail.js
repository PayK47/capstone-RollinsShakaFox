import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaSun, FaWater, FaWind } from 'react-icons/fa';
import './BeachDetail.css';

function BeachDetail() {
  const { beachId } = useParams();
  const [beachData, setBeachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const mainPhoto = `/images/${beachId}1.jpg`;
  const additionalPhotos = [
    `/images/${beachId}2.jpg`,
    `/images/${beachId}3.jpg`,
    `/images/${beachId}4.jpg`,
  ];

  useEffect(() => {
    async function fetchBeachDetails() {
      try {
        const response = await fetch(`/florida-beaches?beach=${beachId}`);
        if (!response.ok) throw new Error(`Error fetching ${beachId}`);
        const data = await response.json();
        setBeachData({
          name: beachId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
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
  }, [beachId]);

  const calculateBrightness = (temperature) =>
    Math.min(Math.max(((temperature || 0) / 100) * 2, 0.5), 2);

  const calculateWaveSize = (waveHeight) =>
    Math.min(Math.max((waveHeight || 0) * 10, 20), 100);

  const calculateWindSize = (windSpeed) =>
    Math.min(Math.max((windSpeed || 0) * 5, 20), 100);

  const handleNextPhoto = () =>
    setCurrentPhotoIndex((prev) => (prev + 1) % additionalPhotos.length);

  const handlePreviousPhoto = () =>
    setCurrentPhotoIndex((prev) => (prev - 1 + additionalPhotos.length) % additionalPhotos.length);

  if (loading) return <p className="loading-message">Loading beach data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="beach-detail-container">
      <h1 className="beach-detail-title">{beachData.name}</h1>

      <div className="top-section">
        <div className="main-photo">
          <a
            href={`https://www.google.com/maps/place/${beachData.name.replace(/\s/g, '+')},+FL`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={mainPhoto}
              alt={beachData.name}
              className="main-photo-image"
              onError={(e) => (e.target.src = '/images/default-beach.jpg')}
            />
            <span className="hover-message">View on Google Maps</span>
          </a>
        </div>

        <div className="photo-carousel">
          <img
            src={additionalPhotos[currentPhotoIndex]}
            alt={`${beachData.name} ${currentPhotoIndex + 2}`}
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
        <div className="grid-item temperature-section">
          <p>Temperature:</p>
          <FaSun
            className="sun-icon"
            style={{ color: '#FFD700', fontSize: '50px', filter: `brightness(${calculateBrightness(beachData.temperature)})` }}
          />
          <p>{beachData.temperature}°F</p>
        </div>

        <div className="grid-item wave-section">
          <p>Wave Height:</p>
          <FaWater
            className="wave-icon"
            style={{ color: '#00bcd4', fontSize: `${calculateWaveSize(beachData.waveSize)}px` }}
          />
          <p>{beachData.waveSize} m</p>
        </div>

        <div className="grid-item swell-section">
          <p>Swell Period:</p>
          <p>{beachData.waveFrequency} sec</p>
        </div>

        <div className="grid-item wind-section">
          <p>Wind Speed:</p>
          <FaWind
            className="wind-icon"
            style={{ color: '#4caf50', fontSize: `${calculateWindSize(beachData.windSpeed)}px` }}
          />
          <p>{beachData.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default BeachDetail;
