import { useState, useEffect } from 'react';
import {
  Plus, Search, FileEdit, Clock, AlertCircle,
  CheckCircle, PenLine, Mail, Edit, Trash2, Upload, Send, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import usePageTitleStore from '@/store/pageTitleStore';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import ModalTambahSurat from '@/pages/surat/ModalTambahSurat';
import ModalUploadWordSurat from '@/pages/surat/ModalUploadWordSurat';
import { useSuratList, useDeleteSurat, useSubmitSurat } from '@/hooks/useSurat';
import { getDashboardStats } from '@/api/dashboard.api';

// ── Icon & warna per label statistik ─────────────────────────────────────────
const STAT_ICON_MAP = {
  // Administrator
  'Total Draf Aktif':     { Icon: FileEdit,    color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  'Menunggu Verifikasi':  { Icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  'Perlu Revisi':         { Icon: AlertCircle, color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100' },
  'Terbit':               { Icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  // Verifikator
  'Telah Diverifikasi':   { Icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  'Perlu Perbaikan':      { Icon: AlertCircle, color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100' },
  // Kajur
  'Menunggu TTD':         { Icon: PenLine,     color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  'Telah Ditandatangani': { Icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  // Dosen
  'Total Surat Diterima': { Icon: Mail,        color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
};
const DEFAULT_STAT = { Icon: FileEdit, color: 'text-[#8B0000]', bg: 'bg-red-50', border: 'border-red-100' };

// ── Status badge per status surat ────────────────────────────────────────────
const STATUS_CONFIG = {
  draft:               { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Draft' },
  menunggu_verifikasi: { bg: 'bg-yellow-50',  text: 'text-yellow-700', label: 'Menunggu Verifikasi' },
  diverifikasi:        { bg: 'bg-blue-50',    text: 'text-blue-700',   label: 'Diverifikasi' },
  ditolak:             { bg: 'bg-red-50',     text: 'text-red-700',    label: 'Perlu Perbaikan' },
  terbit:              { bg: 'bg-green-50',   text: 'text-green-700',  label: 'Terbit' },
};

const StatusBadge = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value }) => {
  const { Icon, color, bg, border } = STAT_ICON_MAP[label] ?? DEFAULT_STAT;
  return (
    <div className="card p-6 flex flex-col justify-between border border-gray-100 shadow-sm bg-white">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        <div className={`w-10 h-10 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isAdmin = role === 'administrator';
  const isKajur = role === 'kajur';
  const isVerifikator = role === 'verifikator';
  const isDosen = role === 'dosen';
  const setPageTitle = usePageTitleStore((s) => s.setTitle);

  const [activeStatus, setActiveStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModalUploadWord, setShowModalUploadWord] = useState(false);
  const [uploadedWordData, setUploadedWordData] = useState(null);
  const [submitConfirm, setSubmitConfirm] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPageTitle('Daftar Surat');
    return () => setPageTitle('');
  }, [setPageTitle]);

  // Fetch surat list
  const suratFilters = {
    page,
    search: searchQuery || undefined,
    status: isDosen ? 'terbit' : (activeStatus || undefined),
    ...(isDosen ? { sort_by: 'nomor_surat', sort_order: 'asc' } : {}),
  };
  const { data: suratData, isLoading: suratLoading } = useSuratList(suratFilters);
  const suratList = suratData?.data || [];
  const meta = suratData?.meta || {};

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats().then((r) => r.data?.data || []),
  });

  // Mutations
  const deleteMutation = useDeleteSurat(deleteConfirm?.id);
  const submitMutation = useSubmitSurat(submitConfirm?.id);

  const handleUploadWord = (extractedData) => {
    setUploadedWordData(extractedData);
    setShowModalUploadWord(false);
    setShowModal(true);
  };

  // Status filter tabs based on role
  const getTabs = () => {
    if (isAdmin) return [
      { label: 'Semua', value: '' },
      { label: 'Draft', value: 'draft' },
      { label: 'Menunggu Verifikasi', value: 'menunggu_verifikasi' },
      { label: 'Ditolak', value: 'ditolak' },
      { label: 'Terbit', value: 'terbit' },
    ];
    if (isDosen) return [{ label: 'Surat Terbit', value: '' }];
    return [{ label: 'Semua', value: '' }];
  };

  const tabs = getTabs();

  // Grid kolom stat cards
  const colsClass = !statsData?.length
    ? 'grid-cols-1'
    : statsData.length === 1
    ? 'grid-cols-1 max-w-xs'
    : statsData.length === 2
    ? 'grid-cols-2'
    : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className={`grid gap-4 ${colsClass}`}>
        {statsLoading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
          : (statsData || []).map((card, idx) => (
              <StatCard key={idx} label={card.label} value={card.value} />
            ))
        }
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setActiveStatus(tab.value); setPage(1); }}
                className={`
                  px-4 py-2 text-[13px] font-semibold rounded-lg transition-all
                  ${activeStatus === tab.value
                    ? 'bg-red-50 text-[#8B0000]'
                    : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto">
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
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModalUploadWord(true)}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-blue-100 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Word
                </button>
                <Button variant="primary" onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />} className="py-2.5 px-5 font-semibold shadow-sm">
                  Tambah Surat
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {suratLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : suratList.length === 0 ? (
            <EmptyState title="Tidak ada surat" description="Belum ada surat yang sesuai filter." />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-16">No</th>
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[240px]">No. Surat / Tanggal</th>
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Hal / Perihal</th>
                  {!isDosen && (
                    <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 text-center">Status</th>
                  )}
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {suratList.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="px-6 py-5 text-[13px] font-medium text-gray-600">{(page - 1) * 15 + index + 1}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-[13px] text-gray-800 tracking-wide">{surat.nomor_surat || '—'}</p>
                      <p className="text-[12px] text-gray-400 mt-1">{surat.created_at}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-medium text-gray-700">{surat.hal}</p>
                    </td>
                    {!isDosen && (
                      <td className="px-6 py-5 text-center">
                        <StatusBadge status={surat.status} />
                      </td>
                    )}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/surat/${surat.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                        </Link>
                        {isAdmin && (surat.status === 'draft' || surat.status === 'ditolak') && (
                          <Link
                            to={`/surat/${surat.id}/edit-konten`}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded border border-transparent hover:border-yellow-200 transition-colors"
                            title="Edit Konten"
                          >
                            <Edit className="w-[18px] h-[18px]" />
                          </Link>
                        )}
                        {isAdmin && surat.status === 'ditolak' && (
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200 transition-colors"
                            title="Submit ulang ke Verifikator"
                            onClick={() => setSubmitConfirm(surat)}
                          >
                            <Send className="w-[18px] h-[18px]" />
                          </button>
                        )}
                        {isAdmin && surat.status === 'draft' && (
                          <button
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
                            title="Hapus"
                            onClick={() => setDeleteConfirm(surat)}
                          >
                            <Trash2 className="w-[18px] h-[18px]" />
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

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
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

      {/* Modals */}
      {isAdmin && (
        <ModalUploadWordSurat
          isOpen={showModalUploadWord}
          onClose={() => setShowModalUploadWord(false)}
          onUpload={handleUploadWord}
        />
      )}
      <ModalTambahSurat isOpen={showModal} onClose={() => setShowModal(false)} initialData={uploadedWordData} />

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

      <ConfirmDialog
        isOpen={!!submitConfirm}
        onClose={() => setSubmitConfirm(null)}
        onConfirm={() => submitMutation.mutate(undefined, { onSuccess: () => setSubmitConfirm(null) })}
        title="Submit Ulang ke Verifikator"
        message="Surat akan dikirim kembali ke verifikator untuk diverifikasi ulang."
        variant="success"
        confirmText="Ya, Kirim"
        loading={submitMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
