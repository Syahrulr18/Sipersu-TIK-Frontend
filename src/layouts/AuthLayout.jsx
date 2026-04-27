import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — centered card layout for login page.
 * Matches the mockup: light gray background, centered white card.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
