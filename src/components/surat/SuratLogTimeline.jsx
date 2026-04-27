import { CheckCircle, XCircle, Clock, Send, Edit3, PenTool } from 'lucide-react';
import { formatTanggalFull } from '@/utils/formatDate';

/**
 * SuratLogTimeline — vertical timeline showing surat status history.
 * 
 * @param {Array} logs - array of { status, user_name, tanggal, catatan }
 */
const SuratLogTimeline = ({ logs = [] }) => {
  const getIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Edit3 className="w-4 h-4" />;
      case 'menunggu_verifikasi':
        return <Send className="w-4 h-4" />;
      case 'diverifikasi':
        return <CheckCircle className="w-4 h-4" />;
      case 'ditolak':
        return <XCircle className="w-4 h-4" />;
      case 'terbit':
        return <PenTool className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'terbit':
      case 'diverifikasi':
        return 'bg-green-500 text-white';
      case 'menunggu_verifikasi':
        return 'bg-blue-500 text-white';
      case 'ditolak':
        return 'bg-red-500 text-white';
      case 'draft':
        return 'bg-gray-300 text-gray-600';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft dibuat',
      menunggu_verifikasi: 'Dikirim ke verifikator',
      diverifikasi: 'Diverifikasi',
      ditolak: 'Ditolak',
      terbit: 'Ditandatangani & diterbitkan',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-0">
      {logs.map((log, index) => (
        <div key={index} className="flex gap-3">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getDotColor(log.status)}`}>
              {getIcon(log.status)}
            </div>
            {index < logs.length - 1 && (
              <div className="w-0.5 h-full min-h-[40px] bg-gray-200" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6">
            <p className="text-sm font-medium text-gray-900">
              {getStatusLabel(log.status)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {log.user_name} • {formatTanggalFull(log.tanggal)}
            </p>
            {log.catatan && (
              <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded-md px-3 py-2 border-l-2 border-gray-300">
                {log.catatan}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuratLogTimeline;
