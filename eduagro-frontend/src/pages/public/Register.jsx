import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, User, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await register(
      formData.name,
      formData.username,
      formData.email || `${formData.username}@eduagro.com`,
      formData.password
    );

    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex items-center justify-center p-4 lg:p-6 font-sans text-slate-900 box-border">
      
      {/* Container Utama Split-Screen (Paten 100% di dalam viewport, tanpa scroll) */}
      <div className="w-full max-w-5xl h-full max-h-[620px] bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Sisi Kiri: Branding / Banner Eduagrowisata */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" /> Eduagrowisata Caru
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight leading-snug">
                Bergabung Bersama Komunitas & Marketplace Kami
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Buat akun untuk mulai menikmati kemudahan berbelanja produk pertanian segar, reservasi wisata kebun, dan akses pengelolaan agrowisata.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 relative z-10 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Akses penuh ke marketplace & reservasi kebun</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Pembaruan edukasi pertanian & berita terbaru</span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Form Register */}
        <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-center bg-white overflow-hidden">
          <div className="max-w-md w-full mx-auto space-y-4">
            
            <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Akun Baru</h2>
              <p className="text-xs font-medium text-slate-500">
                Lengkapi data di bawah ini untuk membuat akun Eduagrowisata.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs font-medium">
              
              <div className="space-y-0.5">
                <label className="block text-slate-700 font-bold">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="block text-slate-700 font-bold">Username</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    placeholder="Contoh: budis"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="block text-slate-700 font-bold">Email (Opsional)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="budi@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="block text-slate-700 font-bold">Password (Minimal 6 Karakter)</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses Pendaftaran...
                  </>
                ) : (
                  <>
                    Daftar Sekarang <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                Masuk di sini
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}