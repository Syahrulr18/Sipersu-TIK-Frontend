import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download, Edit, Trash2, Send,
  CheckCircle, XCircle, PenTool, ArrowLeft, Loader2
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import SuratLogTimeline from '@/components/surat/SuratLogTimeline';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SignModal from '@/components/surat/SignModal';
import { useSuratDetail, useVerifikasiSurat, useTandatanganSurat, useDeleteSurat, useSubmitSurat } from '@/hooks/useSurat';
import { downloadPdf } from '@/api/surat.api';
import toast from 'react-hot-toast';

// Badge per status backend
const STATUS_CONFIG = {
  draft:               { label: 'Draft',                color: 'bg-gray-100 text-gray-600' },
  menunggu_verifikasi: { label: 'Menunggu Verifikasi',  color: 'bg-yellow-100 text-yellow-700' },
  diverifikasi:        { label: 'Diverifikasi',          color: 'bg-blue-100 text-blue-700' },
  ditolak:             { label: 'Perlu Perbaikan',       color: 'bg-red-100 text-red-700' },
  terbit:              { label: 'Terbit',                color: 'bg-green-100 text-green-700' },
};

const DetailSurat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const [catatan, setCatatan] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedPenerimaIdx, setSelectedPenerimaIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch surat detail dari API
  const { data, isLoading, isError } = useSuratDetail(id);
  const surat = data?.data;

  // Mutations
  const verifikasiMutation = useVerifikasiSurat(id);
  const ttdMutation        = useTandatanganSurat(id);
  const deleteMutation     = useDeleteSurat(id);
  const submitMutation     = useSubmitSurat(id);

  const handleConfirm = () => {
    if (confirmAction === 'approve') {
      verifikasiMutation.mutate(
        { aksi: 'setuju', catatan },
        { onSuccess: () => setConfirmAction(null), onError: () => setConfirmAction(null) }
      );
    } else if (confirmAction === 'reject') {
      verifikasiMutation.mutate(
        { aksi: 'tolak', catatan },
        { onSuccess: () => setConfirmAction(null), onError: () => setConfirmAction(null) }
      );
    } else if (confirmAction === 'sign') {
      ttdMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null), onError: () => setConfirmAction(null) });
    } else if (confirmAction === 'rejectKajur') {
      ttdMutation.mutate(
        { aksi: 'tolak', catatan },
        { onSuccess: () => setConfirmAction(null), onError: () => setConfirmAction(null) }
      );
    } else if (confirmAction === 'delete') {
      deleteMutation.mutate(id, { onSuccess: () => navigate('/dashboard'), onError: () => setConfirmAction(null) });
    } else if (confirmAction === 'resubmit') {
      submitMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null), onError: () => setConfirmAction(null) });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const activePenerimaId = (role !== 'dosen' && surat.penerima?.length > 1) 
        ? surat.penerima[selectedPenerimaIdx]?.id 
        : null;
        
      const res = await downloadPdf(id, activePenerimaId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `surat-${surat.nomor_surat?.replace(/\//g, '-') || id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal mengunduh PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const isMutating = verifikasiMutation.isPending || ttdMutation.isPending ||
                     deleteMutation.isPending || submitMutation.isPending;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError || !surat) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center text-gray-500">
        <p>Surat tidak ditemukan.</p>
        <Link to="/dashboard" className="text-[#8B0000] text-sm mt-2 inline-block">← Kembali ke Beranda</Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[surat.status] ?? { label: surat.status, color: 'bg-gray-100 text-gray-600' };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <Breadcrumb items={[
          { label: 'Beranda', path: '/dashboard' },
          { label: surat.hal },
        ]} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* ── KOLOM KIRI: Kertas Surat ── */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-gray-400">
              {surat.nomor_surat ? `No. ${surat.nomor_surat}` : 'Nomor surat belum terbit'}
            </span>
          </div>

          {/* ── TAB PENERIMA (hanya jika > 1 penerima dan bukan dosen) ── */}
          {role !== 'dosen' && surat.penerima?.length > 1 && (
            <div className="flex gap-0 mb-0 overflow-x-auto">
              {surat.penerima.map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={() => setSelectedPenerimaIdx(idx)}
                  title={p.nama_lengkap}
                  className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    selectedPenerimaIdx === idx
                      ? 'bg-white text-[#8B0000] border-[#8B0000] shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                  }`}
                  style={{
                    borderTopLeftRadius: idx === 0 ? '8px' : '0',
                    borderTopRightRadius: idx === surat.penerima.length - 1 ? '8px' : '0',
                  }}
                >
                  Tab {idx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Kertas putih — dokumen resmi */}
          <div
            className="bg-white shadow-xl"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '12pt',
              lineHeight: '1.5',
              color: '#000',
              padding: '96px',
              maxWidth: '900px',
              width: '100%',
            }}
          >
            {/* ── KOP SURAT ── */}
            <div style={{ borderBottom: '4px solid #000', paddingBottom: '10px', marginBottom: '30px', marginTop: '-38px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '95px', verticalAlign: 'middle' }}>
                      <img
                        src="/logo_PNUP.png"
                        alt="Logo PNUP"
                        style={{ width: '95px', height: 'auto', objectFit: 'contain' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingLeft: '8px', lineHeight: 1 }}>
                      <div style={{ fontSize: '15pt', textTransform: 'uppercase' }}>
                        Kementerian Pendidikan Tinggi,<br />Sains, dan Teknologi
                      </div>
                      <div style={{ fontSize: '16pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Politeknik Negeri Ujung Pandang
                      </div>
                      <div style={{ fontSize: '10pt', marginTop: '2px' }}>
                        Direktorat Kampus Tamalanrea, Jl. P. Kemerdekaan Km. 10, Makassar 90245<br />
                        E-mail: pnup@poliupg.ac.id Laman www.poliupg.ac.id
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── IDENTITAS SURAT ── */}
            <table style={{ width: '100%', marginBottom: '24px', marginTop: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top', width: '60%' }}>
                    <table style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Nomor</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}>{surat.nomor_surat || '—'}</td>
                        </tr>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Lampiran</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}>
                            {surat.lampiran?.length > 0
                              ? surat.lampiran.reduce((sum, l) => sum + (l.jumlah_halaman || 1), 0) + ' Lembar'
                              : '-'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Perihal</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}><strong>{surat.hal}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    Makassar, {surat.tanggal_terbit || surat.created_at_date}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── PENERIMA ── */}
            <div style={{ marginBottom: '20px' }}>
              <div>Kepada Yth.</div>
              {role !== 'dosen' && surat.penerima?.length > 1 ? (
                /* Jika multi-penerima dan bukan dosen, tampilkan hanya penerima yang dipilih di tab */
                <>
                  <div style={{ paddingLeft: '16px' }}>
                    {surat.penerima[selectedPenerimaIdx]?.nama_lengkap}
                  </div>
                </>
              ) : (
                /* Jika penerima tunggal atau dosen, tampilkan semua */
                (surat.penerima || []).map((p, i) => (
                  <div key={p.id || i} style={{ paddingLeft: '16px' }}>{p.nama_lengkap}</div>
                ))
              )}
              <div style={{ paddingLeft: '16px' }}>Di - Tempat</div>
            </div>

            {/* ── KONTEN SURAT HTML ── */}
            <div
              className="preview-content"
              style={{ textAlign: 'justify', minHeight: '200px' }}
              dangerouslySetInnerHTML={{ 
                __html: (role !== 'dosen' && surat.penerima?.length > 1) 
                  ? (surat.penerima[selectedPenerimaIdx]?.konten_html || surat.konten_html || '<p><em>(Konten surat belum diisi)</em></p>')
                  : (surat.konten_html || '<p><em>(Konten surat belum diisi)</em></p>')
              }}
            />

            {/* ── CATATAN PENOLAKAN ── */}
            {surat.catatan_penolakan && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#FEF2F2', borderLeft: '4px solid #EF4444', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '10pt', color: '#991B1B' }}>Catatan Penolakan:</p>
                <p style={{ fontSize: '10pt', color: '#991B1B' }}>{surat.catatan_penolakan}</p>
              </div>
            )}

            {/* ── TANDA TANGAN ── */}
            <table style={{ width: '100%', marginTop: '40px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '60%' }} />
                  <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                    <strong>
                      <div>Ketua Jurusan</div>
                      <div>Teknik Informatika dan Komputer</div>
                    </strong>
                    {(surat.status === 'terbit' && surat.penanda_tangan?.ttd_url) ? (
                      <div style={{ margin: '8px 0' }}>
                        <img 
                          src={surat.penanda_tangan.ttd_url} 
                          alt="Tanda Tangan" 
                          style={{ maxHeight: '80px', objectFit: 'contain' }} 
                        />
                      </div>
                    ) : (
                      <div style={{ height: '64px' }} />
                    )}
                    <strong>
                      <u>{surat.penanda_tangan?.nama_lengkap}</u>
                      <br />
                      NIP. {surat.penanda_tangan?.nip}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── LAMPIRAN LIST ── */}
            {surat.lampiran?.length > 0 && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '10pt' }}>Lampiran:</p>
                <ol style={{ margin: 0, paddingLeft: '1.5em', fontSize: '10pt' }}>
                  {surat.lampiran.map((l) => (
                    <li key={l.id} style={{ marginBottom: '4px' }}>
                      {l.nama_file_asli}{' '}
                      <span style={{ color: '#888' }}>({l.ukuran})</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* ── KOLOM KANAN: Sidebar ── */}
        <div className="w-full lg:w-72 space-y-5 shrink-0">

          {/* Aksi */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Aksi</h3>
            <div className="space-y-3">
              {role === 'administrator' && (
                <>
                  <Link to={surat.status === 'draft' || surat.status === 'ditolak' ? `/surat/${id}/edit-konten` : '#'} 
                    className={`block w-full ${!(surat.status === 'draft' || surat.status === 'ditolak') ? 'pointer-events-none opacity-50' : ''}`}>
                    <Button variant="primary" fullWidth icon={<Edit className="w-4 h-4" />} disabled={!(surat.status === 'draft' || surat.status === 'ditolak')}>
                      {surat.status === 'ditolak' ? 'Perbaiki Konten' : 'Edit Konten'}
                    </Button>
                  </Link>
                  <Button variant="outline" fullWidth icon={<Send className="w-4 h-4" />}
                    onClick={() => setConfirmAction('resubmit')}
                    disabled={!(surat.status === 'draft' || surat.status === 'ditolak')}>
                    {surat.status === 'ditolak' ? 'Kirim Ulang' : 'Submit ke Verifikator'}
                  </Button>
                  <Button variant="danger" fullWidth icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => setConfirmAction('delete')}
                    disabled={!(surat.status === 'draft' || surat.status === 'ditolak')}>
                    Hapus Surat
                  </Button>
                </>
              )}

              {role === 'verifikator' && (
                <>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan (wajib jika menolak)..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 disabled:bg-gray-50 disabled:opacity-50"
                    rows={3}
                    disabled={surat.status !== 'menunggu_verifikasi'}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="success" fullWidth icon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => setConfirmAction('approve')}
                      disabled={surat.status !== 'menunggu_verifikasi'}>
                      Setujui
                    </Button>
                    <Button variant="danger" fullWidth icon={<XCircle className="w-4 h-4" />}
                      onClick={() => {
                        if (!catatan.trim()) { toast.error('Catatan wajib diisi jika menolak surat'); return; }
                        setConfirmAction('reject');
                      }}
                      disabled={surat.status !== 'menunggu_verifikasi'}>
                      Tolak
                    </Button>
                  </div>
                </>
              )}

              {role === 'kajur' && (
                <>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Catatan (wajib jika menolak)..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 disabled:bg-gray-50 disabled:opacity-50"
                    rows={3}
                    disabled={surat.status !== 'diverifikasi'}
                  />
                  <div className="flex flex-col gap-2 mt-2">
                    <Button variant="primary" fullWidth icon={<PenTool className="w-4 h-4" />}
                      onClick={() => setConfirmAction('sign')}
                      disabled={surat.status !== 'diverifikasi'}>
                      Tandatangani & Terbitkan
                    </Button>
                    <Button variant="danger" fullWidth icon={<XCircle className="w-4 h-4" />}
                      onClick={() => {
                        if (!catatan.trim()) { toast.error('Catatan wajib diisi jika menolak surat'); return; }
                        setConfirmAction('rejectKajur');
                      }}
                      disabled={surat.status !== 'diverifikasi'}>
                      Tolak
                    </Button>
                  </div>
                </>
              )}

              <Button variant="primary" fullWidth icon={<Download className="w-4 h-4" />}
                onClick={handleDownloadPdf}
                disabled={surat.status !== 'terbit' || isDownloading}
                loading={isDownloading}>
                {isDownloading ? 'Mengunduh...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          {/* Info singkat */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Dibuat oleh</p>
              <p className="font-medium text-gray-800">{surat.dibuat_oleh?.nama_lengkap}</p>
            </div>
            {surat.verifikator && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Verifikator</p>
                <p className="font-medium text-gray-800">{surat.verifikator.nama_lengkap}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Penanda Tangan</p>
              <p className="font-medium text-gray-800">{surat.penanda_tangan?.nama_lengkap}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Kode Hal</p>
              <p className="font-medium text-gray-800">{surat.kode_hal?.kode} — {surat.kode_hal?.nama}</p>
            </div>
            {surat.created_at && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Dibuat</p>
                <p className="text-gray-600">{surat.created_at_date}</p>
              </div>
            )}
          </div>

          {/* Riwayat status */}
          {surat.log?.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Riwayat Status</h3>
              <SuratLogTimeline logs={surat.log} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction && confirmAction !== 'sign'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={
          confirmAction === 'delete'   ? 'Hapus Surat' :
          confirmAction === 'approve'  ? 'Setujui Surat' :
          (confirmAction === 'reject' || confirmAction === 'rejectKajur') ? 'Tolak Surat' :
          confirmAction === 'resubmit' ? 'Kirim ke Verifikator' : 'Konfirmasi'
        }
        message={
          (confirmAction === 'reject' || confirmAction === 'rejectKajur')
            ? 'Surat akan dikembalikan ke pembuat dengan catatan penolakan.'
            : 'Apakah Anda yakin melanjutkan tindakan ini?'
        }
        variant={confirmAction === 'delete' || confirmAction === 'reject' || confirmAction === 'rejectKajur' ? 'danger' : 'primary'}
        confirmText="Ya, Lanjutkan"
        loading={isMutating}
      />

      <SignModal
        isOpen={confirmAction === 'sign'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={ttdMutation.isPending}
      />
    </div>
  );
};

export default DetailSurat;