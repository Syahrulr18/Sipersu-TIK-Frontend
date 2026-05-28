import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/layout/Breadcrumb';
import useAuthStore from '@/store/authStore';
import { formatTanggalSurat } from '@/utils/formatDate';

const demoSurat = {
  id: 1,
  nomor_surat: '0084/9.9.2/DV.00.00/2026',
  lampiran: '-',
  hal: 'Permohonan Kerja Sama',
  created_at: '2026-04-21',
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
  penanda_tangan: {
    nama_lengkap: 'Nurul Khaerani Hamzidah, S.T., M.T.',
    nip: '19890814 201903 2 020',
    jabatan: 'Koordinator Program Studi\nTeknik Multimedia dan Jaringan',
  },
};

const DetailSuratDosen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  if (role !== 'dosen') {
    return <Navigate to={`/surat/${id}`} replace />;
  }

  const surat = demoSurat;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between gap-4">
        <Breadcrumb items={[
          { label: 'Daftar Surat', path: '/surat' },
          { label: 'Preview Surat' },
        ]} />
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-[#8B0000] px-4 py-2 text-sm font-semibold text-[#8B0000] transition hover:bg-[#8B0000]/10"
        >
          Kembali ke Daftar Surat
        </button>
      </div>

      <div
        className="mx-auto bg-white shadow-xl"
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

        <div style={{ marginBottom: '20px' }}>
          {surat.tujuan.map((line, i) => (
            <div key={i} style={{ paddingLeft: i >= 3 ? '16px' : '0' }}>
              {i === 2 ? <strong>{line}</strong> : line}
            </div>
          ))}
        </div>

        <div style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: '12px' }}>
          {surat.salam_pembuka}
        </div>

        <div style={{ textAlign: 'justify' }}>
          {surat.konten.map((par, idx) => (
            <p key={idx} style={{ textIndent: '2.5em', marginBottom: '10px', marginTop: 0 }}>
              {par}
            </p>
          ))}

          <ol style={{ marginLeft: '2.5em', marginBottom: '12px', marginTop: 0, paddingLeft: '1em' }}>
            {surat.poin_kerja_sama.map((poin, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                <strong>{poin}</strong>
              </li>
            ))}
          </ol>

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

          <p style={{ marginBottom: '8px', marginTop: 0 }}>{surat.penutup}</p>

          <p style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: '32px', marginTop: 0 }}>
            {surat.salam_penutup}
          </p>
        </div>

        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%' }} />
              <td style={{ textAlign: 'center' }}>
                {surat.penanda_tangan.jabatan.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
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
    </div>
  );
};

export default DetailSuratDosen;
