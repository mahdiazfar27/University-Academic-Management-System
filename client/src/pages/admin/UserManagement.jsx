import React, { useState, useEffect } from 'react';
import styles from './UserManagement.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="18" y1="8" x2="23" y2="8"></line>
    <line x1="20.5" y1="5.5" x2="20.5" y2="10.5"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const FacultyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const HourglassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 2h14"></path>
    <path d="M5 22h14"></path>
    <path d="M19 2l-7 7-7-7"></path>
    <path d="M5 22l7-7 7 7"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1.5"></circle>
    <circle cx="12" cy="12" r="1.5"></circle>
    <circle cx="12" cy="19" r="1.5"></circle>
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Modal Component
function UserFormModal({ isOpen, user, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'student',
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      // Editing existing user - pre-fill form
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'student',
        status: user.status || 'active'
      });
    } else {
      // Creating new user - reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        status: 'active'
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean form data - only send allowed fields and remove empty password fields if editing
    const cleanData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };
    
    // Add password only if provided
    if (formData.password) {
      cleanData.password = formData.password;
      cleanData.password_confirmation = formData.password_confirmation;
    }
    
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
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
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
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
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

          {!user && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  required={!user}
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
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation || ''}
                  onChange={handleChange}
                  required={!user}
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
            </>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Role *
            </label>
            <select
              name="role"
              value={formData.role || 'student'}
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
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
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
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    admins: 0,
    teachers: 0,
    students: 0
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[DEBUG] Starting fetchUsers...');
      
      // Request all users (large per_page limit to bypass pagination)
      const response = await apiService.getAll('users?per_page=9999');
      console.log('[DEBUG] API response received:', response);
      
      // Handle paginated response from backend
      const userArray = response.data?.data || response.data || [];
      console.log('[DEBUG] Extracted user array:', userArray);
      console.log('[DEBUG] User array length:', userArray.length);
      
      // Compute full name from first_name and last_name
      const usersWithFullName = userArray.map(u => ({
        ...u,
        name: `${u.first_name} ${u.last_name}`.trim() || u.email
      }));
      
      console.log('[DEBUG] Users with full names:', usersWithFullName);
      
      setUsers(usersWithFullName);
      
      // Calculate metrics
      const adminCount = usersWithFullName.filter(u => u.role === 'admin').length;
      const teacherCount = usersWithFullName.filter(u => u.role === 'teacher').length;
      const studentCount = usersWithFullName.filter(u => u.role === 'student').length;
      
      console.log('[DEBUG] Metrics - Total:', usersWithFullName.length, 'Admins:', adminCount, 'Teachers:', teacherCount, 'Students:', studentCount);
      
      setMetrics({
        total: usersWithFullName.length,
        admins: adminCount,
        teachers: teacherCount,
        students: studentCount
      });
    } catch (err) {
      console.error('[DEBUG] Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;
    
    if (activeTab === 'Administrators') {
      filtered = users.filter(u => u.role === 'admin');
    } else if (activeTab === 'Teachers') {
      filtered = users.filter(u => u.role === 'teacher');
    } else if (activeTab === 'Students') {
      filtered = users.filter(u => u.role === 'student');
    }
    
    return filtered;
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiService.delete('users', userId);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      setSaving(true);
      console.log('[DEBUG] handleSaveUser started with formData:', formData);
      console.log('[DEBUG] selectedUser:', selectedUser);
      
      let result;
      
      if (selectedUser) {
        // Update existing user
        console.log('[DEBUG] Updating user ID:', selectedUser.id);
        result = await apiService.update('users', selectedUser.id, formData);
        console.log('[DEBUG] Update response:', result);
      } else {
        // Create new user
        console.log('[DEBUG] Creating new user');
        result = await apiService.create('users', formData);
        console.log('[DEBUG] Create response:', result);
      }
      
      console.log('[DEBUG] Closing modal and clearing selection');
      // Close modal first
      setShowModal(false);
      setSelectedUser(null);
      
      // Then refresh the user list
      console.log('[DEBUG] Calling fetchUsers to refresh list');
      await fetchUsers();
      console.log('[DEBUG] User list refreshed after save');
      
    } catch (err) {
      console.error('[DEBUG] Error saving user:', err);
      
      // Show validation errors if available
      let errorMsg = 'Failed to save user';
      if (err.validationErrors) {
        const errorList = Object.entries(err.validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMsg = 'Validation errors:\n' + errorList;
        console.error('Validation errors:', err.validationErrors);
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else {
        errorMsg = err.message;
      }
      
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>User Management</h1>
          <p>Manage institutional access, roles, and department permissions.</p>
        </div>
        <button className={styles.addUserBtn} onClick={handleAddUser}>
          <UserPlusIcon /> Add New User
        </button>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><UsersIcon /></div>
            <span className={styles.trendBadge}>Live</span>
          </div>
          <div>
            <span className={styles.metricValue}>{metrics.total}</span>
            <span className={styles.metricLabel}>Total Active Users</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><ShieldIcon /></div>
          </div>
          <div>
            <span className={styles.metricValue}>{metrics.admins}</span>
            <span className={styles.metricLabel}>System Administrators</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><FacultyIcon /></div>
          </div>
          <div>
            <span className={styles.metricValue}>{metrics.teachers}</span>
            <span className={styles.metricLabel}>Faculty Members</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.iconBox}><HourglassIcon /></div>
          </div>
          <div>
            <span className={styles.metricValue}>{metrics.students}</span>
            <span className={styles.metricLabel}>Student Accounts</span>
          </div>
        </div>
      </div>

      {/* Main Content Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tabs}>
            {['All Users', 'Administrators', 'Teachers', 'Students'].map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn}><FilterIcon /> Filter</button>
            <button className={styles.actionBtn}><ExportIcon /> Export</button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Loading users...
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No users found
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>USER DETAILS</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>EMAIL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userDetails}>
                        <div className={styles.avatar}>{user.name?.charAt(0)?.toUpperCase() || '?'}</div>
                        <div className={styles.info}>
                          <span className={styles.name}>{user.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles['role' + (user.role?.charAt(0).toUpperCase() + user.role?.slice(1))]}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className={`${styles.statusCell} ${styles[user.status?.toLowerCase()]}`}>
                        <div className={`${styles.statusDot} ${styles[user.status?.toLowerCase() + 'Dot']}`} />
                        {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                      </div>
                    </td>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditUser(user)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#3b82f6'
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredUsers.length > 0 && (
          <div className={styles.tableFooter}>
            <span className={styles.showingText}>Showing {filteredUsers.length} of {users.length} users</span>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showModal}
        user={selectedUser}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
        loading={saving}
      />
    </div>
  );
}
