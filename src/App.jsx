// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading VizAssistant...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Show header only when user is logged in */}
        {user && <Header user={user} />}
        
        <main className={user ? 'main-content' : 'full-page'}>
          <Routes>
            {/* Public routes - accessible to all */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/upload" element={user ? <DataUpload /> : <Navigate to="/login" />} />
            <Route path="/analysis" element={user ? <Analysis /> : <Navigate to="/login" />} />
            <Route path="/insights" element={user ? <Insights /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;