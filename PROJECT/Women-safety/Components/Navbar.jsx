function Navbar({ navigate }) {

  return (
    <header className="navbar">

      <div
        className="navbar-logo"
        onClick={() => navigate("dashboard")}
      >
        <img
          src="/src/assets/logo.png"
          alt="Logo"
        />

        <span>Women Safety</span>
      </div>

      <button
        className="profile-nav-button"
        onClick={() => navigate("profile")}
      >
        👤 Profile
      </button>

    </header>
  );
}

export default Navbar;