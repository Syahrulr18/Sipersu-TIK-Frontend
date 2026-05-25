import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  UploadCloud,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Breadcrumb from '@/components/layout/Breadcrumb';
import DocumentLayout from '@/components/layout/DocumentLayout';
import { formatTanggalFull } from '@/utils/formatDate';
import { formatKodeHal } from '@/constants/kodeHal';

const demoSurat = {
  id: 2,
  nomor_surat: 'M.002/9/KL.01.00/2026',
  hal: 'Undangan Rapat Koordinasi',
  kode_hal: 'KL.01.00',
  created_at: '2026-02-02',
  tujuan: 'Para Dosen Jurusan Teknik Informatika dan Komputer',
  ringkasan: 'Undangan mengikuti rapat koordinasi jurusan untuk persiapan kegiatan akademik semester genap 2026/2027.',
  file_name: 'Draft_Undangan_Rapat_Koordinasi.pdf',
  lampiran: [
    { nama: 'Agenda_Rapat.pdf', ukuran: '120 KB' },
    { nama: 'Daftar_Hadir.docx', ukuran: '86 KB' },
  ],
};

const PersetujuanSurat = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [files, setFiles] = useState([]);
  const [catatan, setCatatan] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const surat = demoSurat.id === Number(id) ? demoSurat : demoSurat;
  const isApprove = action === 'approve';
  const isReject = action === 'reject';
  const canSubmit = isApprove ? files.length > 0 : isReject ? catatan.trim().length > 0 : false;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    setMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage(
        isApprove
          ? 'Draft berhasil disetujui dan dikirim. Tanda tangan digital tersimpan.'
          : 'Draft berhasil ditolak dan catatan pengembalian telah disimpan.'
      );
    }, 800);
  };

  const sidebar = (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-red-600 font-semibold">Unggah Tanda Tangan Digital</p>
        <p className="text-sm text-gray-500">Format PNG transparan disarankan</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button
            variant={isApprove ? 'primary' : 'outline'}
            className="flex-1"
            onClick={() => setAction('approve')}
          >
            <CheckCircle className="w-4 h-4" /> Draft Disetujui
          </Button>
          <Button
            variant={isReject ? 'danger' : 'outline'}
            className="flex-1"
            onClick={() => setAction('reject')}
          >
            <XCircle className="w-4 h-4" /> Draft Ditolak
          </Button>
        </div>

        {isApprove && (
          <div className="space-y-3">
            <FileUpload
              files={files}
              onChange={setFiles}
              accept="image/png"
              multiple={false}
              error={action === 'approve' && files.length === 0 ? 'Silakan unggah tanda tangan digital dalam format PNG.' : ''}
            />
          </div>
        )}

        {isReject && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">Catatan Rejeksi</label>
            <textarea
              rows={5}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Berikan alasan mengapa draft ini ditolak..."
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-[#8B0000] focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-2">
          <Button
            fullWidth
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            loading={isSubmitting}
          >
            Kirim Sekarang
          </Button>
          <p className="text-xs text-gray-400">
            Tombol kirim akan aktif setelah draft disetujui atau ditolak dan proses persetujuan lengkap.
          </p>
        </div>

        {message && (
          <div className="rounded-3xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Antrian TTD', path: '/tandatangan' },
          { label: 'Pratinjau Persetujuan Draf' },
        ]}
      />

      <DocumentLayout
        badge="Otorisasi Tanda Tangan"
        title="Pratinjau Persetujuan Draf"
        subtitle="Ketua Jurusan — Verifikasi Dokumen"
        headerActions={(
          <Link
            to="/tandatangan"
            className="inline-flex items-center gap-2 rounded-3xl border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition-colors hover:bg-[#8B0000]/10"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Antrian TTD
          </Link>
        )}
        sidebar={sidebar}
      >
        <div className="space-y-6 text-sm text-gray-700">
          <div className="rounded-[1.75rem] border border-gray-200 bg-[#FBFBFB] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mb-2">Pratinjau Surat</p>
                <h2 className="text-2xl font-semibold text-gray-900">{surat.hal}</h2>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                <p>{formatTanggalFull(surat.created_at)}</p>
                <p>{formatKodeHal(surat.kode_hal)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <div>
              <p className="text-gray-400 uppercase tracking-widest text-[11px]">Kepada</p>
              <p className="font-medium text-gray-900">{surat.tujuan}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase tracking-widest text-[11px]">Ringkasan</p>
              <p className="mt-2 leading-relaxed">{surat.ringkasan}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase tracking-widest text-[11px]">Dokumen Draft</p>
              <div className="mt-3 rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{surat.file_name}</p>
                    <p className="text-xs text-gray-500">Pratinjau format PDF</p>
                  </div>
                  <Paperclip className="w-5 h-5 text-red-600" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-[13px] text-gray-600">
                  <div className="rounded-2xl bg-white p-3 border border-gray-200">
                    <p className="font-semibold text-gray-900">No. Surat</p>
                    <p className="mt-1 text-sm">{surat.nomor_surat}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-gray-200">
                    <p className="font-semibold text-gray-900">Kode Hal</p>
                    <p className="mt-1 text-sm">{formatKodeHal(surat.kode_hal)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-gray-200 bg-white p-6">
            <p className="text-gray-400 uppercase tracking-widest text-[11px]">Lampiran</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {surat.lampiran.map((file) => (
                <div key={file.nama} className="rounded-3xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{file.nama}</p>
                    <p className="text-xs text-gray-500">{file.ukuran}</p>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DocumentLayout>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={
          isApprove
            ? 'Setujui Draft Surat'
            : isReject
              ? 'Tolak Draft Surat'
              : 'Konfirmasi'
        }
        message={
          isApprove
            ? 'Draft akan disetujui dan dokumen akan diproses lebih lanjut.'
            : 'Draft akan ditolak dan dikembalikan ke pengirim dengan catatan.'
        }
        variant={isReject ? 'danger' : 'primary'}
        confirmText="Ya, Kirim"
      />
    </div>
  );
};

export default PersetujuanSurat;
