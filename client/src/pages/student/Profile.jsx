import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const CapFaintIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L1 7l11 5 11-5-11-5zM2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6l-10 5-10-5z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Personal info (from User table)
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    religion: '',
    blood_group: '',
    phone_number: '',
    // Guardian info (from Student table)
    father_name: '',
    mother_name: '',
    // Academic info (from Student table)
    student_id: '',
    current_semester: '',
    admission_year: '',
    admission_semester: '',
    program: '',
    cgpa: 0,
    enrollment_status: '',
    // User profile
    profile_image_url: '',
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await apiService.request('/student/profile');
        const data = response.data;
        
        console.log('Profile data:', data);
        
        // Extract user and student data
        const user = data.user || {};
        const department = data.department || {};
        
        const profileData = {
          // Personal info (from user)
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          gender: user.gender || '',
          date_of_birth: user.date_of_birth || '',
          religion: user.religion || '',
          blood_group: user.blood_group || '',
          phone_number: user.phone_number || '',
          // Guardian info (from student)
          father_name: data.father_name || '',
          mother_name: data.mother_name || '',
          // Academic info (from student)
          student_id: data.student_id || '',
          current_semester: data.current_semester || '',
          admission_year: data.admission_year || '',
          admission_semester: data.admission_semester || '',
          program: department.name || 'N/A',
          cgpa: data.cgpa || 0,
          enrollment_status: data.enrollment_status || 'active',
          // Profile image
          profile_image_url: user.profile_image_url || '',
        };
        
        setFormData(profileData);
        setOriginalData(profileData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Prepare data to send - only changed fields
      const dataToSend = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          dataToSend[key] = formData[key];
        }
      });
      
      if (Object.keys(dataToSend).length === 0) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        return;
      }
      
      console.log('Saving data:', dataToSend);
      
      const response = await apiService.request('/student/profile/update', {
        method: 'POST',
        body: JSON.stringify(dataToSend)
      });
      
      // Update original data to reflect saved changes
      setOriginalData(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle discard
  const handleDiscardChanges = () => {
    setFormData(originalData);
  };

  if (loading) {
    return <div className={styles.profileContainer}><p>Loading...</p></div>;
  }

  const fullName = `${formData.first_name} ${formData.last_name}`.trim();

  return (
    <div className={styles.profileContainer}>
      {/* Alert Banner */}
      {showAlert && (
        <div className={styles.alertBanner}>
          <div className={styles.alertContent}>
            <InfoIcon />
            <div>
              <strong>Update Required</strong><br/>
              Please ensure your personal information is accurate for the upcoming semester registration. Contact the helpdesk if you find any discrepancies.
            </div>
          </div>
          <button className={styles.alertClose} onClick={() => setShowAlert(false)}>
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Success Banner */}
      {savedSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ✓ Profile updated successfully
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '12px 20px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ✗ {error}
        </div>
      )}

      {/* Breadcrumb & Title */}
      <div className={styles.breadcrumb}>Portal / Student Profile</div>
      <h1 className={styles.pageTitle}>Student Profile</h1>

      <div className={styles.mainGrid}>
        
        {/* LEFT COLUMN: Tabs & Form */}
        <div className={styles.formCard}>
          <div className={styles.tabHeader}>
            {['Personal', 'Academic', 'Guardian', 'Contact'].map(tab => (
              <button 
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.formBody}>
            <form className={styles.formGrid}>
              {/* PERSONAL TAB */}
              {activeTab === 'Personal' && (
                <>
                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>FULL NAME</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={fullName}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>FIRST NAME</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>LAST NAME</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>GENDER</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <select 
                        className={styles.select}
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        style={{ width: '100%', appearance: 'none' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }}>
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>DATE OF BIRTH</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="date"
                        className={styles.input}
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                      />
                      <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }}>
                        <CalendarIcon />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>RELIGION</label>
                    <input 
                      type="text"
                      className={styles.input}
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>BLOOD GROUP</label>
                    <input 
                      type="text"
                      className={styles.input}
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>PHONE NUMBER</label>
                    <input 
                      type="tel"
                      className={styles.input}
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {/* ACADEMIC TAB */}
              {activeTab === 'Academic' && (
                <>
                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>STUDENT ID</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={formData.student_id}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>PROGRAM</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={formData.program}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>CURRENT SEMESTER</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={formData.current_semester && `${formData.current_semester}${['st', 'nd', 'rd'][formData.current_semester - 1] || 'th'} Semester`}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>ADMISSION YEAR</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={formData.admission_year}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>CGPA</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={parseFloat(formData.cgpa).toFixed(2)}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>ENROLLMENT STATUS</label>
                    <input 
                      type="text"
                      className={styles.input}
                      value={formData.enrollment_status}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default', textTransform: 'capitalize' }}
                    />
                  </div>
                </>
              )}

              {/* GUARDIAN TAB */}
              {activeTab === 'Guardian' && (
                <>
                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>FATHER'S NAME</label>
                    <input 
                      type="text"
                      className={styles.input}
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>MOTHER'S NAME</label>
                    <input 
                      type="text"
                      className={styles.input}
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <p style={{ gridColumn: 'span 2', color: '#666', fontSize: '14px', marginTop: '10px' }}>
                    Note: Contact information for guardians can be updated in the Contact section if available.
                  </p>
                </>
              )}

              {/* CONTACT TAB */}
              {activeTab === 'Contact' && (
                <>
                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>PHONE NUMBER</label>
                    <input 
                      type="tel"
                      className={styles.input}
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>EMAIL ADDRESS</label>
                    <input 
                      type="email"
                      className={styles.input}
                      value={formData.email || 'N/A'}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                    />
                  </div>

                  <p style={{ gridColumn: 'span 2', color: '#666', fontSize: '14px', marginTop: '10px' }}>
                    To update contact information, please contact the student affairs office. Email address cannot be changed through this form.
                  </p>
                </>
              )}
            </form>

            <div className={styles.formFooter}>
              <button 
                className={styles.discardBtn}
                onClick={handleDiscardChanges}
              >
                Discard Changes
              </button>
              <button 
                className={styles.saveBtn}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Widgets */}
        <div className={styles.rightCol}>
          
          {/* Profile Card */}
          <div className={styles.widgetCard}>
            <div className={styles.avatarCard}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarIcon}>
                  {/* Male Avatar Placeholder SVG approx */}
                  <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
                    <path d="M50 45C58.2843 45 65 38.2843 65 30C65 21.7157 58.2843 15 50 15C41.7157 15 35 21.7157 35 30C35 38.2843 41.7157 45 50 45Z" fill="#e5b481"/>
                    <path d="M75 75C75 61.1929 63.8071 50 50 50C36.1929 50 25 61.1929 25 75V100H75V75Z" fill="#1e3a8a"/>
                    <path d="M35 25C35 25 40 18 50 18C60 18 65 25 65 25" stroke="#333" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                </div>
                <button className={styles.editAvatarBtn}>
                  <CameraIcon />
                </button>
              </div>
              <h2 className={styles.studentName}>{fullName || 'Student'}</h2>
              <div className={styles.statusBadge}>{formData.enrollment_status === 'active' ? 'Active Student' : formData.enrollment_status}</div>

              <div className={styles.detailTable}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Student ID</span>
                  <span className={styles.detailValue}>{formData.student_id || 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Semester</span>
                  <span className={styles.detailValue}>{formData.current_semester && `${formData.current_semester}${['st', 'nd', 'rd'][formData.current_semester - 1] || 'th'} Semester`}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Admission Year</span>
                  <span className={styles.detailValue}>{formData.admission_year || 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Program</span>
                  <span className={styles.detailValue}>{formData.program || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Standing */}
          <div className={`${styles.widgetCard} ${styles.standingCard}`}>
            <div className={styles.standingLabel}>ACADEMIC STANDING</div>
            <div className={styles.standingValue}>
              <span className={styles.standingGpa}>{formData.cgpa ? parseFloat(formData.cgpa).toFixed(2) : '0.00'}</span>
              <span className={styles.standingUnit}>CGPA</span>
            </div>
            <div className={styles.standingIcon}>
              <CapFaintIcon />
            </div>
          </div>

          {/* Profile Completion */}
          <div className={styles.widgetCard}>
            <div className={styles.completionHeader}>
              <span className={styles.completionLabel}>PROFILE COMPLETION</span>
              <span className={styles.completionValue}>85%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: '85%' }}></div>
            </div>
            <p className={styles.completionInfo}>
              Add <a href="#" className={styles.completionLink}>Passport Copy</a> and <a href="#" className={styles.completionLink}>Health Certificate</a> to complete your profile.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
