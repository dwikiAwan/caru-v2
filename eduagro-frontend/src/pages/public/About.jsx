import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Sprout, Users, MapPin, Award, CheckCircle2, History } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-full shadow-sm">
            <span>Profil & Sejarah Komunitas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Pengembangan Lahan Budidaya <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Anggur Ponorogo</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            Eduagrowisata Caru didirikan oleh kelompok petani lokal di Dusun Caru, Desa Bajang, Kecamatan Mlarak, Ponorogo. Sejak 2021, kawasan seluas ±2.560 m² ini dikembangkan sebagai pusat percontohan budidaya anggur adaptif.
          </p>
        </section>

        {/* Sejarah & Stat Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
              <History className="w-5 h-5" />
              <span>Rekam Jejak Kegiatan (2021 - Sekarang)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Dari Lahan Pertanian Desa Menjadi Sarana Belajar Bersama
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Awalnya digagas oleh para petani yang ingin mengoptimalkan fungsi lahan dengan tanaman buah bernilai tambah tinggi. Melalui proses seleksi dan pendampingan teknik perawatan, area kebun kini mengelola puluhan varietas anggur pilihan serta menjadi ruang edukasi bagi masyarakat sekitar.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Kolaborasi aktif 20+ petani lokal Desa Bajang',
                'Pengelolaan 229+ pohon anggur produktif',
                'Area lahan percontohan seluas ±2.560 m²',
                'Penerapan teknik pemangkasan (pruning) terstruktur',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Stat Cards dengan Shadow & Border Tegas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-md">
              <Users className="w-7 h-7 text-emerald-700 mx-auto" />
              <div className="text-3xl font-black text-slate-900">20+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Petani Aktif</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-md">
              <Sprout className="w-7 h-7 text-teal-700 mx-auto" />
              <div className="text-3xl font-black text-slate-900">229+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pohon Anggur</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-md">
              <MapPin className="w-7 h-7 text-amber-700 mx-auto" />
              <div className="text-2xl sm:text-3xl font-black text-slate-900">±2.560 m²</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Luas Lahan</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-md">
              <Award className="w-7 h-7 text-indigo-700 mx-auto" />
              <div className="text-3xl font-black text-slate-900">2021</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tahun Berdiri</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}