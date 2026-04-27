import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, ArrowRight, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { nip: '', password: '' },
  });

  const onSubmit = (data) => {
    loginApi(data);
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
          <div className="w-14 h-14 bg-[#8B0000]/10 rounded-xl flex items-center justify-center mb-3">
            <Mail className="w-7 h-7 text-[#8B0000]" />
          </div>
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

        {/* Demo login buttons */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider mb-3">
            Demo Login (tanpa backend)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['administrator', 'verifikator', 'kajur', 'dosen'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoLogin(role)}
                className="px-3 py-1.5 text-[11px] font-medium border border-gray-200 rounded-lg
                           text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all capitalize"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 SIPERSU TIK PNUP
      </p>
    </div>
  );
};

export default Login;
