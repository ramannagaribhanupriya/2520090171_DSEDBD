function Profile({ navigate, user, onLogout }) {

  return (
    <div className="simple-page">

      <div className="page-card profile-card">

        <img
          src="/src/assets/logo.png"
          alt="Profile"
          className="profile-image"
        />

        <h1>My Profile</h1>

        <div className="profile-details">

          <div>
            <strong>Name</strong>
            <p>{user?.name || "User"}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{user?.email || "Not available"}</p>
          </div>

        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

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

export default Profile;