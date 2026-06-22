import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import SignModal from '@/components/surat/SignModal';

import { useAntrianTandaTangan, useTandatanganSurat } from '@/hooks/useSurat';

const TandaTangan = () => {
  const [confirmId, setConfirmId] = useState(null);

  const { data, isLoading } = useAntrianTandaTangan();
  const antrian = data?.data || [];

  const ttdMutation = useTandatanganSurat(confirmId);

  const handleConfirm = () => {
    ttdMutation.mutate(undefined, {
      onSuccess: () => setConfirmId(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="page-title">Menunggu Tanda Tangan</h1>
        {!isLoading && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {antrian.length}
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : antrian.length === 0 ? (
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
              {antrian.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.nomor_surat || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{item.hal}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.kode_hal?.kode || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {item.dibuat_oleh?.nama_lengkap || '—'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.created_at}</td>
                  <td className="px-4 py-4 text-center flex gap-2 justify-center">
                    <Link to={`/surat/${item.id}`}>
                      <Button size="sm" variant="outline">Detail</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<PenLine className="w-3.5 h-3.5" />}
                      onClick={() => setConfirmId(item.id)}
                    >
                      Tanda Tangan
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SignModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirm}
        loading={ttdMutation.isPending}
      />
    </div>
  );
};

export default TandaTangan;
