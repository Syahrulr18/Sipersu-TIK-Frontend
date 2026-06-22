import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, ArrowRight, Mail, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useLogin } from '@/hooks/useAuth';
import useAuthStore from '@/store/authStore';

const loginSchema = z.object({
  nip: z.string().min(1, 'NIP wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

/**
 * Login page — matches the mockup precisely.
 * Centered card with logo, NIP input, password input, and login button.
 */
const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const { mutate: loginApi, isPending } = useLogin();

  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { nip: '', password: '' },
  });

  const onSubmit = (data) => {
    loginApi(data, {
      onError: (error) => {
        const msg = error.response?.data?.message || 'Terjadi kesalahan saat login';
        setLoginError(msg);
      }
    });
  };

  // Demo login for testing without backend
  const handleDemoLogin = (role) => {
    const demoUsers = {
      administrator: {
        id: 1,
        nama_lengkap: 'Admin',
        nip: '198705222015041002',
        email: 'admin.tik@poliupg.ac.id',
        username: 'admin_jurusan',
        role: 'administrator',
        jurusan: 'Teknik Informatika & Komputer',
      },
      verifikator: {
        id: 2,
        nama_lengkap: 'Dr. Ahmad Verifikator',
        nip: '197801012006041001',
        email: 'verifikator@poliupg.ac.id',
        username: 'verifikator1',
        role: 'verifikator',
        jurusan: 'Teknik Informatika & Komputer',
      },
      kajur: {
        id: 3,
        nama_lengkap: 'Prof. Budi Santoso, S.T., M.Kom',
        nip: '197505152003121001',
        email: 'kajur.tik@poliupg.ac.id',
        username: 'kajur_tik',
        role: 'kajur',
        jurusan: 'Teknik Informatika & Komputer',
      },
      dosen: {
        id: 4,
        nama_lengkap: 'Ir. Siti Aminah, M.T.',
        nip: '198201032010122001',
        email: 'siti.aminah@poliupg.ac.id',
        username: 'siti_aminah',
        role: 'dosen',
        jurusan: 'Teknik Informatika & Komputer',
      },
    };

    loginStore(demoUsers[role], 'demo-token-' + role);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo_PNUP.png" alt="Logo PNUP" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            SIPERSU TIK PNUP
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="NIP"
            icon={<User className="w-4 h-4" />}
            error={errors.nip?.message}
            {...register('nip')}
          />

          <Input
            type="password"
            placeholder="Password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isPending}
            className="mt-6 py-3"
          >
            Login
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 mb-2">
            Gunakan NIP dan password akun Anda untuk masuk.<br/>
            Hubungi administrator jika mengalami kendala.
          </p>
        </div>
      </div>

        {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 SIPERSU TIK PNUP
      </p>

      {/* Error Overlay */}
      <Modal
        isOpen={!!loginError}
        onClose={() => setLoginError('')}
        title="Login Gagal"
        size="sm"
        footer={
          <div className="flex justify-end w-full">
            <Button onClick={() => setLoginError('')} variant="primary">
              Mengerti
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-gray-600 text-center mb-2">
            Peringatan:
          </p>
          <p className="text-gray-900 font-medium text-center">
            {loginError || 'NIP atau Password yang Anda masukkan salah.'}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
