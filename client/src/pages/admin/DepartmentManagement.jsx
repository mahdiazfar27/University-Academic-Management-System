import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import styles from './DepartmentManagement.module.css';

/* ── SVG Icons ── */
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const DeptsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
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

const AvgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Department Form Modal
function DepartmentFormModal({ isOpen, department, onClose, onSave, loading, users }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head_id: ''
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        description: department.description || '',
        head_id: department.head_id || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        head_id: ''
      });
    }
  }, [department, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      head_id: formData.head_id || null
    };
    onSave(cleanData);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            {department ? 'Edit Department' : 'Add New Department'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Computer Science"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Department Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="e.g., CS"
              maxLength="5"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Department description"
              rows="3"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Head of Department
            </label>
            <select
              name="head_id"
              value={formData.head_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select a teacher...</option>
              {users.filter(u => u.role === 'teacher').map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#475569',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    totalFaculty: 0,
    totalCourses: 0,
    avgCourses: 0
  });

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAll('departments?per_page=9999');
      const deptArray = response.data?.data || response.data || [];
      
      setDepartments(deptArray);
      
      // Calculate metrics
      const totalFaculty = deptArray.reduce((sum, d) => sum + (d.teachers_count || 0), 0);
      const totalCourses = deptArray.reduce((sum, d) => sum + (d.courses_count || 0), 0);
      const avgCourses = deptArray.length > 0 ? (totalCourses / deptArray.length).toFixed(1) : 0;
      
      setMetrics({
        total: deptArray.length,
        totalFaculty,
        totalCourses,
        avgCourses
      });
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getAll('users?per_page=9999');
      const userArray = response.data?.data || response.data || [];
      setUsers(userArray);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDept(null);
    setShowModal(true);
  };

  const handleEditDepartment = (dept) => {
    setSelectedDept(dept);
    setShowModal(true);
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await apiService.delete('departments', deptId);
      console.log('[DEBUG] Department deleted');
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Failed to delete department');
    }
  };

  const handleSaveDepartment = async (formData) => {
    try {
      setSaving(true);
      console.log('[DEBUG] Saving department:', formData);
      
      if (selectedDept) {
        await apiService.update('departments', selectedDept.id, formData);
        console.log('[DEBUG] Department updated');
      } else {
        await apiService.create('departments', formData);
        console.log('[DEBUG] Department created');
      }
      
      setShowModal(false);
      setSelectedDept(null);
      await fetchDepartments();
      console.log('[DEBUG] Departments refreshed');
      
    } catch (err) {
      console.error('[DEBUG] Error saving department:', err);
      
      let errorMsg = 'Failed to save department';
      if (err.validationErrors) {
        const errorList = Object.entries(err.validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMsg = 'Validation errors:\n' + errorList;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getHeadName = (headId) => {
    // Convert both to number for comparison since headId comes from API as string
    const headIdNum = parseInt(headId, 10);
    const user = users.find(u => parseInt(u.id, 10) === headIdNum);
    return user ? `${user.first_name} ${user.last_name}` : 'Unassigned';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Department Management</h1>
          <p>Configure academic hierarchies and administrative oversight.</p>
        </div>
        <button className={styles.addUserBtn} onClick={handleAddDepartment}>
          <PlusIcon /> Add Department
        </button>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.iconBox} ${styles.blueIcon}`}><DeptsIcon /></div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>TOTAL DEPARTMENTS</span>
            <span className={styles.metricValue}>{metrics.total}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.iconBox} ${styles.greenIcon}`}><FacultyIcon /></div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>TOTAL FACULTY</span>
            <span className={styles.metricValue}>{metrics.totalFaculty}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.iconBox} ${styles.orangeIcon}`}><CourseIcon /></div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>TOTAL COURSES</span>
            <span className={styles.metricValue}>{metrics.totalCourses}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.iconBox} ${styles.purpleIcon}`}><AvgIcon /></div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>AVG COURSES/DEPT</span>
            <span className={styles.metricValue}>{metrics.avgCourses}</span>
          </div>
        </div>
      </div>

      {/* Department Directory */}
      <div className={styles.directoryCard}>
        <div className={styles.directoryHeader}>
          <h2>Department Directory</h2>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading departments...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DEPARTMENT NAME</th>
                  <th>CODE</th>
                  <th>HEAD</th>
                  <th>FACULTY</th>
                  <th>COURSES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div className={styles.deptCell}>
                        <span className={styles.deptName}>{dept.name}</span>
                        {dept.description && <span className={styles.deptDesc}>{dept.description}</span>}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: '#3b82f6' }}>{dept.code}</span>
                    </td>
                    <td>{getHeadName(dept.head_id)}</td>
                    <td className={styles.countCell}>{dept.teachers_count || 0}</td>
                    <td className={styles.countCell}>{dept.courses_count || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditDepartment(dept)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#3b82f6'
                          }}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#ef4444'
                          }}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {departments.length === 0 && !loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No departments found. Create one to get started!
          </div>
        )}
      </div>

      {/* Modal */}
      <DepartmentFormModal
        isOpen={showModal}
        department={selectedDept}
        onClose={() => {
          setShowModal(false);
          setSelectedDept(null);
        }}
        onSave={handleSaveDepartment}
        loading={saving}
        users={users}
      />
    </div>
  );
}
