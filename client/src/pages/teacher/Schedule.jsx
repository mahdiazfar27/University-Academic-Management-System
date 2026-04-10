import React from 'react';
import styles from './Schedule.module.css';

/* ── SVG Icons ── */
const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ForkKnifeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20"></path>
    <path d="M4 2v3.1a5.1 5.1 0 0 0 10.2 0V2"></path>
    <path d="M9 22V12"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function Schedule() {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const times = [
    { label: '08:30 AM', duration: '90 Mins' },
    { label: '10:15 AM', duration: '90 Mins' },
    { label: '01:30 PM', duration: '90 Mins' },
    { label: '03:15 PM', duration: '90 Mins' },
  ];

  const scheduleData = [
    // 08:30 AM
    { day: 'MONDAY', time: '08:30 AM', code: 'CS-201', title: 'Data Structures', room: 'RM: 402-B', section: 'SEC A', type: 'blue' },
    { day: 'WEDNESDAY', time: '08:30 AM', code: 'CS-201', title: 'Data Structures', room: 'RM: 402-B', section: 'SEC A', type: 'blue' },
    { day: 'FRIDAY', time: '08:30 AM', code: 'LAB-102', title: 'Advanced Coding', room: 'LAB 03', section: 'SEC C', type: 'yellow' },
    // 10:15 AM
    { day: 'TUESDAY', time: '10:15 AM', code: 'SWE-402', title: 'Software Arch.', room: 'RM: 101-C', section: 'SEC B', type: 'blue' },
    { day: 'THURSDAY', time: '10:15 AM', code: 'SWE-402', title: 'Software Arch.', room: 'RM: 101-C', section: 'SEC B', type: 'blue' },
    // 01:30 PM
    { day: 'MONDAY', time: '01:30 PM', code: 'GEN-101', title: 'Ethics in AI', room: 'RM: Aud-A', section: 'SEC G', type: 'blue' },
    { day: 'WEDNESDAY', time: '01:30 PM', code: 'CS-201', title: 'Data Structures', room: 'RM: 402-B', section: 'SEC C', type: 'blue' },
    { day: 'THURSDAY', time: '01:30 PM', code: 'GEN-101', title: 'Ethics in AI', room: 'RM: Aud-A', section: 'SEC G', type: 'blue' },
    // 03:15 PM
    { day: 'TUESDAY', time: '03:15 PM', code: 'RS-501', title: 'Research Seminar', room: 'CR-02', section: 'PG-1', type: 'purple' },
    { day: 'FRIDAY', time: '03:15 PM', code: 'DEPT', title: 'Faculty Meeting', room: 'Conf. Hall', section: 'REQ', type: 'gray' },
  ];

  const getSession = (day, time) => {
    return scheduleData.find(s => s.day === day && s.time === time);
  };

  return (
    <div className={styles.container}>
      <div className={styles.semesterText}>Semester: Fall 2024</div>
      <div className={styles.headerRow}>
        <h1>Weekly Teaching Schedule</h1>
        <div className={styles.headerActions}>
          <button className={styles.printBtn}><PrintIcon /> Print</button>
          <button className={styles.downloadBtn}><DownloadIcon /> Download PDF</button>
        </div>
      </div>

      <div className={styles.scheduleCard}>
        <div className={styles.tableWrapper}>
          <div className={styles.grid}>
            <div className={styles.dayHeader} style={{ background: 'white' }}>TIME / DAY</div>
            {days.map(day => (
              <div key={day} className={styles.dayHeader}>{day}</div>
            ))}

            {/* First two time slots */}
            {times.slice(0, 2).map((time, tIdx) => (
              <React.Fragment key={tIdx}>
                <div className={styles.timeLabelCell}>
                  <span className={styles.timeValue}>{time.label}</span>
                  <span className={styles.durationValue}>{time.duration}</span>
                </div>
                {days.map(day => {
                  const session = getSession(day, time.label);
                  return (
                    <div key={day} className={styles.gridCell}>
                      {session && (
                        <div className={`${styles.courseCard} ${styles[session.type + 'Card']}`}>
                          <div className={styles.cardHeader}>
                            <span className={styles.courseCode}>{session.code}</span>
                            <span className={styles.courseTitle}>{session.title}</span>
                          </div>
                          <div className={styles.cardFooter}>
                            <span className={styles.roomInfo}>{session.room}</span>
                            <span className={styles.sectionBadge}>{session.section}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Break Row */}
            <div className={styles.breakRow}>
              <ForkKnifeIcon />
              INSTITUTIONAL LUNCH BREAK & MID-DAY RECESS
            </div>

            {/* Last two time slots */}
            {times.slice(2).map((time, tIdx) => (
              <React.Fragment key={tIdx}>
                <div className={styles.timeLabelCell}>
                  <span className={styles.timeValue}>{time.label}</span>
                  <span className={styles.durationValue}>{time.duration}</span>
                </div>
                {days.map(day => {
                  const session = getSession(day, time.label);
                  return (
                    <div key={day} className={styles.gridCell}>
                      {session && (
                        <div className={`${styles.courseCard} ${styles[session.type + 'Card']}`}>
                          <div className={styles.cardHeader}>
                            <span className={styles.courseCode}>{session.code}</span>
                            <span className={styles.courseTitle}>{session.title}</span>
                          </div>
                          <div className={styles.cardFooter}>
                            <span className={styles.roomInfo}>{session.room}</span>
                            <span className={styles.sectionBadge}>{session.section}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footerGrid}>
        <div className={styles.officeHoursCard}>
          <div className={styles.infoIconBox}>
            <InfoIcon />
          </div>
          <div className={styles.officeInfo}>
            <h3>Faculty Office Hours</h3>
            <p>
              Personal consultation slots are available on Wednesday and Friday from 10:00 AM to 12:00 PM at Office Room 302. 
              Please book via the Faculty Dashboard for formal sessions.
            </p>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <CalendarIcon />
            Summary Statistics
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>12</span>
              <span className={styles.statLabel}>TOTAL CREDITS</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>18</span>
              <span className={styles.statLabel}>CONTACT HOURS</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>4</span>
              <span className={styles.statLabel}>COURSES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
