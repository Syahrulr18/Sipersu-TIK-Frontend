import { useParams, Link } from 'react-router-dom';
import {
  Download, Edit, Trash2, Send,
  CheckCircle, XCircle, PenTool, FileText, ArrowLeft
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import SuratLogTimeline from '@/components/surat/SuratLogTimeline';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatTanggalSurat } from '@/utils/formatDate';
import { useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// Demo data — disesuaikan dengan isi PDF contoh
const demoSurat = {
  id: 1,
  nomor_surat: null,  // Nomor surat hanya ada setelah disetujui
  lampiran: '-',
  hal: 'Permohonan Kerja Sama',
  status: 'Menunggu Verifikasi',  // Saat menunggu verifikasi, tidak ada nomor
  created_at: '2026-04-21',
  dibuat_oleh: { nama_lengkap: 'Admin Jurusan', role: 'administrator' },
  penanda_tangan: {
    nama_lengkap: 'Nurul Khaerani Hamzidah, S.T., M.T.',
    nip: '19890814 201903 2 020',
    jabatan: 'Koordinator Program Studi\nTeknik Multimedia dan Jaringan,',
  },
  tujuan: [
    'Kepada Yth.',
    'Pimpinan',
    'Lembaga Layanan Psikologi Psikomorfosa',
    'Di -',
    'Tempat',
  ],
  salam_pembuka: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh.',
  konten: [
    'Puji dan syukur kita panjatkan kehadirat Allah Subhaanahu Wa Ta\'ala yang telah melimpahkan rahmat-Nya kepada kita semua, sehingga kita masih diberi kesehatan dan perlindungan-Nya.',
    'Sehubungan dengan pemenuhan tugas project pada mata kuliah Pemrograman Web di Program Studi Teknik Multimedia dan Jaringan, Politeknik Negeri Ujung Pandang, kami bermaksud untuk menjalin kerja sama dengan Lembaga Layanan Psikologi Psikomorfosa. Project yang kami laksanakan berjudul "Website Tes Psikologi PAPI Kostick", yang bertujuan untuk mengembangkan sistem berbasis web guna mendukung pelaksanaan tes psikologi secara digital, khususnya dalam hal pengelolaan peserta, pelaksanaan tes, serta pengolahan data secara terstruktur dan efisien.',
    'Melalui surat ini, kami memohon kesediaan Bapak/Ibu kiranya dapat memberikan izin kepada kami untuk melakukan kerja sama dalam bentuk:',
  ],
  poin_kerja_sama: [
    'Wawancara narasumber',
    'Pengambilan data dan observasi terkait project',
    'Validasi konten psikologi pada website yang dibuat',
  ],
  jadwal: {
    waktu: 'Selasa, 19 Mei 2026',
    lokasi: 'Kantor Lembaga Layanan Psikologi Psikomorfosa Makassar',
  },
  penutup: 'Besar harapan kami agar permohonan ini dapat diterima, sehingga project mata kuliah ini dapat memberikan manfaat yang nyata bagi dunia pendidikan maupun praktisi psikologi. Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.',
  salam_penutup: 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh.',
  logs: [
    { status: 'draft', user_name: 'Admin Jurusan', tanggal: '2026-04-21T08:00:00', catatan: null },
    { status: 'menunggu_verifikasi', user_name: 'Admin Jurusan', tanggal: '2026-04-21T10:30:00', catatan: 'Dikirim untuk verifikasi' },
  ],
};

// Badge warna per status
const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-700' },
  diverifikasi: { label: 'Diverifikasi', color: 'bg-blue-100 text-blue-700' },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
  terbit: { label: 'Terbit', color: 'bg-green-100 text-green-700' },
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

  const status = statusConfig[surat.status] ?? { label: surat.status, color: 'bg-gray-100 text-gray-600' };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Breadcrumb & tombol kembali */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Breadcrumb items={[
          { label: 'Daftar Surat', path: '/surat' },
          { label: surat.hal },
        ]} />
        <Link
          to="/surat"
          className="inline-flex items-center gap-2 rounded-full border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition hover:bg-[#8B0000]/10"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* ── KOLOM KIRI: Kertas Surat ── */}
        <div className="flex-1">
          {/* Status badge */}
          <div className="mb-3 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
            <span className="text-xs text-gray-400">No. {surat.nomor_surat || '—'}</span>
          </div>

          {/* Kertas putih — menyerupai dokumen fisik */}
          <div
            className="bg-white shadow-xl"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '12pt',
              lineHeight: '1.5',
              color: '#000',
              padding: '48px 64px',
              maxWidth: '794px',   /* A4 lebar */
              width: '100%',
            }}
          >
            {/* ── KOP SURAT ── */}
            <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '80px', verticalAlign: 'middle' }}>
                      {/* Logo placeholder — ganti dengan <img src="..." /> jika tersedia */}
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
                          { label: 'Nomor', value: surat.nomor_surat },
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

              {/* Poin-poin kerja sama */}
              <ol style={{ marginLeft: '2.5em', marginBottom: '12px', marginTop: 0, paddingLeft: '1em' }}>
                {surat.poin_kerja_sama.map((poin, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <strong>{poin}</strong>
                  </li>
                ))}
              </ol>

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
                    {/* Ruang tanda tangan */}
                    <div style={{ height: '64px' }} />
                    <div style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '200px' }}>
                      <strong><u>{surat.penanda_tangan.nama_lengkap}</u></strong>
                    </div>
                    <br />
                    <span>NIP {surat.penanda_tangan.nip}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Akhir kertas */}
        </div>

        {/* ── KOLOM KANAN: Sidebar Aksi & Riwayat ── */}
        <div className="w-full lg:w-72 space-y-5 shrink-0">

          {/* Aksi */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30"
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

              {/* Jika tidak ada aksi yang tersedia */}
              {!(
                (role === 'administrator' && ['draft', 'ditolak'].includes(surat.status)) ||
                (role === 'verifikator' && surat.status === 'menunggu_verifikasi') ||
                (role === 'kajur' && surat.status === 'diverifikasi') ||
                surat.status === 'terbit'
              ) && (
                <p className="text-xs text-gray-400 text-center py-2">Tidak ada aksi tersedia</p>
              )}
            </div>
          </div>

          {/* Info singkat */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Dibuat oleh</p>
              <p className="font-medium text-gray-800">{surat.dibuat_oleh.nama_lengkap}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Penanda Tangan</p>
              <p className="font-medium text-gray-800">{surat.penanda_tangan.nama_lengkap}</p>
            </div>
          </div>

          {/* Riwayat status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Riwayat Status</h3>
            <SuratLogTimeline logs={surat.logs} />
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
          confirmAction === 'sign'
            ? 'Surat akan langsung diterbitkan. Tindakan ini tidak dapat dibatalkan.'
            : 'Apakah Anda yakin melanjutkan tindakan ini?'
        }
        variant={confirmAction === 'delete' || confirmAction === 'reject' ? 'danger' : 'primary'}
        confirmText="Ya, Lanjutkan"
      />
    </div>
  );
};

export default DetailSurat;