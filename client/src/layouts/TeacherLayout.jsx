import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../api/apiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import styles from './Layout.module.css';

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [institutionName, setInstitutionName] = useState('Royal Academica');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    // Load settings on mount
    const loadSettings = async () => {
      try {
        const response = await apiService.getSettings();
        const settings = response.data || response;
        if (settings.institution_name) {
          setInstitutionName(settings.institution_name);
        }
        if (settings.logo_url) {
          setLogoUrl(settings.logo_url);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event) => {
      if (event.detail?.institution_name) {
        setInstitutionName(event.detail.institution_name);
      }
      if (event.detail?.logo_url) {
        setLogoUrl(event.detail.logo_url);
      }
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'MAIN MENU', type: 'section' },
    { label: 'Dashboard', path: '/teacher', icon: 'home' },
    { label: 'My Courses', path: '/teacher/courses', icon: 'courses' },
    { label: 'Attendance Entry', path: '/teacher/attendance', icon: 'attendance' },
    { label: 'Marks Entry', path: '/teacher/marks', icon: 'marks' },
    { label: 'Class Routine', path: '/teacher/routine', icon: 'class' },
    { label: 'ADMINISTRATIVE', type: 'section' },
    { label: 'Notice Posting', path: '/teacher/notices', icon: 'notices' },
  ];

  return (
    <div className={styles.layoutContainer}>
      <Sidebar 
        menuItems={menuItems} 
        title={institutionName} 
        subtitle="IUMS PORTAL"
        logoUrl={logoUrl}
        onLogout={handleLogout}
      />
      <div className={styles.mainContent}>
        <Header user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
