import { useState } from 'react';
import { ClipboardCheck, Eye, CheckCircle, XCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { formatTanggalShort } from '@/utils/formatDate';

const demoAntrian = [
  { id: 1, nomor_surat: 'M.001/9/KL.01.00/2026', hal: 'Permohonan Izin Magang Industri', kode_hal: 'KL.01.00', dari: 'Admin Jurusan', tanggal_masuk: '2026-10-24' },
  { id: 4, nomor_surat: 'M.004/9/KL.01.00/2026', hal: 'Pengajuan Alat Laboratorium', kode_hal: 'KL.01.00', dari: 'Admin Jurusan', tanggal_masuk: '2026-10-18' },
  { id: 5, nomor_surat: 'M.005/9/AL.02/2026', hal: 'Laporan Akademik Semester Ganjil', kode_hal: 'AL.02', dari: 'Admin Jurusan', tanggal_masuk: '2026-10-15' },
];

const Verifikasi = () => {
  const [reviewModal, setReviewModal] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [catatan, setCatatan] = useState('');

  const handleAction = (action) => {
    setConfirmAction(action);
  };

  const handleConfirm = () => {
    setConfirmAction(null);
    setReviewModal(null);
    setCatatan('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="page-title">Antrian Verifikasi</h1>
        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {demoAntrian.length}
        </span>
      </div>

      <div className="card overflow-hidden">
        {demoAntrian.length === 0 ? (
          <EmptyState title="Tidak ada antrian" description="Semua surat sudah diverifikasi." />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">No. Surat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Kode Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Dari</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Tgl Masuk</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demoAntrian.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.nomor_surat}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{item.hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.kode_hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.dari}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{formatTanggalShort(item.tanggal_masuk)}</td>
                  <td className="px-4 py-4 text-center">
                    <Button size="sm" variant="primary" onClick={() => setReviewModal(item)}>
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => { setReviewModal(null); setCatatan(''); }}
        title="Review Surat"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="success" icon={<CheckCircle className="w-4 h-4" />} onClick={() => handleAction('approve')}>
              Setujui
            </Button>
            <Button variant="danger" icon={<XCircle className="w-4 h-4" />} onClick={() => handleAction('reject')}>
              Tolak
            </Button>
          </div>
        }
      >
        {reviewModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nomor</span>
                <span className="font-semibold">{reviewModal.nomor_surat}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Perihal</span>
                <span className="font-medium">{reviewModal.hal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dari</span>
                <span>{reviewModal.dari}</span>
              </div>
            </div>
            <Button variant="outline" fullWidth icon={<Eye className="w-4 h-4" />}>
              Lihat Surat (Preview PDF)
            </Button>
            <div>
              <label className="label-field">Catatan</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tulis catatan verifikasi..."
                className="input-field resize-none"
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction === 'approve' ? 'Setujui Surat' : 'Tolak Surat'}
        message={confirmAction === 'approve' ? 'Surat akan diteruskan ke penanda tangan.' : 'Surat akan dikembalikan ke pembuat.'}
        variant={confirmAction === 'approve' ? 'success' : 'danger'}
        confirmText={confirmAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
      />
    </div>
  );
};

export default Verifikasi;
