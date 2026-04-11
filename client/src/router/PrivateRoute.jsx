import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ children, requiredRole }) {
  const { user, isAuthenticated, initializing } = useAuth();

  // Wait for authentication context to initialize
  if (initializing) {
    return null; // or loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user?.role === 'student') return <Navigate to="/student" replace />;
  }

  return children;
}
