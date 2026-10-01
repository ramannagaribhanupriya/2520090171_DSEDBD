import React from "react";
import logo from "../assets/logo.png";

function Welcome({ navigate }) {
  return (
    <div
      className="welcome-page"
      style={{
        backgroundImage: `url(${logo})`
      }}
    >
      <button
        className="get-started-button"
        onClick={() => navigate("register")}
      >
        Get Started →
      </button>
    </div>
  );
}

export default Welcome;