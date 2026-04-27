import { useParams, Link } from 'react-router-dom';
import {
  Calendar, User, FileText, Download, Edit, Trash2, Send,
  CheckCircle, XCircle, PenTool, Paperclip, ArrowLeft
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import NomorSurat from '@/components/surat/NomorSurat';
import SuratLogTimeline from '@/components/surat/SuratLogTimeline';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatTanggalFull, formatTanggalShort } from '@/utils/formatDate';
import { formatKodeHal } from '@/constants/kodeHal';
import { useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// Demo data
const demoSurat = {
  id: 1,
  nomor_surat: 'M.001/9/KL.01.00/2026',
  hal: 'Permohonan Izin Magang Industri',
  ringkasan: 'Surat permohonan izin magang industri untuk mahasiswa program studi D4 Teknik Informatika semester 6 di PT. Telkom Indonesia Tbk.',
  kode_hal: 'KL.01.00',
  status: 'menunggu_verifikasi',
  created_at: '2026-10-24',
  dibuat_oleh: { nama_lengkap: 'Admin Jurusan', role: 'administrator' },
  penanda_tangan: { nama_lengkap: 'Prof. Budi Santoso, S.T., M.Kom', nip: '197505152003121001', jabatan: 'Ketua Jurusan' },
  verifikator: { nama_lengkap: 'Dr. Ahmad Verifikator', jabatan: 'Sekretaris Jurusan' },
  penerima: [
    { id: 10, nama_lengkap: 'Kepala HRD PT. Telkom Indonesia' },
    { id: 11, nama_lengkap: 'Manager Divisi IT PT. Telkom' },
  ],
  lampiran: [
    { nama: 'Proposal_Magang.pdf', ukuran: '2.4 MB' },
    { nama: 'Daftar_Mahasiswa.docx', ukuran: '156 KB' },
  ],
  logs: [
    { status: 'draft', user_name: 'Admin Jurusan', tanggal: '2026-10-24T08:00:00', catatan: null },
    { status: 'menunggu_verifikasi', user_name: 'Admin Jurusan', tanggal: '2026-10-24T10:30:00', catatan: 'Dikirim untuk verifikasi' },
  ],
};

const DetailSurat = () => {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const surat = demoSurat;
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [catatan, setCatatan] = useState('');

  const handleAction = (action) => {
    setConfirmAction(action);
    setShowConfirm(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Daftar Surat', path: '/surat' },
        { label: surat.hal },
      ]} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <NomorSurat nomor={surat.nomor_surat} status={surat.status} />
            <Badge status={surat.status} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{surat.hal}</h1>
        </div>
        <Link to="/surat" className="btn-outline text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {/* 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT — col-span-7 */}
        <div className="lg:col-span-7 space-y-4">
          {/* Info card */}
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B0000]" /> Informasi Surat
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Kode Hal</p>
                <p className="font-medium">{formatKodeHal(surat.kode_hal)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tanggal</p>
                <p className="font-medium">{formatTanggalFull(surat.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Dibuat oleh</p>
                <p className="font-medium">{surat.dibuat_oleh.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Penanda Tangan</p>
                <p className="font-medium">{surat.penanda_tangan.nama_lengkap}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-0.5">Verifikator</p>
                <p className="font-medium">{surat.verifikator.nama_lengkap}</p>
              </div>
            </div>
          </div>

          {/* Tujuan */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#8B0000]" /> Tujuan / Penerima
            </h3>
            <div className="flex flex-wrap gap-2">
              {surat.penerima.map((p) => (
                <span key={p.id} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {p.nama_lengkap}
                </span>
              ))}
            </div>
          </div>

          {/* Lampiran */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#8B0000]" /> Lampiran
            </h3>
            {surat.lampiran.length === 0 ? (
              <p className="text-sm text-gray-400">Tidak ada lampiran</p>
            ) : (
              <div className="space-y-2">
                {surat.lampiran.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{f.nama}</p>
                        <p className="text-xs text-gray-400">{f.ukuran}</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ringkasan */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Ringkasan</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{surat.ringkasan}</p>
          </div>
        </div>

        {/* RIGHT — col-span-5 */}
        <div className="lg:col-span-5 space-y-4">
          {/* Timeline */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Riwayat Status</h3>
            <SuratLogTimeline logs={surat.logs} />
          </div>

          {/* Actions card */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Aksi</h3>
            <div className="space-y-2">
              {/* Admin actions for draft */}
              {role === 'administrator' && surat.status === 'draft' && (
                <>
                  <Link to={`/surat/${id}/edit-konten`} className="w-full">
                    <Button variant="primary" fullWidth icon={<Edit className="w-4 h-4" />}>Edit Konten</Button>
                  </Link>
                  <Button variant="danger" fullWidth icon={<Trash2 className="w-4 h-4" />} onClick={() => handleAction('delete')}>
                    Hapus Surat
                  </Button>
                </>
              )}

              {/* Admin actions for ditolak */}
              {role === 'administrator' && surat.status === 'ditolak' && (
                <Button variant="primary" fullWidth icon={<Send className="w-4 h-4" />} onClick={() => handleAction('resubmit')}>
                  Revisi & Kirim Ulang
                </Button>
              )}

              {/* Verifikator actions */}
              {role === 'verifikator' && surat.status === 'menunggu_verifikasi' && (
                <>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan (wajib jika menolak)..."
                    className="input-field resize-none mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button variant="success" fullWidth icon={<CheckCircle className="w-4 h-4" />} onClick={() => handleAction('approve')}>
                      Setujui
                    </Button>
                    <Button variant="danger" fullWidth icon={<XCircle className="w-4 h-4" />} onClick={() => handleAction('reject')}>
                      Tolak
                    </Button>
                  </div>
                </>
              )}

              {/* Kajur actions */}
              {role === 'kajur' && surat.status === 'diverifikasi' && (
                <Button variant="primary" fullWidth icon={<PenTool className="w-4 h-4" />} onClick={() => handleAction('sign')}>
                  Tandatangani & Terbitkan
                </Button>
              )}

              {/* Download for terbit */}
              {surat.status === 'terbit' && (
                <Button variant="primary" fullWidth icon={<Download className="w-4 h-4" />}>
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => setShowConfirm(false)}
        title={
          confirmAction === 'delete' ? 'Hapus Surat' :
          confirmAction === 'approve' ? 'Setujui Surat' :
          confirmAction === 'reject' ? 'Tolak Surat' :
          confirmAction === 'sign' ? 'Tandatangani Surat' : 'Konfirmasi'
        }
        message={
          confirmAction === 'sign' ? 'Surat akan langsung diterbitkan. Tindakan ini tidak dapat dibatalkan.' :
          'Apakah Anda yakin melanjutkan tindakan ini?'
        }
        variant={confirmAction === 'delete' || confirmAction === 'reject' ? 'danger' : 'primary'}
        confirmText="Ya, Lanjutkan"
      />
    </div>
  );
};

export default DetailSurat;
