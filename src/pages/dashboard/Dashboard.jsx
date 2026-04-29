import { useState } from 'react';
import { Plus, Search, Folder, FileEdit, FileCheck, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ModalTambahSurat from '@/pages/surat/ModalTambahSurat';
import { formatTanggalShort } from '@/utils/formatDate';

// Demo data matching mockup
const demoAllSurat = [
  {
    id: 1, nomor_surat: 'M.001/9/KL.01.00/2026', tanggal: '24 Okt 2026',
    hal: 'Permohonan Izin Magang Industri',
    ringkasan: 'PT. Telkom Indonesia Tbk.',
    status: 'Menunggu Verifikasi Sekjur', statusType: 'yellow',
  },
  {
    id: 2, nomor_surat: 'M.002/9/KL.01.00/2026', tanggal: '23 Okt 2026',
    hal: 'Undangan Rapat Koordinasi',
    ringkasan: 'Dosen Pengajar Semester Ganjil',
    status: 'Telah Disetujui', statusType: 'green',
  },
  {
    id: 3, nomor_surat: 'M.003/9/KL.01.00/2026', tanggal: '20 Okt 2026',
    hal: 'Surat Tugas Dosen Pembimbing',
    ringkasan: 'Lomba IT Nasional 2026',
    status: 'Perlu Perbaikan', statusType: 'red',
  },
  {
    id: 4, nomor_surat: 'M.004/9/KL.01.00/2026', tanggal: '18 Okt 2026',
    hal: 'Pengajuan Alat Laboratorium',
    ringkasan: 'Lab Jaringan Komputer',
    status: 'Menunggu Persetujuan Kajur', statusType: 'orange',
  },
];

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'administrator';

  const [activeTab, setActiveTab] = useState('Semua Draf');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const tabs = ['Semua Draf', 'Menunggu Verifikasi Sekjur', 'Menunggu Perse'];

  const StatusBadge = ({ status, type }) => {
    const config = {
      yellow: { bg: 'bg-[#FFF9D2]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
      green: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', icon: '✓' },
      red: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', icon: '⚠' },
      orange: { bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', dot: 'bg-[#EA580C]' },
    };

    const c = config[type];
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide ${c.bg} ${c.text} shadow-sm border border-white/50 w-[140px] justify-center text-center leading-tight`}>
        {c.icon && <span>{c.icon}</span>}
        {c.dot && <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
        <span className="whitespace-pre-wrap">{status.replace(' ', '\n')}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Daftar Surat</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden bg-white">
          <p className="text-sm text-gray-500 font-medium z-10">Total Draf Aktif</p>
          <div className="flex items-end justify-between mt-2 z-10">
            <p className="text-4xl font-bold text-gray-900">24</p>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <Folder className="w-5 h-5 text-[#8B0000]" />
            </div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden bg-white">
          <p className="text-sm text-gray-500 font-medium z-10">Perlu Revisi</p>
          <div className="flex items-end justify-between mt-2 z-10">
            <p className="text-4xl font-bold text-gray-900">3</p>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center border border-yellow-100">
              <FileEdit className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden bg-white">
          <p className="text-sm text-gray-500 font-medium z-10">Terkirim</p>
          <div className="flex items-end justify-between mt-2 z-10">
            <p className="text-4xl font-bold text-gray-900">12</p>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
              <FileCheck className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all
                  ${activeTab === tab
                    ? 'bg-red-50 text-[#8B0000]'
                    : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nomor atau perihal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B0000] focus:border-[#8B0000] w-[260px] text-gray-600 placeholder-gray-400"
              />
            </div>
            {isAdmin && (
              <Button variant="primary" onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />} className="py-2.5 px-5 font-semibold shadow-sm">
                Tambah
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-16">No</th>
                <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[280px]">No. Surat / Tanggal</th>
                <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Hal / Perihal</th>
                <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 text-center">Status</th>
                <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demoAllSurat.map((surat, index) => (
                <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                  <td className="px-6 py-5 text-[13px] font-medium text-gray-600">{index + 1}</td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-[13px] text-gray-800 tracking-wide">{surat.nomor_surat}</p>
                    <p className="text-[12px] text-gray-400 mt-1 font-medium">{surat.tanggal}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[13px] font-medium text-gray-700">{surat.hal}</p>
                    <p className="text-[12px] text-gray-400 mt-1">{surat.ringkasan}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={surat.status} type={surat.statusType} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/surat/${surat.id}/edit-konten`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-[18px] h-[18px]" />
                      </Link>
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
                        title="Hapus"
                        onClick={() => setDeleteConfirm(surat)}
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <p className="text-[12px] text-gray-500 font-medium">Menampilkan 1 sampai 4 dari 24 data</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <ModalTambahSurat isOpen={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => setDeleteConfirm(null)}
        title="Hapus Surat"
        message={`Yakin ingin menghapus surat ini?`}
        variant="danger"
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default Dashboard;
