import { useState } from 'react';
import { User, Lock, Camera, AlertCircle, Mail, AtSign } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Profil = () => {
  const user = useAuthStore((s) => s.user);
  const [passwords, setPasswords] = useState({
    current: '',
    new_password: '',
    confirm: '',
  });

  return (
    <div className="space-y-6">
      <h1 className="page-title">Profil</h1>

      {/* Informasi Pribadi */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#8B0000]" />
          Informasi Pribadi
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-[#8B0000] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              {user?.nama_lengkap?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#8B0000] rounded-full flex items-center justify-center text-white border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Foto Profil</p>
            <p className="text-xs text-gray-400">Unggah foto format JPG, PNG maks. 2MB</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="primary">Ubah Foto</Button>
              <Button size="sm" variant="ghost">Hapus</Button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Nama Lengkap</label>
            <div className="input-field bg-gray-50 text-gray-700">
              {user?.nama_lengkap || 'ASMIR'}
            </div>
          </div>
          <div>
            <label className="label-field">NIP / ID Pegawai</label>
            <div className="input-field bg-gray-50 text-gray-700">
              {user?.nip || '198705222015041002'}
            </div>
          </div>
          <div>
            <label className="label-field">Username</label>
            <div className="input-field bg-gray-50 text-gray-700 flex items-center gap-2">
              <AtSign className="w-4 h-4 text-gray-400" />
              {user?.username || 'admin_jurusan'}
            </div>
          </div>
          <div>
            <label className="label-field">Alamat Email</label>
            <div className="input-field bg-gray-50 text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email || 'admin.tik@poliupg.ac.id'}
            </div>
          </div>
        </div>
      </div>

      {/* Keamanan & Kata Sandi */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#8B0000]" />
          Keamanan & Kata Sandi
        </h2>

        <div className="space-y-4 max-w-lg">
          <Input
            label="Kata Sandi Saat Ini"
            type="password"
            placeholder="••••••••"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kata Sandi Baru"
              type="password"
              placeholder="Minimal 8 karakter"
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
            />
            <Input
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-700">
              Kata sandi yang kuat setidaknya mengandung huruf besar, huruf kecil, angka, dan simbol untuk keamanan maksimal akun institusi Anda.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button variant="outline">Batal</Button>
          <Button variant="primary">Simpan Perubahan</Button>
        </div>
      </div>
    </div>
  );
};

export default Profil;
