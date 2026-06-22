import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Info, Bell, BellOff, CheckCheck, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useNotifikasiList, useBacaNotifikasi, useBacaSemua, useDeleteNotifikasi, useHapusSemuaNotifikasi } from '@/hooks/useNotifikasi';

const iconMap = {
  terbit:    <CheckCircle className="w-5 h-5 text-green-500" />,
  tolak:     <AlertTriangle className="w-5 h-5 text-red-500" />,
  verifikasi: <Info className="w-5 h-5 text-blue-500" />,
  default:   <Bell className="w-5 h-5 text-gray-400" />,
};

const Notifikasi = () => {
  const { data, isLoading } = useNotifikasiList();
  const notifikasiList = data?.data || [];

  const bacaMutation = useBacaNotifikasi();
  const bacaSemuaMutation = useBacaSemua();
  const deleteMutation = useDeleteNotifikasi();
  const deleteAllMutation = useHapusSemuaNotifikasi();

  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Group by "HARI INI" vs sebelumnya
  const today = new Date().toDateString();
  const grouped = notifikasiList.reduce((acc, notif) => {
    const d = new Date(notif.created_at?.replace(' ', 'T') || Date.now()).toDateString();
    const key = d === today ? 'HARI INI' : 'SEBELUMNYA';
    if (!acc[key]) acc[key] = [];
    acc[key].push(notif);
    return acc;
  }, {});

  const unreadCount = notifikasiList.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Notifikasi</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCheck className="w-4 h-4" />}
              onClick={() => bacaSemuaMutation.mutate()}
              loading={bacaSemuaMutation.isPending}
            >
              Tandai Semua Dibaca
            </Button>
          )}
          {notifikasiList.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setConfirmDeleteAll(true)}
            >
              Hapus Semua
            </Button>
          )}
        </div>
      </div>

      <div className="card divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : notifikasiList.length === 0 ? (
          <EmptyState
            title="Tidak ada notifikasi"
            description="Semua notifikasi akan muncul di sini."
            icon={<BellOff className="w-12 h-12 text-gray-300" />}
          />
        ) : (
          Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="px-6 py-3 bg-gray-50/50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{group}</p>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/30 border-l-4 border-blue-400' : ''}`}
                    onClick={() => {
                      if (!notif.is_read) bacaMutation.mutate(notif.id);
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {iconMap[notif.tipe] || iconMap.default}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{notif.judul}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.pesan}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{notif.created_at}</span>
                      {!notif.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      {notif.surat_id && (
                        <Link
                          to={`/surat/${notif.surat_id}`}
                          className="text-xs text-blue-600 hover:underline px-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Lihat
                        </Link>
                      )}
                      <button
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(notif.id);
                        }}
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={() => deleteAllMutation.mutate(undefined, { onSuccess: () => setConfirmDeleteAll(false) })}
        title="Hapus Semua Notifikasi"
        message="Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini tidak dapat dibatalkan."
        variant="danger"
        confirmText="Ya, Hapus Semua"
        loading={deleteAllMutation.isPending}
      />
    </div>
  );
};

export default Notifikasi;
