import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../api/apiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import styles from './Layout.module.css';

export default function StudentLayout() {
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
    { type: 'section', label: 'MAIN MENU' },
    { label: 'User Home', path: '/student', icon: 'home' },
    { label: 'Student Profile', path: '/student/profile', icon: 'profile' },
    { label: 'Result', path: '/student/results', icon: 'result' },
    { label: 'Name & Other Correction', path: '/student/name-correction', icon: 'edit' },
    { type: 'section', label: 'FINANCE' },
    { label: 'Payments', path: '/student/payments', icon: 'payment' },
    { type: 'section', label: 'ACADEMIC' },
    { label: 'Class Routine', path: '/student/class-routine', icon: 'class' },
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
