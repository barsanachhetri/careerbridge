import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  // Daily motivational quotes for placement admins
  const motivationalQuotes = [
    "Every job posting creates an opportunity for a student's future. Keep inspiring! 🌟",
    "Your efforts today in recruiting will shape the careers of tomorrow's leaders. 💪",
    "One job posting = infinite possibilities for a deserving student. Let's go! 🚀",
    "A single placement can change someone's life forever. Keep posting! ✨",
    "More jobs posted today = More dreams fulfilled tomorrow. You've got this! 💼",
    "Behind every successful student placement is an inspiring placement admin. That's you! 👏",
    "Diversity in job postings means diverse opportunities. Keep them coming! 🌈",
    "Your dedication to placements is making a real difference. Keep shining! ⭐",
    "The more jobs we post, the more students succeed. Let's break records today! 📈",
    "Remember: Every notification you send sparks hope in a student's heart. 💝",
    "Post one more job and watch the magic happen. You are a game changer! 🎯",
    "Students are waiting for your next job posting. Make it happen today! 💡",
    "Excellence in placements starts with excellence in opportunities. Let's lead! 🏆",
    "Your role in student success is invaluable. Keep building bridges! 🌉",
    "Today's job postings are tomorrow's success stories. Let's write them! 📖",
    "Motivation is contagious—share more jobs and inspire the team! 🔥",
    "Every student deserves a chance to shine. Give them more opportunities! ✨",
    "Great placements happen when we actively recruit. Let's make it count! 💎",
    "Your commitment to students is what makes this system work. Thank you! 🙏",
    "Post boldly, recruit widely, succeed greatly. Today's your day! 🎪",
  ];

  // Get quote based on today's date (consistent throughout the day)
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const todayQuote = motivationalQuotes[dayOfYear % motivationalQuotes.length];

  const links = [
    { to: "/create-job", icon: "➕", label: "Post a New Job", sub: "Create a role and set eligibility criteria" },
    { to: "/applicants", icon: "👥", label: "View Applicants", sub: "Review resumes and shortlist candidates" },
    { to: "/company-tracker", icon: "📊", label: "Company Visit Tracker", sub: "Monitor all companies visiting campus" },
    { to: "/notifications", icon: "📣", label: "Send Notifications", sub: "Broadcast updates to all students" },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-text">
          <span className="eyebrow">Admin Portal</span>
          <h2>Hello, {admin.name?.split(" ")[0] || "Admin"} 👋</h2>
          <p>Manage job postings, applicants, and student communication.</p>
        </div>
      </div>

      {/* Daily Motivational Quote */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
          border: "1px solid rgba(37, 99, 235, 0.3)",
          borderRadius: ".75rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "2.5rem" }}>💡</div>
        <div>
          <div style={{ fontSize: ".85rem", color: "var(--text-3)", fontWeight: 600, letterSpacing: ".05em", marginBottom: ".3rem", textTransform: "uppercase" }}>
            Daily Motivation
          </div>
          <div style={{ fontSize: "1.05rem", color: "var(--text-1)", fontWeight: 500, lineHeight: 1.6 }}>
            {todayQuote}
          </div>
        </div>
      </div>

      <p className="section-label">Manage</p>
      <ul className="list-group stagger">
        {links.map(link => (
          <li key={link.to}>
            <Link className="list-group-item" to={link.to}>
              <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
                <div className="notif-icon">{link.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{link.label}</div>
                  <div style={{ fontSize: ".8rem", color: "var(--text-3)", marginTop: ".1rem" }}>{link.sub}</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
