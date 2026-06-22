import { useState, useRef } from 'react';
import { User, Lock, Camera, AlertCircle, Mail, AtSign, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { uploadPhoto, uploadTtd } from '@/api/auth.api';
import { useQueryClient } from '@tanstack/react-query';

const Profil = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const ttdInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingTtd, setIsUploadingTtd] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new_password: '',
    confirm: '',
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setIsUploading(true);
    try {
      const res = await uploadPhoto(formData);
      toast.success('Foto profil berhasil diubah');
      updateUser({ foto_url: res.data.foto_url });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleTtdChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran tanda tangan maksimal 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('ttd', file);

    setIsUploadingTtd(true);
    try {
      const res = await uploadTtd(formData);
      toast.success('Tanda tangan berhasil diubah');
      updateUser({ ttd_url: res.data.ttd_url });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah tanda tangan');
    } finally {
      setIsUploadingTtd(false);
      // Reset input
      if (ttdInputRef.current) ttdInputRef.current.value = '';
    }
  };

  const openTtdDialog = () => {
    ttdInputRef.current?.click();
  };

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
            {user?.foto_url ? (
              <img src={user.foto_url} alt="Profile" className="w-20 h-20 bg-gray-100 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 bg-[#8B0000] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {user?.nama_lengkap?.charAt(0) || 'U'}
              </div>
            )}
            
            <button 
              onClick={openFileDialog}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#8B0000] rounded-full flex items-center justify-center text-white border-2 border-white hover:bg-red-800 transition disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Foto Profil</p>
            <p className="text-xs text-gray-400">Unggah foto format JPG, PNG maks. 2MB</p>
            <div className="flex gap-2 mt-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
              <Button size="sm" variant="primary" onClick={openFileDialog} loading={isUploading}>
                Ubah Foto
              </Button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Nama Lengkap</label>
            <div className="input-field bg-gray-50 text-gray-700">
              {user?.nama_lengkap || '—'}
            </div>
          </div>
          <div>
            <label className="label-field">NIP / ID Pegawai</label>
            <div className="input-field bg-gray-50 text-gray-700">
              {user?.nip || '—'}
            </div>
          </div>
          <div>
            <label className="label-field">Username</label>
            <div className="input-field bg-gray-50 text-gray-700 flex items-center gap-2">
              <AtSign className="w-4 h-4 text-gray-400" />
              {user?.username || '—'}
            </div>
          </div>
          <div>
            <label className="label-field">Alamat Email</label>
            <div className="input-field bg-gray-50 text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Tanda Tangan Kajur */}
      {user?.role === 'kajur' && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-[#8B0000]" />
            Tanda Tangan Elektronik
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.ttd_url ? (
                <img src={user.ttd_url} alt="Tanda Tangan" className="h-20 w-auto bg-gray-50 border border-gray-200 rounded-lg p-2 object-contain" />
              ) : (
                <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium border border-dashed border-gray-300">
                  Belum ada
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">File Tanda Tangan</p>
              <p className="text-xs text-gray-400">Unggah foto format PNG transparan maks. 2MB</p>
              <div className="flex gap-2 mt-2">
                <input 
                  type="file" 
                  ref={ttdInputRef}
                  onChange={handleTtdChange}
                  accept=".png"
                  className="hidden"
                />
                <Button size="sm" variant="outline" onClick={openTtdDialog} loading={isUploadingTtd}>
                  Ubah Tanda Tangan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
