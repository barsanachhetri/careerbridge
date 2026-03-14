import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "User not found") {
        navigate("/signup");
        return;
      }
      if (msg === "Wrong password") {
        const next = attempts + 1;
        setAttempts(next);
        setError(next >= 3
          ? "Too many failed attempts."
          : `Wrong password. ${3 - next} attempt${3 - next !== 1 ? "s" : ""} left.`
        );
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="auth-shell">
      {/* Left branding panel */}
      <div className="auth-panel">
        <div>
          <div className="brand-orb" style={{ width: 40, height: 40, fontSize: "1rem", marginBottom: "1.5rem" }}>CB</div>
          <h1>Your career<br />starts here.</h1>
        </div>
        <p>Connect with top recruiters, track every application, and land the role you deserve — all in one place.</p>
        <div className="auth-features">
          <div className="auth-feature">200+ verified companies</div>
          <div className="auth-feature">Real-time application tracking</div>
          <div className="auth-feature">Interview round notifications</div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            ⚠️ &nbsp;{error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            className="form-control"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: ".75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: ".25rem",
                color: "var(--text-2)",
                transition: "all .2s"
              }}
              onMouseOver={(e) => e.target.style.color = "var(--blue)"}
              onMouseOut={(e) => e.target.style.color = "var(--text-2)"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg btn-block mt-3"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {attempts >= 3 && (
          <Link to="/forgot-password" className="btn btn-ghost btn-block mt-2">
            Forgot password?
          </Link>
        )}

        <p className="auth-link">
          Don't have an account?&nbsp;<Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
