import useAuthStore from '@/store/authStore';
import NotifikasiDropdown from '@/components/shared/NotifikasiDropdown';
import { getRoleLabel } from '@/utils/roleHelper';

/**
 * Header — top bar with page context and user info (right-aligned).
 * Matches mockup: "Admin Jurusan" + "Teknik Informatika & Komputer"
 * 
 * @param {string} title - page title (optional, shown in breadcrumb area)
 */
const Header = ({ title }) => {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page title */}
      <div>
        {title && (
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Right: User info + notifications */}
      <div className="flex items-center gap-4">
        <NotifikasiDropdown
          unreadCount={0}
          notifications={[]}
        />

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {getRoleLabel(user?.role)} Jurusan
          </p>
          <p className="text-xs text-gray-500">
            Teknik Informatika & Komputer
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
