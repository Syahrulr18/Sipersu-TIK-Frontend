import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatTanggalSurat } from '@/utils/formatDate';

const demoSurat = {
  id: 2,
  nomor_surat: 'M.002/9/KL.01.00/2026',
  lampiran: '1 berkas',
  hal: 'Undangan Rapat Koordinasi',
  kode_hal: 'KL.01.00',
  created_at: '2026-02-02',
  tujuan: [
    'Kepada Yth.',
    'Para Dosen',
    'Jurusan Teknik Informatika dan Komputer',
    'Di -',
    'Tempat',
  ],
  salam_pembuka: "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
  konten: [
    "Puji dan syukur kita panjatkan kehadirat Allah Subhaanahu Wa Ta'ala yang telah melimpahkan rahmat-Nya kepada kita semua, sehingga kita masih diberi kesehatan dan perlindungan-Nya.",
    "Sehubungan dengan persiapan kegiatan akademik semester genap 2026/2027, kami mengundang Bapak/Ibu Dosen Jurusan Teknik Informatika dan Komputer untuk menghadiri rapat koordinasi jurusan yang akan dilaksanakan dalam waktu dekat.",
    "Mengingat pentingnya kehadiran Bapak/Ibu dalam rapat tersebut, kami mohon kiranya dapat meluangkan waktu untuk hadir tepat waktu.",
  ],
  jadwal: {
    waktu: 'Senin, 10 Februari 2026, Pukul 09.00 WITA',
    lokasi: 'Ruang Rapat Jurusan Teknik Informatika dan Komputer',
  },
  penutup: 'Demikian undangan ini kami sampaikan, atas perhatian dan kehadiran Bapak/Ibu kami ucapkan terima kasih.',
  salam_penutup: "Wassalamu'alaikum Warahmatullahi Wabarakatuh.",
  penanda_tangan: {
    nama_lengkap: 'Prof. Budi Santoso, S.T., M.Kom',
    nip: '197505152003121001',
    jabatan: 'Ketua Jurusan\nTeknik Informatika dan Komputer,',
  },
  file_lampiran: [
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

  const surat = demoSurat;
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Breadcrumb & tombol kembali */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: 'Antrian TTD', path: '/tandatangan' },
            { label: 'Pratinjau Persetujuan Draf' },
          ]}
        />
        <Link
          to="/tandatangan"
          className="inline-flex items-center gap-2 rounded-full border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition hover:bg-[#8B0000]/10"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Antrian TTD
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* ── KOLOM KIRI: Kertas Surat ── */}
        <div className="flex-1">
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">
              Menunggu Tanda Tangan
            </span>
          </div>

          {/* Kertas putih — format surat resmi */}
          <div
            className="bg-white shadow-xl"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '12pt',
              lineHeight: '1.5',
              color: '#000',
              padding: '48px 64px',
              maxWidth: '794px',
              width: '100%',
            }}
          >
            {/* ── KOP SURAT ── */}
            <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '80px', verticalAlign: 'middle' }}>
                      <img
                        src="/logo_PNUP.png"
                        alt="Logo PNUP"
                        style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingLeft: '8px' }}>
                      <div style={{ fontSize: '11pt', fontWeight: 'normal', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Kementerian Pendidikan Tinggi,
                      </div>
                      <div style={{ fontSize: '11pt', fontWeight: 'normal', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Sains, dan Teknologi
                      </div>
                      <div style={{ fontSize: '14pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Politeknik Negeri Ujung Pandang
                      </div>
                      <div style={{ fontSize: '9pt', marginTop: '2px' }}>
                        Direktorat Kampus Tamalanrea, Jl. P. Kemerdekaan Km. 10, Makassar 90245
                      </div>
                      <div style={{ fontSize: '9pt' }}>
                        E-mail: pnup@poliupg.ac.id &nbsp; Laman www.poliupg.ac.id
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── NOMOR / LAMPIRAN / PERIHAL + TANGGAL ── */}
            <table style={{ width: '100%', marginBottom: '24px', marginTop: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top', width: '60%' }}>
                    <table style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        {[
                          { label: 'Nomor', value: surat.nomor_surat || '—' },
                          { label: 'Lampiran', value: surat.lampiran },
                          { label: 'Perihal', value: <strong>{surat.hal}</strong> },
                        ].map(({ label, value }) => (
                          <tr key={label}>
                            <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>{label}</td>
                            <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                            <td style={{ paddingBottom: '2px' }}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    {formatTanggalSurat(surat.created_at)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── TUJUAN ── */}
            <div style={{ marginBottom: '20px' }}>
              {surat.tujuan.map((line, i) => (
                <div key={i} style={{ paddingLeft: i >= 3 ? '16px' : '0' }}>
                  {i === 2 ? <strong>{line}</strong> : line}
                </div>
              ))}
            </div>

            {/* ── SALAM PEMBUKA ── */}
            <div style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: '12px' }}>
              {surat.salam_pembuka}
            </div>

            {/* ── ISI SURAT ── */}
            <div style={{ textAlign: 'justify' }}>
              {surat.konten.map((par, idx) => (
                <p key={idx} style={{ textIndent: '2.5em', marginBottom: '10px', marginTop: 0 }}>
                  {par}
                </p>
              ))}

              {/* Jadwal */}
              <p style={{ marginBottom: '10px', marginTop: 0 }}>
                Kegiatan ini rencananya akan dilaksanakan pada:
              </p>
              <table style={{ marginLeft: '2.5em', marginBottom: '16px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '8px', paddingBottom: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Waktu Pelaksanaan</td>
                    <td style={{ paddingRight: '8px', paddingBottom: '4px', fontWeight: 'bold' }}>:</td>
                    <td style={{ paddingBottom: '4px', fontWeight: 'bold' }}>{surat.jadwal.waktu}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '8px', fontWeight: 'bold' }}>Lokasi</td>
                    <td style={{ paddingRight: '8px', fontWeight: 'bold' }}>:</td>
                    <td style={{ fontWeight: 'bold' }}>{surat.jadwal.lokasi}</td>
                  </tr>
                </tbody>
              </table>

              {/* Penutup */}
              <p style={{ marginBottom: '8px', marginTop: 0 }}>{surat.penutup}</p>

              {/* Salam penutup */}
              <p style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: '32px', marginTop: 0 }}>
                {surat.salam_penutup}
              </p>
            </div>

            {/* ── TANDA TANGAN ── */}
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%' }} />
                  <td style={{ textAlign: 'center' }}>
                    {surat.penanda_tangan.jabatan.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    {/* Area tanda tangan — jika sudah disetujui bisa tampil gambar TTD */}
                    <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isApprove && files.length > 0 ? (
                        <img
                          src={URL.createObjectURL(files[0])}
                          alt="Tanda Tangan"
                          style={{ maxHeight: '60px', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '9pt', color: '#aaa', fontStyle: 'italic' }}>
                          [Tanda tangan belum diunggah]
                        </span>
                      )}
                    </div>
                    <div style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '200px' }}>
                      <strong><u>{surat.penanda_tangan.nama_lengkap}</u></strong>
                    </div>
                    <br />
                    <span>NIP {surat.penanda_tangan.nip}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── LAMPIRAN ── */}
            {surat.file_lampiran?.length > 0 && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '10pt' }}>Lampiran:</p>
                <ol style={{ margin: 0, paddingLeft: '1.5em', fontSize: '10pt' }}>
                  {surat.file_lampiran.map((f, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{f.nama} <span style={{ color: '#888' }}>({f.ukuran})</span></li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          {/* Akhir kertas */}
        </div>

        {/* ── KOLOM KANAN: Sidebar Aksi ── */}
        <div className="w-full lg:w-72 space-y-5 shrink-0">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-[#8B0000] font-semibold mb-1">Otorisasi Tanda Tangan</p>
            <p className="text-sm text-gray-500 mb-5">Ketua Jurusan — Verifikasi Dokumen</p>

            <div className="space-y-4">
              {/* Tombol pilihan aksi */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAction('approve')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold border transition
                    ${isApprove ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#8B0000] hover:text-[#8B0000]'}`}
                >
                  <CheckCircle className="w-4 h-4" /> Setujui
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold border transition
                    ${isReject ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-200 hover:border-red-500 hover:text-red-600'}`}
                >
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
              </div>

              {/* Upload TTD */}
              {isApprove && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Unggah Tanda Tangan Digital</p>
                  <p className="text-xs text-gray-400">Format PNG transparan disarankan</p>
                  <FileUpload
                    files={files}
                    onChange={setFiles}
                    accept="image/png"
                    multiple={false}
                    error={isApprove && files.length === 0 ? 'Silakan unggah tanda tangan dalam format PNG.' : ''}
                  />
                </div>
              )}

              {/* Catatan tolak */}
              {isReject && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Catatan Penolakan</label>
                  <textarea
                    rows={5}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Berikan alasan mengapa draft ini ditolak..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-[#8B0000] focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Tombol kirim */}
              <Button
                fullWidth
                variant="primary"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
              >
                Kirim Sekarang
              </Button>

              {!action && (
                <p className="text-xs text-gray-400 text-center">Pilih aksi terlebih dahulu untuk melanjutkan.</p>
              )}

              {/* Pesan sukses */}
              {message && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Info surat */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Nomor Surat</p>
              <p className="font-medium text-gray-800">{surat.nomor_surat || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Penanda Tangan</p>
              <p className="font-medium text-gray-800">{surat.penanda_tangan.nama_lengkap}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={isApprove ? 'Setujui Draft Surat' : isReject ? 'Tolak Draft Surat' : 'Konfirmasi'}
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