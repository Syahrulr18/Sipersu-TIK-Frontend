import Badge from '@/components/ui/Badge';
import NomorSurat from './NomorSurat';
import { formatTanggalShort } from '@/utils/formatDate';
import { Eye, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * SuratTable — renders surat list in table format matching the mockup.
 * 
 * @param {Array} data
 * @param {boolean} loading
 * @param {function} onDelete
 * @param {boolean} showActions
 */
const SuratTable = ({
  data = [],
  loading = false,
  onDelete,
  showActions = true,
}) => {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-12">
            No
          </th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
            No. Surat / Tanggal
          </th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
            Hal / Perihal
          </th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
            Status
          </th>
          {showActions && (
            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
              Aksi
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((surat, index) => (
          <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-4 text-sm text-gray-500">{index + 1}</td>
            <td className="px-4 py-4">
              <div className="font-semibold text-sm text-gray-900">
                <NomorSurat nomor={surat.nomor_surat} status={surat.status} />
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {formatTanggalShort(surat.created_at)}
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="text-sm font-medium text-gray-800">{surat.hal}</div>
              <div className="text-xs text-gray-400 mt-0.5">{surat.ringkasan?.substring(0, 60)}...</div>
            </td>
            <td className="px-4 py-4">
              <Badge status={surat.status} />
            </td>
            {showActions && (
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1">
                  <Link
                    to={`/surat/${surat.id}`}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                    title="Detail"
                  >
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  {surat.status === 'draft' && (
                    <Link
                      to={`/surat/${surat.id}/edit-konten`}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-yellow-600" />
                    </Link>
                  )}
                  {onDelete && surat.status === 'draft' && (
                    <button
                      onClick={() => onDelete(surat)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SuratTable;
