import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.js';
import LoginPage from './pages/LoginPage.js';
import StudentPortal from './pages/StudentPortal.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentPortal />} />
      </Routes>
    </Router>
  );
}
export default App;