import React, { useState } from "react";

function Register({ navigate }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            mobile: mobile,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful! Please login.");

      setName("");
      setMobile("");
      setEmail("");
      setPassword("");

      navigate("login");
    } catch (error) {
      console.error("Register Error:", error);
      alert(
        "Unable to connect to backend. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Create Account</h2>

        <p className="subtitle">
          Register for Women Safety App
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Mobile Number</label>

          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          onClick={() => navigate("login")}
        >
          Login
        </button>

        <br />

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("welcome")}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default Register;