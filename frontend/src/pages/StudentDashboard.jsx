import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    API.get("/notifications")
      .then(res => setNotifications(res.data))
      .catch(() => { });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const links = [
    { to: "/edit-profile", icon: "✏️", label: "Edit Your Profile", sub: "Update your details and skills" },
    { to: "/jobs", icon: "💼", label: "Browse Available Jobs", sub: "Explore open roles matching your profile" },
    { to: "/applications", icon: "📋", label: "My Applications", sub: "Track the status of every submission" },
    { to: "/notifications", icon: "🔔", label: "Notifications", sub: "Interview rounds, shortlists & updates", badge: unreadCount },
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <span className="eyebrow">Student Portal</span>
          <h2>Good to see you, {user.name?.split(" ")[0] || "Student"} 👋</h2>
          <p style={{ marginTop: ".2rem" }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "You're all caught up."}
          </p>
        </div>
      </div>

      {/* Quick nav */}
      <p className="section-label">Quick Actions</p>
      <ul className="list-group stagger">
        {links.map(link => (
          <li key={link.to}>
            <Link className="list-group-item" to={link.to}>
              <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
                <div className="notif-icon">{link.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-1)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                    {link.label}
                    {link.badge > 0 && <span className="nav-badge">{link.badge}</span>}
                  </div>
                  <div style={{ fontSize: ".8rem", color: "var(--text-3)", marginTop: ".1rem" }}>{link.sub}</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Profile chip */}
      <div className="card mt-5" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div className="avatar" style={{ width: 48, height: 48, fontSize: "1rem", flexShrink: 0 }}>
          {(user.name || "S").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: ".82rem", color: "var(--text-3)" }}>{user.email}</div>
          {user.branch && <div style={{ fontSize: ".78rem", color: "var(--blue)", marginTop: ".2rem" }}>{user.branch} · CGPA {user.cgpa}</div>}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
