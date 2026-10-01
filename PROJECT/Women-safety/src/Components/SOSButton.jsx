import React, { useState } from "react";

function SOSButton({ navigate }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const handleSOS = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude
        });

        console.log("SOS Location:", latitude, longitude);
      },
      (error) => {
        setError("Unable to get your location. Please allow location access.");
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="sos-container">

      <button
        className="sos-button"
        onClick={handleSOS}
      >
        SOS
      </button>

      {location && (
        <div className="location-box">

          <h3>🚨 SOS Activated</h3>

          <p>
            <strong>Latitude:</strong>{" "}
            {location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong>{" "}
            {location.longitude}
          </p>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Open Location in Google Maps
          </a>

        </div>
      )}

      {error && (
        <p className="location-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default SOSButton;