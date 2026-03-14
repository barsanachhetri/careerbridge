import React, { useEffect, useState } from "react";
import API from "../services/api";

function Applicants() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selected, setSelected] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [round, setRound] = useState({
        roundName: "",
        roundDate: "",
        roundTime: "",
        instructions: ""
    });

    const [actionForm, setActionForm] = useState({
        roundName: "",
        roundDate: "",
        roundTime: "",
        instructions: "",
        package: ""
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await API.get("/applications");
            setApplications(res.data);
        } catch {
            alert("Failed");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(x => x !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selected.length === filteredApplications.length) {
            setSelected([]);
        } else {
            setSelected(filteredApplications.map(app => app._id));
        }
    };

    const shortlistStudents = async () => {
        if (selected.length === 0) {
            alert("Select students");
            return;
        }
        setShowForm(true);
    };

    const submitShortlist = async () => {
        if (!round.roundName.trim()) {
            alert("Please enter Round Name");
            return;
        }
        if (!round.roundDate) {
            alert("Please select Round Date");
            return;
        }
        if (!round.roundTime) {
            alert("Please select Round Time");
            return;
        }
        if (!round.instructions.trim()) {
            alert("Please enter Instructions");
            return;
        }

        try {
            setSubmitting(true);

            const response = await API.put("/applications/shortlist-multiple", {
                applicationIds: selected,
                roundName: round.roundName,
                roundDate: round.roundDate,
                roundTime: round.roundTime,
                instructions: round.instructions
            });

            alert(`Successfully shortlisted ${selected.length} student${selected.length !== 1 ? 's' : ''}!\nNotifications have been sent to all shortlisted candidates.`);

            setSelected([]);
            setShowForm(false);

            setRound({
                roundName: "",
                roundDate: "",
                roundTime: "",
                instructions: ""
            });

            fetchApplications();

        } catch (error) {
            console.error("Error shortlisting students:", error);
            alert("Failed to shortlist students. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const bulkReject = async () => {
        if (selected.length === 0) {
            alert("Select students to reject");
            return;
        }

        const confirm = window.confirm(`Are you sure you want to reject ${selected.length} student${selected.length !== 1 ? 's' : ''}?`);

        if (!confirm) return;

        try {
            setSubmitting(true);

            for (const id of selected) {
                await API.put(`/applications/${id}`, { action: "reject" });
            }

            alert(`Successfully rejected ${selected.length} student${selected.length !== 1 ? 's' : ''}!`);

            setSelected([]);

            fetchApplications();

        } catch (error) {
            console.error("Error rejecting students:", error);
            alert("Failed to reject students. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Individual application action handler
    const openActionModal = (appId, action) => {
        setSelectedAppId(appId);
        setSelectedAction(action);
        setActionForm({
            roundName: "",
            roundDate: "",
            roundTime: "",
            instructions: "",
            package: ""
        });
        setShowActionModal(true);
    };

    const submitAction = async () => {
        const app = applications.find(a => a._id === selectedAppId);
        if (!app) return;

        try {
            const payload = { action: selectedAction };

            if (selectedAction === "nextRound") {
                if (!actionForm.roundName.trim()) {
                    alert("Please enter Round Name");
                    return;
                }
                if (!actionForm.roundDate) {
                    alert("Please select Date");
                    return;
                }
                if (!actionForm.roundTime) {
                    alert("Please select Time");
                    return;
                }
                payload.roundName = actionForm.roundName;
                payload.roundDate = actionForm.roundDate;
                payload.roundTime = actionForm.roundTime;
                payload.instructions = actionForm.instructions;
            }

            if (selectedAction === "selected") {
                if (!actionForm.package.trim()) {
                    alert("Please enter Package/CTC");
                    return;
                }
                payload.package = actionForm.package;
            }

            setSubmitting(true);
            await API.put(`/applications/${selectedAppId}`, payload);

            const actionName =
                selectedAction === "nextRound" ? "moved to next round" :
                    selectedAction === "reject" ? "rejected" :
                        selectedAction === "selected" ? "marked as selected" :
                            selectedAction === "placed" ? "marked as placed" : "updated";

            alert(`Application ${actionName} successfully!`);

            setShowActionModal(false);
            fetchApplications();

        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Failed to update application");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.student?.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div style={{ color: '#ffa500' }}>Loading...</div></div>
    }

    return (
        <div className="applicants-container">

            <div className="applicants-header">
                <h1>Applicants</h1>
                <p>Manage and shortlist applicants for interview rounds</p>
            </div>

            <div className="applicants-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-buttons">
                    {["All", "Applied", "Shortlisted", "Rejected", "Selected", "Placed"].map((status) => (
                        <button
                            key={status}
                            className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="applicants-wrapper">
                <table className="applicants-table">

                    <thead>

                        <tr>

                            <th className="checkbox-col">
                                <input
                                    type="checkbox"
                                    checked={selected.length === filteredApplications.length && filteredApplications.length > 0}
                                    onChange={toggleSelectAll}
                                    className="select-all-checkbox"
                                />
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Round</th>
                            <th className="actions-col">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredApplications.map((app, idx) => (

                            <tr key={app._id} className={selected.includes(app._id) ? 'selected' : ''}>

                                <td className="checkbox-col">

                                    <input
                                        type="checkbox"
                                        checked={selected.includes(app._id)}
                                        onChange={() => toggleSelect(app._id)}
                                        className="row-checkbox"
                                    />

                                </td>

                                <td className="name-cell"><strong>{app.student?.name}</strong></td>

                                <td className="email-cell">{app.student?.email}</td>

                                <td className="company-cell">{app.job?.companyName}</td>

                                <td className="status-cell">

                                    <span className={`status-badge status-${app.status?.toLowerCase()}`}>

                                        {app.status}

                                    </span>

                                </td>

                                <td className="round-cell">
                                    {app.roundNumber > 0 ? (
                                        <span style={{ fontSize: ".85rem", color: "var(--blue)", fontWeight: 600 }}>
                                            Round {app.roundNumber}: {app.roundName}
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: ".85rem", color: "var(--text-3)" }}>-</span>
                                    )}
                                </td>

                                <td className="actions-cell" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>

                                    {app.resume && (

                                        <a
                                            href={`http://localhost:5000/${app.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-view"
                                            style={{ fontSize: ".8rem", padding: ".4rem .6rem" }}
                                        >

                                            📄 View

                                        </a>

                                    )}

                                    {app.status === "Applied" && (
                                        <button
                                            className="btn-action"
                                            style={{ fontSize: ".8rem", padding: ".4rem .6rem", backgroundColor: "var(--blue)" }}
                                            onClick={() => openActionModal(app._id, "nextRound")}
                                        >
                                            ➜ Next Round
                                        </button>
                                    )}

                                    {app.status === "Shortlisted" && (
                                        <>
                                            <button
                                                className="btn-action"
                                                style={{ fontSize: ".8rem", padding: ".4rem .6rem", backgroundColor: "var(--blue)" }}
                                                onClick={() => openActionModal(app._id, "nextRound")}
                                            >
                                                ➜ Next Round
                                            </button>
                                            <button
                                                className="btn-action"
                                                style={{ fontSize: ".8rem", padding: ".4rem .6rem", backgroundColor: "var(--green)" }}
                                                onClick={() => openActionModal(app._id, "selected")}
                                            >
                                                ✓ Select
                                            </button>
                                        </>
                                    )}

                                    {app.status === "Selected" && (
                                        <button
                                            className="btn-action"
                                            style={{ fontSize: ".8rem", padding: ".4rem .6rem", backgroundColor: "var(--green)" }}
                                            onClick={() => openActionModal(app._id, "placed")}
                                        >
                                            ✓ Place
                                        </button>
                                    )}

                                    {(app.status === "Applied" || app.status === "Shortlisted") && (
                                        <button
                                            className="btn-action"
                                            style={{ fontSize: ".8rem", padding: ".4rem .6rem", backgroundColor: "var(--red)" }}
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to reject this applicant?")) {
                                                    openActionModal(app._id, "reject");
                                                    setShowActionModal(true);
                                                    setSubmitting(true);
                                                    API.put(`/applications/${app._id}`, { action: "reject" })
                                                        .then(() => {
                                                            alert("Applicant rejected!");
                                                            setShowActionModal(false);
                                                            fetchApplications();
                                                        })
                                                        .catch(err => alert("Error: " + (err.response?.data?.message || "Failed")))
                                                        .finally(() => setSubmitting(false));
                                                }
                                            }}
                                        >
                                            ✗ Reject
                                        </button>
                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

            <div className="applicants-footer">
                <div className="selection-info">
                    {selected.length > 0 && (
                        <span>{selected.length} applicant{selected.length !== 1 ? 's' : ''} selected</span>
                    )}
                </div>

                <div className="action-buttons">
                    <button
                        className="btn-reject"
                        onClick={bulkReject}
                        disabled={selected.length === 0 || submitting}
                    >
                        Reject Selected ({selected.length})
                    </button>

                    <button
                        className="btn-shortlist"
                        onClick={shortlistStudents}
                        disabled={selected.length === 0 || submitting}
                    >

                        Shortlist Selected ({selected.length})

                    </button>
                </div>
            </div>

            {/* Bulk Round Form */}

            {showForm && (

                <div className="shortlist-form-overlay">
                    <div className="shortlist-form-card">

                        <h3>Bulk Shortlist - Next Round Details</h3>

                        <div className="form-group">
                            <label>Round Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Technical Round"
                                value={round.roundName}
                                onChange={(e) =>
                                    setRound({ ...round, roundName: e.target.value })
                                }
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Round Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={round.roundDate}
                                    onChange={(e) =>
                                        setRound({ ...round, roundDate: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>Round Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={round.roundTime}
                                    onChange={(e) =>
                                        setRound({ ...round, roundTime: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Instructions</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Interview instructions and guidelines"
                                value={round.instructions}
                                onChange={(e) =>
                                    setRound({ ...round, instructions: e.target.value })
                                }
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn-submit"
                                onClick={submitShortlist}
                                disabled={submitting}
                            >
                                {submitting ? "Processing..." : "Confirm Shortlist"}
                            </button>

                            <button
                                className="btn-cancel"
                                onClick={() => setShowForm(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>

            )}

            {/* Individual Action Modal */}

            {showActionModal && (

                <div className="shortlist-form-overlay">
                    <div className="shortlist-form-card">

                        <h3>
                            {selectedAction === "nextRound" ? "Move to Next Round" :
                                selectedAction === "selected" ? "Mark as Selected" :
                                    selectedAction === "placed" ? "Mark as Placed" : "Update Application"}
                        </h3>

                        {selectedAction === "nextRound" && (
                            <>
                                <div className="form-group">
                                    <label>Round Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Technical Interview"
                                        value={actionForm.roundName}
                                        onChange={(e) =>
                                            setActionForm({ ...actionForm, roundName: e.target.value })
                                        }
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={actionForm.roundDate}
                                            onChange={(e) =>
                                                setActionForm({ ...actionForm, roundDate: e.target.value })
                                            }
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={actionForm.roundTime}
                                            onChange={(e) =>
                                                setActionForm({ ...actionForm, roundTime: e.target.value })
                                            }
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Instructions</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        placeholder="Instructions for this round"
                                        value={actionForm.instructions}
                                        onChange={(e) =>
                                            setActionForm({ ...actionForm, instructions: e.target.value })
                                        }
                                        disabled={submitting}
                                    />
                                </div>
                            </>
                        )}

                        {selectedAction === "selected" && (
                            <div className="form-group">
                                <label>Package/CTC (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., 12 LPA"
                                    value={actionForm.package}
                                    onChange={(e) =>
                                        setActionForm({ ...actionForm, package: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                className="btn-submit"
                                onClick={submitAction}
                                disabled={submitting}
                            >
                                {submitting ? "Processing..." : "Confirm"}
                            </button>

                            <button
                                className="btn-cancel"
                                onClick={() => setShowActionModal(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>

            )}

        </div>

    );

}

export default Applicants;