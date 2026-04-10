import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FacultyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const CourseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const NewUserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const NewNoticeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const NewCourseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const ReportsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
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

const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <polyline points="9 11 12 14 22 4"></polyline>
  </svg>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    total_students: 0,
    total_teachers: 0,
    total_admins: 0
  });

  const [attendanceStats, setAttendanceStats] = useState({
    overall_attendance: 0,
    total_enrollments: 0,
    students_with_low_attendance: [],
    courses_attendance: [],
  });
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    loadUserStats();
    loadAttendanceStats();
  };

  const loadUserStats = async () => {
    try {
      setLoadingStats(true);
      // Get all users (per_page=9999 bypasses pagination) and calculate by role
      const usersRes = await apiService.getAll('users?per_page=9999');
      const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);

      const stats = {
        total_students: users.filter(u => u.role === 'student').length,
        total_teachers: users.filter(u => u.role === 'teacher').length,
        total_admins: users.filter(u => u.role === 'admin').length
      };
      setUserStats(stats);
    } catch (err) {
      console.error('Error loading user stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };



  const loadAttendanceStats = async () => {
    try {
      setLoadingAttendance(true);
      // Get all enrollments to calculate attendance statistics
      const enrollmentsRes = await apiService.getEnrollments();
      const enrollments = Array.isArray(enrollmentsRes.data) 
        ? enrollmentsRes.data 
        : (enrollmentsRes.data?.data || []);

      if (enrollments.length === 0) {
        setLoadingAttendance(false);
        return;
      }

      let totalClasses = 0;
      let totalPresent = 0;
      const courseStats = {};
      const lowAttendanceStudents = [];

      // Fetch attendance for all enrollments
      const attendancePromises = enrollments.map(enrollment =>
        apiService.getEnrollmentAttendance(enrollment.id)
          .then(res => ({ enrollment, data: res }))
          .catch(err => {
            console.warn(`Failed to fetch attendance for enrollment ${enrollment.id}:`, err);
            return { enrollment, data: null };
          })
      );

      const attendanceResults = await Promise.all(attendancePromises);

      attendanceResults.forEach(({ enrollment, data }) => {
        if (data && data.data && data.data.attendance_summary) {
          const summary = data.data.attendance_summary;
          totalClasses += summary.total_classes || 0;
          totalPresent += summary.classes_present || 0;

          // Track course attendance
          const courseName = data.data.course?.name || 'Unknown Course';
          if (!courseStats[courseName]) {
            courseStats[courseName] = {
              total_classes: 0,
              classes_present: 0,
              count: 0,
            };
          }
          courseStats[courseName].total_classes += summary.total_classes || 0;
          courseStats[courseName].classes_present += summary.classes_present || 0;
          courseStats[courseName].count += 1;

          // Track students with low attendance
          if (summary.attendance_percentage < 75) {
            lowAttendanceStudents.push({
              student_id: enrollment.student_id,
              course: courseName,
              attendance: summary.attendance_percentage,
            });
          }
        }
      });

      const overallAttendance = totalClasses > 0 
        ? Math.round((totalPresent / totalClasses) * 100) 
        : 0;

      // Calculate per-course averages
      const courseAttendanceList = Object.entries(courseStats).map(([name, stats]) => ({
        name,
        average_attendance: Math.round((stats.classes_present / stats.total_classes) * 100),
        total_students: stats.count,
      }));

      setAttendanceStats({
        overall_attendance: overallAttendance,
        total_enrollments: enrollments.length,
        students_with_low_attendance: lowAttendanceStudents.slice(0, 5), // Top 5 low attendance
        courses_attendance: courseAttendanceList,
      });

      console.log('Attendance stats loaded:', {
        overall: overallAttendance,
        enrollments: enrollments.length,
        low_attendance: lowAttendanceStudents.length,
      });
    } catch (err) {
      console.error('Failed to load attendance stats:', err.message);
      setAttendanceStats({
        overall_attendance: 0,
        total_enrollments: 0,
        students_with_low_attendance: [],
        courses_attendance: [],
      });
    } finally {
      setLoadingAttendance(false);
    }
  };

  const adminLogs = [
    { action: 'Modified Department Policy', user: { name: 'Robert Fox', avatar: 'https://i.pravatar.cc/150?u=robert' }, time: 'Oct 24, 2:15 PM', status: 'SUCCESS' },
    { action: 'Bulk Student Import', user: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/150?u=jane' }, time: 'Oct 24, 1:45 PM', status: 'PENDING' },
    { action: 'Course Syllabus Update', user: { name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/150?u=cody' }, time: 'Oct 24, 12:00 PM', status: 'SUCCESS' },
    { action: 'Security Audit Completed', user: { name: 'Admin User', avatar: 'https://i.pravatar.cc/150?u=admin' }, time: 'Oct 24, 11:30 AM', status: 'SUCCESS' },
  ];

  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Admin Overview</h1>
          <p>Real-time insight into institutional performance and system health.</p>
        </div>
        <button className={styles.exportBtn}>
          <ExportIcon /> Export Report
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><PeopleIcon /></div>
            <span className={`${styles.trendBadge} ${styles.trendGrow}`}>+12.5%</span>
          </div>
          <div>
            <span className={styles.metricLabel}>TOTAL STUDENTS</span>
            <span className={styles.metricValue}>{loadingStats ? '...' : userStats.total_students.toLocaleString()}</span>
            <span className={styles.metricSubtext}>Active across all departments</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><FacultyIcon /></div>
            <span className={`${styles.trendBadge} ${styles.trendStable}`}>Stable</span>
          </div>
          <div>
            <span className={styles.metricLabel}>TOTAL FACULTY</span>
            <span className={styles.metricValue}>{loadingStats ? '...' : userStats.total_teachers.toLocaleString()}</span>
            <span className={styles.metricSubtext}>{userStats.total_admins} admin(s)</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><AttendanceIcon /></div>
            <span className={`${styles.trendBadge} ${styles.trendGrow}`}>{attendanceStats.overall_attendance}%</span>
          </div>
          <div>
            <span className={styles.metricLabel}>OVERALL ATTENDANCE</span>
            <span className={styles.metricValue}>{loadingAttendance ? '...' : `${attendanceStats.overall_attendance}%`}</span>
            <span className={styles.metricSubtext}>{attendanceStats.total_enrollments} enrollments tracked</span>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      {!loadingAttendance && (attendanceStats.students_with_low_attendance.length > 0 || attendanceStats.courses_attendance.length > 0) && (
        <div className={styles.attendanceSection} style={{ marginTop: '24px', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Attendance Insights</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Low Attendance Alerts */}
            {attendanceStats.students_with_low_attendance.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Low Attendance Alerts (&lt;75%)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attendanceStats.students_with_low_attendance.map((item, idx) => (
                    <div key={idx} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#fff', border: '1px solid #fee2e2' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.course}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Student ID: {item.student_id} - {item.attendance}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Per-Course Attendance */}
            {attendanceStats.courses_attendance.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Course Attendance Average</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attendanceStats.courses_attendance.slice(0, 5).map((course, idx) => (
                    <div key={idx} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                        <span>{course.name}</span>
                        <span>{course.average_attendance}%</span>
                      </div>
                      <div style={{ backgroundColor: '#e5e7eb', borderRadius: '2px', height: '4px', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: course.average_attendance >= 80 ? '#10b981' : '#f59e0b', height: '100%', width: `${course.average_attendance}%` }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{course.total_students} students</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Split */}
      <div className={styles.mainLayout}>
        {/* Sidebar Widgets */}
        <div className={styles.sidebar} style={{ gridColumn: '1 / -1' }}>
          {/* Admin Actions */}
          <div className={styles.widgetCard}>
            <span className={styles.widgetTitle}>ADMIN ACTIONS</span>
            <div className={styles.actionsGrid}>
              <div className={styles.actionItem} onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
                <NewUserIcon />
                <span>New User</span>
              </div>
              <div className={styles.actionItem} onClick={() => navigate('/admin/notices')} style={{ cursor: 'pointer' }}>
                <NewNoticeIcon />
                <span>New Notice</span>
              </div>
              <div className={styles.actionItem} onClick={() => navigate('/admin/courses')} style={{ cursor: 'pointer' }}>
                <NewCourseIcon />
                <span>New Course</span>
              </div>
              <div className={styles.actionItem} style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <ReportsIcon />
                <span>Reports</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
