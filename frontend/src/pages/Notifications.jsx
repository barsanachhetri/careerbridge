import React, { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [role, setRole]   = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user?.role);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
      res.data.forEach(n => { if (!n.read) API.put(`/notifications/read/${n._id}`); });
    } catch { alert("Failed to load notifications."); }
    finally { setLoading(false); }
  };

  const send = async () => {
    if (!title || !message) { alert("Please fill in title and message."); return; }
    setSending(true);
    try {
      await API.post("/notifications", { title, message });
      setTitle(""); setMessage("");
      fetchNotifications();
    } catch { alert("Failed to send notification."); }
    finally { setSending(false); }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-text">
          <span className="eyebrow">{role === "admin" ? "Admin · " : ""}Communications</span>
          <h2>Notifications</h2>
          <p>{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Admin compose panel */}
      {role === "admin" && (
        <div className="card mb-4" style={{ padding:"2rem" }}>
          <h4 style={{ marginBottom:"1.2rem" }}>📣 Send Notification</h4>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              placeholder="e.g. Google — Round 2 Shortlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              placeholder="Type your message to all students…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={send} disabled={sending}>
            {sending ? "Sending…" : "Send to All Students"}
          </button>
        </div>
      )}

      {/* List */}
      {loading && (
        <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading…</p></div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔕</div>
          <h3>No notifications yet</h3>
          <p>You'll be notified here about shortlists, interviews, and updates.</p>
        </div>
      )}

      <div className="stagger">
        {notifications.map(n => (
          <div key={n._id} className={`notif-card${!n.read ? " unread" : ""}`}>
            <div className="notif-icon">{n.roundName ? "📅" : "🔔"}</div>
            <div style={{ flex:1 }}>
              <h5>{n.title}</h5>
              <p>{n.message}</p>

              {n.roundName && (
                <div style={{
                  marginTop:".75rem", padding:".75rem 1rem",
                  background:"var(--ice)", borderRadius:"var(--r-sm)",
                  fontSize:".82rem", color:"var(--text-2)",
                  display:"grid", gridTemplateColumns:"1fr 1fr", gap:".3rem .75rem"
                }}>
                  <span><strong>Round:</strong> {n.roundName}</span>
                  <span><strong>Date:</strong> {n.roundDate}</span>
                  <span><strong>Time:</strong> {n.roundTime}</span>
                  {n.instructions && (
                    <span style={{ gridColumn:"1/-1" }}>
                      <strong>Instructions:</strong> {n.instructions}
                    </span>
                  )}
                </div>
              )}

              <div className="notif-time">{formatDate(n.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
