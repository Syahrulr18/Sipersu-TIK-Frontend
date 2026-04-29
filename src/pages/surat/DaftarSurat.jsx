import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import SuratTable from '@/components/surat/SuratTable';
import ModalTambahSurat from './ModalTambahSurat';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getStatusOptions } from '@/utils/formatStatus';

const demoSuratList = [
  {
    id: 1, nomor_surat: 'M.001/9/KL.01.00/2026', hal: 'Permohonan Izin Magang Industri',
    ringkasan: 'PT. Telkom Indonesia Tbk.', kode_hal: 'KL.01.00',
    status: 'menunggu_verifikasi', created_at: '2026-10-24',
  },
  {
    id: 2, nomor_surat: 'M.002/9/KL.01.00/2026', hal: 'Undangan Rapat Koordinasi',
    ringkasan: 'Dosen Pengajar Semester Ganjil', kode_hal: 'KL.01.00',
    status: 'diverifikasi', created_at: '2026-10-23',
  },
  {
    id: 3, nomor_surat: 'M.003/9/KL.01.00/2026', hal: 'Surat Tugas Dosen Pembimbing',
    ringkasan: 'Lomba IT Nasional 2025', kode_hal: 'KL.01.00',
    status: 'ditolak', created_at: '2026-10-20',
  },
  {
    id: 4, nomor_surat: 'M.004/9/KL.01.00/2026', hal: 'Pengajuan Alat Laboratorium',
    ringkasan: 'Lab Jaringan Komputer', kode_hal: 'KL.01.00',
    status: 'menunggu_verifikasi', created_at: '2026-10-18',
  },
];

/**
 * DaftarSurat — list page matching the mockup precisely.
 * Includes: stat cards, filter tabs, search, table, pagination.
 */
const DaftarSurat = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'administrator';

  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { key: 'semua', label: 'Semua Draf' },
    { key: 'menunggu_verifikasi', label: 'Menunggu Verifikasi Sekjur' },
    { key: 'menunggu_perse', label: 'Menunggu Perse' },
  ];

  // Filter data
  const filteredData = demoSuratList.filter((s) => {
    if (activeTab !== 'semua' && s.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.nomor_surat?.toLowerCase().includes(q) ||
        s.hal?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <h1 className="page-title">Daftar Surat</h1>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-[#8B0000]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Draf Aktif</p>
            <p className="text-xl font-bold text-gray-900">24</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Perlu Revisi</p>
            <p className="text-xl font-bold text-gray-900">3</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Terkirim</p>
            <p className="text-xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium rounded-full border transition-all
                ${activeTab === tab.key
                  ? 'bg-[#8B0000] text-white border-[#8B0000]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor atau perihal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] w-64"
            />
          </div>
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Tambah
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filteredData.length === 0 ? (
          <EmptyState
            title="Belum ada surat"
            description="Surat yang Anda buat akan muncul di sini."
          />
        ) : (
          <>
            <SuratTable
              data={filteredData}
              onDelete={(surat) => setDeleteConfirm(surat)}
            />
            <div className="border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={6}
                total={24}
                perPage={4}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal Tambah Surat */}
      <ModalTambahSurat
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          setDeleteConfirm(null);
        }}
        title="Hapus Surat"
        message={`Yakin ingin menghapus surat "${deleteConfirm?.hal}"? Tindakan ini tidak dapat dibatalkan.`}
        variant="danger"
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default DaftarSurat;
