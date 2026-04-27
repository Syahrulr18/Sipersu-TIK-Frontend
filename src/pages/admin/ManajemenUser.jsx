import { useState } from 'react';
import { Plus, Search, Edit, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getRoleLabel } from '@/utils/roleHelper';

const demoUsers = [
  { id: 1, nama_lengkap: 'Admin Jurusan', email: 'admin.tik@poliupg.ac.id', role: 'administrator', jurusan: 'TIK', aktif: true },
  { id: 2, nama_lengkap: 'Dr. Ahmad Verifikator', email: 'ahmad@poliupg.ac.id', role: 'verifikator', jurusan: 'TIK', aktif: true },
  { id: 3, nama_lengkap: 'Prof. Budi Santoso', email: 'budi@poliupg.ac.id', role: 'kajur', jurusan: 'TIK', aktif: true },
  { id: 4, nama_lengkap: 'Ir. Siti Aminah', email: 'siti@poliupg.ac.id', role: 'dosen', jurusan: 'TIK', aktif: true },
  { id: 5, nama_lengkap: 'Muh. Rizky Aditya', email: 'rizky@poliupg.ac.id', role: 'dosen', jurusan: 'TIK', aktif: false },
];

const ManajemenUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = demoUsers.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.nama_lengkap.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Manajemen User</h1>
        <Button variant="primary" onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Tambah User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          placeholder="Semua Role"
          options={[
            { value: 'administrator', label: 'Administrator' },
            { value: 'verifikator', label: 'Verifikator' },
            { value: 'kajur', label: 'Ketua Jurusan' },
            { value: 'dosen', label: 'Dosen' },
          ]}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-48"
        />
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Nama</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8B0000] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.nama_lengkap.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.nama_lengkap}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-4">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Toggle Status">
                      {user.aktif ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Reset Password">
                      <Key className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah User Baru" size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary">Simpan</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap..." />
          <Input label="NIP" placeholder="Masukkan NIP..." />
          <Input label="Email" type="email" placeholder="Masukkan email..." />
          <Select label="Role" placeholder="Pilih role..." options={[
            { value: 'administrator', label: 'Administrator' },
            { value: 'verifikator', label: 'Verifikator' },
            { value: 'kajur', label: 'Ketua Jurusan' },
            { value: 'dosen', label: 'Dosen' },
          ]} />
        </div>
      </Modal>
    </div>
  );
};

export default ManajemenUser;
