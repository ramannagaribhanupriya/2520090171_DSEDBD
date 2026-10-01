function EmergencyAlert({ navigate }) {

  return (
    <div className="alert-page">

      <div className="alert-card">

        <div className="alert-icon">
          🚨
        </div>

        <h1>SOS Active</h1>

        <p>
          Your emergency alert has been activated.
        </p>

        <div className="alert-info">

          <p>
            📍 Location sharing is active.
          </p>

          <p>
            📱 Emergency contacts will be notified.
          </p>

          <p>
            🆘 Please stay in a safe location.
          </p>

        </div>

        <div className="alert-buttons">

          <button
            className="safe-button"
            onClick={() => navigate("dashboard")}
          >
            ✓ I'm Safe
          </button>

          <button
            className="stop-button"
            onClick={() => navigate("dashboard")}
          >
            Stop SOS
          </button>

        </div>

      </div>

    </div>
  );
}

export default EmergencyAlert;