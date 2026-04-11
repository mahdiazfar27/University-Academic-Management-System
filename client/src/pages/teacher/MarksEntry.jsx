import React, { useState, useEffect } from 'react';
import styles from './MarksEntry.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SubmitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default function MarksEntry() {
  const teacherId = localStorage.getItem('teacher_id') || '2'; // Default for testing

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Fetch marks when course is selected
  const handleCourseSelect = async (event) => {
    const courseId = event.target.value;
    if (!courseId) {
      setSelectedCourse(null);
      setStudents([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCourseMarks(courseId);
      
      if (response.status === 'success' && response.data) {
        // Map backend response to table format
        setStudents(
          (response.data.students || []).map(student => ({
            id: student.id,
            studentRegistrationNumber: student.student_registration_number,
            name: student.name,
            status: 'PRESENT', // Backend doesn't track status, default to PRESENT
            mark: student.final_marks !== null ? String(student.final_marks) : '--'
          }))
        );
        setSelectedCourse(courseId);
        setIsDirty(false);
      } else {
        setError('Failed to fetch marks');
      }
    } catch (err) {
      console.error('Error fetching marks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    // Allow empty string (for clearing the field)
    if (value === '') {
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, mark: value } : s
      ));
      setIsDirty(true);
      return;
    }

    // Only allow numeric input (digits only)
    if (!/^\d+$/.test(value)) return;

    // Only allow values from 0 to 100
    const num = parseInt(value, 10);
    if (num > 100) return;

    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, mark: value } : s
    ));
    setIsDirty(true);
  };

  const handleReset = () => {
    // Reload marks from API
    if (selectedCourse) {
      handleCourseSelect({ target: { value: selectedCourse } });
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setError('Please select a course first');
      return;
    }

    if (!isDirty) {
      setSuccessMessage('No changes to submit');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Prepare data for submission
      const marksData = {
        course_offering_id: parseInt(selectedCourse),
        marks: students
          .filter(s => s.mark !== '--' && s.mark !== '')
          .map(s => ({
            student_id: s.id,
            final_marks: parseInt(s.mark) || 0
          }))
      };

      if (marksData.marks.length === 0) {
        setError('No marks to submit');
        return;
      }

      const response = await apiService.submitMarks(marksData);

      if (response.status === 'success') {
        setSuccessMessage(`✓ Successfully submitted marks for ${marksData.marks.length} student(s)`);
        setIsDirty(false);
        // Reload marks to refresh
        setTimeout(() => {
          handleCourseSelect({ target: { value: selectedCourse } });
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit marks');
      }
    } catch (err) {
      console.error('Error submitting marks:', err);
      setError(err.message || 'Failed to submit marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Marks Entry</h1>
        </div>
        <div className={styles.searchBox}>
          <div className={styles.searchIcon}><SearchIcon /></div>
          <input type="text" className={styles.searchInput} placeholder="Search student or course..." />
        </div>
      </div>

      {/* Selection Area */}
      <div className={styles.selectionCard}>
        <div className={styles.selectGroup}>
          <label className={styles.label}>COURSE & SECTION</label>
          <select className={styles.select} onChange={handleCourseSelect}>
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title} (Sec {course.section})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectGroup}>
          <label className={styles.label}>ASSESSMENT TYPE</label>
          <select className={styles.select}>
            <option>Final Marks Entry (Spring 2024)</option>
            <option>Mid-term Marks (Spring 2024)</option>
          </select>
        </div>
        <button className={styles.submitBtnTop} onClick={handleSubmit} disabled={!isDirty || loading}>
          <SubmitIcon /> {loading ? 'Submitting...' : 'Submit Marks'}
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>Error: {error}</div>}
      {successMessage && <div style={{ color: 'green', padding: '10px', margin: '10px 0' }}>{successMessage}</div>}

      {/* Marks Table */}
      <div className={styles.marksCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.marksTable}>
            <thead>
              <tr>
                <th>STUDENT ID</th>
                <th>FULL NAME</th>
                <th>STATUS</th>
                <th>FINAL MARK (100)</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              )}
              {!loading && students.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  {selectedCourse ? 'No students found' : 'Select a course to view students'}
                </td></tr>
              )}
              {!loading && students.map(student => (
                <tr key={student.id}>
                  <td className={styles.studentId}>{student.studentRegistrationNumber}</td>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar}>{student.name.substring(0, 2).toUpperCase()}</div>
                      <span className={styles.stName}>{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${student.status === 'PRESENT' ? styles.present : styles.absent}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className={styles.markInput}
                      value={student.mark}
                      onChange={(e) => handleMarkChange(student.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      {isDirty && (
        <div className={styles.bottomBar}>
          <div className={styles.barContent}>
            <div className={styles.warningArea}>
              <InfoIcon />
              <span>Unsaved changes will be lost.</span>
            </div>
            <div className={styles.actionBtns}>
              <button className={styles.discardBtn} onClick={handleReset}>Discard Changes</button>
              <button className={styles.submitBtnBottom} onClick={handleSubmit} disabled={loading}>
                <SubmitIcon /> {loading ? 'Submitting...' : 'Submit Marks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
