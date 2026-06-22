import { useState } from 'react';
import { Plus, Search, Edit, ToggleLeft, ToggleRight, Key, Loader2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getRoleLabel } from '@/utils/roleHelper';
import { getUserList, createUser, updateUser, toggleUser, resetPassword, deleteUser } from '@/api/master.api';
import { useForm } from 'react-hook-form';

const ROLE_OPTIONS = [
  { value: 'administrator', label: 'Administrator' },
  { value: 'verifikator', label: 'Verifikator' },
  { value: 'kajur', label: 'Ketua Jurusan' },
  { value: 'dosen', label: 'Dosen' },
];

const JABATAN_OPTIONS = [
  { value: 'Dosen tetap', label: 'Dosen Tetap' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Sekjur', label: 'Sekjur' },
  { value: 'Kajur', label: 'Kajur' },
  { value: 'Kepala Lab', label: 'Kepala Lab' },
  { value: 'Staf Kebersihan', label: 'Staf Kebersihan' },
  { value: 'Lektor Kepala', label: 'Lektor Kepala' },
  { value: 'Lektor', label: 'Lektor' },
  { value: 'Asisten Ahli', label: 'Asisten Ahli' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const ManajemenUser = () => {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm();

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', { page, search: searchQuery, role: roleFilter }],
    queryFn: () => getUserList({ page, search: searchQuery || undefined, role: roleFilter || undefined }).then((r) => r.data),
  });
  const userList = usersData?.data || [];
  const meta = usersData?.meta || {};

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil dibuat');
      setShowModal(false);
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membuat user'),
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil diperbarui');
      setEditUser(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui user'),
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: (id) => toggleUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Status user berhasil diubah');
    },
  });

  // Reset password mutation
  const resetPwMutation = useMutation({
    mutationFn: (id) => resetPassword(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Password direset ke: "${res.data?.password_default}"`);
      setResetConfirm(null);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil dihapus');
      setDeleteConfirm(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus user'),
  });

  const onSubmit = (data) => {
    if (editUser) {
      updateMutation.mutate({ id: editUser.id, data });
    } else {
      createMutation.mutate({ ...data, password: 'password' });
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    resetForm({
      nama_lengkap: user.nama_lengkap,
      nip: user.nip,
      email: user.email,
      jabatan: user.jabatan,
      role: user.role,
    });
  };

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="card overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-gray-100 bg-white">
          <h1 className="text-xl font-bold text-gray-900">Manajemen User</h1>
          <div className="flex items-center gap-3">
            <Select
              placeholder="Semua Role"
              options={ROLE_OPTIONS}
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-[160px]"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NIP, email..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B0000] focus:border-[#8B0000] w-[260px] text-gray-600 placeholder-gray-400"
              />
            </div>
            <Button variant="primary" onClick={() => { setEditUser(null); setShowModal(true); resetForm({}); }} icon={<Plus className="w-4 h-4" />}>
              Tambah User
            </Button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Nama</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">NIP / Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 flex-shrink-0">
                        {u.foto_url ? (
                          <img src={u.foto_url} alt="Profile" className="w-9 h-9 rounded-full object-cover bg-gray-100" />
                        ) : (
                          <div className="w-9 h-9 bg-[#8B0000] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {u.nama_lengkap?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.nama_lengkap}</p>
                        {u.jabatan && <p className="text-xs text-gray-400">{u.jabatan}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{u.nip || '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit User"
                        onClick={() => handleEdit(u)}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-green-50 rounded-lg"
                        title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        onClick={() => toggleMutation.mutate(u.id)}
                      >
                        {u.is_active
                          ? <ToggleRight className="w-4 h-4 text-green-500" />
                          : <ToggleLeft className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      <button
                        className="p-2 hover:bg-yellow-50 rounded-lg"
                        title="Reset Password"
                        onClick={() => setResetConfirm(u)}
                      >
                        <Key className="w-4 h-4 text-yellow-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg"
                        title="Hapus User"
                        onClick={() => setDeleteConfirm(u)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</p>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-40">&lt;</button>
              <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-40">&gt;</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal || !!editUser}
        onClose={() => { setShowModal(false); setEditUser(null); resetForm({}); }}
        title={editUser ? "Edit User" : "Tambah User Baru"}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowModal(false); setEditUser(null); resetForm({}); }}>Batal</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={createMutation.isPending || updateMutation.isPending}>Simpan</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap..." error={errors.nama_lengkap?.message} {...register('nama_lengkap', { required: 'Wajib diisi' })} />
          <Input label="NIP" placeholder="Masukkan NIP..." {...register('nip')} />
          <Input label="Email" type="email" placeholder="Masukkan email..." error={errors.email?.message} {...register('email', { required: 'Wajib diisi' })} />
          <Select label="Jabatan" placeholder="Pilih jabatan..." options={JABATAN_OPTIONS} error={errors.jabatan?.message} {...register('jabatan')} />
          <Select label="Role" placeholder="Pilih role..." options={ROLE_OPTIONS} error={errors.role?.message} {...register('role', { required: 'Wajib dipilih' })} />
          {!editUser && <p className="text-xs text-gray-400">Password default: <strong>password</strong></p>}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!resetConfirm}
        onClose={() => setResetConfirm(null)}
        onConfirm={() => resetPwMutation.mutate(resetConfirm.id)}
        title="Reset Password"
        message={`Reset password ${resetConfirm?.nama_lengkap} menjadi "password"?`}
        variant="warning"
        confirmText="Ya, Reset"
        loading={resetPwMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user ${deleteConfirm?.nama_lengkap}?`}
        variant="danger"
        confirmText="Ya, Hapus"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ManajemenUser;
