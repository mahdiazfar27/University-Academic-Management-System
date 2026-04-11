import React, { useState, useEffect } from 'react';
import styles from './CourseManagement.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

/* ── Course Form Modal ── */
function CourseFormModal({ isOpen, onClose, onSave, selectedCourse, departments }) {
  const [formData, setFormData] = useState({ code: '', name: '', department_id: '', credits: '', description: '', semester: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      setFormData(selectedCourse);
    } else {
      setFormData({ code: '', name: '', department_id: '', credits: '', description: '', semester: '' });
    }
    setErrors({});
  }, [selectedCourse, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Error saving course');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{selectedCourse ? 'Edit Course' : 'Add New Course'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Course Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., CSE 401"
              maxLength="10"
            />
            {errors.code && <span className={styles.error}>{errors.code}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Course Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Advanced Algorithms"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Department *</label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.department_id && <span className={styles.error}>{errors.department_id}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Credits *</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              placeholder="0-5"
              min="0"
              max="5"
              step="0.5"
            />
            {errors.credits && <span className={styles.error}>{errors.credits}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Course description..."
              rows="3"
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Semester</label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="1-8"
              min="1"
              max="8"
            />
            {errors.semester && <span className={styles.error}>{errors.semester}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('[DEBUG] Fetching courses...');
      setLoading(true);
      const response = await apiService.getAll('courses?per_page=9999');
      const courseArray = response.data?.data || response.data || [];
      console.log('[DEBUG] Courses fetched:', courseArray.length);
      setCourses(courseArray);
      setError('');
    } catch (err) {
      console.error('[DEBUG] Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('[DEBUG] Fetching departments for dropdown...');
      const response = await apiService.getAll('departments?per_page=9999');
      const deptArray = response.data?.data || response.data || [];
      setDepartments(deptArray);
    } catch (err) {
      console.error('[DEBUG] Error fetching departments:', err);
    }
  };

  const handleSaveCourse = async (formData) => {
    try {
      if (selectedCourse) {
        console.log('[DEBUG] Updating course:', selectedCourse.id);
        await apiService.update('courses', selectedCourse.id, formData);
      } else {
        console.log('[DEBUG] Creating new course:', formData);
        await apiService.create('courses', formData);
      }
      await fetchCourses();
    } catch (err) {
      console.error('[DEBUG] Error saving course:', err);
      throw err;
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      console.log('[DEBUG] Deleting course:', id);
      await apiService.delete('courses', id);
      await fetchCourses();
    } catch (err) {
      console.error('[DEBUG] Error deleting course:', err);
      alert('Failed to delete course');
    }
  };

  const openModal = (course = null) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter(course =>
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Live metrics
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  const activeDepartments = new Set(courses.map(c => c.department_id)).size;
  const avgCredits = totalCourses > 0 ? (totalCredits / totalCourses).toFixed(2) : '0.00';

  return (
    <div className={styles.container}>
      {/* Breadcrumbs & Header */}
      <div className={styles.breadcrumb}>MANAGEMENT › COURSE CATALOG</div>
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Course Management</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}><ExportIcon /> Export List</button>
          <button className={styles.addCourseBtn} onClick={() => openModal()}><PlusIcon /> Add New Course</button>
        </div>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>TOTAL COURSES</span>
          <div className={styles.metricValue}>
            {totalCourses}
          </div>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>TOTAL CREDITS</span>
          <div className={styles.metricValue}>
            {totalCredits} <span style={{ fontSize: '12px', color: '#94a3b8', margin: '0 8px' }}>Hours</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>ACTIVE DEPARTMENTS</span>
          <div className={styles.metricValue}>
            {activeDepartments}
          </div>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>AVG CREDITS</span>
          <div className={styles.metricValue}>
            {avgCredits}
          </div>
        </div>
      </div>

      {/* Course Catalog Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableSearch}>
            <input
              type="text"
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerFilters}>
            <div className={styles.paginationSummary}>
              Showing {filteredCourses.length} of {courses.length}
              <span className={styles.navArrows}>
                <ChevronLeft className={styles.navArrow} />
                <ChevronRight className={styles.navArrow} />
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No courses found</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>COURSE NAME</th>
                  <th>DEPARTMENT</th>
                  <th>CREDITS</th>
                  <th>SEMESTER</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const deptName = departments.find(d => d.id === course.department_id)?.name || 'N/A';
                  return (
                    <tr key={course.id}>
                      <td className={styles.courseCode}>{course.code}</td>
                      <td>
                        <div className={styles.courseTitleWrapper}>
                          <span className={styles.courseTitle}>{course.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.deptBadge}>{deptName}</span>
                      </td>
                      <td className={styles.creditsCell}>
                        {course.credits} <span>CH</span>
                      </td>
                      <td>{course.semester || '-'}</td>
                      <td className={styles.actionsCell}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openModal(course)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveCourse}
        selectedCourse={selectedCourse}
        departments={departments}
      />
    </div>
  );
}
