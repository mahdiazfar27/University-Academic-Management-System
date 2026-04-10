import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>Go back to home</Link>
    </div>
  );
}
