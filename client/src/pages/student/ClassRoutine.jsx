import React, { useState, useEffect } from 'react';
import styles from './ClassRoutine.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const MegaphoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2V15H6L11 19V5z"></path>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const CapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 5L2 10L12 15L22 10Z"></path>
    <path d="M6 12V17C6 17 9 20 12 20C15 20 18 17 18 17V12"></path>
  </svg>
);

const AttendanceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <polyline points="9 11 12 14 22 4"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CourseBlock = ({ code, room, type }) => {
  const themeClass = styles[type] || styles.core;
  return (
    <div className={`${styles.courseBlock} ${themeClass}`}>
      <span className={styles.code}>{code}</span>
      <span className={styles.room}>Room: {room}</span>
    </div>
  );
};

export default function MyClassRoutine() {
  const [showAlert, setShowAlert] = useState(true);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        console.error('No user data found');
        setLoading(false);
        return;
      }

      // Get enrollments to calculate overall attendance
      const enrollmentsRes = await apiService.getEnrollments();
      const enrollments = Array.isArray(enrollmentsRes.data) 
        ? enrollmentsRes.data 
        : (enrollmentsRes.data?.data || []);

      if (enrollments.length === 0) {
        setLoading(false);
        return;
      }

      // Filter enrollments for this student
      let userEnrollments = enrollments.filter(e => e.student_id === user.student_code);
      if (userEnrollments.length === 0) {
        userEnrollments = enrollments.filter(e => e.student_id === user.student_id);
      }

      // Fetch attendance for all enrollments
      let totalClasses = 0;
      let totalPresent = 0;

      const attendancePromises = userEnrollments.map(enrollment =>
        apiService.getEnrollmentAttendance(enrollment.id)
          .catch(err => {
            console.warn(`Failed to fetch attendance for enrollment ${enrollment.id}:`, err);
            return null;
          })
      );

      const attendanceResults = await Promise.all(attendancePromises);

      attendanceResults.forEach(result => {
        if (result && result.data && result.data.attendance_summary) {
          const summary = result.data.attendance_summary;
          totalClasses += summary.total_classes || 0;
          totalPresent += summary.classes_present || 0;
        }
      });

      const overallAttendancePercentage = totalClasses > 0 
        ? Math.round((totalPresent / totalClasses) * 100) 
        : 0;

      setAttendancePercentage(overallAttendancePercentage);
    } catch (err) {
      console.error('Failed to load attendance:', err.message);
      setAttendancePercentage(0);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots = [
    { label: '08:00 - 08:50' },
    { label: '09:00 - 09:50' },
    { label: '10:00 - 10:50' },
    { label: '11:00 - 11:50' },
    { label: '12:00 - 12:50' },
    { label: '02:00 - 02:50' },
    { label: '03:00 - 03:50' },
  ];

  return (
    <div className={styles.routineContainer}>
      {/* Breadcrumb & Title */}
      <div className={styles.breadcrumb}>Dashboard &gt; Routine Management</div>
      <h1 className={styles.pageTitle}>Class Routine</h1>

      {/* Alert Banner */}
      {showAlert && (
        <div className={styles.alertBanner}>
          <div className={styles.alertIcon}>
            <MegaphoneIcon />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertTitle}>Upcoming Routine Changes</div>
            <div className={styles.alertMessage}>
              Please note that Monday morning classes (08:00 AM) for CSE-311 have been moved to Room 402 effective from next week. Ensure you verify room allocations before attending.
            </div>
          </div>
          <button className={styles.alertClose} onClick={() => setShowAlert(false)}>
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Routine Card */}
      <div className={styles.routineCard}>
        <div className={styles.cardHeader}>
          <div className={styles.semesterInfo}>
            <h2>Semester: Spring, 2025</h2>
            <div className={styles.semesterSubtitle}>Full Course Schedule & Hall Assignments</div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.filterBtn}>
              <FilterIcon /> Filter
            </button>
            <button className={styles.printBtn}>
              <PrintIcon /> Print
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className={styles.tableWrapper}>
          <div className={styles.timetableGrid}>
            {/* Header Row */}
            <div className={styles.headerCell} style={{ backgroundColor: 'white' }}>DAY / TIME</div>
            {timeSlots.map((slot, i) => (
              <React.Fragment key={i}>
                <div className={styles.headerCell}>
                  <span>{slot.label}</span>
                </div>
                {i === 4 && <div className={styles.headerCell}>BREAK</div>}
              </React.Fragment>
            ))}

            {/* Sunday */}
            <div className={styles.dayCell}>Sunday</div>
            <div className={styles.slotCell}><CourseBlock code="CSE-311" room="302" type="core" /></div>
            <div className={styles.slotCell}><CourseBlock code="MAT-201" room="104" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="ENG-102" room="501" type="english" /></div>
            <div className={styles.slotCell} />
            <div className={styles.lunchBreak}><span className={styles.verticalText}>LUNCH BREAK</span></div>
            <div className={styles.slotCell}><CourseBlock code="LAB-312" room="Lab Room A" type="lab" /></div>
            <div className={styles.slotCell}><CourseBlock code="LAB-312" room="Lab Room A" type="lab" /></div>

            {/* Monday */}
            <div className={styles.dayCell}>Monday</div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="CSE-311" room="302" type="core" /></div>
            <div className={styles.slotCell}><CourseBlock code="PHY-221" room="212" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="MAT-201" room="104" type="core" /></div>
            <div className={styles.lunchBreak}><span className={styles.verticalText}>LUNCH BREAK</span></div>
            <div className={styles.slotCell}><CourseBlock code="ENG-102" room="501" type="english" /></div>
            <div className={styles.slotCell} />

            {/* Tuesday */}
            <div className={styles.dayCell}>Tuesday</div>
            <div className={styles.slotCell}><CourseBlock code="CSE-311" room="302" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="PHY-221" room="212" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="LAB-222" room="Lab Room B" type="lab" /></div>
            <div className={styles.lunchBreak}><span className={styles.verticalText}>LUNCH BREAK</span></div>
            <div className={styles.slotCell}><CourseBlock code="LAB-222" room="Lab Room B" type="lab" /></div>
            <div className={styles.slotCell} />

            {/* Wednesday */}
            <div className={styles.dayCell}>Wednesday</div>
            <div className={styles.slotCell}><CourseBlock code="MAT-201" room="104" type="core" /></div>
            <div className={styles.slotCell}><CourseBlock code="PHY-221" room="212" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="ENG-102" room="501" type="english" /></div>
            <div className={styles.slotCell} />
            <div className={styles.lunchBreak}><span className={styles.verticalText}>LUNCH BREAK</span></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell} />

            {/* Thursday */}
            <div className={styles.dayCell}>Thursday</div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="CSE-311" room="302" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell}><CourseBlock code="MAT-201" room="104" type="core" /></div>
            <div className={styles.slotCell} />
            <div className={styles.lunchBreak}><span className={styles.verticalText}>LUNCH BREAK</span></div>
            <div className={styles.slotCell} />
            <div className={styles.slotCell} />
          </div>
        </div>

        <button className={styles.fab}>+</button>

        <button className={styles.downloadPdfBtn}>
          <DownloadIcon /> Download Pdf
        </button>
      </div>

      {/* Bottom Widgets */}
      <div className={styles.widgetsRow}>
        <div className={styles.widgetCard}>
          <div className={styles.widgetIconBox} style={{ backgroundColor: '#eff6ff' }}>
            <div style={{ backgroundColor: '#1e40af', padding: '6px', borderRadius: '4px' }}>
              <CapIcon />
            </div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.widgetLabel}>Course Load</div>
            <div className={styles.widgetMain}>18.5</div>
            <div className={styles.widgetSub}>CREDITS THIS SEMESTER</div>
          </div>
        </div>

        <div className={styles.widgetCard}>
          <div className={styles.widgetIconBox} style={{ backgroundColor: '#f0fdf4' }}>
            <div style={{ backgroundColor: '#10b981', padding: '6px', borderRadius: '4px' }}>
              <AttendanceIcon />
            </div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.widgetLabel}>Attendance</div>
            <div className={styles.widgetMain}>{loading ? '--' : `${attendancePercentage}%`}</div>
            <div className={styles.attendanceBarBg}>
              <div className={styles.attendanceBarFill} style={{ width: `${attendancePercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className={styles.widgetCard}>
          <div className={styles.widgetIconBox} style={{ backgroundColor: '#fff7ed' }}>
            <div style={{ backgroundColor: '#f97316', padding: '6px', borderRadius: '4px' }}>
              <ClockIcon />
            </div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.widgetLabel}>Next Class</div>
            <div className={styles.nextClassValue}>CSE-311 (Room 302)</div>
            <div className={styles.nextClassSub}>Starting in 15 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
