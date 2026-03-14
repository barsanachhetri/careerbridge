import React, { useState } from "react";
import API from "../services/api";

function CreateJob() {
  const [form, setForm] = useState({
    companyName: "", role: "", tier: "", description: "",
    eligibleBranches: "", deadline: ""
  });
  const [jobPdf, setJobPdf]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const createJob = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (jobPdf) fd.append("jobPdf", jobPdf);
      await API.post("/jobs", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setForm({ companyName:"", role:"", tier:"", description:"", eligibleBranches:"", deadline:"" });
      setJobPdf(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div className="page-header-text">
          <span className="eyebrow">Admin · Jobs</span>
          <h2>Post a New Job</h2>
        </div>
      </div>

      {success && (
        <div className="alert alert-success mb-4">
          ✅ &nbsp;Job posted successfully! Students can now apply.
        </div>
      )}

      <div className="card" style={{ padding:"2rem" }}>
        <div className="form-group">
          <label className="form-label">Company Name <span className="req">*</span></label>
          <input className="form-control" placeholder="e.g. Google" value={form.companyName} onChange={set("companyName")} />
        </div>

        <div className="form-group">
          <label className="form-label">Role / Position <span className="req">*</span></label>
          <input className="form-control" placeholder="e.g. Software Engineer Intern" value={form.role} onChange={set("role")} />
        </div>

        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea className="form-control" placeholder="Describe the role, responsibilities, and requirements…" value={form.description} onChange={set("description")} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          <div className="form-group">
            <label className="form-label">Tier</label>
            <input className="form-control" placeholder="e.g. 1, 2, A" value={form.tier} onChange={set("tier")} />
          </div>
          <div className="form-group">
            <label className="form-label">Application Deadline</label>
            <input className="form-control" type="date" value={form.deadline} onChange={set("deadline")} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Eligible Branches</label>
          <input className="form-control" placeholder="CSE, ISE, ECE (comma separated)" value={form.eligibleBranches} onChange={set("eligibleBranches")} />
          <span className="form-hint">Separate multiple branches with commas.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Job Description PDF</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf"
            onChange={(e) => setJobPdf(e.target.files[0])}
          />
          {jobPdf && <span className="form-hint">✓ {jobPdf.name}</span>}
        </div>

        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={createJob}
          disabled={loading}
        >
          {loading ? "Posting…" : "Post Job"}
        </button>
      </div>
    </div>
  );
}

export default CreateJob;
