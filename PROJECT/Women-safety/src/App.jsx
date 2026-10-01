import React, { useState } from "react";
import logo from "./assets/logo.png";

function App() {
  const [page, setPage] = useState("welcome");
  const [message, setMessage] = useState("");

  // REGISTER
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // CONTACTS
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [contacts, setContacts] = useState(() => {
    return JSON.parse(
      localStorage.getItem("emergencyContacts") || "[]"
    );
  });

  // LOCATION
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [sosActive, setSosActive] = useState(false);

  // LIVE TRACKING
  const [trackingLocation, setTrackingLocation] = useState(null);
  const [trackingError, setTrackingError] = useState("");

  // MESSAGE
  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !mobile ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            mobile: mobile,
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      // Save only safe user information.
      // Password is NOT stored in localStorage.
      const user = {
        id: data.userId,
        name: name,
        mobile: mobile,
        email: email
      };

      localStorage.setItem(
        "registeredUser",
        JSON.stringify(user)
      );

      setName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      showMessage("Registration Successful!");

      setTimeout(() => {
        setPage("login");
      }, 1200);

    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        "Unable to connect to backend. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter email/mobile and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailPhone: loginEmail,
            password: loginPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Invalid email/mobile or password."
        );
        return;
      }

      // Save logged-in user
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "registeredUser",
        JSON.stringify(data.user)
      );

      localStorage.setItem("loggedIn", "true");

      setLoginEmail("");
      setLoginPassword("");

      showMessage("Login Successful!");

      setTimeout(() => {
        setPage("dashboard");
      }, 1200);

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to backend. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // ADD CONTACT
  // =====================================================

  const addContact = async () => {
    if (!contactName || !contactPhone) {
      alert(
        "Please enter contact name and phone number."
      );
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser || !loggedInUser.id) {
      alert("Please login first.");
      setPage("login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            name: contactName,
            mobile: contactPhone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to save emergency contact."
        );
        return;
      }

      const newContact = {
        id: data.contactId,
        name: contactName,
        phone: contactPhone
      };

      const updatedContacts = [
        ...contacts,
        newContact
      ];

      setContacts(updatedContacts);

      localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(updatedContacts)
      );

      setContactName("");
      setContactPhone("");

      showMessage(
        "Contact Added Successfully!"
      );

    } catch (error) {
      console.error("Contact Error:", error);

      alert(
        "Unable to connect to backend."
      );
    }
  };

  // =====================================================
  // DELETE CONTACT
  // =====================================================

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== id
    );

    setContacts(updatedContacts);

    localStorage.setItem(
      "emergencyContacts",
      JSON.stringify(updatedContacts)
    );

    showMessage(
      "Contact Deleted Successfully!"
    );
  };

  // =====================================================
  // SOS
  // =====================================================

  const handleSOS = () => {
    setLocationError("");

    if (contacts.length === 0) {
      alert(
        "Please add at least one emergency contact before using SOS."
      );

      setPage("contacts");
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser || !loggedInUser.id) {
      alert("Please login first.");
      setPage("login");
      return;
    }

    if (!navigator.geolocation) {
      setLocationError(
        "Location is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setLocation({
          latitude: latitude,
          longitude: longitude
        });

        setSosActive(true);

        // Send SOS information to backend
        try {
          const response = await fetch(
            "http://localhost:5000/api/sos",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                user_id: loggedInUser.id,
                latitude: latitude,
                longitude: longitude
              })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            alert(
              data.message ||
              "SOS request failed."
            );
            return;
          }

          showMessage(
            "🚨 SOS Activated! Location sent successfully."
          );

        } catch (error) {
          console.error(
            "SOS Error:",
            error
          );

          alert(
            "Unable to connect to backend."
          );
        }
      },

      () => {
        setLocationError(
          "Unable to get location. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // =====================================================
  // I'M SAFE
  // =====================================================

  const handleImSafe = () => {
    setSosActive(false);
    setLocation(null);
    setLocationError("");

    showMessage(
      "🟢 I'm Safe! Safe status has been updated."
    );
  };

  // =====================================================
  // STOP SOS
  // =====================================================

  const handleStopSOS = () => {
    setSosActive(false);
    setLocation(null);
    setLocationError("");

    showMessage(
      "🔴 SOS stopped."
    );
  };

  // =====================================================
  // LIVE TRACKING
  // =====================================================

  const getTrackingLocation = () => {
    setTrackingError("");

    if (!navigator.geolocation) {
      setTrackingError(
        "Location is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTrackingLocation({
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude
        });

        showMessage(
          "Current Location Found Successfully!"
        );
      },

      () => {
        setTrackingError(
          "Unable to get location. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("registeredUser");

    showMessage(
      "Logged Out Successfully!"
    );

    setTimeout(() => {
      setPage("login");
    }, 800);
  };

  // =====================================================
  // WELCOME
  // =====================================================

  if (page === "welcome") {
    return (
      <div
        className="welcome-page"
        style={{
          backgroundImage: `url(${logo})`
        }}
      >
        <button
          className="get-started-button"
          onClick={() => setPage("register")}
        >
          Get Started →
        </button>
      </div>
    );
  }

  // =====================================================
  // REGISTER
  // =====================================================

  if (page === "register") {
    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="auth-page">
          <div className="auth-card">

            <h2>Create Account</h2>

            <p className="subtitle">
              Register for Women Safety App
            </p>

            <form onSubmit={handleRegister}>

              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value)
                }
                required
              />

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="submit"
                className="primary-button full-width"
              >
                Register
              </button>

            </form>

            <p className="bottom-text">
              Already have an account?
            </p>

            <button
              type="button"
              className="link-button"
              onClick={() =>
                setPage("login")
              }
            >
              Login
            </button>

            <br />

            <button
              type="button"
              className="back-button"
              onClick={() =>
                setPage("welcome")
              }
            >
              ← Back
            </button>

          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // LOGIN
  // =====================================================

  if (page === "login") {
    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="auth-page">
          <div className="auth-card">

            <h2>Login</h2>

            <p className="subtitle">
              Login to Women Safety App
            </p>

            <form onSubmit={handleLogin}>

              <label>
                Email or Mobile Number
              </label>

              <input
                type="text"
                placeholder="Enter email or mobile number"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(
                    e.target.value
                  )
                }
                required
              />

              <div className="login-options">

                <label className="remember">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <button
                  type="button"
                  className="link-button"
                  onClick={() =>
                    alert(
                      "Password reset will be added with backend."
                    )
                  }
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="submit"
                className="primary-button full-width"
              >
                Login
              </button>

            </form>

            <p className="bottom-text">
              Don't have an account?
            </p>

            <button
              type="button"
              className="link-button"
              onClick={() =>
                setPage("register")
              }
            >
              Register
            </button>

            <br />

            <button
              type="button"
              className="back-button"
              onClick={() =>
                setPage("welcome")
              }
            >
              ← Back
            </button>

          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  if (page === "dashboard") {
    const savedUser = JSON.parse(
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("registeredUser") ||
      "{}"
    );

    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="navbar">

          <div className="navbar-logo">

            <img
              src={logo}
              alt="Women Safety"
            />

            <span>
              Women Safety
            </span>

          </div>

          <button
            className="profile-nav-button"
            onClick={() =>
              setPage("profile")
            }
          >
            👤 Profile
          </button>

        </div>

        <div className="sidebar">

          <button
            onClick={() =>
              setPage("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              setPage("contacts")
            }
          >
            👥 Emergency Contacts
          </button>

          <button
            onClick={() =>
              setPage("tracking")
            }
          >
            📍 Live Tracking
          </button>

          <button
            onClick={() =>
              setPage("profile")
            }
          >
            👤 Profile
          </button>

          <button onClick={logout}>
            🚪 Logout
          </button>

        </div>

        <main className="main-content">

          <div className="dashboard-header">

            <h1>
              Welcome,{" "}
              {savedUser.name || "User"}!
            </h1>

            <p>
              Stay safe and use the emergency
              features when needed.
            </p>

          </div>

          <div className="sos-section">

            <h2>
              Emergency SOS
            </h2>

            <p>
              Press the SOS button during an emergency.
            </p>

            <div className="sos-container">

              <button
                className="sos-button"
                onClick={handleSOS}
              >
                SOS
              </button>

              {location && sosActive && (
                <div className="location-box">

                  <h3>
                    🚨 SOS Activated
                  </h3>

                  <p>
                    <strong>
                      Latitude:
                    </strong>{" "}
                    {location.latitude}
                  </p>

                  <p>
                    <strong>
                      Longitude:
                    </strong>{" "}
                    {location.longitude}
                  </p>

                  <p className="location-shared-message">
                    📍 Location sent successfully.
                  </p>

                  <a
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍 Open Location in Google Maps
                  </a>

                  <div className="sos-action-buttons">

                    <button
                      className="safe-button"
                      onClick={handleImSafe}
                    >
                      🟢 I'm Safe
                    </button>

                    <button
                      className="stop-sos-button"
                      onClick={handleStopSOS}
                    >
                      🔴 Stop SOS
                    </button>

                  </div>

                </div>
              )}

              {locationError && (
                <p className="location-error">
                  {locationError}
                </p>
              )}

            </div>

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <div className="card-icon">
                👥
              </div>

              <h3>
                Emergency Contacts
              </h3>

              <p>
                Add and manage your emergency contacts.
              </p>

              <button
                onClick={() =>
                  setPage("contacts")
                }
              >
                Manage Contacts
              </button>

            </div>

            <div className="dashboard-card">

              <div className="card-icon">
                📍
              </div>

              <h3>
                Live Tracking
              </h3>

              <p>
                View your current location.
              </p>

              <button
                onClick={() =>
                  setPage("tracking")
                }
              >
                Open Tracking
              </button>

            </div>

            <div className="dashboard-card">

              <div className="card-icon">
                👤
              </div>

              <h3>
                My Profile
              </h3>

              <p>
                View your registered details.
              </p>

              <button
                onClick={() =>
                  setPage("profile")
                }
              >
                View Profile
              </button>

            </div>

          </div>

        </main>
      </>
    );
  }

  // =====================================================
  // CONTACTS
  // =====================================================

  if (page === "contacts") {
    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="simple-page">

          <div className="page-card">

            <h1>
              Emergency Contacts
            </h1>

            <p>
              Add people who should be contacted during
              an emergency.
            </p>

            <div className="contact-form">

              <input
                type="text"
                placeholder="Contact Name"
                value={contactName}
                onChange={(e) =>
                  setContactName(e.target.value)
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={contactPhone}
                onChange={(e) =>
                  setContactPhone(e.target.value)
                }
              />

              <button
                className="primary-button"
                onClick={addContact}
              >
                Add Contact
              </button>

            </div>

            <div className="contacts-list">

              {contacts.length === 0 ? (
                <p className="empty-message">
                  No emergency contacts added yet.
                </p>
              ) : (
                contacts.map((contact) => (
                  <div
                    className="contact-item"
                    key={contact.id}
                  >

                    <div>

                      <strong>
                        {contact.name}
                      </strong>

                      <p>
                        {contact.phone}
                      </p>

                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteContact(contact.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                ))
              )}

            </div>

            <button
              className="back-dashboard"
              onClick={() =>
                setPage("dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // LIVE TRACKING
  // =====================================================

  if (page === "tracking") {
    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="simple-page">

          <div className="page-card">

            <h1>
              📍 Live Tracking
            </h1>

            <p>
              View your current location.
            </p>

            <button
              className="primary-button"
              onClick={getTrackingLocation}
            >
              Get My Location
            </button>

            {trackingLocation && (
              <div className="location-box">

                <h3>
                  📍 Current Location
                </h3>

                <p>
                  <strong>
                    Latitude:
                  </strong>{" "}
                  {trackingLocation.latitude}
                </p>

                <p>
                  <strong>
                    Longitude:
                  </strong>{" "}
                  {trackingLocation.longitude}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${trackingLocation.latitude},${trackingLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍 Open Location in Google Maps
                </a>

              </div>
            )}

            {trackingError && (
              <p className="location-error">
                {trackingError}
              </p>
            )}

            <button
              className="back-dashboard"
              onClick={() =>
                setPage("dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // PROFILE
  // =====================================================

  if (page === "profile") {
    const savedUser = JSON.parse(
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("registeredUser") ||
      "{}"
    );

    return (
      <>
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="simple-page">

          <div className="page-card profile-card">

            <h1>
              👤 My Profile
            </h1>

            <div className="profile-details">

              <div>

                <strong>
                  Name
                </strong>

                <p>
                  {savedUser.name || "Not available"}
                </p>

              </div>

              <div>

                <strong>
                  Mobile Number
                </strong>

                <p>
                  {savedUser.mobile || "Not available"}
                </p>

              </div>

              <div>

                <strong>
                  Email
                </strong>

                <p>
                  {savedUser.email || "Not available"}
                </p>

              </div>

            </div>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>

            <br />

            <button
              className="back-dashboard"
              onClick={() =>
                setPage("dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>
      </>
    );
  }

  return null;
}

export default App;