import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#f3f4f9', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#1a237e' }}>IUMS Portal</h2>
        <p style={{ color: '#666' }}>Sign in to access your account</p>
        
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <label>User Role</label>
          <select style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option>Student</option>
            <option>Teacher</option>
          </select>
          <label>Email or Institutional ID</label>
          <input type="text" placeholder="e.g. j.doe@university.edu" style={{ width: '100%', padding: '12px', margin: '10px 0', boxSizing: 'border-word', borderRadius: '6px', border: '1px solid #ddd' }} />
          <label>Password</label>
          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }} />
        </div>
        
        <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '15px', backgroundColor: '#00c08b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>LOGIN TO PORTAL →</button>
      </div>
    </div>
  );
};
export default LoginPage;