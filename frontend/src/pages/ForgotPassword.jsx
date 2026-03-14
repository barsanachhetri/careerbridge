import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = async () => {
    setError("");
    setLoading(true);
    try {
      await API.put("/auth/reset-password", { email, password });
      navigate("/");
    } catch {
      setError("Could not reset password. Check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-mini">
      <div className="auth-mini-card">
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="brand-orb" style={{ width: 36, height: 36, fontSize: ".8rem", marginBottom: "1.2rem" }}>CB</div>
          <h2 style={{ fontSize: "1.5rem" }}>Reset password</h2>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Enter your email and a new password.</p>
        </div>

        {error && <div className="alert alert-danger mb-3">⚠️ &nbsp;{error}</div>}

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-control" type="email" placeholder="you@college.edu" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">New password</label>
          <input className="form-control" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button
          className="btn btn-primary btn-lg btn-block mt-3"
          onClick={reset}
          disabled={loading}
        >
          {loading ? "Updating…" : "Update Password"}
        </button>

        <p className="auth-link"><Link to="/">Back to sign in</Link></p>
      </div>
    </div>
  );
}

export default ForgotPassword;
