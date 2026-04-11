import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../api/apiService';
import styles from './Dashboard.module.css';

/* ── SVG Icons ── */
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const AttendanceCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
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

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const pendingMarks = [
    { code: 'CSE-401 Lab', status: '12 Students Missing', type: 'warning' },
    { code: 'CSE-202 Midterm', status: 'Review Phase', type: 'info' }
  ];

  const notices = [
    { category: 'ACADEMIC COUNCIL', title: 'Final Exam Schedule - Spring 2024', time: 'Published 2 hours ago' },
    { category: 'IT SERVICES', title: 'Portal Maintenance on Sunday', time: 'Published Yesterday' },
    { category: 'FACULTY AFFAIRS', title: 'Updated Research Grant Guidelines', time: 'Published June 10, 2024' }
  ];

  useEffect(() => {
    if (user && user.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[TeacherDashboard] Fetching teacher dashboard data...');
      console.log('[TeacherDashboard] Token in localStorage:', localStorage.getItem('auth_token') ? 'YES' : 'NO');
      console.log('[TeacherDashboard] User from auth context:', user);
      console.log('[TeacherDashboard] User.teacher_id:', user?.teacher_id);
      
      // Pass teacher_id as query parameter so endpoint knows which teacher
      const endpoint = user?.teacher_id 
        ? `/teacher/dashboard?teacher_id=${user.teacher_id}`
        : '/teacher/dashboard';
      
      console.log('[TeacherDashboard] Using endpoint:', endpoint);
      console.log('[TeacherDashboard] About to call apiService.request()');
      
      const response = await apiService.request(endpoint);
      console.log('[TeacherDashboard] Dashboard response:', response);
      
      const data = response.data || response;
      setDashboardData(data);
      
      if (data.today_classes && Array.isArray(data.today_classes)) {
        const classesWithStatus = data.today_classes.map(cls => ({
          ...cls,
          status: 'active',
          btnLabel: 'Mark Attendance'
        }));
        setTodayClasses(classesWithStatus);
        console.log('[TeacherDashboard] Today classes:', classesWithStatus);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('[TeacherDashboard] Error loading dashboard:', err);
      console.error('[TeacherDashboard] Error message:', err.message);
      console.error('[TeacherDashboard] Error response:', err.response);
      console.error('[TeacherDashboard] Full error object:', err);
      setError(err.message || 'Failed to load dashboard');
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading dashboard...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#dc2626' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={styles.welcomeSection}>
            <h1>Welcome back, Professor</h1>
            <p>You have {todayClasses.length} classes scheduled for today.</p>
          </div>

          <div className={styles.mainGrid}>
            {/* MAIN CONTENT */}
            <div className={styles.dashboardContent}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  <CalendarIcon /> Today's Classes
                </div>
                <a href="#" className={styles.viewRoutine}>View Full Routine</a>
              </div>

              <div className={styles.classesList}>
                {todayClasses.length > 0 ? (
                  todayClasses.map((cls, idx) => (
                    <div key={idx} className={`${styles.classCard} ${styles[`${cls.status}Card`]}`}>
                      <div className={styles.cardHeader}>
                        <span className={styles.timeBadge}>{cls.time || cls.class_time}</span>
                        <span className={styles.roomTag}>{cls.room || cls.room_number}</span>
                      </div>
                      <div className={styles.classInfo}>
                        <h3>{cls.course_title || cls.title}</h3>
                        <div className={styles.classMeta}>
                          {cls.course_code || cls.code} | {cls.students || cls.current_enrollment} Students
                        </div>
                      </div>
                      <button className={`${styles.actionBtn} ${styles[`${cls.status}Btn`]}`}>
                        {cls.status === 'active' && <AttendanceCheckIcon />} {cls.btnLabel || 'Mark Attendance'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No classes scheduled for today
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR WIDGETS */}
            <div className={styles.sidebarWidgets}>
          {/* Marks Entry Pending */}
          <div className={`${styles.widgetCard} ${styles.marksWidget}`}>
            <div className={styles.widgetHeading}>
              <BellIcon /> Marks Entry Pending
            </div>
            <div className={styles.marksAlert}>
              <p className={styles.alertText}>
                Final Semester marks for <strong>Algorithms (Lab)</strong> are due within 48 hours.
              </p>
            </div>
            <div className={styles.pendingList}>
              {pendingMarks.map((item, idx) => (
                <div key={idx} className={styles.pendingItem}>
                  <div className={styles.itemInfo}>
                    <div className={`${styles.itemIcon} ${item.type === 'info' ? styles.itemIconSecondary : ''}`}>
                      <FileTextIcon />
                    </div>
                    <div className={styles.itemLabels}>
                      <span className={styles.itemTitle}>{item.code}</span>
                      <span className={`${styles.itemStatus} ${item.type === 'info' ? styles.itemStatusSecondary : ''}`}>{item.status}</span>
                    </div>
                  </div>
                  <ChevronRightIcon />
                </div>
              ))}
            </div>
            <button className={styles.marksBtn}>Access Marksheet</button>
          </div>

          {/* Recent Notices */}
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeading}>
              <SpeakerIcon /> Recent Notices
            </div>
            <div className={styles.noticesList}>
              {notices.map((notice, idx) => (
                <div key={idx} className={styles.noticeItem}>
                  <span className={styles.noticeCategory}>{notice.category}</span>
                  <div className={styles.noticeTitle}>{notice.title}</div>
                  <div className={styles.noticeTime}>{notice.time}</div>
                </div>
              ))}
            </div>
            <button className={styles.postNoticeBtn}>Post New Notice</button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
