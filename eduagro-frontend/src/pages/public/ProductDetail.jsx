import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { Star, ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Sprout, PackageX } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products = [] } = useAdmin(); // Ambil data produk asli dari database Laravel

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Cari produk berdasarkan ID dari database MySQL
  const product = products.find((p) => String(p.id) === String(id));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Marketplace
        </Link>

        {!product ? (
          /* Tampilan ketika produk tidak ditemukan atau masih dimuat dari database */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4">
            <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Produk Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Produk yang Anda cari mungkin telah dihapus oleh admin atau belum terdaftar di database.
            </p>
            <Link
              to="/marketplace"
              className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-500 transition"
            >
              Lihat Katalog Lainnya
            </Link>
          </div>
        ) : (
          /* Tampilan Detail Produk dari Database MySQL */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 shadow-xs">
            {/* Gambar Produk */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden bg-slate-100 h-80 sm:h-96">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Detail */}
            <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-100">
                  Kategori: {product.category || 'Umum'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">{product.name}</h1>
                
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" /> {product.rating || 5.0}
                  </span>
                  <span>•</span>
                  <span>Terjual {product.sales || 0} item</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Stok: {product.stock || 0} pcs</span>
                </div>

                <div className="text-3xl font-black text-emerald-700 pt-2">
                  Rp {Number(product.price || 0).toLocaleString('id-ID')}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed pt-2 border-t border-slate-100 whitespace-pre-line">
                  {product.description || 'Tidak ada deskripsi produk.'}
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Jaminan Kualitas Hasil Tani Asli Ponorogo
                  </div>
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" /> Garansi Bibit Tumbuh dengan Pendampingan Petani
                  </div>
                </div>
              </div>

              {/* Aksi Tambah ke Keranjang */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 font-bold text-slate-600 hover:text-emerald-600"
                  >
                    -
                  </button>
                  <span className="px-4 font-black text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 font-bold text-slate-600 hover:text-emerald-600"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto grow py-3.5 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  {added ? <CheckCircle2 className="w-5 h-5 text-emerald-200" /> : <ShoppingBag className="w-5 h-5" />}
                  <span>{added ? 'Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}