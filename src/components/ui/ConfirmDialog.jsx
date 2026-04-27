import { AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * ConfirmDialog — confirmation overlay before destructive actions.
 * 
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string} title
 * @param {string} message
 * @param {'danger'|'primary'|'success'} variant
 * @param {string} confirmText
 * @param {string} cancelText
 * @param {boolean} loading
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  variant = 'danger',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  loading = false,
}) => {
  if (!isOpen) return null;

  const iconColors = {
    danger: 'bg-red-100 text-red-600',
    primary: 'bg-red-100 text-[#8B0000]',
    success: 'bg-green-100 text-green-600',
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${iconColors[variant]}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'success' ? 'success' : variant === 'primary' ? 'primary' : 'danger'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
