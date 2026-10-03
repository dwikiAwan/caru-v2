import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  SlidersHorizontal, 
  CheckCircle2, 
  PackageX,
  Sprout,
  Apple,
  Wine,
  Cookie
} from 'lucide-react';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();
  
  // Ambil data produk langsung dari AdminContext (Database Laravel)
  const { products = [] } = useAdmin();

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Mencegah perpindahan ke halaman detail saat klik tombol keranjang
    e.preventDefault();
    addToCart(product);
    setToastMessage(`"${product.name}" ditambahkan ke keranjang!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Helper Pemeta Satuan Otomatis berdasarkan Kategori atau Property Unit
  const getDisplayUnit = (product) => {
    if (product.unit) return product.unit;
    const cat = (product.category || '').toLowerCase();
    switch (cat) {
      case 'buah':
        return 'kg';
      case 'bibit':
      case 'jus':
        return 'qty';
      case 'keripik':
      case 'kripik':
        return 'pcs';
      default:
        return 'pcs';
    }
  };

  // Filter awal berdasarkan query pencarian
  const searchedProducts = products.filter((product) =>
    (product.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kategori yang tersedia beserta ikon dan deskripsinya
  const categoriesConfig = [
    { id: 'Buah', title: 'Buah Segar', icon: Apple, desc: 'Varietas buah anggur segar hasil panen kebun Eduagrowisata Caru.' },
    { id: 'Bibit', title: 'Bibit Unggul', icon: Sprout, desc: 'Bibit tanaman anggur impor pilihan yang siap dipindah tanam.' },
    { id: 'Jus', title: 'Jus Olahan', icon: Wine, desc: 'Minuman ekstrak buah anggur murni hasil olahan lokal.' },
    { id: 'Keripik', title: 'Keripik Olahan', icon: Cookie, desc: 'Camilan renyah olahan pucuk daun anggur kebun.' },
  ];

  // Komponen Reusable Card Produk (Borders Tegas & Shadow Berdimensi)
  const ProductCard = ({ product }) => {
    const unit = getDisplayUnit(product);

    return (
      <Link
        to={`/product/${product.id}`}
        className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-lg"
      >
        <div className="relative h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {product.category}
          </span>
        </div>

        <div className="p-5 flex flex-col justify-between grow space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" /> {product.rating || 5.0}
              </span>
              <span>Terjual {product.sales || 0}</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-700 transition">
              {product.name}
            </h3>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Harga</span>
              <span className="font-black text-emerald-700 text-base sm:text-lg">
                Rp {Number(product.price || 0).toLocaleString('id-ID')}
                <span className="text-[11px] font-semibold text-slate-500">/{unit}</span>
              </span>
            </div>

            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-700/20 transition cursor-pointer"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-extrabold">{toastMessage}</span>
        </div>
      )}

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Banner Marketplace dengan Shadow Tegas & Teks Faktual */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-md">
              Hasil Panen 20+ Petani Kebun Bajang
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight pt-1">
              Marketplace Produk & Bibit Anggur
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Katalog resmi penjualan varietas anggur impor segar, bibit pilihan berakar kuat, serta olahan makanan dan minuman khas Eduagrowisata Caru.
            </p>
          </div>
        </div>

        {/* Filter Bar (Box Putih Solid + Shadow & Border Jelas) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-md">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama produk atau bibit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 text-sm font-semibold"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <SlidersHorizontal className="w-5 h-5 text-slate-400 shrink-0 mr-1 hidden lg:block" />
            {['Semua', 'Buah', 'Bibit', 'Jus', 'Keripik'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Konten Produk */}
        {searchedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-3 shadow-xl max-w-lg mx-auto">
            <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">Belum Ada Produk Tersedia</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada item yang cocok dengan pencarian Anda. Silakan ganti kata kunci pencarian atau pilih kategori lainnya.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoriesConfig
              .filter((config) => selectedCategory === 'Semua' || selectedCategory === config.id)
              .map((config) => {
                const categoryProducts = searchedProducts.filter(
                  (p) => (p.category || '').toLowerCase() === config.id.toLowerCase()
                );

                if (categoryProducts.length === 0) return null;

                const CategoryIcon = config.icon;

                return (
                  <section key={config.id} className="space-y-6">
                    {/* Header Seksi Kategori */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 shadow-xs">
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            Kategori {config.title}
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">{config.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold bg-white text-slate-700 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        {categoryProducts.length} Produk
                      </span>
                    </div>

                    {/* Grid Produk Per Kategori */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}