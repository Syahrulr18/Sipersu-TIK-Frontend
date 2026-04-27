import { getStatusConfig } from '@/utils/formatStatus';

/**
 * StatusBadge — renders a colored badge for surat status.
 * 
 * @param {string} status - one of: draft, menunggu_verifikasi, diverifikasi, ditolak, terbit
 * @param {'sm'|'md'} size
 */
const Badge = ({ status, size = 'md', className = '' }) => {
  const config = getStatusConfig(status);

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${config.className}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

export default Badge;
