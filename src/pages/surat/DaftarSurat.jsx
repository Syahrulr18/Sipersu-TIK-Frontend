import { useState } from 'react';
import { Search, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import useAuthStore from '@/store/authStore';
import { useSuratList, useDeleteSurat } from '@/hooks/useSurat';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const DaftarSurat = () => {
  const user = useAuthStore((s) => s.user);
  const isDosen = user?.role === 'dosen';
  const isAdmin = user?.role === 'administrator';
  const isKajur = user?.role === 'kajur';
  const isVerifikator = user?.role === 'verifikator';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);

  // Ambil data surat riil dari API dengan status 'terbit', diurutkan berdasarkan nomor_surat
  const { data: suratData, isLoading } = useSuratList({
    page,
    status: 'terbit',
    search: searchQuery || undefined,
    sort_by: 'nomor_surat',
    sort_order: 'asc',
  });

  const suratList = suratData?.data || [];
  const meta = suratData?.meta || {};

  const deleteMutation = useDeleteSurat();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Daftar Surat</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px] justify-between">
        
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nomor atau perihal..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B0000] focus:border-[#8B0000] w-[260px] text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : suratList.length === 0 ? (
              <EmptyState title="Tidak ada surat" description="Belum ada surat yang terbit." />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-16">No</th>
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[240px]">No. Surat / Tanggal</th>
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Hal / Perihal</th>
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 text-center">Status</th>
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[120px] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {suratList.map((surat, index) => (
                    <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                      <td className="px-6 py-5 text-[13px] font-medium text-gray-600">{(page - 1) * 15 + index + 1}</td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-[13px] text-gray-800 tracking-wide">{surat.nomor_surat || '—'}</p>
                        <p className="text-[12px] text-gray-400 mt-1 font-medium">{surat.tanggal_terbit || surat.created_at}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-medium text-gray-700">{surat.hal}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Telah Disetujui
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {(isAdmin || isKajur || isVerifikator || isDosen) && (
                            <Link
                              to={`/surat/${surat.id}`}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors p-1"
                              title="Detail"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          )}
                          {isAdmin && (
                            <button
                              className="text-[#8B0000] hover:text-red-700 transition-colors p-1"
                              title="Hapus"
                              onClick={() => setDeleteConfirm(surat)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <p className="text-[12px] text-gray-500">
              Halaman {meta.current_page} dari {meta.last_page} ({meta.total} data)
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-40"
              >
                &lt;
              </button>
              <button
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-40"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deleteConfirm?.id, { onSuccess: () => setDeleteConfirm(null) })}
        title="Hapus Surat"
        message={`Yakin ingin menghapus surat "${deleteConfirm?.hal}"?`}
        variant="danger"
        confirmText="Ya, Hapus"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default DaftarSurat;
