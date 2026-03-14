import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Add CSS for select dropdown styling
const selectStyleCSS = `
  select {
    color-scheme: dark;
  }
  select option {
    background-color: #1a1f2e;
    color: #e8eaed;
    padding: 10px;
  }
  select option:checked {
    background-color: #2563eb;
    background-image: linear-gradient(#2563eb, #2563eb);
  }
  select option:hover {
    background-color: #2d3748;
  }
`;

function EditProfile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        branch: user.branch || "",
        cgpa: user.cgpa || "",
        skills: user.skills?.join(", ") || "",
    });

    const branches = [
        "Computer Science",
        "Electronics",
        "Mechanical",
        "Civil",
        "Electrical",
        "Information Technology",
        "Aeronautical",
        "Biotechnology",
        "Chemical",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError("");

        try {
            // Validate inputs
            if (!formData.name.trim()) {
                setError("Name is required");
                setLoading(false);
                return;
            }

            if (!formData.email.trim()) {
                setError("Email is required");
                setLoading(false);
                return;
            }

            if (!formData.branch) {
                setError("Please select a branch");
                setLoading(false);
                return;
            }

            if (!formData.cgpa || formData.cgpa < 0 || formData.cgpa > 10) {
                setError("Please enter a valid CGPA (0-10)");
                setLoading(false);
                return;
            }

            if (!formData.skills.trim()) {
                setError("Please add at least one skill");
                setLoading(false);
                return;
            }

            // Convert skills string to array
            const skillsArray = formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0);

            if (skillsArray.length === 0) {
                setError("Please add at least one skill");
                setLoading(false);
                return;
            }

            // Send update request
            const response = await API.put("/auth/profile", {
                name: formData.name,
                email: formData.email,
                branch: formData.branch,
                cgpa: parseFloat(formData.cgpa),
                skills: skillsArray,
            });

            if (response.status === 200) {
                // Update localStorage with new user data
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setSuccess(true);

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <style>{selectStyleCSS}</style>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-text">
                    <span className="eyebrow">Student Portal</span>
                    <h2>Edit Your Profile</h2>
                    <p style={{ marginTop: ".2rem" }}>Update your details and skills</p>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div
                    className="card"
                    style={{
                        borderLeft: "4px solid var(--green)",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        marginBottom: "1.5rem",
                    }}
                >
                    <div style={{ color: "var(--green)", fontWeight: 600 }}>✓ Profile updated successfully!</div>
                    <div style={{ fontSize: ".85rem", marginTop: ".3rem" }}>
                        Redirecting to dashboard...
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div
                    className="card"
                    style={{
                        borderLeft: "4px solid var(--red)",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        marginBottom: "1.5rem",
                    }}
                >
                    <div style={{ color: "var(--red)", fontWeight: 600 }}>✗ {error}</div>
                </div>
            )}

            {/* Form */}
            <div className="card">
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={{
                                width: "100%",
                                padding: ".75rem",
                                border: "1px solid var(--border)",
                                borderRadius: ".5rem",
                                fontSize: ".95rem",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={{
                                width: "100%",
                                padding: ".75rem",
                                border: "1px solid var(--border)",
                                borderRadius: ".5rem",
                                fontSize: ".95rem",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Two Column Layout */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        {/* Branch Field */}
                        <div>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
                                Branch/Department
                            </label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: ".75rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: ".5rem",
                                    fontSize: ".95rem",
                                    fontFamily: "inherit",
                                    backgroundColor: "var(--bg-2)",
                                    color: "var(--text-1)",
                                }}
                            >
                                <option value="">Select your branch</option>
                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* CGPA Field */}
                        <div>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
                                CGPA (0-10)
                            </label>
                            <input
                                type="number"
                                name="cgpa"
                                value={formData.cgpa}
                                onChange={handleChange}
                                placeholder="e.g., 8.5"
                                min="0"
                                max="10"
                                step="0.01"
                                style={{
                                    width: "100%",
                                    padding: ".75rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: ".5rem",
                                    fontSize: ".95rem",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                    </div>

                    {/* Skills Field */}
                    <div style={{ marginBottom: "2rem" }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
                            Skills (comma-separated)
                        </label>
                        <textarea
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g., JavaScript, React, Node.js, Python"
                            rows="3"
                            style={{
                                width: "100%",
                                padding: ".75rem",
                                border: "1px solid var(--border)",
                                borderRadius: ".5rem",
                                fontSize: ".95rem",
                                fontFamily: "inherit",
                                resize: "vertical",
                            }}
                        />
                        <div style={{ fontSize: ".8rem", color: "var(--text-3)", marginTop: ".3rem" }}>
                            Separate skills with commas. Example: Python, Machine Learning, Data Analysis
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            style={{
                                padding: ".75rem 1.5rem",
                                border: "1px solid var(--border)",
                                borderRadius: ".5rem",
                                backgroundColor: "var(--bg-2)",
                                color: "var(--text-1)",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: ".9rem",
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: ".75rem 1.5rem",
                                border: "none",
                                borderRadius: ".5rem",
                                backgroundColor: loading ? "var(--text-3)" : "var(--blue)",
                                color: "white",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: ".9rem",
                            }}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
