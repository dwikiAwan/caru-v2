import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAdmin } from '../../context/AdminContext';
import { 
  Sprout, ShoppingBag, BookOpen, Users, MapPin, Award, 
  ArrowRight, CheckCircle2, Star, Sparkles, Leaf, Compass,
  GlassWater, Cookie, ChevronRight, Quote, MessageSquareQuote
} from 'lucide-react';

export default function Home() {
  const { messages = [] } = useAdmin();

  // Filter: Ambil ulasan bintang 5 (maksimal 10 ulasan terbaru)
  const topTestimonials = messages
    .filter((msg) => Number(msg.rating) === 5)
    .slice(0, 10);

  // Duplikasi array ulasan agar efek marquee horizontal berjalan mulus tanpa putus
  const displayTestimonials = topTestimonials.length > 0 
    ? [...topTestimonials, ...topTestimonials] 
    : [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-emerald-50/80 via-slate-100 to-slate-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Teks Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-emerald-200 text-emerald-800 text-xs font-extrabold rounded-full shadow-md backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Eduagrowisata Caru Ponorogo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Pusat Budidaya & <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Wisata Anggur</span> Ponorogo
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Kawasan budidaya seluas <span className="font-bold text-slate-900">±2.560 m²</span> di Dusun Caru yang dikelola bersama oleh <span className="font-bold text-slate-900">20+ petani lokal</span>. Kami merawat lebih dari <span className="font-bold text-slate-900">50 varietas anggur pilihan</span> yang telah teruji adaptif di iklim tropis.
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" /> Beli Produk & Bibit
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200/90 text-slate-700 font-extrabold rounded-2xl hover:bg-slate-50 transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-emerald-600" /> Reservasi Kunjungan
                </a>
              </div>

              {/* Keunggulan Utama */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap justify-center lg:justify-start gap-4 text-slate-700 text-xs font-bold">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 50 Varietas Adaptif
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Pendampingan Petani
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Petik Langsung di Kebun
                </div>
              </div>
            </div>

            {/* Visual Hero Image & Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800&auto=format&fit=crop&q=80"
                    alt="Eduagrowisata Caru Ponorogo"
                    className="w-full h-[440px] object-cover hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Berdiri Sejak 2021
                    </span>
                    <h3 className="text-xl font-bold mt-2">Dusun Caru, Desa Bajang</h3>
                    <p className="text-xs text-slate-200 mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Kec. Mlarak, Kabupaten Ponorogo
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">50 Varietas</div>
                    <div className="text-[11px] font-semibold text-slate-500">Anggur Impor Pilihan</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">20+ Petani</div>
                    <div className="text-[11px] font-semibold text-slate-500">Komunitas Lokal</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 3 PILAR KEUNGGULAN */}
      <section className="py-16 bg-slate-100 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition duration-300">
              <div className="p-4 bg-emerald-100/80 text-emerald-700 rounded-2xl w-fit mb-6 shadow-sm">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Bibit & Varietas Unggul</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pengembangan varietas anggur impor yang telah melewati proses seleksi adaptasi iklim lokal di Kebun Bajang.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 transition duration-300">
              <div className="p-4 bg-teal-100/80 text-teal-700 rounded-2xl w-fit mb-6 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Budidaya Terarah</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Penerapan teknik pemangkasan (*pruning*) dan perawatan rutin untuk menjaga produktivitas serta kualitas panen.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition duration-300">
              <div className="p-4 bg-amber-100/80 text-amber-700 rounded-2xl w-fit mb-6 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Edukasi & Pelatihan</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pusat pembelajaran terbuka bagi kelompok tani, pelajar, dan masyarakat umum yang ingin memelajari teknik tanam anggur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUK UNGGULAN SECTION */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Katalog Kebun
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Hasil Panen & Produk Olahan</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Produk segar dan hasil olahan langsung dari kebun anggota komunitas petani Eduagrowisata Caru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-100 text-emerald-700 rounded-2xl w-fit shadow-sm">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Buah Anggur Segar</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Buah anggur siap konsumsi yang dipetik saat tingkat kematangan optimal di kebun.
                </p>
              </div>
              <a href="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2">
                Lihat Stok Buah <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 bg-teal-100 text-teal-700 rounded-2xl w-fit shadow-sm">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bibit Anggur Siap Tanam</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bibit varietas anggur impor dengan sistem perakaran sehat dan siap dipindah ke pot/lahan.
                </p>
              </div>
              <a href="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2">
                Pilih Bibit <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-100 text-indigo-700 rounded-2xl w-fit shadow-sm">
                  <GlassWater className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Jus Anggur Murni</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Minuman olahan ekstrak buah anggur murni hasil produksi usaha mikro warga lokal.
                </p>
              </div>
              <a href="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2">
                Pesan Jus <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-100 text-amber-700 rounded-2xl w-fit shadow-sm">
                  <Cookie className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Keripik Olahan Daun</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Camilan renyah olahan pucuk daun anggur sebagai produk inovasi olahan sampingan kebun.
                </p>
              </div>
              <a href="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2">
                Cek Camilan <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EDUKASI WISATA SECTION */}
      <section className="py-20 bg-slate-200/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Alur Kunjungan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Program Edukasi & Agrowisata</h2>
            <p className="text-slate-600 text-sm">
              Pengalaman langsung belajar budidaya anggur bersama pendamping lapangan di lokasi kebun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Pengenalan Kebun',
                desc: 'Mengenal pemetaan area tanam dan sejarah awal pembentukan kebun budidaya di Dusun Caru.',
              },
              {
                step: '02',
                title: 'Mengenal Varietas',
                desc: 'Melihat perbedaan karakteristik daun, pertumbuhan, dan karakter buah dari 50 varietas anggur.',
              },
              {
                step: '03',
                title: 'Praktik & Perawatan',
                desc: 'Mempelajari dasar teknik pemangkasan (*pruning*), pemupukan, dan perbanyakan bibit.',
              },
              {
                step: '04',
                title: 'Panen & Olahan',
                desc: 'Menikmati sensasi petik buah anggur saat musim panen tiba serta mencicipi produk olahan kebun.',
              },
            ].map((act, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md relative space-y-3 hover:border-slate-300 hover:shadow-lg transition">
                <span className="text-3xl font-black text-emerald-300 block">{act.step}</span>
                <h3 className="text-lg font-bold text-slate-900">{act.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONI PENGUNJUNG SECTION (CARD PUTIH DIBERBESAR DENGAN SHADOW TEGAS) */}
      <section className="py-16 bg-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Pengalaman Pengunjung
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Tanggapan Pengunjung Kebun</h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Ulasan nyata dari wisatawan, pembeli bibit, dan peserta kegiatan edukasi di Eduagrowisata Caru.
            </p>
          </div>

          {topTestimonials.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xl space-y-2 max-w-md mx-auto">
              <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Belum ada ulasan terdaftar. Ulasan yang dikirim pengunjung melalui halaman Kontak akan muncul di sini.
              </p>
            </div>
          ) : (
            /* Container Marquee Horizontal Smooth Scroll */
            <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
              <div className="flex flex-row flex-nowrap gap-4 w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] py-2">
                {displayTestimonials.map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    /* Ukuran Card Ditingkatkan ke w-72 sm:w-80 dengan Background Putih & Shadow Tegas */
                    className="w-72 sm:w-80 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xl flex flex-col justify-between shrink-0 hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 select-none"
                  >
                    {/* Pesan Ulasan */}
                    <div className="space-y-2.5">
                      <Quote className="w-5 h-5 text-emerald-500/60" />
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4">
                        "{review.message}"
                      </p>
                    </div>

                    {/* Bagian Bawah: Nama, Pengunjung Kebun, dan Bintang di Bawahnya */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-end justify-between">
                      <div className="space-y-1">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs leading-tight truncate max-w-[180px]">
                            {review.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                            Pengunjung Kebun
                          </p>
                        </div>

                        {/* Bintang Rating Tepat di Bawah Tulisan "Pengunjung Kebun" */}
                        <div className="flex gap-0.5 text-amber-400 pt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 stroke-none" />
                          ))}
                        </div>
                      </div>

                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mb-1 shadow-sm"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. CALL TO ACTION & BERITA TERKINI */}
      <section className="py-16 bg-gradient-to-br from-emerald-800 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ingin Mengetahui Perkembangan Kebun Kami?</h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
            Ikuti berita kegiatan panen, jadwal pelatihan budidaya, dan kabar pengabdian masyarakat di Desa Bajang.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-900 font-extrabold rounded-2xl shadow-xl hover:bg-emerald-50 transition cursor-pointer"
          >
            Baca Berita & Kegiatan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}