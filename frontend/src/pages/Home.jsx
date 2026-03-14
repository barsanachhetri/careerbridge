import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";

/* Animated counter hook */
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const COMPANIES = [
  { name: "Google", logo: "🔵", color: "#4285f4" },
  { name: "Microsoft", logo: "🟦", color: "#00a4ef" },
  { name: "Amazon", logo: "🟠", color: "#ff9900" },
  { name: "Atlassian", logo: "🔷", color: "#0052cc" },
  { name: "Swiggy", logo: "🟠", color: "#fc8019" },
  { name: "Flipkart", logo: "🔵", color: "#2874f0" },
  { name: "Zomato", logo: "🔴", color: "#e23744" },
  { name: "Meesho", logo: "🟣", color: "#9b59b6" },
  { name: "CRED", logo: "⬛", color: "#1a1a2e" },
  { name: "Razorpay", logo: "🔷", color: "#3395ff" },
];

const FEATURES = [
  { icon: "🎯", title: "Smart Job Matching", desc: "CGPA and branch-aware filtering shows you only roles you're eligible for. No noise." },
  { icon: "📡", title: "Live Status Updates", desc: "Real-time notifications the moment your application status changes. No more refreshing." },
  { icon: "📄", title: "One-click Apply", desc: "Upload your resume once. Apply to multiple companies with a single click." },
  { icon: "📅", title: "Interview Scheduler", desc: "Admins send round details directly. Date, time, and instructions in one place." },
  { icon: "📊", title: "Application Tracker", desc: "See every application at a glance — Applied, Shortlisted, Selected, or Rejected." },
  { icon: "🔒", title: "Secure & Verified", desc: "Only company-verified job posts. No spam, no fake listings." },
];

function Home() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Parallax mouse effect on hero - optimized with throttling */
  useEffect(() => {
    let rafId = null;
    const handleMouse = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        setMousePos({ x: (e.clientX / w - 0.5) * 30, y: (e.clientY / h - 0.5) * 20 });
        rafId = null;
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* Intersection observer for counters */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(200, 1600, statsVisible);
  const c2 = useCounter(94, 1400, statsVisible);
  const c3 = useCounter(3200, 2000, statsVisible);
  const c4 = useCounter(47, 1500, statsVisible);

  return (
    <div className="home-root">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        {/* Animated mesh background */}
        <div className="hero-mesh" style={{
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`
        }} />
        <div className="hero-mesh hero-mesh--2" style={{
          transform: `translate(${-mousePos.x * 0.25}px, ${-mousePos.y * 0.25}px)`
        }} />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            Placement Season 2026 is Live
          </div>

          <h1 className="hero-heading">
            Land your dream<br />
            <span className="hero-heading-gradient">placement.</span>
          </h1>

          <p className="hero-sub">
            The all-in-one campus placement portal. Apply to top companies,
            track every round, and get notified the moment something changes.
          </p>

          <div className="hero-ctas">
            <Link to="/signup" className="btn-hero-primary">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/login" className="btn-hero-secondary">Sign In</Link>
          </div>

          {/* floating badges */}
          <div className="hero-badges">
            <div className="hero-badge hero-badge--green">
              <span>✓</span> 94% placement rate
            </div>
            <div className="hero-badge hero-badge--blue">
              <span>⚡</span> Instant notifications
            </div>
            <div className="hero-badge hero-badge--purple">
              <span>🏆</span> Top-tier companies
            </div>
          </div>
        </div>

        {/* Floating card mockup */}
        <div className="hero-card-mockup" style={{
          transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.12}px) rotate(-2deg)`
        }}>
          <div className="mock-card">
            <div className="mock-card-top">
              <div className="mock-logo">🔵</div>
              <div>
                <div className="mock-company">Google</div>
                <div className="mock-role">Software Engineer Intern</div>
              </div>
              <div className="mock-badge-selected">Selected ✓</div>
            </div>
            <div className="mock-divider" />
            <div className="mock-timeline">
              {["Applied", "Shortlisted", "Interview", "Selected"].map((s, i) => (
                <div key={s} className={`mock-step${i <= 3 ? " done" : ""}`}>
                  <div className="mock-step-dot" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mock-notif">
            <div>🔔</div>
            <div>
              <div className="mock-notif-title">Interview Scheduled!</div>
              <div className="mock-notif-sub">Tomorrow · 11:00 AM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────── */}
      <section className="ticker-section">
        <div className="ticker-label">Hiring partners</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="ticker-item">
                <span>{c.logo}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD QUICK ACCESS ──────────────────── */}
      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-eyebrow">Access Your Portal</div>
          <h2 className="section-title">Go to Your Dashboard</h2>
          <p className="section-sub">Choose your role to access your personalized placement portal.</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/dashboard" className="dashboard-card dashboard-card--student">
            <div className="dashboard-icon">👨‍🎓</div>
            <h3>Student Dashboard</h3>
            <p>Track applications, view interview schedules, and manage your placement journey.</p>
            <div className="dashboard-cta">
              <span>Access Portal</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>

          <Link to="/admin" className="dashboard-card dashboard-card--admin">
            <div className="dashboard-icon">👨‍💼</div>
            <h3>Admin Dashboard</h3>
            <p>Manage job postings, review applications, and oversee the entire placement process.</p>
            <div className="dashboard-cta">
              <span>Access Portal</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-inner">
          {[
            { value: c1, suffix: "+", label: "Partner Companies" },
            { value: c2, suffix: "%", label: "Placement Rate" },
            { value: c3, suffix: "+", label: "Students Placed" },
            { value: c4, suffix: "L+", label: "Avg. CTC (₹)" },
          ].map((s) => (
            <div key={s.label} className="home-stat">
              <div className="home-stat-value">{s.value}{s.suffix}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-eyebrow">Why PlaceLink</div>
          <h2 className="section-title">Everything you need<br />to get placed.</h2>
          <p className="section-sub">Designed for students and placement cells alike. Fast, reliable, beautiful.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h4 className="feature-title">{f.title}</h4>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="how-section">
        <div className="section-header">
          <div className="section-eyebrow">Process</div>
          <h2 className="section-title">From signup to offer<br />in four steps.</h2>
        </div>
        <div className="steps-row">
          {[
            { n: "01", title: "Create Account", desc: "Sign up as a student. Fill in your branch and CGPA." },
            { n: "02", title: "Browse & Apply", desc: "Explore eligible jobs. Upload resume. Apply in one click." },
            { n: "03", title: "Track Progress", desc: "Get real-time updates on every round and stage." },
            { n: "04", title: "Accept Offer", desc: "Receive your offer letter and celebrate." },
          ].map((s, i) => (
            <div key={s.n} className="step">
              <div className="step-number">{s.n}</div>
              {i < 3 && <div className="step-connector" />}
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-content">
          <h2>Ready to find your first job?</h2>
          <p>Join thousands of students who found their dream placement through Career Bridge.</p>
          <div className="hero-ctas" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <Link to="/signup" className="btn-hero-primary">Create Free Account</Link>
            <Link to="/login" className="btn-hero-secondary" style={{ borderColor: "rgba(255,255,255,.25)", color: "white" }}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="home-footer">
        <div className="footer-brand">
          <div className="brand-orb-home">CB</div>
          <span>Career Bridge</span>
        </div>
        <p className="footer-copy">© 2026 Career Bridge. Built for campus placement.</p>
      </footer>

    </div>
  );
}

export default memo(Home);
