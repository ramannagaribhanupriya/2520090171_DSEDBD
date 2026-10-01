import React, { useState } from "react";

function Login({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailPhone: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid login details.");
        return;
      }

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      localStorage.setItem("loggedIn", "true");

      alert("Login Successful! Welcome to Women Safety App.");

      navigate("dashboard");

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Login</h2>

        <p className="subtitle">
          Login to Women Safety App
        </p>

        <form onSubmit={handleLogin}>

          <label>Email or Mobile Number</label>

          <input
            type="text"
            placeholder="Enter email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                alert("Please contact support to reset password.")
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
          className="link-button"
          onClick={() => navigate("register")}
        >
          Register
        </button>

        <br />

        <button
          className="back-button"
          onClick={() => navigate("welcome")}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default Login;