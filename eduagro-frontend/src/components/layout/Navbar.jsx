import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

import { 
  Sprout, ShoppingBag, User, Menu, X, ArrowRight, LogOut, MessageSquare 
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const { user, isLoggedIn, logout, firstName } = useAuth();
  const { reservations = [], orders = [] } = useAdmin();

  const isActive = (path) => location.pathname === path;

  // Cek apakah ada status aktif (reservasi pending ATAU pesanan pending/diproses/dikirim)
  const hasActiveStatus = () => {
    const activeReservations = reservations.some((r) => {
      const status = (r.status || '').toLowerCase();
      return status === 'pending' || status === 'menunggu';
    });

    const activeOrders = orders.some((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'pending' || status === 'diproses' || status === 'dikirim' || status === 'pengemasan' || status === 'pengiriman';
    });

    return activeReservations || activeOrders;
  };

  const showNotificationDot = hasActiveStatus();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Produk', path: '/marketplace' },
    { name: 'Layanan', path: '/services' },
    { name: 'Berita', path: '/blog' },
    { name: 'Kontak', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-700/20 group-hover:bg-emerald-600 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                Eduagrowisata <span className="text-emerald-700">Caru</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 -mt-0.5">
                Ponorogo • Jawa Timur
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop (Container Abu-Abu Tegas dengan Border) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Akses Chat, Keranjang & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Ikon Chat */}
            <Link
              to="/chat"
              className={`p-2.5 rounded-2xl transition group relative border ${
                isActive('/chat')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-emerald-700'
              }`}
              title="Pusat Chat & Status Notifikasi"
            >
              <MessageSquare className="w-5 h-5" />
              {showNotificationDot && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 border-2 border-white"></span>
                </span>
              )}
            </Link>

            {/* Keranjang Belanja */}
            <Link
              to="/cart"
              className={`p-2.5 rounded-2xl transition group relative border ${
                isActive('/cart')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-emerald-700'
              }`}
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white text-[11px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-slate-300 my-auto" />

            {/* User Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/chat'}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200/80 transition"
                >
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>Halo, {firstName}!</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-2xl transition cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-600 rounded-2xl shadow-md shadow-emerald-700/20 transition hover:-translate-y-0.5"
                >
                  Daftar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Menu Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block py-2.5 text-sm font-extrabold rounded-xl px-4 border transition ${
                isActive(link.path)
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'text-slate-800 hover:text-emerald-700 hover:bg-slate-100 border-transparent'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              to="/chat"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-slate-800 bg-slate-100 border border-slate-200 rounded-2xl font-extrabold text-xs relative"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" /> Pusat Chat & Status
              {showNotificationDot && (
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-slate-800 bg-slate-100 border border-slate-200 rounded-2xl font-extrabold text-xs"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" /> Keranjang Belanja ({totalItems})
            </Link>

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-center text-xs font-extrabold text-slate-800 bg-slate-100 border border-slate-200 rounded-2xl"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-center text-xs font-extrabold text-white bg-emerald-700 rounded-2xl shadow-md"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}