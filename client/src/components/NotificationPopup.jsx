import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import styles from './NotificationPopup.module.css';

export default function NotificationPopup() {
  const { notifications, isOpen, toggleOpen, unseenCount } = useContext(NotificationContext);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'alert':
        return '⚠️';
      case 'event':
        return '📅';
      case 'scholarship':
        return '🎓';
      case 'achievement':
        return '🏆';
      case 'academic':
        return '📚';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <button 
        className={styles.notificationBtn} 
        onClick={toggleOpen}
        title="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unseenCount > 0 && (
          <span className={styles.badge}>{unseenCount > 99 ? '99+' : unseenCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.popup}>
          <div className={styles.popupHeader}>
            <h3>Notifications</h3>
            <button className={styles.closeBtn} onClick={toggleOpen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.popupContent}>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.seen ? styles.unseen : ''}`}
                >
                  <div className={styles.icon}>
                    {getCategoryIcon(notification.category)}
                  </div>
                  <div className={styles.content}>
                    <h4 className={styles.title}>{notification.title}</h4>
                    <p className={styles.summary}>
                      {notification.content.substring(0, 80)}
                      {notification.content.length > 80 ? '...' : ''}
                    </p>
                    <div className={styles.meta}>
                      <span className={styles.time}>{formatDate(notification.created_at)}</span>
                      <span className={styles.audience}>{notification.audience}</span>
                    </div>
                  </div>
                  {!notification.seen && (
                    <div className={styles.dot}></div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.empty}>
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
