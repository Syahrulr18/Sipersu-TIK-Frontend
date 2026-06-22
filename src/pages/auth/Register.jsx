import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, ArrowRight, Mail, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { register as registerApi } from '@/api/auth.api';

const registerSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi'),
  nip: z.string().optional(),
  jabatan: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
});

const Register = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama_lengkap: '',
      email: '',
      password: '',
      password_confirmation: '',
      nip: '',
      jabatan: ''
    },
  });

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      await registerApi(data);
      toast.success('Pendaftaran berhasil. Silakan login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md my-8">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo_PNUP.png" alt="Logo PNUP" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            BUAT AKUN BARU
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Nama Lengkap"
            icon={<User className="w-4 h-4" />}
            error={errors.nama_lengkap?.message}
            {...register('nama_lengkap')}
          />

          <Input
            type="email"
            placeholder="Email"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="NIP (Opsional)"
              icon={<Briefcase className="w-4 h-4" />}
              error={errors.nip?.message}
              {...register('nip')}
            />
            <Input
              placeholder="Jabatan (Opsional)"
              icon={<Briefcase className="w-4 h-4" />}
              error={errors.jabatan?.message}
              {...register('jabatan')}
            />
          </div>

          <Input
            type="password"
            placeholder="Password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            type="password"
            placeholder="Konfirmasi Password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isPending}
            className="mt-6 py-3"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#8B0000] hover:underline font-medium"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 SIPERSU TIK PNUP
      </p>
    </div>
  );
};

export default Register;
