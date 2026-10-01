import { useState } from "react";

function LiveTracking({ navigate }) {

  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  const startTracking = () => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude
        });

        setTracking(true);
      },

      () => {
        alert("Unable to get your location.");
      }

    );
  };

  const stopTracking = () => {
    setTracking(false);
  };

  return (
    <div className="simple-page">

      <div className="page-card">

        <h1>Live Tracking</h1>

        <p>
          Share your current location during an emergency.
        </p>

        {!tracking ? (

          <button
            className="primary-button"
            onClick={startTracking}
          >
            Start Live Tracking
          </button>

        ) : (

          <button
            className="stop-button"
            onClick={stopTracking}
          >
            Stop Tracking
          </button>

        )}

        {location && (

          <div className="location-box">

            <h3>Current Location</h3>

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
              rel="noreferrer"
            >
              Open Location in Google Maps
            </a>

          </div>

        )}

        <button
          className="back-dashboard"
          onClick={() => navigate("dashboard")}
        >
          ← Go to Dashboard
        </button>

      </div>

    </div>
  );
}

export default LiveTracking;