import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 5%', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#003399', margin: 0 }}>IUMS</h2>
      <div style={{ display: 'flex', gap: '30px' }}>
        <span>Academic</span>
        <span>Admissions</span>
        <span>Examinations</span>
        <span>Research</span>
      </div>
      <div>
        <button style={{ marginRight: '10px', padding: '10px 20px' }}>Support</button>
        <button className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Portal Login</button>
      </div>
    </nav>
  );
};

export default Navbar;