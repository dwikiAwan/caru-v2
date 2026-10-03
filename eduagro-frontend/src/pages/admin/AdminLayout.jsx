import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, Sprout, Home, ExternalLink, Calendar, Mail, User, Wallet } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Produk', path: '/admin/products', icon: Package },
    { name: 'Pesanan & Transaksi', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Keuangan & Pendapatan', path: '/admin/finance', icon: Wallet },
    { name: 'Reservasi Wisata', path: '/admin/reservations', icon: Calendar },
    { name: 'Pesan Kontak', path: '/admin/messages', icon: Mail },
    { name: 'Artikel & Berita', path: '/admin/posts', icon: FileText },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar Navigasi Admin - Profesional Solid */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-800 shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block leading-tight">Admin Caru</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Eduagrowisata</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 grow overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-2 tracking-wider">Menu Utama</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-1.5 bg-slate-950/40">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2"><Home className="w-4 h-4" /> Lihat Web Publik</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Konten Utama Admin */}
      <div className="grow flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Panel Pengelola Eduagrowisata Caru</h2>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user?.name || user?.username || 'Admin Komunitas Petani'}</span>
          </div>
        </header>

        <main className="p-8 grow overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}