import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminNotices.module.css';
import apiService from '../../api/apiService';
import { NotificationContext } from '../../context/NotificationContext';

/* ── SVG Icons ── */
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

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const BulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ConvocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ScholarshipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

/* ── Notice Form Modal ── */
function NoticeFormModal({ isOpen, onClose, onSave, selectedNotice }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'all',
    category: 'announcement',
    status: 'draft',
    expires_at: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNotice) {
      setFormData(selectedNotice);
    } else {
      setFormData({
        title: '',
        content: '',
        audience: 'all',
        category: 'announcement',
        status: 'draft',
        expires_at: '',
      });
    }
    setErrors({});
  }, [selectedNotice, isOpen]);

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
        alert(error.response?.data?.message || 'Error saving notice');
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
          <h2>{selectedNotice ? 'Edit Notice' : 'Compose New Notice'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notice title"
              maxLength="255"
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your notice content here..."
              rows="6"
            />
            {errors.content && <span className={styles.error}>{errors.content}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Audience *</label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
              >
                <option value="all">All Users</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
              {errors.audience && <span className={styles.error}>{errors.audience}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="scholarship">Scholarship</option>
                <option value="event">Event</option>
                <option value="academic">Academic</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <span className={styles.error}>{errors.category}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && <span className={styles.error}>{errors.status}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Expires At</label>
              <input
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
              />
              {errors.expires_at && <span className={styles.error}>{errors.expires_at}</span>}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Saving...' : (selectedNotice ? 'Update Notice' : 'Publish Notice')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, categories: 0 });
  
  // Get global notification context to update on new notices
  const { fetchNotifications } = useContext(NotificationContext);

  useEffect(() => {
    fetchNotices();
    fetchStats();
  }, []);

  const fetchNotices = async () => {
    try {
      console.log('[DEBUG] Fetching notices...');
      setLoading(true);
      const response = await apiService.getAll('notices?per_page=9999');
      const noticeArray = response.data?.data || response.data || [];
      console.log('[DEBUG] Notices fetched:', noticeArray.length);
      setNotices(noticeArray);
      setError('');
    } catch (err) {
      console.error('[DEBUG] Error fetching notices:', err);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('[DEBUG] Fetching notice stats...');
      const response = await apiService.getAll('notices-stats');
      setStats(response.data || { total: 0, published: 0, draft: 0, categories: 0 });
    } catch (err) {
      console.error('[DEBUG] Error fetching stats:', err);
    }
  };

  const handleSaveNotice = async (formData) => {
    try {
      if (selectedNotice) {
        console.log('[DEBUG] Updating notice:', selectedNotice.id);
        await apiService.update('notices', selectedNotice.id, formData);
      } else {
        console.log('[DEBUG] Creating new notice:', formData);
        await apiService.create('notices', formData);
      }
      await fetchNotices();
      await fetchStats();
      // Refresh global notifications to show new/updated notice immediately
      if (fetchNotifications) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('[DEBUG] Error saving notice:', err);
      throw err;
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      console.log('[DEBUG] Deleting notice:', id);
      await apiService.delete('notices', id);
      await fetchNotices();
      await fetchStats();
      // Refresh global notifications after deletion
      if (fetchNotifications) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('[DEBUG] Error deleting notice:', err);
      alert('Failed to delete notice');
    }
  };

  const openModal = (notice = null) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'event':
        return <ConvocationIcon />;
      case 'alert':
        return <AlertIcon />;
      case 'scholarship':
        return <ScholarshipIcon />;
      default:
        return <BulbIcon />;
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.reference_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Notice Management</h1>
          <p>Broadcast important information across the network.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.filterBtn}><FilterIcon /> Filter</button>
          <button className={styles.composeBtn} onClick={() => openModal()}><PlusIcon /> Compose Notice</button>
        </div>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.mainLayout}>
        {/* Left Column: Notice Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableSearch}>
            <input
              type="text"
              placeholder="Search by title or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {loading ? (
            <div className={styles.loadingState}>Loading notices...</div>
          ) : filteredNotices.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No notices found</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>NOTICE DETAILS</th>
                    <th>AUDIENCE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotices.map(notice => (
                    <tr key={notice.id}>
                      <td>
                        <div className={styles.noticeDetailCell}>
                          <div className={`${styles.iconBox} ${styles[notice.category + 'Icon']}`}>
                            {getCategoryIcon(notice.category)}
                          </div>
                          <div className={styles.noticeText}>
                            <span className={styles.noticeTitle}>{notice.title}</span>
                            <span className={styles.noticeRef}>Ref: {notice.reference_code}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles['badge' + (notice.audience === 'all' ? 'All' : notice.audience.charAt(0).toUpperCase() + notice.audience.slice(1))]}`}>
                          {notice.audience.charAt(0).toUpperCase() + notice.audience.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${notice.status === 'published' ? styles.published : (notice.status === 'draft' ? styles.draft : styles.archived)}`}>
                          {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.actionIcon}
                          onClick={() => openModal(notice)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className={`${styles.actionIcon} ${styles.deleteIcon}`}
                          onClick={() => handleDeleteNotice(notice.id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.tableFooter}>
            <span className={styles.resultCount}>Showing {filteredNotices.length} of {notices.length} notices</span>
          </div>
        </div>

        {/* Right Column: Stats & Tip */}
        <div className={styles.sidebar}>
          <div className={styles.statsCard}>
            <div className={styles.statsTitle}>Quick Stats</div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Notices</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Published</span>
              <span className={styles.statValue}>{stats.published}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Drafts</span>
              <span className={styles.statValue}>{stats.draft}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Categories</span>
              <span className={styles.statValue}>{stats.categories}</span>
            </div>
          </div>

          <div className={styles.proTipCard}>
            <BulbIcon />
            <div className={styles.proTipContent}>
              <h4>Pro Tip</h4>
              <p>Publishing notices on weekday mornings increases visibility and engagement rates by up to 40%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Form Modal */}
      <NoticeFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveNotice}
        selectedNotice={selectedNotice}
      />
    </div>
  );
}
