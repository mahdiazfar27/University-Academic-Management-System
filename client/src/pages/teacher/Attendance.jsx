import React, { useState, useEffect } from 'react';
import styles from './Attendance.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const SubmitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function Attendance() {
  const teacherId = localStorage.getItem('teacher_id') || '2'; // Default for testing
  const todayDate = new Date().toISOString().split('T')[0];

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null); // Store course details for bottom bar
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 10;

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherCourses(teacherId);
        if (response.status === 'success' && response.data) {
          setCourses(response.data.courses || []);
        } else {
          setError('Failed to fetch courses');
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

  // Fetch attendance when course or date changes
  const handleCourseSelect = async (event) => {
    const courseId = event.target.value;
    if (courseId) {
      await fetchAttendance(courseId, selectedDate);
      setSelectedCourse(courseId);
      setCurrentPage(1); // Reset to first page
      
      // Store course info for bottom bar display
      const course = courses.find(c => c.id === parseInt(courseId));
      if (course) {
        setSelectedCourseInfo(course);
      }
    } else {
      setStudents([]);
      setSelectedCourse(null);
      setSelectedCourseInfo(null);
    }
  };

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    if (selectedCourse) {
      await fetchAttendance(selectedCourse, date);
    }
  };

  const fetchAttendance = async (courseId, date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCourseAttendance(courseId, date);
      
      console.log('=== ATTENDANCE.JSX DEBUG ===');
      console.log('Raw API response:', JSON.stringify(response, null, 2));
      
      if (response.status === 'success' && response.data) {
        // DEBUG: Log the FIRST student to verify backend returns correct structure
        if (response.data.students && response.data.students.length > 0) {
          console.log('First raw student from API:', JSON.stringify(response.data.students[0], null, 2));
          const firstStudent = response.data.students[0];
          console.log('Fields found:', Object.keys(firstStudent));
          console.log('student_id field (should be int ID):', firstStudent.student_id, `Type: ${typeof firstStudent.student_id}`);
          console.log('id field (should be registration):', firstStudent.id, `Type: ${typeof firstStudent.id}`);
        }
        
        // Map backend response to component format
        // Backend returns: id (reg#), student_id (DB ID), name, is_present
        const mappedStudents = (response.data.students || []).map((student, idx) => {
          const studentId = student.student_id;
          const parsedId = parseInt(studentId);
          
          console.log(`Mapping student ${idx}:`, {
            raw_student_id: studentId,
            parsed_id: parsedId,
            is_nan: isNaN(parsedId),
            status: student.is_present
          });
          
          if (isNaN(parsedId)) {
            console.error(`ERROR: Student ${idx} has invalid ID: ${studentId}`);
            setError(`Invalid student ID received from server for student: ${student.name}`);
          }
          
          return {
            id: parsedId,  // Database ID from students.id (1, 2, 3...)
            name: student.name,
            registrationNumber: student.id,  // Registration number for display
            status: student.is_present ? 'P' : 'A'  // Truthy/falsy works for 0/1 and true/false
          };
        });
        
        console.log('Mapped students:', JSON.stringify(mappedStudents.slice(0, 2), null, 2));
        
        // Sort by student ID in ascending order
        const sortedStudents = mappedStudents.sort((a, b) => a.id - b.id);
        
        setStudents(sortedStudents);
      } else {
        setError('Failed to fetch attendance');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markedCount = students.filter(s => s.status).length;
  const progressPercent = students.length > 0 ? (markedCount / students.length) * 100 : 0;

  const handleStatusChange = (studentId, status) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const markAllToStatus = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setError('Please select a course first');
      return;
    }

    // Validate all students have a status
    const unmatchedStudents = students.filter(s => !s.status);
    if (unmatchedStudents.length > 0) {
      setError(`Please mark all students as Present or Absent. ${unmatchedStudents.length} student(s) not marked.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Prepare attendance data for submission
      const attendanceData = {
        course_offering_id: parseInt(selectedCourse),
        date: selectedDate,
        attendance: students.map(s => ({
          student_id: s.id,  // Should be integer
          is_present: s.status === 'P'  // Convert P/A to boolean
        }))
      };

      // ===== COMPREHENSIVE VALIDATION & LOGGING =====
      console.log('=== ATTENDANCE SUBMISSION VALIDATION ===');
      console.log('Selected course raw value:', selectedCourse, 'Type:', typeof selectedCourse);
      console.log('Selected course parsed as int:', parseInt(selectedCourse), 'Type:', typeof parseInt(selectedCourse));
      console.log('Date:', selectedDate);
      console.log('Total students in array:', students.length);
      
      // Validate each student's ID
      console.log('\n=== STUDENT DATA VALIDATION ===');
      students.slice(0, 3).forEach((s, idx) => {
        console.log(`Student ${idx}:`, {
          id: s.id,
          id_type: typeof s.id,
          is_nan: isNaN(s.id),
          name: s.name,
          status: s.status
        });
      });
      
      const badStudents = students.filter(s => isNaN(s.id) || s.id === undefined || s.id === null);
      if (badStudents.length > 0) {
        console.error(`ERROR: ${badStudents.length} students have invalid IDs!`);
        setError(`Invalid student data: ${badStudents.length} students have no ID`);
        setLoading(false);
        return;
      }
      
      console.log('\n=== FINAL SUBMISSION PAYLOAD ===');
      console.log('Payload:', JSON.stringify(attendanceData, null, 2));
      console.log('First attendance record:', attendanceData.attendance[0]);
      console.log('=========================================\n');

      const response = await apiService.submitAttendance(attendanceData);
      
      console.log('API Response:', JSON.stringify(response, null, 2));

      if (response.status === 'success') {
        setSuccessMessage(`✓ Successfully submitted attendance for ${students.length} student(s)`);
        
        // Clear the current students to show reloading state
        setStudents([]);
        setLoading(true);
        
        // Reload attendance after a short delay to show data is persisting
        setTimeout(() => {
          fetchAttendance(selectedCourse, selectedDate);
        }, 1000);
      } else {
        // Parse validation errors if available
        let errorMsg = response.message || 'Failed to submit attendance';
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, errors]) => {
              const errorList = Array.isArray(errors) ? errors.join(', ') : errors;
              return `${field}: ${errorList}`;
            })
            .join('\n');
          errorMsg = `${errorMsg}\n\nValidation details:\n${errorDetails}`;
        }
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setError(err.message || 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.breadcrumb}>PORTAL &gt; ATTENDANCE ENTRY</div>
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Record Attendance</h1>
          <p>Select class parameters and update student participation for today's session.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.submitBtnTop} onClick={handleSubmit} disabled={students.length === 0 || loading}>
            <SubmitIcon /> {loading ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Panel: Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.detailsCard}>
            <div className={styles.cardHeading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
              SESSION DETAILS
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.label}>SELECT COURSE & SECTION</label>
              <select className={styles.select} onChange={handleCourseSelect}>
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title} (Sec {course.section})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.label}>SESSION DATE</label>
              <input type="date" className={styles.dateInput} value={selectedDate} onChange={handleDateChange} />
            </div>

            <div className={styles.markAllSection}>
              <label className={styles.label}>MARK ALL AS</label>
              <div className={styles.markAllGrid}>
                <button className={styles.markBtn} onClick={() => markAllToStatus('P')}>PRESENT</button>
                <button className={styles.markBtn} onClick={() => markAllToStatus('A')}>ABSENT</button>
              </div>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.sumLabel}>Total Students</span>
              <span className={styles.sumVal}>{students.length}</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
            </div>
            <span className={styles.progressSub}>{Math.round(progressPercent)}% marked so far</span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>PRESENT</span>
              <span className={styles.statValue}>{students.filter(s => s.status === 'P').length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>ABSENT</span>
              <span className={`${styles.statValue}`}>{students.filter(s => s.status === 'A').length}</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Student Manifest */}
        <div className={styles.manifestCard}>
          <div className={styles.manifestHeader}>
            <span className={styles.manifestTitle}>STUDENT MANIFEST</span>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotP}`} /> PRESENT</div>
              <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotA}`} /> ABSENT</div>
            </div>
          </div>

          {error && <div style={{ color: 'red', padding: '10px' }}>Error: {error}</div>}
          {successMessage && <div style={{ color: 'green', padding: '10px' }}>{successMessage}</div>}

          <div className={styles.tableWrapper}>
            <table className={styles.manifestTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>STUDENT NAME</th>
                  <th>STATUS SELECTION</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                )}
                {!loading && students.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    {selectedCourse ? 'No students found' : 'Select a course and date to view students'}
                  </td></tr>
                )}
                {!loading && students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((student) => (
                  <tr key={student.id}>
                    <td className={styles.studentId}>{student.registrationNumber}</td>
                    <td>
                      <div className={styles.studentProfile}>
                        <div className={styles.stInfo}>
                          <span className={styles.stName}>{student.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.selectionGroup}>
                        <button 
                          className={`${styles.selBtn} ${styles.selBtnP} ${student.status === 'P' ? styles.active : ''}`}
                          onClick={() => handleStatusChange(student.id, 'P')}
                        >P</button>
                        <button 
                          className={`${styles.selBtn} ${styles.selBtnA} ${student.status === 'A' ? styles.active : ''}`}
                          onClick={() => handleStatusChange(student.id, 'A')}
                        >A</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length > 0 && (
            <div className={styles.pagination}>
              <span className={styles.pagingInfo}>
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students for this section
              </span>
              <div className={styles.pagingBtns}>
                <button className={styles.pageBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>PREVIOUS</button>
                <button className={styles.pageBtn} disabled={currentPage * itemsPerPage >= students.length} onClick={() => setCurrentPage(currentPage + 1)}>NEXT PAGE</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.barContent}>
          <div className={styles.sessionSummary}>
            <span className={styles.sumLabelSmall}>SELECTED SESSION</span>
            <span className={styles.sessionHighlight}>
              {selectedCourseInfo 
                ? `${selectedCourseInfo.code} ${selectedCourseInfo.title} • ${selectedDate}`
                : 'No course selected'
              }
            </span>
          </div>
          <button 
            className={styles.submitBtnBottom} 
            onClick={handleSubmit} 
            disabled={students.length === 0 || loading}
          >
            <SubmitIcon /> {loading ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
}
