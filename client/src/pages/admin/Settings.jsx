import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import styles from './Settings.module.css';

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    institution_name: 'Royal Academica',
    tagline: 'Excellence in Educational Management',
    logo_url: ''
  });
  const [formData, setFormData] = useState({ ...settings });
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSettings();
      if (response.data) {
        setSettings(response.data);
        setFormData(response.data);
        if (response.data.logo_url) {
          setLogoPreview(response.data.logo_url);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
        setFormData(prev => ({ ...prev, logo_url: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('[Settings] Saving settings with data:', formData);
      const response = await apiService.updateSettings(formData);
      console.log('[Settings] Update response:', response);
      
      // Handle the response - extract updated data
      const updatedData = response.data || response;
      if (updatedData) {
        // Merge updated data with current settings
        const mergedSettings = {
          ...settings,
          ...updatedData
        };
        setSettings(mergedSettings);
        setFormData(mergedSettings);
        
        // Update logo preview if logo was updated
        if (updatedData.logo_url) {
          setLogoPreview(updatedData.logo_url);
        }
        
        alert('Settings saved successfully!');
        // Trigger header update by dispatching event with the merged settings
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: mergedSettings }));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      console.error('Error response:', err.response);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData({ ...settings });
    setLogoPreview(settings.logo_url || '');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.headerTitle}>System Configuration</h1>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>System Configuration</h1>
      <p className={styles.headerSubtitle}>Manage institutional identity and branding.</p>

      <div className={styles.topGrid}>
        {/* Institutional Identity */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Institutional Identity</span>
          <span className={styles.cardSubtitle}>Global brand assets for your institution</span>
          
          {/* Logo Upload */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ marginBottom: '12px', display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
              INSTITUTION LOGO
            </label>
            <div style={{ marginBottom: '12px' }}>
              {logoPreview && (
                <img 
                  src={logoPreview} 
                  alt="Logo Preview" 
                  style={{ maxWidth: '120px', maxHeight: '120px', marginBottom: '12px', borderRadius: '6px' }}
                />
              )}
            </div>
            <label htmlFor="logo-upload" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 16px', border: '2px dashed #cbd5e1', borderRadius: '6px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              <UploadIcon />
              <span>UPDATE LOGO</span>
              <input 
                id="logo-upload"
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Institution Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
              INSTITUTION NAME
            </label>
            <input 
              type="text" 
              name="institution_name"
              value={formData.institution_name}
              onChange={handleInputChange}
              className={styles.input}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Tagline */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
              TAGLINE
            </label>
            <input 
              type="text" 
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              className={styles.input}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.barActions}>
          <button 
            onClick={handleDiscard}
            className={styles.discardBtn}
            style={{
              padding: '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#475569',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={styles.saveBtn}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save System Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
