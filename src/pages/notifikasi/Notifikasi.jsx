import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { formatTanggalRelatif, formatWaktu } from '@/utils/formatDate';

const demoNotifikasi = {
  'HARI INI': [
    { id: 1, judul: 'Draft M.001/9/KL.01.00/2026 telah disetujui oleh Ketua Jurusan.', pesan: 'Surat Permohonan Izin Kegiatan Himpunan Mahasiswa siap untuk diproses lebih lanjut.', icon: 'success', waktu: '2 jam yang lalu', is_read: false, surat_id: 1, created_at: '2026-04-27T19:00:00' },
    { id: 2, judul: 'Surat M.004/9/KL.01.00/2026 memerlukan perbaikan.', pesan: 'Terdapat catatan revisi dari Kepala Lab terkait spesifikasi ATK yang diajukan.', icon: 'warning', waktu: '4 jam yang lalu', is_read: false, surat_id: 4, created_at: '2026-04-27T17:00:00' },
    { id: 3, judul: 'Pengingat: Rapat Evaluasi Mingguan.', pesan: 'Jangan lupa menghadiri rapat evaluasi staf di Ruang Rapat Lt. 2 pukul 14:00 WITA.', icon: 'info', waktu: '6 jam yang lalu', is_read: false, surat_id: null, created_at: '2026-04-27T15:00:00' },
  ],
  'KEMARIN': [
    { id: 4, judul: 'Draft M.002/9/KL.01.00/2026 telah diverifikasi oleh Admin.', pesan: 'Undangan Rapat Evaluasi Kurikulum siap diajukan ke Ketua Jurusan.', icon: 'default', waktu: '14:30', is_read: true, surat_id: 2, created_at: '2026-04-26T14:30:00' },
    { id: 5, judul: 'Surat masuk baru dari Direktorat menunggu disposisi.', pesan: 'Perihal: Sosialisasi Program MBKM Semester Genap.', icon: 'default', waktu: '09:15', is_read: true, surat_id: null, created_at: '2026-04-26T09:15:00' },
    { id: 6, judul: 'Akun pengguna baru telah dibuat.', pesan: 'Dosen baru an. Budi Santoso, S.T., M.Kom telah ditambahkan ke sistem.', icon: 'default', waktu: '08:00', is_read: true, surat_id: null, created_at: '2026-04-26T08:00:00' },
  ],
};

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  default: <Bell className="w-5 h-5 text-gray-400" />,
};

const Notifikasi = () => {
  return (
    <div className="space-y-6">
      <h1 className="page-title">Notifikasi</h1>
      <div className="card divide-y divide-gray-100">
        {Object.entries(demoNotifikasi).map(([group, items]) => (
          <div key={group}>
            <div className="px-6 py-3 bg-gray-50/50">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{group}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.surat_id ? `/surat/${notif.surat_id}` : '#'}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-yellow-50/50 border-l-3 border-yellow-400' : ''}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {iconMap[notif.icon] || iconMap.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{notif.judul}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.pesan}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400 whitespace-nowrap">{notif.waktu}</span>
                    {!notif.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifikasi;
