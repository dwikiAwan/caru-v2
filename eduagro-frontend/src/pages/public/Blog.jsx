import { useAdmin } from '../../context/AdminContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';

export default function Blog() {
  // Ambil data posts dari AdminContext (Database Laravel)
  const { posts = [] } = useAdmin();

  // Urutkan postingan agar yang terbaru (ID tertinggi/paling baru ditambahkan) berada di paling atas
  const sortedPosts = [...posts].reverse();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        
        {/* Header Seksi Berita */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-emerald-200/80 shadow-xs">
            Kabar Komunitas & Publikasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Berita & Artikel Budidaya Anggur
          </h1>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Kumpulan berita kegiatan pengabdian masyarakat, informasi panen, serta artikel teknik perawatan tanaman anggur di Dusun Caru.
          </p>
        </div>

        {/* Jika belum ada artikel terdaftar dari Admin */}
        {sortedPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-3 shadow-xl max-w-md mx-auto">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">Belum Ada Artikel/Berita</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Saat ini belum ada artikel yang diterbitkan. Artikel terbaru akan langsung ditampilkan di sini setelah diunggah oleh Admin.
            </p>
          </div>
        ) : (
          /* Grid 2 Card Per Baris (Menumpuk ke Bawah) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-lg group"
              >
                {/* Visual Gambar Artikel */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img 
                    src={post.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800'} 
                    alt={post.title} 
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    {post.category || 'Berita'}
                  </span>
                </div>

                {/* Isi Konten Artikel */}
                <div className="p-6 space-y-4 grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                      {post.excerpt || post.content}
                    </p>
                  </div>

                  {/* Metadata & Navigasi */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> {post.author || 'Admin'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> {post.date || post.created_at?.split('T')[0]}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-extrabold text-xs transition"
                    >
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}