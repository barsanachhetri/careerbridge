import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "No password", color: "#999" };

    let score = 0;
    const feedback = [];

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Uppercase check
    if (/[A-Z]/.test(pwd)) score += 1;

    // Lowercase check
    if (/[a-z]/.test(pwd)) score += 1;

    // Number check
    if (/[0-9]/.test(pwd)) score += 1;

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 1;

    let strength = "Weak";
    let color = "#ef4444";

    if (score >= 6) {
      strength = "Very Strong";
      color = "#22c55e";
    } else if (score >= 5) {
      strength = "Strong";
      color = "#3b82f6";
    } else if (score >= 3) {
      strength = "Fair";
      color = "#f59e0b";
    }

    return { score, label: strength, color, maxScore: 7 };
  };

  // Generate strong password
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}";

    const allChars = lowercase + uppercase + numbers + special;
    let pwd = "";

    // Ensure at least one of each type
    pwd += lowercase[Math.floor(Math.random() * lowercase.length)];
    pwd += uppercase[Math.floor(Math.random() * uppercase.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += special[Math.floor(Math.random() * special.length)];

    // Fill rest with random characters
    for (let i = pwd.length; i < 14; i++) {
      pwd += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle password
    pwd = pwd.split("").sort(() => Math.random() - 0.5).join("");
    setPassword(pwd);
  };

  const strength = checkPasswordStrength(password);

  const signup = async () => {
    setError("");

    // Check password strength
    if (strength.score < 3) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }

    setLoading(true);
    try {
      const data = { name, email, password, role };
      if (role === "student") { data.branch = branch; data.cgpa = Number(cgpa); }
      await API.post("/auth/signup", data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div>
          <div className="brand-orb" style={{ width: 40, height: 40, fontSize: "1rem", marginBottom: "1.5rem" }}>CB</div>
          <h1>Join the<br />placement network.</h1>
        </div>
        <p>Create your profile once and apply to hundreds of opportunities with a single click.</p>
        <div className="auth-features">
          <div className="auth-feature">Instant shortlist notifications</div>
          <div className="auth-feature">Resume upload & tracking</div>
          <div className="auth-feature">Branch-specific job filtering</div>
        </div>
      </div>

      <div className="auth-form-panel" style={{ overflowY: "auto" }}>
        <h2>Create account</h2>
        <p className="auth-subtitle">It takes less than a minute</p>

        {error && <div className="alert alert-danger mb-3">⚠️ &nbsp;{error}</div>}

        <div className="form-group">
          <label className="form-label">Full name <span className="req">*</span></label>
          <input className="form-control" placeholder="Arjun Rao" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Email <span className="req">*</span></label>
          <input className="form-control" type="email" placeholder="you@college.edu" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Password <span className="req">*</span></label>
          <div style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem", alignItems: "stretch" }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="button"
              onClick={generatePassword}
              style={{
                padding: ".5rem 1rem",
                backgroundColor: "var(--blue)",
                color: "white",
                border: "none",
                borderRadius: ".5rem",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: ".85rem",
                whiteSpace: "nowrap",
                transition: "all .2s"
              }}
              onMouseOver={(e) => e.target.style.opacity = "0.8"}
              onMouseOut={(e) => e.target.style.opacity = "1"}
              title="Generate a strong password"
            >
              🔐 Generate
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginTop: ".75rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex",
                  gap: ".25rem",
                  marginBottom: ".3rem",
                  height: ".5rem"
                }}>
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: i < strength.score ? strength.color : "#ddd",
                        borderRadius: ".25rem",
                        transition: "all .3s ease"
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: ".75rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  Strength: <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
              </div>

              {/* Password Requirements Checker */}
              <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>
                <div style={{ marginBottom: ".3rem" }}>
                  <span style={{ color: /[A-Z]/.test(password) ? "var(--green)" : "#999" }}>✓ Uppercase</span>
                </div>
                <div style={{ marginBottom: ".3rem" }}>
                  <span style={{ color: /[0-9]/.test(password) ? "var(--green)" : "#999" }}>✓ Numbers</span>
                </div>
                <div>
                  <span style={{ color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "var(--green)" : "#999" }}>✓ Special</span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {password && strength.score < 3 && (
            <div style={{
              marginTop: ".5rem",
              padding: ".5rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: ".4rem",
              fontSize: ".8rem",
              color: "var(--red)",
              fontWeight: 500
            }}>
              💡 Tip: Use at least 8 characters with uppercase, numbers, and special characters
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === "student" && (
          <>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <input className="form-control" placeholder="e.g. Computer Science" onChange={(e) => setBranch(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">CGPA</label>
              <input className="form-control" placeholder="e.g. 8.5" onChange={(e) => setCgpa(e.target.value)} />
            </div>
          </>
        )}

        <button
          className="btn btn-primary btn-lg btn-block mt-3"
          onClick={signup}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="auth-link">
          Already have an account?&nbsp;<Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
