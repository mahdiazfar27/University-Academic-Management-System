import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../api/apiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import styles from './Layout.module.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [institutionName, setInstitutionName] = useState('Royal Academica');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    // Load settings on mount
    const loadSettings = async () => {
      try {
        console.log('[AdminLayout] Loading settings on mount...');
        const response = await apiService.getSettings();
        console.log('[AdminLayout] Settings response:', response);
        
        // API returns { status: 'success', data: { institution_name, logo_url, tagline } }
        const settings = response.data || response;
        console.log('[AdminLayout] Extracted settings:', settings);
        
        if (settings.institution_name) {
          console.log('[AdminLayout] Setting institution_name to:', settings.institution_name);
          setInstitutionName(settings.institution_name);
        }
        if (settings.logo_url) {
          console.log('[AdminLayout] Setting logo_url to:', settings.logo_url);
          setLogoUrl(settings.logo_url);
        }
      } catch (error) {
        console.error('[AdminLayout] Failed to load settings:', error);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event) => {
      console.log('[AdminLayout] Settings updated event:', event.detail);
      if (event.detail?.institution_name) {
        console.log('[AdminLayout] Updating institution_name to:', event.detail.institution_name);
        setInstitutionName(event.detail.institution_name);
      }
      if (event.detail?.logo_url) {
        console.log('[AdminLayout] Updating logo_url to:', event.detail.logo_url);
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
    { label: 'MAIN DASHBOARD', type: 'section' },
    { label: 'Dashboard', path: '/admin', icon: 'home' },
    { label: 'MANAGEMENT', type: 'section' },
    { label: 'User Management', path: '/admin/users', icon: 'profile' },
    { label: 'Department Management', path: '/admin/departments', icon: 'class' },
    { label: 'Course Management', path: '/admin/courses', icon: 'courses' },
    { label: 'Notice Management', path: '/admin/notices', icon: 'notices' },
    { label: 'SYSTEM', type: 'section' },
    { label: 'Settings', path: '/admin/settings', icon: 'settings' },
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
