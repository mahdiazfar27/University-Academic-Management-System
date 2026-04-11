import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../api/apiService';
import styles from './Dashboard.module.css';

// SVG Assets
const ProfileBadgePattern = () => (
  <svg className={styles.profilePattern} viewBox="0 0 100 100" preserveAspectRatio="none">
    <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle fill="rgba(255,255,255,0.15)" cx="3" cy="3" r="1"></circle>
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
  </svg>
);

const CapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 7.5L12 13L23 7.5L12 2ZM1 7.5V14C1 14 6 18 12 18C18 18 23 14 23 14V7.5M12 21.5C9 21.5 6 20.6 6 20.6V16.4C6 16.4 9 17.5 12 17.5C15 17.5 18 16.4 18 16.4V20.6C18 20.6 15 21.5 12 21.5Z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
  </svg>
);

const BookFaintIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="rgba(15, 23, 42, 0.04)" style={{ position: 'absolute', right: '-10px', bottom: '-20px' }}>
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V2H6.5C5.11929 2 4 3.11929 4 4.5V19.5ZM4 19.5C4 20.8807 5.11929 22 6.5 22H20V20H6.5C5.80964 20 5.25 19.4404 5.25 18.75C5.25 18.0596 5.80964 17.5 6.5 17.5H20"/>
  </svg>
);

const WalletFaintIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.05)" style={{ position: 'absolute', right: '-10px', bottom: '-20px' }}>
    <path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V6H20V18ZM16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11Z"/>
  </svg>
);

const BookSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V2H6.5C5.11929 2 4 3.11929 4 4.5V19.5ZM4 19.5C4 20.8807 5.11929 22 6.5 22H20V20H6.5C5.80964 20 5.25 19.4404 5.25 18.75C5.25 18.0596 5.80964 17.5 6.5 17.5H20"/>
  </svg>
);

const WalletSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V6H20V18ZM16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11Z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MegaphoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2V15H6L11 19V5Z"></path>
    <path d="M15.54 8.46C16.48 9.4 17 10.63 17 12C17 13.37 16.48 14.6 15.54 15.54"></path>
    <path d="M19.07 4.93C20.89 6.75 22 9.25 22 12C22 14.75 20.89 17.25 19.07 19.07"></path>
  </svg>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Student Data
  const [studentData, setStudentData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [payments, setPayments] = useState(null);
  const [attendance, setAttendance] = useState(null);

  // Helper function to extract data from various response structures
  const extractData = (response) => {
    if (Array.isArray(response)) {
      return response;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data;
    }
    return response;
  };

  useEffect(() => {
    if (user && user.id && user.student_id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let userEnrollments = [];
      let studentRegistrationNumber = null;
      let studentProfile = null;

      console.log('========== DASHBOARD LOAD START ==========');
      console.log('User:', user);
      
      // First, get the student's profile via JWT endpoint
      try {
        const profileRes = await apiService.request('/student/profile');
        studentProfile = profileRes.data;
        studentRegistrationNumber = studentProfile?.student_id;
        console.log('Student profile fetched:', studentProfile);
        console.log('Student registration number:', studentRegistrationNumber);
        setStudentData(studentProfile);
      } catch (err) {
        console.error('Could not fetch student profile:', err);
        // Fallback to user data
        setStudentData(user);
        studentRegistrationNumber = null;
      }

      // Fetch enrollments
      try {
        console.log('Fetching enrollments...');
        const enrollmentsRes = await apiService.getEnrollments();
        const enrollmentsArray = extractData(enrollmentsRes);
        console.log('Enrollments array:', enrollmentsArray);
        if (enrollmentsArray.length > 0) {
          console.log('First enrollment structure:', enrollmentsArray[0]);
        }
        
        if (Array.isArray(enrollmentsArray)) {
          // Filter by the student's registration number (stored in enrollments.student_id)
          userEnrollments = enrollmentsArray.filter(e => e.student_id === studentRegistrationNumber);
          console.log('Filtering by registration number:', studentRegistrationNumber);
          console.log('Filtered enrollments:', userEnrollments);
          setEnrollments(userEnrollments);
        } else {
          console.error('Enrollments data is not an array:', enrollmentsArray);
          setEnrollments([]);
        }
      } catch (err) {
        console.error('Failed to fetch enrollments:', err.message);
        setError('Failed to load enrollments: ' + err.message);
        setLoading(false);
        return;
      }

      // Fetch results/grades
      try {
        console.log('Fetching results...');
        const gradesRes = await apiService.getResults();
        const gradesArray = extractData(gradesRes);
        console.log('Grades array:', gradesArray);
        if (gradesArray.length > 0) {
          console.log('First grade structure:', gradesArray[0]);
        }
        
        if (Array.isArray(gradesArray)) {
          // Filter by the student's registration number (stored in results.student_id)
          let userGrades = gradesArray.filter(g => g.student_id === studentRegistrationNumber);
          console.log('Filtering grades by registration number:', studentRegistrationNumber);
          console.log('Filtered grades:', userGrades);
          setGrades(userGrades);
          console.log('Filtered grades:', userGrades);
        } else {
          console.error('Grades data is not an array:', gradesArray);
          setGrades([]);
        }
      } catch (err) {
        console.error('Failed to fetch results:', err.message);
        setError('Failed to load grades: ' + err.message);
        setLoading(false);
        return;
      }

      // Fetch attendance data for each enrollment
      try {
        console.log('Fetching attendance data...');
        if (userEnrollments && userEnrollments.length > 0) {
          // Fetch attendance for all enrollments
          const attendancePromises = userEnrollments.map(enrollment =>
            apiService.getEnrollmentAttendance(enrollment.id)
              .catch(err => {
                console.warn(`Failed to fetch attendance for enrollment ${enrollment.id}:`, err);
                return null;
              })
          );

          const attendanceResults = await Promise.all(attendancePromises);
          
          // Combine all attendance data to calculate overall percentage
          let totalClasses = 0;
          let totalPresent = 0;
          const attendanceByEnrollment = [];

          attendanceResults.forEach((result, idx) => {
            if (result && result.data && result.data.attendance_summary) {
              const summary = result.data.attendance_summary;
              totalClasses += summary.total_classes || 0;
              totalPresent += summary.classes_present || 0;
              attendanceByEnrollment.push({
                enrollment_id: userEnrollments[idx].id,
                course_name: result.data.course?.name || 'Unknown Course',
                attendance_percentage: summary.attendance_percentage || 0,
                total_classes: summary.total_classes || 0,
                classes_present: summary.classes_present || 0,
              });
            }
          });

          const overallAttendancePercentage = totalClasses > 0 
            ? Math.round((totalPresent / totalClasses) * 100) 
            : 0;

          setAttendance({
            attendance_summary: {
              attendance_percentage: overallAttendancePercentage,
              total_classes: totalClasses,
              classes_present: totalPresent,
              classes_absent: totalClasses - totalPresent,
            },
            by_course: attendanceByEnrollment,
          });

          console.log('Attendance data loaded:', {
            overall_percentage: overallAttendancePercentage,
            total_classes: totalClasses,
            by_course: attendanceByEnrollment,
          });
        } else {
          setAttendance(null);
        }
      } catch (err) {
        console.error('Failed to fetch attendance:', err.message);
        // Don't fail the entire dashboard, just skip attendance if it fails
        setAttendance(null);
      }

      // Fetch payments (optional - skip for now, requires auth)
      try {
        console.log('Skipping payments - requires authentication');
        setPayments({ summary: { total_outstanding: 0 } });
      } catch (err) {
        console.warn('Payments not available:', err.message);
      }

      console.log('========== DASHBOARD LOAD COMPLETE ==========');
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#dc2626' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  // Calculate statistics
  const calculateCGPA = () => {
    // Use CGPA from student profile data
    if (studentData?.cgpa) {
      return parseFloat(studentData.cgpa).toFixed(2);
    }
    return 0;
  };

  const calculateAttendancePercentage = () => {
    if (!attendance || !attendance.attendance_summary) return 0;
    return attendance.attendance_summary.attendance_percentage;
  };

  const getOutstandingBalance = () => {
    if (!payments || !payments.summary) return 0;
    return payments.summary.total_outstanding;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainGrid}>
        
        {/* LEFT COLUMN: Profile & Quick Stats */}
        <div className={styles.leftCol}>
          
          {/* PROFILE CARD */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderText}>STUDENT PROFILE</div>
              <ProfileBadgePattern />
            </div>
            <div className={styles.profileAvatarSection}>
              <div className={styles.avatarMain}>
                <div className={styles.avatarInner}>
                  {/* Avatar Male illustration approx */}
                  <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%" style={{borderRadius: '50%', backgroundColor: '#1c1c1c'}}>
                    <rect width="100" height="100" fill="#1c1c1c"/>
                    <path d="M50 45C58.2843 45 65 38.2843 65 30C65 21.7157 58.2843 15 50 15C41.7157 15 35 21.7157 35 30C35 38.2843 41.7157 45 50 45Z" fill="#e5b481"/>
                    <path d="M75 75C75 61.1929 63.8071 50 50 50C36.1929 50 25 61.1929 25 75V100H75V75Z" fill="#2d6f6d"/>
                    <text x="50" y="85" fontSize="10" fill="white" textAnchor="middle">Safe</text>
                    <text x="50" y="95" fontSize="10" fill="white" textAnchor="middle">for Work</text>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className={styles.profileBody}>
              <h2 className={styles.studentName}>
                {studentData?.user?.first_name && studentData?.user?.last_name 
                  ? `${studentData.user.first_name} ${studentData.user.last_name}`
                  : studentData?.full_name || user?.name || 'Student Name'}
              </h2>
              <div className={styles.studentId}>ID: {studentData?.student_id || 'N/A'}</div>
              <div className={styles.enrollBadge}>
                <span className={styles.badgeDot}></span>
                CURRENTLY ENROLLED
              </div>
            </div>
          </div>

          {/* STAT PAIR */}
          <div className={styles.statPair}>
            <div className={styles.smallStatCard}>
              <div className={styles.smallStatLabel}>CGPA</div>
              <div className={styles.smallStatValue}>{calculateCGPA()}</div>
            </div>
            <div className={styles.smallStatCard}>
              <div className={styles.smallStatLabel}>COURSES</div>
              <div className={styles.smallStatValue}>{enrollments.length}</div>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Info & Widgets */}
        <div className={styles.rightCol}>
          
          {/* ACADEMIC INFO */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeaderArea}>
              <h3 className={styles.cardTitle}>
                <CapIcon /> Academic Information
              </h3>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>FULL NAME</div>
                <div className={styles.infoValue}>
                  {studentData?.user?.first_name && studentData?.user?.last_name 
                    ? `${studentData.user.first_name} ${studentData.user.last_name}`
                    : studentData?.full_name || 'N/A'}
                </div>
              </div>
              
              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>STUDENT ID</div>
                <div className={styles.infoValue}>{studentData?.student_id || 'N/A'}</div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>EMAIL</div>
                <div className={styles.infoValue}>{studentData?.user?.email || 'N/A'}</div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>ENROLLMENT STATUS</div>
                <div className={styles.infoValueStatus}>
                  Active Regular Student <CheckCircleIcon />
                </div>
              </div>
            </div>
          </div>

          {/* TWO SIDE-BY-SIDE WIDGETS */}
          <div className={styles.widgetPair}>
            <div className={styles.coursesWidget}>
              <BookFaintIcon />
              <div className={styles.widgetHeader}>
                <BookSmallIcon /> Current Courses
              </div>
              <p className={styles.widgetDesc}>
                You are currently registered for 5 courses this semester.
              </p>
              <a href="#" className={styles.widgetLink}>View Registration →</a>
            </div>

            <div className={styles.balanceWidget}>
              <WalletFaintIcon />
              <div className={styles.widgetHeaderWhite}>
                <WalletSmallIcon /> Account Balance
              </div>
              <p className={styles.widgetDescWhite}>
                Your next installment is due on the 15th of each month.
              </p>
              <a href="/student/payments" className={styles.widgetLink}>View Payments →</a>
            </div>

            <div className={styles.balanceWidget}>
              <WalletFaintIcon />
              <div className={styles.widgetHeaderWhite}>
                <WalletSmallIcon /> Outstanding Balance
              </div>
              <p className={styles.widgetDescWhite}>
                Your next payment is due soon.
              </p>
              <div className={styles.balanceAmount}>₹{getOutstandingBalance().toFixed(2)}</div>
            </div>
          </div>

        </div>
      </div>

      {/* ACADEMIC OVERVIEW */}
      <div className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>Academic Overview</h2>
        
        <div className={styles.overviewGrid}>
          
          <div className={styles.overviewCard}>
            <div className={styles.progressHeader}>SEMESTER PROGRESS</div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${calculateAttendancePercentage()}%` }}></div>
            </div>
            <div className={styles.progressLabels}>
              <span>Week 10 of 16</span>
              <span>{calculateAttendancePercentage()}% Attendance</span>
            </div>
            
            <div className={styles.progressStats}>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>ATTENDANCE</div>
                <div className={styles.statBoxValue}>{calculateAttendancePercentage()}%</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>GRADES</div>
                <div className={styles.statBoxValue}>{grades.length}</div>
              </div>
            </div>
          </div>

          <div className={styles.overviewCardMini}>
            <div className={styles.orangeCircle}>
              <CalendarIcon />
            </div>
            <div className={styles.miniLabel}>COURSES</div>
            <div className={styles.miniValue}>{enrollments.length} Active</div>
            <a href="/student/classes" className={styles.miniLink}>View Details</a>
          </div>

          <div className={styles.overviewCardMini}>
            <div className={styles.blueCircle}>
              <WalletSmallIcon />
            </div>
            <div className={styles.miniLabel}>PAYMENTS</div>
            <div className={styles.miniValue}>₹{getOutstandingBalance()}</div>
            <a href="/student/payments" className={styles.miniLink}>Pay Now</a>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS & DEADLINES */}
      <div className={styles.announcementsSection}>
        <h2 className={styles.sectionTitle}>Announcements & Deadlines</h2>
        
        <div className={styles.announcementsList}>
          <div className={styles.announcementCard}>
            <div className={styles.announcementIcon}>
              <MegaphoneIcon />
            </div>
            <div className={styles.announcementContent}>
              <h4 className={styles.announcementTitle}>Course Registration Deadline</h4>
              <p className={styles.announcementText}>Last date for course registration is approaching. Please complete your registration before the deadline.</p>
              <span className={styles.announcementDate}>Due: March 15, 2024</span>
            </div>
          </div>

          <div className={styles.announcementCard}>
            <div className={styles.announcementIcon}>
              <MegaphoneIcon />
            </div>
            <div className={styles.announcementContent}>
              <h4 className={styles.announcementTitle}>Exam Schedule Released</h4>
              <p className={styles.announcementText}>Your semester exam schedule has been released. Check your exam dates and venues in the portal.</p>
              <span className={styles.announcementDate}>Effective: March 20, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}