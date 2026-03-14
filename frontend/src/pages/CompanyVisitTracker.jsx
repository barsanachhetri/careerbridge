import React, { useEffect, useState } from "react";
import API from "../services/api";

function CompanyVisitTracker() {
    const [totalCompanies, setTotalCompanies] = useState(0);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await API.get("/jobs/statistics/company");
                setTotalCompanies(response.data.totalCompanies);
                setCompanies(response.data.companies);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load company statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-icon">⏳</div>
                    <p>Loading statistics…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-text">
                    <span className="eyebrow">Placement Analytics</span>
                    <h2>Company Visit Tracker</h2>
                    <p style={{ marginTop: ".2rem" }}>Monitor all companies visiting for campus recruitment</p>
                </div>
            </div>

            {/* Error State */}
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

            {/* Total Companies Stat */}
            <div className="card" style={{ marginBottom: "2rem", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: ".85rem", color: "var(--text-3)", fontWeight: 500, marginBottom: ".3rem" }}>
                            TOTAL COMPANIES
                        </div>
                        <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--blue)" }}>
                            {totalCompanies}
                        </div>
                    </div>
                    <div style={{ fontSize: "3rem", opacity: 0.3 }}>🏢</div>
                </div>
            </div>

            {/* Companies List */}
            {companies.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No companies yet</h3>
                    <p>Companies will appear here once they post job openings.</p>
                </div>
            ) : (
                <div className="card">
                    <div style={{ marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-1)" }}>
                            📋 Company List
                        </h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                        {/* Table Header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr",
                                gap: "1rem",
                                padding: ".75rem 1rem",
                                backgroundColor: "var(--bg-2)",
                                borderRadius: ".5rem",
                                borderBottom: "1px solid var(--border)",
                                fontSize: ".85rem",
                                fontWeight: 600,
                                color: "var(--text-2)",
                                marginBottom: ".5rem",
                            }}
                        >
                            <div>Company Name</div>
                            <div>Visit Date</div>
                            <div>Total Jobs</div>
                        </div>

                        {/* Table Rows */}
                        {companies.map((company, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr",
                                    gap: "1rem",
                                    padding: ".75rem 1rem",
                                    borderRadius: ".5rem",
                                    border: "1px solid var(--border)",
                                    alignItems: "center",
                                    transition: "all .2s ease",
                                    cursor: "pointer",
                                    backgroundColor: "var(--bg-1)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--bg-2)";
                                    e.currentTarget.style.borderColor = "var(--blue)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--bg-1)";
                                    e.currentTarget.style.borderColor = "var(--border)";
                                }}
                            >
                                {/* Company Name */}
                                <div style={{ fontWeight: 600, color: "var(--text-1)" }}>
                                    {company.companyName}
                                </div>

                                {/* Visit Date */}
                                <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                                    📅 {formatDate(company.visitDate)}
                                </div>

                                {/* Total Jobs */}
                                <div style={{ color: "var(--blue)", fontWeight: 600 }}>
                                    {company.totalJobs} {company.totalJobs === 1 ? "job" : "jobs"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            {companies.length > 0 && (
                <div
                    className="card"
                    style={{
                        marginTop: "2rem",
                        backgroundColor: "var(--bg-2)",
                        padding: "1rem",
                        borderRadius: ".5rem",
                        display: "grid",
                        gridTemplateColumns: "auto auto auto",
                        gap: "2rem",
                    }}
                >
                    <div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".3rem" }}>
                            Companies
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--blue)" }}>
                            {totalCompanies}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".3rem" }}>
                            Total Job Openings
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--green)" }}>
                            {companies.reduce((sum, c) => sum + c.totalJobs, 0)}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".3rem" }}>
                            Latest: {companies.length > 0 && formatDate(companies[0].visitDate)}
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--orange)" }}>
                            {companies[0]?.companyName}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyVisitTracker;
