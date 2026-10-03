import { useCart } from '../../context/CartContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Halaman */}
        <div className="border-b-2 border-slate-900 pb-5">
          <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-md border border-slate-900 inline-block mb-2">
            Marketplace Agrowisata
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Keranjang Belanja</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-900 space-y-4 shadow-xs">
            <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto stroke-[1.5]" />
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Keranjang Anda Masih Kosong</h2>
              <p className="text-slate-600 text-xs font-semibold">Ayo jelajahi varietas bibit dan buah anggur segar kami.</p>
            </div>
            <div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-slate-900 shadow-xs transition"
              >
                Belanja Sekarang
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Daftar Produk dalam Keranjang */}
            <div className="lg:col-span-8 bg-white rounded-2xl border-2 border-slate-900 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-200 border-b-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-900">
                Item Terpilih ({cartItems.length})
              </div>
              
              <div className="divide-y-2 divide-slate-300 p-6 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-slate-900 bg-slate-100 shrink-0" 
                      />
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-900 text-sm leading-snug">{item.name}</h3>
                        <span className="text-emerald-700 font-black text-xs block">
                          Rp {Number(item.price || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t-2 sm:border-t-0 border-slate-200">
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center border-2 border-slate-900 rounded-xl bg-slate-100 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2.5 text-slate-900 hover:bg-slate-300 transition cursor-pointer"
                          title="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="px-4 font-black text-xs text-slate-900 border-x-2 border-slate-900 bg-white py-2.5">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2.5 text-slate-900 hover:bg-slate-300 transition cursor-pointer"
                          title="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl border-2 border-slate-900 transition cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ringkasan Belanja */}
            <div className="lg:col-span-4 bg-white rounded-2xl border-2 border-slate-900 p-6 space-y-6 sticky top-24 shadow-2xs">
              <div className="border-b-2 border-slate-900 pb-3">
                <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Ringkasan Pesanan</h3>
              </div>

              <div className="space-y-3 text-xs font-bold text-slate-700 pb-5 border-b-2 border-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-black text-slate-900">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estimasi Pengiriman</span>
                  <span className="font-black text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded border-2 border-slate-900 text-[10px] uppercase">
                    Dihitung di Checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border-2 border-slate-900">
                <span className="text-xs font-black text-slate-900 uppercase">Total Bayar</span>
                <span className="text-emerald-700 text-base font-black">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Lanjut ke Pembayaran <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}