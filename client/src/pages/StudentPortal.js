import React from 'react';

const StudentPortal = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fc' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#1a237e', color: 'white', padding: '20px' }}>
        <h2>IUMS Portal</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '40px' }}>
          <li style={{ padding: '15px 0', borderBottom: '1px solid #333' }}>📊 Dashboard</li>
          <li style={{ padding: '15px 0', borderBottom: '1px solid #333' }}>📅 Routine</li>
          <li style={{ padding: '15px 0', borderBottom: '1px solid #333' }}>📜 Results</li>
          <li style={{ padding: '15px 0', borderBottom: '1px solid #333' }}>💸 Fees & Billing</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Dashboard Overview</h3>
          <p>Alex Henderson (ID: 2024-09821)</p>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ background: 'white', padding: '20px', flex: 1, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <p>Cumulative GPA</p>
            <h2>3.82 / 4.0</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', flex: 1, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <p>Overall Attendance</p>
            <h2 style={{ color: '#00c08b' }}>92%</h2>
          </div>
        </div>

        {/* Course Progress Section */}
        <h4 style={{ marginTop: '40px' }}>Current Semester Courses</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                <h5>Database Management Systems</h5>
                <div style={{ width: '100%', background: '#eee', height: '10px', borderRadius: '5px' }}>
                    <div style={{ width: '75%', background: '#1a237e', height: '10px', borderRadius: '5px' }}></div>
                </div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                <h5>Algorithms & Complexity</h5>
                <div style={{ width: '100%', background: '#eee', height: '10px', borderRadius: '5px' }}>
                    <div style={{ width: '42%', background: '#1a237e', height: '10px', borderRadius: '5px' }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
export default StudentPortal;