import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiService.getAll('notices?status=published&per_page=100');
      
      if (data.data && Array.isArray(data.data.data)) {
        const noticesList = data.data.data.map(notice => ({
          id: notice.id,
          title: notice.title,
          content: notice.content,
          audience: notice.audience,
          category: notice.category,
          created_at: notice.created_at,
          created_by: notice.created_by,
          seen: localStorage.getItem(`notice_seen_${notice.id}`) === 'true'
        }));

        setNotifications(noticesList);
        
        // Calculate unseen count
        const unseenNotes = noticesList.filter(n => !n.seen).length;
        setUnseenCount(unseenNotes);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // Fetch notifications on mount and refresh every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsSeen = (noticeId) => {
    localStorage.setItem(`notice_seen_${noticeId}`, 'true');
    setNotifications(prev =>
      prev.map(n => n.id === noticeId ? { ...n, seen: true } : n)
    );
    setUnseenCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsSeen = () => {
    notifications.forEach(notice => {
      localStorage.setItem(`notice_seen_${notice.id}`, 'true');
    });
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    setUnseenCount(0);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsSeen();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unseenCount,
        isOpen,
        toggleOpen,
        markAsSeen,
        markAllAsSeen,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
