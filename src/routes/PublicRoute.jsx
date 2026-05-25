import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

/**
 * PublicRoute — redirects authenticated users away from auth pages.
 * Wraps pages like login/register that should not be shown after sign-in.
 */
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
