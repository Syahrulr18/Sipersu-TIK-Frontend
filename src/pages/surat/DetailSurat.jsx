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
import DocumentLayout from '@/components/layout/DocumentLayout';
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

  const sidebar = (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Riwayat Status</h3>
        <SuratLogTimeline logs={surat.logs} />
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Aksi</h3>
        <div className="space-y-3">
          {role === 'administrator' && surat.status === 'draft' && (
            <>
              <Link to={`/surat/${id}/edit-konten`} className="block w-full">
                <Button variant="primary" fullWidth icon={<Edit className="w-4 h-4" />}>Edit Konten</Button>
              </Link>
              <Button variant="danger" fullWidth icon={<Trash2 className="w-4 h-4" />} onClick={() => handleAction('delete')}>
                Hapus Surat
              </Button>
            </>
          )}

          {role === 'administrator' && surat.status === 'ditolak' && (
            <Button variant="primary" fullWidth icon={<Send className="w-4 h-4" />} onClick={() => handleAction('resubmit')}>
              Revisi & Kirim Ulang
            </Button>
          )}

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

          {role === 'kajur' && surat.status === 'diverifikasi' && (
            <Button variant="primary" fullWidth icon={<PenTool className="w-4 h-4" />} onClick={() => handleAction('sign')}>
              Tandatangani & Terbitkan
            </Button>
          )}

          {surat.status === 'terbit' && (
            <Button variant="primary" fullWidth icon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Daftar Surat', path: '/surat' },
        { label: surat.hal },
      ]} />

      <DocumentLayout
        badge="Detail Surat"
        title={surat.hal}
        subtitle={`No. ${surat.nomor_surat} • ${formatKodeHal(surat.kode_hal)}`}
        headerActions={(
          <Link
            to="/surat"
            className="inline-flex items-center gap-2 rounded-3xl border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition-colors hover:bg-[#8B0000]/10"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        )}
        sidebar={sidebar}
      >
        <div className="space-y-6 text-sm text-gray-700">
          <div className="rounded-[1.75rem] border border-gray-200 bg-[#FBFBFB] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1">Dibuat oleh</p>
                <p className="font-medium text-gray-900">{surat.dibuat_oleh.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1">Penanda Tangan</p>
                <p className="font-medium text-gray-900">{surat.penanda_tangan.nama_lengkap}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-gray-400 uppercase tracking-[0.2em] mb-1">Kode Hal</p>
                <p className="font-medium text-gray-900">{formatKodeHal(surat.kode_hal)}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-[0.2em] mb-1">Tanggal</p>
                <p className="font-medium text-gray-900">{formatTanggalFull(surat.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <p className="text-gray-400 uppercase tracking-[0.2em] mb-3">Tujuan / Penerima</p>
            <div className="flex flex-wrap gap-2">
              {surat.penerima.map((p) => (
                <span key={p.id} className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                  {p.nama_lengkap}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <p className="text-gray-400 uppercase tracking-[0.2em] mb-3">Ringkasan</p>
            <p className="leading-relaxed text-gray-700">{surat.ringkasan}</p>
          </div>

          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <p className="text-gray-400 uppercase tracking-[0.2em] mb-3">Lampiran</p>
            <div className="space-y-3">
              {surat.lampiran.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-3xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{f.nama}</p>
                      <p className="text-xs text-gray-500">{f.ukuran}</p>
                    </div>
                  </div>
                  <button className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DocumentLayout>

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
