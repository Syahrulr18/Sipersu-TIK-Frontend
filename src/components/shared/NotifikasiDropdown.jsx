import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { formatTanggalRelatif } from '@/utils/formatDate';

/**
 * NotifikasiDropdown — bell icon with unread count + dropdown list.
 * 
 * @param {number} unreadCount
 * @param {Array} notifications
 * @param {function} onRead
 * @param {function} onReadAll
 */
const NotifikasiDropdown = ({
  unreadCount = 0,
  notifications = [],
  onRead,
  onReadAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (notif) => {
    if (!notif.is_read && onRead) onRead(notif.id);
    if (notif.surat_id) navigate(`/surat/${notif.surat_id}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl animate-slide-down z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifikasi</h3>
            {unreadCount > 0 && onReadAll && (
              <button
                onClick={onReadAll}
                className="text-xs text-[#8B0000] hover:underline font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Belum ada notifikasi
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`
                    w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                    ${!notif.is_read ? 'bg-yellow-50 border-l-2 border-yellow-400' : 'border-l-2 border-transparent'}
                  `}
                >
                  <p className="text-sm text-gray-800 font-medium line-clamp-1">
                    {notif.judul}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {notif.pesan}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatTanggalRelatif(notif.created_at)}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                navigate('/notifikasi');
                setIsOpen(false);
              }}
              className="w-full text-center text-sm text-[#8B0000] font-medium py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Lihat semua notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifikasiDropdown;
