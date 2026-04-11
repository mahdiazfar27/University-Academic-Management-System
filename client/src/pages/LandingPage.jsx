import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './LandingPage.module.css';

/* =========================================
   SVG ICONS
========================================= */

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 9v6h20V9L12 14 2 9zM4 11v6h2v-6H4zm4 0v6h2v-6H8zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2z" />
  </svg>
);

const CapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 7.5l11 5.5 11-5.5L12 2zm0 15v3c-3 0-6-1.5-6-3v-3L12 17z" />
  </svg>
);

const IDIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h18v14H3z"></path>
    <path d="M8 10h8"></path>
    <path d="M8 14h4"></path>
    <circle cx="15" cy="14" r="1"></circle>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const CheckSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
    <line x1="2" y1="10" x2="22" y2="10"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default function LandingPage() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const getDashboardPath = () => {
    if (!user || !user.role) return '/login';
    const role = user.role.toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'teacher') return '/teacher';
    if (role === 'student') return '/student';
    return '/login';
  };

  const dashboardPath = getDashboardPath();

  return (
    <div className={styles.landingContainer}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logoGroup}>
            <div className={styles.navLogoIcon}>
              <LogoIcon />
            </div>
            <span className={styles.navLogoText}>IUMS</span>
          </div>

          <div className={styles.navLinks}>
            <a href="#academic" className={styles.navLink}>Academic</a>
            <a href="#admissions" className={styles.navLink}>Admissions</a>
            <a href="#examinations" className={styles.navLink}>Examinations</a>
            <a href="#research" className={styles.navLink}>Research</a>
          </div>

          <div className={styles.navButtons}>
            <button className={styles.btnSupport}>Support</button>
            {isAuthenticated ? (
              <Link to={dashboardPath} className={styles.btnPortalLogin}>My Dashboard</Link>
            ) : (
              <Link to="/login" className={styles.btnPortalLogin}>Portal Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            NEXT-GEN EDUCATION MANAGEMENT
          </div>
          <h1 className={styles.heroTitle}>
            Empowering<br />
            Excellence in <span className={styles.heroTitleHighlight}>Higher<br />Education.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            A unified ecosystem for students, faculty, and<br />
            administration to streamline academic lifecycles, research,<br />
            and institutional growth.
          </p>
          <div className={styles.heroActions}>
            {isAuthenticated ? (
              <Link to={dashboardPath} className={styles.btnStudentPortal}>
                <CapIcon /> My Dashboard
              </Link>
            ) : (
              <Link to="/login" className={styles.btnStudentPortal}>
                <CapIcon /> Student Portal
              </Link>
            )}
            
            {isAuthenticated ? (
              <button onClick={logout} className={styles.btnFacultyAccess}>
                <IDIcon /> Logout
              </button>
            ) : (
              <Link to="/login" className={styles.btnFacultyAccess}>
                <IDIcon /> Faculty Access
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><UsersIcon /></div>
            <h3 className={styles.statNumber}>15,000+</h3>
            <p className={styles.statLabel}>STUDENTS</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><UserIcon /></div>
            <h3 className={styles.statNumber}>500+</h3>
            <p className={styles.statLabel}>FACULTY MEMBERS</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><BuildingIcon /></div>
            <h3 className={styles.statNumber}>42</h3>
            <p className={styles.statLabel}>DEPARTMENTS</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><BookIcon /></div>
            <h3 className={styles.statNumber}>120+</h3>
            <p className={styles.statLabel}>COURSES</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Comprehensive Academic Management</h2>
          <p className={styles.featuresSubtitle}>
            Our integrated system provides all the tools necessary for modern university operations<br />
            in one unified dashboard.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}><BookIcon /></div>
            <h3 className={styles.featureCardTitle}>Course Management</h3>
            <p className={styles.featureCardText}>
              Seamlessly manage curriculum, syllabi, and course materials with automated scheduling and tracking.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}><CheckSquareIcon /></div>
            <h3 className={styles.featureCardTitle}>Online Examinations</h3>
            <p className={styles.featureCardText}>
              Secure digital assessment tools with proctoring support, automatic grading, and result generation.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}><WalletIcon /></div>
            <h3 className={styles.featureCardTitle}>Financial Systems</h3>
            <p className={styles.featureCardText}>
              Integrated fee payment gateways, payroll management, and comprehensive financial reporting.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to experience the future of education?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of students and educators already using the IUMS<br />
            platform to achieve academic excellence.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnApplyNow}>Apply Now</button>
            <button className={styles.btnRequestDemo}>Request Demo</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerCol1}>
            <div className={styles.logoGroupWrapper}>
              <div className={styles.navLogoIcon}>
                <LogoIcon />
              </div>
              <span className={styles.navLogoText}>IUMS</span>
            </div>
            <p className={styles.footerDesc}>
              Providing world-class digital infrastructure for higher education institutions globally. Committed to academic innovation.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialCircle}><FacebookIcon /></a>
              <a href="#" className={styles.socialCircle}><TwitterIcon /></a>
              <a href="#" className={styles.socialCircle}><LinkedinIcon /></a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>University Portal</h4>
            <a href="#" className={styles.footerColLink}>Student Dashboard</a>
            <a href="#" className={styles.footerColLink}>Faculty Portal</a>
            <a href="#" className={styles.footerColLink}>Admission Status</a>
            <a href="#" className={styles.footerColLink}>LMS Login</a>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Quick Links</h4>
            <a href="#" className={styles.footerColLink}>Academic Calendar</a>
            <a href="#" className={styles.footerColLink}>Library Catalog</a>
            <a href="#" className={styles.footerColLink}>Research Papers</a>
            <a href="#" className={styles.footerColLink}>Alumni Association</a>
          </div>

          <div className={styles.footerColContact}>
            <h4 className={styles.footerColTitle}>Contact Us</h4>
            <div className={styles.contactItem}>
              <MapPinIcon />
              <span>University Campus, Education Square, City Center</span>
            </div>
            <div className={styles.contactItem}>
              <PhoneIcon />
              <span>+1 (234) 567-8900</span>
            </div>
            <div className={styles.contactItem}>
              <MailIcon />
              <span>info@iums-university.edu</span>
            </div>
          </div>
        </div>

        <div className={styles.footerBottomWrap}>
          <div className={styles.footerBottom}>
            <p>© 2024 Integrated University Management System. All rights reserved.</p>
            <div className={styles.footerLegalLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
