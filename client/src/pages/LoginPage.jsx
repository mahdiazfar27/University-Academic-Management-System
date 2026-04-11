import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

// SVG Icon for closed eye
const EyeClosedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// SVG Icon for open eye (off)
const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

// SVG Icon for graduation cap
const GraduationCapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L0 7.5V9C0 14.25 3.58 18.92 8.5 20.5C10.5 20.88 12 21 12 21S13.5 20.88 15.5 20.5C20.42 18.92 24 14.25 24 9V7.5L12 2M12 4.18L20 7.5V9C20 13.24 17.35 16.87 13.5 18.3V11L12 9.5L10.5 11V18.3C6.65 16.87 4 13.24 4 9V7.5L12 4.18Z"/>
  </svg>
);

// SVG Icon for user role (person outline)
const UserRoleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// SVG Icon for At symbol
const AtSymbolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.5 8.4"></path>
  </svg>
);

// SVG Icon for Lock
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// Chevron Down
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Headset icon
const HeadsetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'text-bottom'}}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
  </svg>
);

// Login right arrow door icon
const LoginDoorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', verticalAlign: 'middle'}}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('alexander.lewis@iums.edu');
  const [password, setPassword] = useState('teacher@123');
  const [role, setRole] = useState('teacher');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { login, loading, isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      // Replace the login page in history with dashboard
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'teacher') navigate('/teacher', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const result = await login(email, password, role);
      
      if (result && result.success) {
        // Redirect to appropriate dashboard with replace: true
        // This replaces the login page in browser history so pressing back won't show login
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'teacher') navigate('/teacher', { replace: true });
        else navigate('/student', { replace: true });
      } else {
        setErrorMessage(result?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <GraduationCapIcon />
          </div>
          <h1 className={styles.title}>IUMS Portal</h1>
          <p className={styles.subtitle}>Integrated University Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Sign In</h2>
          <p className={styles.formDescription}>Enter your credentials to access your account</p>

          {/* Error Message */}
          {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

          {/* Role Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>User Role</label>
            <div className={styles.selectWrapper}>
              <div className={styles.inputLeftIcon}>
                <UserRoleIcon />
              </div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
                disabled={loading}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <div className={styles.selectChevron}>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email or Institutional ID</label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputLeftIcon}>
                <AtSymbolIcon />
              </div>
              <input
                id="email"
                type="email"
                placeholder="e.g. j.doe@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
            </div>
            <div className={styles.passwordWrapper}>
              <div className={styles.inputLeftIcon}>
                <LockIcon />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.passwordField}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          {/* Keep Logged In Checkbox */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="remember"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              disabled={loading}
              className={styles.checkbox}
            />
            <label htmlFor="remember" className={styles.checkboxLabel}>Keep me logged in</label>
          </div>

          {/* Login Button */}
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Logging in...' : (
              <>LOGIN TO PORTAL <LoginDoorIcon /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <a href="#" className={styles.footerLink}><HeadsetIcon /> IT Help Desk: (555) 012-3456</a>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>System Status</a>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>© 2024 University Education Systems. All rights reserved.</p>
        <p>Powered by Global Education Cloud v4.2.0</p>
      </div>
    </div>
  );
}
