import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { formatTanggalShort } from '@/utils/formatDate';

const demoAntrian = [
  { id: 2, nomor_surat: null, hal: 'Undangan Rapat Koordinasi', kode_hal: 'KL.01.00', verifikator: 'Dr. Ahmad Verifikator', tanggal: '2026-10-23', status: 'Menunggu Persetujuan Kajur' },
  { id: 6, nomor_surat: null, hal: 'Revisi Kurikulum Prodi D4', kode_hal: 'AL.03', verifikator: 'Dr. Ahmad Verifikator', tanggal: '2026-10-22', status: 'Menunggu Persetujuan Kajur' },
];

const TandaTangan = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="page-title">Menunggu Tanda Tangan</h1>
        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{demoAntrian.length}</span>
      </div>
      <div className="card overflow-hidden">
        {demoAntrian.length === 0 ? (
          <EmptyState title="Tidak ada antrian" description="Semua surat sudah ditandatangani." />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">No. Surat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Kode Hal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Diverifikasi oleh</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Tanggal</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demoAntrian.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.nomor_surat || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{item.hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.kode_hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.verifikator}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{formatTanggalShort(item.tanggal)}</td>
                  <td className="px-4 py-4 text-center">
                    <Link to={`/tandatangan/${item.id}`} className="inline-block">
                      <Button size="sm" variant="primary">Lihat Persetujuan</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TandaTangan;
