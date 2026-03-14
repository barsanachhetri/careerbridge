import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";

// Loading Component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0f1419',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '3px solid rgba(255,165,0,.2)',
      borderTop: '3px solid #ffa500',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <div style={{ color: '#ffa500', fontSize: '1rem', fontWeight: '600' }}>Loading...</div>
  </div>
);

// Load critical pages immediately, lazy load others
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Applications = lazy(() => import("./pages/Applications"));
const CreateJob = lazy(() => import("./pages/CreateJob"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Applicants = lazy(() => import("./pages/Applicants"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ShortlistForm = lazy(() => import("./pages/ShortlistForm"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const CompanyVisitTracker = lazy(() => import("./pages/CompanyVisitTracker"));





function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <StudentDashboard />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="/jobs" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Jobs />
          </Suspense>
        } />
        <Route path="/applications" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Applications />
          </Suspense>
        } />
        <Route path="/create-job" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CreateJob />
          </Suspense>
        } />
        <Route path="/notifications" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Notifications />
          </Suspense>
        } />
        <Route path="/applicants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Applicants />
          </Suspense>
        } />
        <Route path="/shortlist/:applicantId" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ShortlistForm />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPassword />
          </Suspense>
        } />
        <Route path="/edit-profile" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EditProfile />
          </Suspense>
        } />
        <Route path="/company-tracker" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CompanyVisitTracker />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;