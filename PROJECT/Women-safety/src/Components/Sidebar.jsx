function Sidebar({ navigate }) {

  return (
    <aside className="sidebar">

      <button onClick={() => navigate("dashboard")}>
        🏠 Dashboard
      </button>

      <button onClick={() => navigate("contacts")}>
        👥 Emergency Contacts
      </button>

      <button onClick={() => navigate("tracking")}>
        📍 Live Tracking
      </button>

      <button onClick={() => navigate("alert")}>
        🚨 Emergency Alert
      </button>

      <button onClick={() => navigate("profile")}>
        👤 Profile
      </button>

    </aside>
  );
}

export default Sidebar;