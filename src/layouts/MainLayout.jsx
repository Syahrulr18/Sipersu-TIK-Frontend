import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

/**
 * MainLayout — sidebar + header + content area.
 * Used for all authenticated pages.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div className="ml-[240px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
