import React from 'react';
import styles from './NameCorrection.module.css';

/* ── SVG Icons ── */
const ShieldIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const UserCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);

const FileEditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const HourglassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14"></path>
    <path d="M5 2h14"></path>
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
  </svg>
);

const BuildingGraphic = () => (
  <svg viewBox="0 0 200 400" className={styles.heroGraphic}>
    <rect width="200" height="400" fill="#0f172a" />
    <path d="M20 400 V100 L100 20 L180 100 V400" stroke="white" strokeWidth="2" fill="none" opacity="0.2" />
    <path d="M40 400 V120 L100 50 L160 120 V400" stroke="white" strokeWidth="1" fill="none" opacity="0.1" />
    <line x1="100" y1="20" x2="100" y2="400" stroke="white" strokeWidth="0.5" opacity="0.1" />
  </svg>
);

export default function NameCorrection() {
  return (
    <div className={styles.correctionContainer}>
      <div className={styles.titleArea}>
        <h1>Name & Other Correction</h1>
      </div>

      <div className={styles.topSection}>
        {/* HERO CARD */}
        <div className={styles.heroCard}>
          <div className={styles.heroLeft}>
            <BuildingGraphic />
            <div className={styles.heroContent}>
              <div className={styles.shieldIcon}>
                <ShieldIcon size={32} color="white" />
              </div>
              <h2 className={styles.heroTitle}>Official Verification Protocol</h2>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.noticeBadge}>ADMINISTRATIVE NOTICE</div>
            <h2 className={styles.cardHeading}>Correction Policy</h2>
            <p className={styles.description}>
              If you wish to make any changes to your IUMS profile, personal details, or academic information, please contact the University Administrative Office directly.
            </p>
            <div className={styles.emphasisBox}>
              For security and verification purposes, corrections cannot be made online through this portal.
            </div>
            <div className={styles.heroActions}>
              <button className={styles.contactBtn}>Contact Office</button>
              <button className={styles.policyBtn}>View Academic Policy</button>
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className={styles.sidebarWidgets}>
          {/* Contact Information */}
          <div className={styles.widgetCard}>
            <div className={styles.widgetTitle}>
              <UserCheckIcon /> Contact Information
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><EmailIcon /></div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>EMAIL ADDRESS</span>
                <span className={styles.contactValue}>admin@royalacademica.edu</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><PhoneIcon /></div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>PHONE SUPPORT</span>
                <span className={styles.contactValue}>+1 (800) ACAD-ADM</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className={`${styles.widgetCard} ${styles.hoursWidget}`}>
            <div className={styles.widgetTitle}>
              <ClockIcon /> Office Hours
            </div>
            <div className={styles.hoursList}>
              <div className={styles.hoursItem}>
                <span className={styles.dayLabel}>Mon — Fri</span>
                <span className={styles.timeValue}>08:00 AM — 05:00 PM</span>
              </div>
              <div className={styles.hoursItem}>
                <span className={styles.dayLabel}>Saturday</span>
                <span className={styles.timeValue}>09:00 AM — 01:00 PM</span>
              </div>
              <div className={styles.hoursItem}>
                <span className={styles.dayLabel}>Sunday</span>
                <span className={styles.timeStatus}>Closed</span>
              </div>
            </div>
            <div className={styles.hoursGraphic}></div>
          </div>
        </div>
      </div>

      {/* BOTTOM INFO GRID */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoIconBox}><UserCheckIcon /></div>
          <h3 className={styles.infoHead}>Required Documents</h3>
          <p className={styles.infoText}>
            Bring your original University ID and government-issued identification for all personal data corrections.
          </p>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoIconBox}><FileEditIcon /></div>
          <h3 className={styles.infoHead}>Academic Audit</h3>
          <p className={styles.infoText}>
            Academic record changes require approval from the Department Dean and the Registrar's Office.
          </p>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoIconBox}><HourglassIcon /></div>
          <h3 className={styles.infoHead}>Processing Time</h3>
          <p className={styles.infoText}>
            Verified corrections typically reflect on your digital profile within 3–5 business days after approval.
          </p>
        </div>
      </div>

      {/* PAGE FOOTER */}
      <footer className={styles.pageFooter}>
        <div className={styles.footerIntegrity}>INTEGRITY IN GOVERNANCE</div>
        <div className={styles.footerLogos}>
          <ShieldIcon color="#94a3b8" />
          <div className={styles.footerSeal}>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="12" cy="12" r="10" />
               <path d="M12 8v8M8 12h8" />
             </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
