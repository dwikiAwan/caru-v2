import { Sprout, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Sprout className="w-6 h-6 text-emerald-500" />
            <span>Eduagrowisata Caru</span>
          </div>
          <p className="text-sm text-slate-400">
            Wujud kolaborasi 20+ petani lokal Ponorogo dalam mengembagkan budidaya anggur, wisata edukasi, dan bibit berkualitas.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navigasi</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/" className="hover:text-emerald-400">Beranda</a></li>
            <li><a href="/about" className="hover:text-emerald-400">Tentang Agrowisata</a></li>
            <li><a href="/marketplace" className="hover:text-emerald-400">Katalog Produk</a></li>
            <li><a href="/blog" className="hover:text-emerald-400">Artikel Edukasi</a></li>
          </ul>
        </div>

        {/* Category */}
        <div>
          <h4 className="text-white font-semibold mb-4">Produk Utama</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-emerald-400">Bibit Anggur Impor</a></li>
            <li><a href="#" className="hover:text-emerald-400">Buah Anggur Segar</a></li>
            <li><a href="#" className="hover:text-emerald-400">Pupuk & Alat Pruning</a></li>
            <li><a href="#" className="hover:text-emerald-400">Paket Wisata Edukasi</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Lokasi & Kontak</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Bajang, Kec. Mlarak, Kabupaten Ponorogo, Jawa Timur</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>info@eduagrowisatacaru.or.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Eduagrowisata Caru. Developed with Laravel & React.
      </div>
    </footer>
  );
}