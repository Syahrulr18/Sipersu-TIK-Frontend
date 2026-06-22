import { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import useAuthStore from '@/store/authStore';
import { downloadPdf } from '@/api/surat.api';
import { useSuratDetail } from '@/hooks/useSurat';

const DetailSuratDosen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading } = useSuratDetail(id);
  const surat = data?.data;

  if (role !== 'dosen') {
    return <Navigate to={`/surat/${id}`} replace />;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="text-center py-8 text-gray-500">
        Surat tidak ditemukan.
        <Link to="/surat" className="text-[#8B0000] text-sm mt-2 block">← Kembali</Link>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Surat-${surat.nomor_surat || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Surat berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh surat');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between gap-4">
        <Breadcrumb items={[
          { label: 'Daftar Surat', path: '/surat' },
          { label: surat.hal || 'Preview Surat' },
        ]} />
        <div className="flex items-center gap-3">
          {surat.status === 'terbit' && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8B0000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6B0000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Mengunduh...' : 'Unduh PDF'}
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition hover:bg-[#8B0000]/10"
          >
            Kembali
          </button>
        </div>
      </div>

      <div
        className="mx-auto bg-white shadow-xl"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '12pt', lineHeight: '1.5', color: '#000',
          padding: '48px 64px', maxWidth: '794px', width: '100%',
        }}
      >
        {/* Kop surat */}
        <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '80px', verticalAlign: 'middle' }}>
                  <img src="/logo_PNUP.png" alt="Logo PNUP" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingLeft: '8px' }}>
                  <div style={{ fontSize: '11pt', textTransform: 'uppercase' }}>Kementerian Pendidikan Tinggi, Sains, dan Teknologi</div>
                  <div style={{ fontSize: '14pt', fontWeight: 'bold', textTransform: 'uppercase' }}>Politeknik Negeri Ujung Pandang</div>
                  <div style={{ fontSize: '9pt' }}>Jurusan Teknik Informatika dan Komputer</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Identitas surat */}
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

        {/* Penerima */}
        <div style={{ marginBottom: '20px' }}>
          <div>Kepada Yth.</div>
          {(surat.penerima || []).map((p, i) => (
            <div key={p.id || i} style={{ paddingLeft: '16px' }}>{p.nama_lengkap}</div>
          ))}
          <div style={{ paddingLeft: '16px' }}>Di - Tempat</div>
        </div>

        {/* Konten HTML dari backend */}
        <div
          className="preview-content"
          style={{ textAlign: 'justify', minHeight: '200px' }}
          dangerouslySetInnerHTML={{ __html: surat.konten_html || '<p><em>(Konten surat belum diisi)</em></p>' }}
        />

        {/* Tanda Tangan */}
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
      </div>
    </div>
  );
};

export default DetailSuratDosen;
