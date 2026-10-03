import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, User, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk Fitur Forgot Password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(usernameOrEmail, password);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.user && result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan koneksi ke server. Silakan coba lagi.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess('');
    
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess('Instruksi pemulihan kata sandi telah dikirim ke email Anda. Silakan periksa inbox atau folder spam.');
    }, 1500);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex items-center justify-center p-4 lg:p-6 font-sans text-slate-900 box-border">
      
      {/* Container Utama Split-Screen (Paten 100% di dalam viewport, tanpa scroll) */}
      <div className="w-full max-w-5xl h-full max-h-[580px] bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Sisi Kiri: Branding / Banner Eduagrowisata */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" /> Eduagrowisata Caru
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight leading-snug">
                Pusat Edukasi & Marketplace Agrowisata Unggulan
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Kelola pesanan marketplace, agrowisata petik buah, dan reservasi kunjungan edukasi dalam satu sistem terpusat.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 relative z-10 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Transparansi pesanan & reservasi real-time</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Varietas bibit & buah anggur berkualitas tinggi</span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-center bg-white overflow-hidden">
          <div className="max-w-md w-full mx-auto space-y-4">
            
            <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
              <p className="text-xs font-medium text-slate-500">
                Masukkan kredensial akun Anda untuk masuk ke sistem.
              </p>
            </div>

            {/* Notifikasi Error */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-medium">
              
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Username atau Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: caru@gmail.com"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-700 font-bold">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotSuccess('');
                    }}
                    className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa Kredensial...
                  </>
                ) : (
                  <>
                    Masuk Sekarang <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:underline">
                Daftar Akun Baru
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* Modal / Popup Fitur Lupa Kata Sandi */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl space-y-3 shadow-2xl border border-slate-100">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">Pemulihan Kata Sandi</h3>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Masukkan alamat email atau username yang terdaftar untuk menerima instruksi pemulihan kata sandi.
            </p>

            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Email atau Username</label>
                <input
                  type="text"
                  required
                  placeholder="nama@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
                />
              </div>

              <div className="pt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-2 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer text-xs"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-2 text-xs"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    'Kirim Instruksi'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}