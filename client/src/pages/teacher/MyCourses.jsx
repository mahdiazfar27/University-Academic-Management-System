import React, { useState, useEffect } from 'react';
import styles from './MyCourses.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SyllabusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function MyCourses() {
  // Get teacher_id from localStorage or URL params
  const teacherId = localStorage.getItem('teacher_id') || '2'; // Default for testing
  
  const [courses, setCourses] = useState([]);
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notices = [
    { title: 'Final Grade Submission Deadline', time: 'Due in 14 days • April 24, 2024' },
    { title: 'Summer Research Grant Proposals', time: 'Applications open until May 1st' },
  ];

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherCourses(teacherId);
        
        if (response.status === 'success' && response.data) {
          setCourses(response.data.courses || []);
          setActiveCoursesCount(response.data.active_courses_count || 0);
        } else {
          setError(response.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.breadcrumb}>FACULTY PORTAL &gt; TEACHING LOAD</div>
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>My Assigned Courses</h1>
          <div className={styles.semesterText}>Current Semester: <strong>Spring 2024</strong></div>
        </div>
        
        {/* Stat Card */}
        <div className={styles.statsCard}>
          <div className={styles.iconBox}>
            <BookIcon />
          </div>
          <div className={styles.statsInfo}>
            <span className={styles.statsLabel}>ACTIVE COURSES</span>
            <span className={styles.statsValue}>{String(activeCoursesCount).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Column: Teaching Roster */}
        <div className={styles.rosterCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Teaching Roster</span>
            <a href="#" className={styles.downloadLink}>Download Schedule</a>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.rosterTable}>
              <thead>
                <tr>
                  <th>COURSE CODE</th>
                  <th>COURSE TITLE</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading courses...</td></tr>
                )}
                {error && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</td></tr>
                )}
                {!loading && courses.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No courses found</td></tr>
                )}
                {!loading && courses.map((course, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={styles.courseCodeBadge}>{course.code}</span>
                    </td>
                    <td>
                      <div className={styles.courseTitleGroup}>
                        <span className={styles.courseTitle}>{course.title}</span>
                        <span className={styles.courseLevel}>{course.level}</span>
                      </div>
                    </td>
                    <td className={styles.deptCell}>{course.dept}</td>
                    <td>
                      {/* Dynamic Placeholder for Actions */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className={styles.sidebar}>
          {/* Upcoming Lecture Card */}
          <div className={styles.lectureCard}>
            <span className={styles.lectureLabel}>UPCOMING LECTURE</span>
            <div className={styles.lectureInfo}>
              <div className={styles.clockIconBox}>
                <ClockIcon />
              </div>
              <div className={styles.lectureDetails}>
                <h3 className={styles.lectureTitle}>CS-402 Session</h3>
                <div className={styles.lectureMeta}>Today, 2:30 PM • Room 402B</div>
              </div>
            </div>
            <button className={styles.startBtn}>Start Virtual Classroom</button>
          </div>

          {/* Faculty Notices */}
          <div className={styles.noticesCard}>
            <div className={styles.noticesHeader}>
              <div className={styles.noticeDot} />
              FACULTY NOTICES
            </div>
            <div className={styles.noticeList}>
              {notices.map((notice, idx) => (
                <div key={idx} className={styles.noticeItem}>
                  <span className={styles.noticeTitle}>{notice.title}</span>
                  <span className={styles.noticeTime}>{notice.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semester Progress */}
          <div className={styles.progressCard}>
            <img 
              src="/university_campus_background_1775425619211.png" 
              className={styles.semesterImg} 
              alt="University Campus" 
            />
            <div className={styles.progressOverlay}>
              <span className={styles.semesterLabel}>Spring Semester 2024</span>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: '65%' }} />
              </div>
              <span className={styles.progressText}>65% of Term Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className={styles.bottomBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIcon}>
            <SyllabusIcon />
          </div>
          <div className={styles.bannerContent}>
            <h3>Need to revise course syllabi?</h3>
            <p>The curriculum portal is open for Fall 2024 submissions <strong>until</strong> the end of the month.</p>
          </div>
        </div>
        <button className={styles.bannerBtn}>Open Syllabus Portal</button>
      </div>
    </div>
  );
}
