/**
 * Status configuration for surat badges.
 * Maps status key → { label, className }
 */
const STATUS_MAP = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600',
    dotColor: 'bg-gray-400',
  },
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    className: 'bg-yellow-100 text-yellow-700',
    dotColor: 'bg-yellow-500',
  },
  diverifikasi: {
    label: 'Terverifikasi',
    className: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-500',
  },
  ditolak: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500',
  },
  terbit: {
    label: 'Terbit',
    className: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-500',
  },
};

/**
 * Get status config by key.
 * @param {string} status
 * @returns {{ label: string, className: string, dotColor: string }}
 */
export const getStatusConfig = (status) => {
  return STATUS_MAP[status] || STATUS_MAP.draft;
};

/**
 * Get status label by key.
 * @param {string} status
 * @returns {string}
 */
export const getStatusLabel = (status) => {
  return getStatusConfig(status).label;
};

/**
 * Get all available statuses for filter dropdowns.
 * @returns {Array<{value: string, label: string}>}
 */
export const getStatusOptions = () => {
  return Object.entries(STATUS_MAP).map(([value, { label }]) => ({
    value,
    label,
  }));
};

export default STATUS_MAP;
