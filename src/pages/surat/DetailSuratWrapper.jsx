import useAuthStore from '@/store/authStore';
import DetailSurat from './DetailSurat';
import DetailSuratDosen from './DetailSuratDosen';

const DetailSuratWrapper = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  if (role === 'dosen') {
    return <DetailSuratDosen />;
  }

  return <DetailSurat />;
};

export default DetailSuratWrapper;
