import { FileText, Send, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { formatTanggalShort } from '@/utils/formatDate';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Demo chart data
const demoChartData = [
  { bulan: 'Nov', total: 8 },
  { bulan: 'Des', total: 12 },
  { bulan: 'Jan', total: 15 },
  { bulan: 'Feb', total: 10 },
  { bulan: 'Mar', total: 18 },
  { bulan: 'Apr', total: 14 },
];

// Demo recent surat
const demoRecentSurat = [
  { id: 1, nomor_surat: 'M.001/9/KL.01.00/2026', hal: 'Permohonan Izin Magang Industri', status: 'menunggu_verifikasi', created_at: '2026-04-24' },
  { id: 2, nomor_surat: 'M.002/9/KL.01.00/2026', hal: 'Undangan Rapat Koordinasi', status: 'diverifikasi', created_at: '2026-04-23' },
  { id: 3, nomor_surat: 'M.003/9/KL.01.00/2026', hal: 'Surat Tugas Dosen Pembimbing', status: 'ditolak', created_at: '2026-04-20' },
  { id: 4, nomor_surat: 'M.004/9/KL.01.00/2026', hal: 'Pengajuan Alat Laboratorium', status: 'menunggu_verifikasi', created_at: '2026-04-18' },
  { id: 5, nomor_surat: 'M.005/9/AL.02/2026', hal: 'Laporan Akademik Semester Ganjil', status: 'terbit', created_at: '2026-04-15' },
];

/**
 * StatCard component for dashboard.
 */
const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

/**
 * Dashboard — role-based dashboard with stat cards, chart, and recent letters.
 */
const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang kembali, {user?.nama_lengkap || 'User'}
        </p>
      </div>

      {/* Administrator Dashboard */}
      {role === 'administrator' && <AdminDashboard />}

      {/* Verifikator Dashboard */}
      {role === 'verifikator' && <VerifikatorDashboard />}

      {/* Kajur Dashboard */}
      {role === 'kajur' && <KajurDashboard />}

      {/* Dosen Dashboard */}
      {role === 'dosen' && <DosenDashboard />}
    </div>
  );
};

const AdminDashboard = () => (
  <>
    {/* Stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={FileText}
        label="Total Draf Aktif"
        value="24"
        iconBg="bg-red-50"
        iconColor="text-[#8B0000]"
      />
      <StatCard
        icon={AlertTriangle}
        label="Perlu Revisi"
        value="3"
        iconBg="bg-yellow-50"
        iconColor="text-yellow-600"
      />
      <StatCard
        icon={Send}
        label="Terkirim"
        value="12"
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Bulan Ini"
        value="39"
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
    </div>

    {/* Chart + Recent */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Chart */}
      <div className="lg:col-span-3 card p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Surat per Bulan</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demoChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="total" fill="#8B0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent surat */}
      <div className="lg:col-span-2 card p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Surat Terbaru</h3>
        <div className="space-y-3">
          {demoRecentSurat.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{s.hal}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.nomor_surat}</p>
              </div>
              <Badge status={s.status} size="sm" className="ml-2 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const VerifikatorDashboard = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard icon={Clock} label="Menunggu Verifikasi" value="5" iconBg="bg-yellow-50" iconColor="text-yellow-600" />
      <StatCard icon={CheckCircle} label="Disetujui Bulan Ini" value="18" iconBg="bg-green-50" iconColor="text-green-600" />
      <StatCard icon={AlertTriangle} label="Ditolak Bulan Ini" value="2" iconBg="bg-red-50" iconColor="text-red-600" />
    </div>
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Antrian Verifikasi</h3>
      <div className="space-y-3">
        {demoRecentSurat.filter(s => s.status === 'menunggu_verifikasi').map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50/50 border border-yellow-100">
            <div>
              <p className="text-sm font-medium text-gray-800">{s.hal}</p>
              <p className="text-xs text-gray-400">{s.nomor_surat} • {formatTanggalShort(s.created_at)}</p>
            </div>
            <button className="btn-primary text-xs px-3 py-1.5">Review</button>
          </div>
        ))}
      </div>
    </div>
  </>
);

const KajurDashboard = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard icon={Clock} label="Perlu TTD" value="3" iconBg="bg-yellow-50" iconColor="text-yellow-600" />
      <StatCard icon={CheckCircle} label="Sudah TTD Bulan Ini" value="15" iconBg="bg-green-50" iconColor="text-green-600" />
    </div>
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Menunggu Tanda Tangan</h3>
      <div className="space-y-3">
        {demoRecentSurat.filter(s => s.status === 'diverifikasi').map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-100">
            <div>
              <p className="text-sm font-medium text-gray-800">{s.hal}</p>
              <p className="text-xs text-gray-400">{s.nomor_surat} • {formatTanggalShort(s.created_at)}</p>
            </div>
            <button className="btn-primary text-xs px-3 py-1.5">Tanda Tangani</button>
          </div>
        ))}
      </div>
    </div>
  </>
);

const DosenDashboard = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard icon={FileText} label="Total Surat Untukku" value="8" iconBg="bg-blue-50" iconColor="text-blue-600" />
      <StatCard icon={CheckCircle} label="Terbit Bulan Ini" value="3" iconBg="bg-green-50" iconColor="text-green-600" />
    </div>
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Surat Terbaru Untukku</h3>
      <div className="space-y-3">
        {demoRecentSurat.filter(s => s.status === 'terbit').map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-800">{s.hal}</p>
              <p className="text-xs text-gray-400">{s.nomor_surat} • {formatTanggalShort(s.created_at)}</p>
            </div>
            <Badge status={s.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  </>
);

export default Dashboard;
