import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

/**
 * PrivateRoute — redirects to /login if not authenticated.
 * Wraps children that require authentication.
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
