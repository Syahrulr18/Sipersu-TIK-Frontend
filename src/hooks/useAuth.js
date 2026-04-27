import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '@/api/auth.api';
import useAuthStore from '@/store/authStore';

/**
 * Hook for login mutation.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const { user, token } = res.data;
      loginStore(user, token);
      toast.success(`Selamat datang, ${user.nama_lengkap}!`);
      navigate('/dashboard');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Login gagal';
      toast.error(msg);
    },
  });
};

/**
 * Hook for logout mutation.
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      navigate('/login');
    },
    onError: () => {
      // Force logout even on error
      logoutStore();
      navigate('/login');
    },
  });
};

/**
 * Hook for updating profile.
 */
export const useUpdateProfile = () => {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      updateUser(res.data.user);
      toast.success('Profil berhasil diperbarui');
    },
  });
};

/**
 * Hook for changing password.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Kata sandi berhasil diubah');
    },
  });
};
