import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowLeft, Calendar, User, Share2, FileText } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const { posts = [] } = useAdmin(); // Ambil data artikel/berita asli dari database Laravel

  // Cari berita berdasarkan ID dari database MySQL
  const blog = posts.find((b) => String(b.id) === String(id));

  // Fungsi share sederhana
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
        </Link>

        {!blog ? (
          /* Tampilan ketika artikel tidak ditemukan atau belum ada di database */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Berita atau artikel yang Anda cari mungkin telah dihapus oleh admin atau belum terdaftar di database.
            </p>
            <Link
              to="/blog"
              className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-500 transition"
            >
              Lihat Berita Lainnya
            </Link>
          </div>
        ) : (
          /* Tampilan Detail Artikel Asli dari Database MySQL */
          <article className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
            <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {blog.category || 'Berita'}
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-emerald-600" /> {blog.author || 'Admin'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-emerald-600" /> {blog.date || blog.created_at?.split('T')[0]}
                </span>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-bold transition"
              >
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-80 sm:h-96 bg-slate-100">
              <img 
                src={blog.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800'} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
              {blog.content}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}