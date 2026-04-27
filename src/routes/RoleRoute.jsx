import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

/**
 * RoleRoute — restricts access to specific roles.
 * Redirects to /dashboard if user role is not in the allowed list.
 * 
 * @param {string[]} roles - array of allowed role strings
 */
const RoleRoute = ({ roles = [], children }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
