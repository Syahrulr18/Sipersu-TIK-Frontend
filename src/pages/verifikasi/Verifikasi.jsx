import { useState } from 'react';
import { ClipboardCheck, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { useAntrianVerifikasi, useVerifikasiSurat } from '@/hooks/useSurat';

const Verifikasi = () => {
  const [reviewModal, setReviewModal] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [catatan, setCatatan] = useState('');

  const { data, isLoading } = useAntrianVerifikasi();
  const antrian = data?.data || [];

  const verifikasiMutation = useVerifikasiSurat(reviewModal?.id);

  const handleAction = (action) => {
    if (action === 'reject' && !catatan.trim()) {
      setCatatan('');
    }
    setConfirmAction(action);
  };

  const handleConfirm = () => {
    const aksi = confirmAction === 'approve' ? 'setuju' : 'tolak';
    verifikasiMutation.mutate(
      { aksi, catatan },
      {
        onSuccess: () => {
          setConfirmAction(null);
          setReviewModal(null);
          setCatatan('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="page-title">Antrian Verifikasi</h1>
        {!isLoading && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {antrian.length}
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : antrian.length === 0 ? (
          <EmptyState title="Tidak ada antrian" description="Semua surat sudah diverifikasi." />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">No. Surat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Kode Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Dibuat Oleh</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Tgl Masuk</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {antrian.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.nomor_surat || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{item.hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.kode_hal?.kode || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.dibuat_oleh?.nama_lengkap || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.created_at}</td>
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
            <Button
              variant="success"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => handleAction('approve')}
            >
              Setujui
            </Button>
            <Button
              variant="danger"
              icon={<XCircle className="w-4 h-4" />}
              onClick={() => handleAction('reject')}
            >
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
                <span className="font-semibold">{reviewModal.nomor_surat || '(belum terbit)'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Perihal</span>
                <span className="font-medium text-right max-w-xs">{reviewModal.hal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dibuat Oleh</span>
                <span>{reviewModal.dibuat_oleh?.nama_lengkap || '—'}</span>
              </div>
            </div>
            <Link to={`/surat/${reviewModal.id}`}>
              <Button variant="outline" fullWidth icon={<Eye className="w-4 h-4" />}>
                Lihat Detail Surat
              </Button>
            </Link>
            <div>
              <label className="label-field">Catatan {confirmAction === 'reject' && <span className="text-red-500">*</span>}</label>
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
        message={
          confirmAction === 'approve'
            ? 'Surat akan diteruskan ke penanda tangan.'
            : 'Surat akan dikembalikan ke pembuat dengan catatan.'
        }
        variant={confirmAction === 'approve' ? 'success' : 'danger'}
        confirmText={confirmAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
        loading={verifikasiMutation.isPending}
      />
    </div>
  );
};

export default Verifikasi;
