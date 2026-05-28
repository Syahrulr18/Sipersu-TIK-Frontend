import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import useAuthStore from '@/store/authStore';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import PublicRoute from './PublicRoute';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import DaftarSurat from '@/pages/surat/DaftarSurat';
import DetailSuratWrapper from '@/pages/surat/DetailSuratWrapper';
import EditKonten from '@/pages/surat/EditKonten';
import Verifikasi from '@/pages/verifikasi/Verifikasi';
import TandaTangan from '@/pages/tandatangan/TandaTangan';
import PersetujuanSurat from '@/pages/tandatangan/PersetujuanSurat';
import Notifikasi from '@/pages/notifikasi/Notifikasi';
import ManajemenUser from '@/pages/admin/ManajemenUser';
import Profil from '@/pages/profil/Profil';

/**
 * AppRoutes — defines all application routes.
 */
const AppRoutes = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const defaultRedirect = isAuthenticated ? '/dashboard' : '/login';

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes with MainLayout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/surat" element={<DaftarSurat />} />
        <Route path="/surat/:id" element={<DetailSuratWrapper />} />
        <Route
          path="/surat/:id/edit-konten"
          element={
            <RoleRoute roles={['administrator']}>
              <EditKonten />
            </RoleRoute>
          }
        />
        <Route
          path="/verifikasi"
          element={
            <RoleRoute roles={['verifikator']}>
              <Verifikasi />
            </RoleRoute>
          }
        />
        <Route
          path="/tandatangan"
          element={
            <RoleRoute roles={['kajur']}>
              <TandaTangan />
            </RoleRoute>
          }
        />
        <Route
          path="/tandatangan/:id"
          element={
            <RoleRoute roles={['kajur']}>
              <PersetujuanSurat />
            </RoleRoute>
          }
        />
        <Route path="/notifikasi" element={<Notifikasi />} />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={['administrator']}>
              <ManajemenUser />
            </RoleRoute>
          }
        />
        <Route path="/profil" element={<Profil />} />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
      <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
    </Routes>
  );
};

export default AppRoutes;
