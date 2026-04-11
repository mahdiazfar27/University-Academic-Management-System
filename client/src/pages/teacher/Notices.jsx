import React, { useState, useEffect, useContext } from 'react';
import styles from './Notices.module.css';
import apiService from '../../api/apiService';
import { NotificationContext } from '../../context/NotificationContext';

/* ── SVG Icons ── */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export default function Notices() {
  const [formData, setFormData] = useState({
    title: '',
    courses: [],
    priority: 'normal',
    content: '',
    audience: 'students',
    category: 'announcement',
    status: 'published'
  });

  const [recentNotices, setRecentNotices] = useState([]);
  const [stats, setStats] = useState({
    activeThisWeek: 0,
    readReceiptRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get global notification context to update on new notices
  const { fetchNotifications } = useContext(NotificationContext);

  // Fetch notices on component mount
  useEffect(() => {
    fetchTeacherNotices();
  }, []);

  const fetchTeacherNotices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll('notices?per_page=10');
      
      if (data.data && Array.isArray(data.data.data)) {
        const notices = data.data.data.map(notice => ({
          id: notice.id,
          type: notice.category === 'achievement' ? 'IMPORTANT' : notice.category === 'alert' ? 'URGENT' : 'NORMAL',
          time: new Date(notice.created_at).toLocaleDateString(),
          title: notice.title,
          summary: notice.content.substring(0, 100) + '...',
          course: notice.audience === 'students' ? 'All Students' : notice.audience
        }));
        setRecentNotices(notices.reverse());
        setStats({
          activeThisWeek: notices.length,
          readReceiptRate: 94
        });
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = (course) => {
    setFormData(prev => ({ ...prev, courses: prev.courses.filter(c => c !== course) }));
  };

  const handleReset = () => {
    setFormData({ 
      title: '', 
      courses: [], 
      priority: 'normal', 
      content: '',
      audience: 'students',
      category: 'announcement',
      status: 'published'
    });
    setError('');
  };

  const handlePostNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const noticeData = {
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        category: formData.category || 'announcement',
        status: formData.status,
        expires_at: null
      };

      const response = await apiService.create('notices', noticeData);

      if (response.status === 'success') {
        setError('');
        handleReset();
        fetchTeacherNotices();
        // Refresh global notifications to show new notice immediately
        if (fetchNotifications) {
          await fetchNotifications();
        }
        alert('Notice posted successfully!');
      }
    } catch (err) {
      console.error('Error posting notice:', err);
      setError(err.message || 'Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Create Academic Notice</h1>
      <p className={styles.headerSubtitle}>Broadcast important updates, assignments, or reminders to your students.</p>

      <div className={styles.mainLayout}>
        {/* Left Column: Notice Form */}
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>NOTICE TITLE</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Mid-term Examination Schedule Update"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>TARGET COURSE / SECTION</label>
            <div className={styles.chipsContainer}>
              {formData.courses.map(course => (
                <div key={course} className={styles.chip}>
                  {course}
                  <span className={styles.removeChip} onClick={() => handleRemoveCourse(course)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                </div>
              ))}
              <button className={styles.addCourseBtn}>+ Add Course</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>PRIORITY LEVEL</label>
            <div className={styles.priorityGrid}>
              <button 
                className={`${styles.priorityBtn} ${formData.priority === 'normal' ? styles.activeNormal : ''}`}
                onClick={() => setFormData({ ...formData, priority: 'normal' })}
              >
                <CheckIcon /> Normal
              </button>
              <button 
                className={`${styles.priorityBtn} ${formData.priority === 'important' ? styles.activeImportant : ''}`}
                onClick={() => setFormData({ ...formData, priority: 'important' })}
              >
                <AlertIcon /> Important
              </button>
              <button 
                className={`${styles.priorityBtn} ${formData.priority === 'urgent' ? styles.activeUrgent : ''}`}
                onClick={() => setFormData({ ...formData, priority: 'urgent' })}
              >
                <WarningIcon /> Urgent
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>NOTICE CONTENT</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Write the detailed notice here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className={styles.formActions}>
            {error && <p style={{ color: 'red', marginRight: 'auto' }}>{error}</p>}
            <button className={styles.clearBtn} onClick={handleReset} disabled={loading}>Clear Form</button>
            <button className={styles.postBtn} onClick={handlePostNotice} disabled={loading}>
              <SendIcon /> {loading ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className={styles.sidebar}>
          <div className={`${styles.statsCard} ${styles.blueStats}`}>
            <span className={styles.statLabel}>ACTIVE THIS WEEK</span>
            <span className={styles.statValue}>{stats.activeThisWeek}</span>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${Math.min(stats.activeThisWeek * 10, 100)}%` }} />
            </div>
          </div>

          <div className={`${styles.statsCard} ${styles.whiteStats}`}>
            <span className={styles.statLabel}>READ RECEIPT RATE</span>
            <span className={styles.statValue}>{stats.readReceiptRate}%</span>
            <div className={styles.statTrend}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              +2.4%
            </div>
          </div>

          <div className={styles.recentFeedCard}>
            <div className={styles.feedHeader}>
              <span className={styles.feedTitle}>RECENTLY POSTED</span>
              <a href="#" className={styles.viewAll}>VIEW ALL</a>
            </div>
            <div className={styles.feedList}>
              {recentNotices.length > 0 ? (
                recentNotices.map((notice, idx) => (
                  <div key={idx} className={styles.feedItem}>
                    <div className={styles.itemHeader}>
                      <span className={`${styles.badge} ${styles['badge' + notice.type.charAt(0) + notice.type.slice(1).toLowerCase()]}`}>
                        {notice.type}
                      </span>
                      <span className={styles.itemTime}>{notice.time}</span>
                    </div>
                    <h4 className={styles.itemTitle}>{notice.title}</h4>
                    <p className={styles.itemSummary}>{notice.summary}</p>
                    <span className={styles.courseTag}>{notice.course}</span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  No notices yet. Post one to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
