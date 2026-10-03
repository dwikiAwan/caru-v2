import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, isLoggedIn } = useAuth();

  // 1. Cek status login dasar (apakah token/state login tersedia)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek hak akses admin:
  // - Mengakomodasi jika user memegang role/isAdmin dari DB
  // - Atau jika akun yang login menggunakan username/email admin utama
  const isAdmin = 
    user?.role === 'admin' || 
    user?.isAdmin === true || 
    user?.username === 'admin' || 
    user?.email === 'admin@gmail.com';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Jika terverifikasi sebagai admin, tampilkan route anak (AdminLayout & halaman admin)
  return <Outlet />;
}