import { FileText } from 'lucide-react';

/**
 * EmptyState — display when list has no data.
 * 
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} icon
 * @param {React.ReactNode} action
 */
const EmptyState = ({
  title = 'Belum ada data',
  description = 'Data yang Anda cari belum tersedia.',
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon || <FileText className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 text-center max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
