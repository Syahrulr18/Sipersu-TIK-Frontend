/**
 * Role configuration and permission helpers.
 */

export const ROLES = {
  ADMINISTRATOR: 'administrator',
  VERIFIKATOR: 'verifikator',
  KAJUR: 'kajur',
  DOSEN: 'dosen',
};

export const ROLE_LABELS = {
  [ROLES.ADMINISTRATOR]: 'Administrator',
  [ROLES.VERIFIKATOR]: 'Verifikator',
  [ROLES.KAJUR]: 'Ketua Jurusan',
  [ROLES.DOSEN]: 'Dosen',
};

/**
 * Get user-friendly role label.
 * @param {string} role
 * @returns {string}
 */
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

/**
 * Check if user has one of the given roles.
 * @param {object} user
 * @param {string[]} roles
 * @returns {boolean}
 */
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

/**
 * Check if user is administrator.
 * @param {object} user
 * @returns {boolean}
 */
export const isAdmin = (user) => hasRole(user, [ROLES.ADMINISTRATOR]);

/**
 * Check if user is verifikator.
 * @param {object} user
 * @returns {boolean}
 */
export const isVerifikator = (user) => hasRole(user, [ROLES.VERIFIKATOR]);

/**
 * Check if user is kajur.
 * @param {object} user
 * @returns {boolean}
 */
export const isKajur = (user) => hasRole(user, [ROLES.KAJUR]);

/**
 * Get sidebar menu items based on role.
 * @param {string} role
 * @returns {Array}
 */
export const getSidebarMenu = (role) => {
  const menus = {
    [ROLES.ADMINISTRATOR]: [
      { section: 'MENU UTAMA', items: [
        { label: 'Beranda', path: '/dashboard', icon: 'Home' },
        { label: 'Terkirim', path: '/surat', icon: 'Send' },
        { label: 'Notifikasi', path: '/notifikasi', icon: 'Bell' },
      ]},
      { section: 'PENGATURAN', items: [
        { label: 'Profil', path: '/profil', icon: 'User' },
        { label: 'Panduan', path: '/panduan', icon: 'BookOpen' },
        { label: 'Bantuan', path: '/bantuan', icon: 'HelpCircle' },
      ]},
    ],
    [ROLES.VERIFIKATOR]: [
      { section: 'MENU UTAMA', items: [
        { label: 'Beranda', path: '/dashboard', icon: 'Home' },
        { label: 'Antrian Verifikasi', path: '/verifikasi', icon: 'ClipboardCheck', badge: true },
        { label: 'Terkirim', path: '/surat', icon: 'Send' },
        { label: 'Notifikasi', path: '/notifikasi', icon: 'Bell' },
      ]},
      { section: 'PENGATURAN', items: [
        { label: 'Profil', path: '/profil', icon: 'User' },
        { label: 'Panduan', path: '/panduan', icon: 'BookOpen' },
        { label: 'Bantuan', path: '/bantuan', icon: 'HelpCircle' },
      ]},
    ],
    [ROLES.KAJUR]: [
      { section: 'MENU UTAMA', items: [
        { label: 'Beranda', path: '/dashboard', icon: 'Home' },
        { label: 'Antrian TTD', path: '/tandatangan', icon: 'PenTool', badge: true },
        { label: 'Terkirim', path: '/surat', icon: 'Send' },
        { label: 'Notifikasi', path: '/notifikasi', icon: 'Bell' },
      ]},
      { section: 'PENGATURAN', items: [
        { label: 'Profil', path: '/profil', icon: 'User' },
        { label: 'Panduan', path: '/panduan', icon: 'BookOpen' },
        { label: 'Bantuan', path: '/bantuan', icon: 'HelpCircle' },
      ]},
    ],
    [ROLES.DOSEN]: [
      { section: 'MENU UTAMA', items: [
        { label: 'Beranda', path: '/dashboard', icon: 'Home' },
        { label: 'Terkirim', path: '/surat', icon: 'Send' },
        { label: 'Notifikasi', path: '/notifikasi', icon: 'Bell' },
      ]},
      { section: 'PENGATURAN', items: [
        { label: 'Profil', path: '/profil', icon: 'User' },
        { label: 'Panduan', path: '/panduan', icon: 'BookOpen' },
        { label: 'Bantuan', path: '/bantuan', icon: 'HelpCircle' },
      ]},
    ],
  };

  return menus[role] || menus[ROLES.DOSEN];
};
