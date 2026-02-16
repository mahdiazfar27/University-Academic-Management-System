import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import heroImage from '../photo/university.jpg';
import '../styles/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <header
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 32, 96, 0.7), rgba(0, 32, 96, 0.7)), url(${heroImage})`
        }}
      >
        <div className="hero-content">
          <span className="badge">NEXT-GEN EDUCATION MANAGEMENT</span>
          <h1>
            Empowering Excellence <br />
            in Higher Education.
          </h1>

          <p>
            A unified ecosystem for students, faculty, and administration to
            streamline academic lifecycles, research, and institutional growth.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate('/login')}
            >
              Student Portal
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate('/login')}
            >
              Faculty Access
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <h2>15,000+</h2>
          <p>STUDENTS</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>FACULTY MEMBERS</p>
        </div>

        <div className="stat-card">
          <h2>42</h2>
          <p>DEPARTMENTS</p>
        </div>

        <div className="stat-card">
          <h2>120+</h2>
          <p>COURSES</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to experience the future of education?</h2>
        <p>
          Join thousands of students and educators already using the IUMS
          platform to achieve academic excellence.
        </p>

        <div className="cta-buttons">
          <button className="primary-btn">Apply Now</button>
          <button className="secondary-btn-outline">Request Demo</button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
