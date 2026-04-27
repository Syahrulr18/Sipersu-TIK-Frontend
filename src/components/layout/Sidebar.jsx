import { NavLink, useLocation } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import useAuthStore from '@/store/authStore';
import { getSidebarMenu } from '@/utils/roleHelper';
import {
  Home, Send, Bell, User, BookOpen, HelpCircle,
  ClipboardCheck, PenTool, LogOut, Mail
} from 'lucide-react';

const iconMap = {
  Home, Send, Bell, User, BookOpen, HelpCircle,
  ClipboardCheck, PenTool,
};

/**
 * Sidebar — matches the mockup with dark-red header, avatar, grouped menus.
 */
const Sidebar = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const role = user?.role || 'dosen';
  const menuGroups = getSidebarMenu(role);

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo header — dark red */}
      <div className="bg-[#8B0000] px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm tracking-wide">SIPERSU TIK</h1>
          <p className="text-white/70 text-[10px]">PNUP</p>
        </div>
      </div>

      {/* User avatar section */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
          <div className="w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nama_lengkap || 'User'}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {user?.role || 'user'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {menuGroups.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || Home;
                const isActive = location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${isActive
                          ? 'bg-[#8B0000] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          !
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
