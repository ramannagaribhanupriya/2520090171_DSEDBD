import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SOSButton from "../components/SOSButton";

function Dashboard({ navigate, user }) {

  return (
    <div className="app-layout">

      <Navbar navigate={navigate} />

      <Sidebar navigate={navigate} />

      <main className="main-content">

        <div className="dashboard-header">

          <h1>
            Welcome, {user?.name || "User"}!
          </h1>

          <p>
            Stay safe and stay connected.
          </p>

        </div>

        <div className="sos-section">

          <SOSButton
            navigate={navigate}
          />

          <p>
            Press the SOS button during an emergency.
          </p>

        </div>

        <div className="dashboard-grid">

          <div
            className="dashboard-card"
            onClick={() => navigate("contacts")}
          >
            <div className="card-icon">👥</div>
            <h3>Emergency Contacts</h3>
            <p>
              Manage your emergency contacts.
            </p>
            <button>Open</button>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("tracking")}
          >
            <div className="card-icon">📍</div>
            <h3>Live Tracking</h3>
            <p>
              Share your current location.
            </p>
            <button>Track Location</button>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("profile")}
          >
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>
              View and manage your profile.
            </p>
            <button>View Profile</button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;