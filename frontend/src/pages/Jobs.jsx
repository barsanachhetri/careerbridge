import React, { useEffect, useState } from "react";
import API from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    // Fetch jobs and user's applications in parallel
    Promise.all([
      API.get("/jobs"),
      API.get("/applications/my")
    ])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data);
        // Create a Set of job IDs the student has already applied to
        const appliedJobIds = new Set(appsRes.data.map(app => app.job._id || app.job));
        setAppliedJobs(appliedJobIds);
      })
      .catch(() => alert("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const applyJob = async (jobId) => {
    // Check if already applied
    if (appliedJobs.has(jobId)) {
      alert("You have already applied for this job.");
      return;
    }

    if (!resume) {
      alert("Please select your resume first.");
      return;
    }

    setApplying(true);
    try {
      const fd = new FormData();
      fd.append("jobId", jobId);
      fd.append("resume", resume);
      await API.post("/applications/apply", fd, { headers: { "Content-Type": "multipart/form-data" } });

      // Add job to applied set
      setAppliedJobs(prev => new Set([...prev, jobId]));

      alert("Application submitted!");
      setResume(null);
      setSelectedJob(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Loading jobs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-text">
          <span className="eyebrow">Opportunities</span>
          <h2>Available Jobs</h2>
          <p>{jobs.length} role{jobs.length !== 1 ? "s" : ""} open right now</p>
        </div>
      </div>

      {jobs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No jobs posted yet</h3>
          <p>Check back soon — new roles are added regularly.</p>
        </div>
      )}

      <div className="stagger">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-card-top">
              <div style={{ display: "flex", alignItems: "flex-start", gap: ".9rem" }}>
                <div className="job-logo">🏢</div>
                <div>
                  <div className="job-company">{job.companyName}</div>
                  <span className="job-role">{job.role}</span>
                </div>
              </div>
              <span className="badge badge-applied">Open</span>
            </div>

            <div className="job-meta">
              {job.tier && <span className="meta-chip">Tier {job.tier}</span>}
              {job.eligibleBranches?.join(", ") && (
                <span className="meta-chip">{job.eligibleBranches.join(", ")}</span>
              )}
              {job.deadline && (
                <span className="meta-chip">📅 {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              )}
            </div>

            {job.description && (
              <p className="job-desc">{job.description}</p>
            )}

            <div className="job-actions" style={{ flexWrap: "wrap", alignItems: "center" }}>
              {job.jobDescriptionPdf && (
                <a
                  href={`http://localhost:5000/${job.jobDescriptionPdf}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  📄 Job Description
                </a>
              )}

              {!appliedJobs.has(job._id) && (
                <>
                  <label
                    className="btn btn-secondary btn-sm"
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    📎 {selectedJob === job._id && resume ? resume.name : "Attach Resume"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                      onChange={(e) => {
                        setResume(e.target.files[0]);
                        setSelectedJob(job._id);
                      }}
                    />
                  </label>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => applyJob(job._id)}
                    disabled={applying && selectedJob === job._id}
                  >
                    {applying && selectedJob === job._id ? "Submitting…" : "Apply Now"}
                  </button>
                </>
              )}

              {appliedJobs.has(job._id) && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: "not-allowed", opacity: 0.6 }}
                  disabled
                >
                  ✓ Already Applied
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
