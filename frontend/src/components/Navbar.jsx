import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [unread, setUnread] = useState(0);

    /* Auth pages — hide navbar */
    const hideOn = ["/login", "/signup", "/forgot-password"];
    const shouldHide = hideOn.includes(location.pathname);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        setRole(user?.role || null);

        if (user?.role === "student") {
            API.get("/notifications").then(res => {
                setUnread(res.data.filter(n => !n.read).length);
            }).catch(() => { });
        }
    }, [location.pathname]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const isActive = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    /* Return null after all hooks are called */
    if (shouldHide) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-orb">CB</span>
                Career Bridge
            </Link>

            <ul className="navbar-nav">
                {role === "student" && (
                    <>
                        <li><Link className={isActive("/jobs")} to="/jobs">Jobs</Link></li>
                        <li><Link className={isActive("/applications")} to="/applications">Applications</Link></li>
                        <li>
                            <Link className={isActive("/notifications")} to="/notifications">
                                Notifications
                                {unread > 0 && <span className="nav-badge">{unread}</span>}
                            </Link>
                        </li>
                    </>
                )}
                {role === "admin" && (
                    <>
                        <li><Link className={isActive("/create-job")} to="/create-job">Post Job</Link></li>
                        <li><Link className={isActive("/applicants")} to="/applicants">Applicants</Link></li>
                        <li><Link className={isActive("/notifications")} to="/notifications">Notifications</Link></li>
                    </>
                )}
                {!role && (
                    <>
                        <li><Link className="nav-link" to="/login">Sign In</Link></li>
                        <li><Link className="btn btn-primary btn-sm" to="/signup">Sign Up</Link></li>
                    </>
                )}
                {role && (
                    <li>
                        <button className="btn btn-secondary btn-sm" onClick={logout}>
                            Sign Out
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
