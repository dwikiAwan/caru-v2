import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { CheckCircle2, ArrowLeft, Loader2, ShieldCheck, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useAdmin();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address: '',
    method: 'Transfer Bank (QRIS)',
  });

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);

    const itemsData = cartItems.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    }));

    if (addOrder) {
      await addOrder({
        customer: shipping.name,
        phone: shipping.phone,
        items: itemsData,
        total: totalPrice,
        status: 'Menunggu Verifikasi',
      });
    }

    setLoading(false);
    setCompleted(true);
    clearCart();
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-black selection:bg-emerald-500 selection:text-white">
        <Navbar/>
        <main className="grow max-w-lg mx-auto px-4 py-16 text-center space-y-4 my-auto w-full">
          {/* Card Sukses dengan Border & Shadow Tegas */}
          <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-5 text-left">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-slate-900 rounded-xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]"/>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                Pesanan Berhasil!
              </h1>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Instruksi pembayaran dan konfirmasi rincian pesanan telah diteruskan ke pengelola <span className="font-bold text-black">Eduagrowisata Caru</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-2 text-xs font-mono text-black">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-600">Status</span>
                <span className="font-bold text-emerald-600 uppercase">Menunggu Verifikasi</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Metode</span>
                <span className="font-bold text-black">{shipping.method}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
            >
              Kembali ke Marketplace
            </button>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-black selection:bg-emerald-500 selection:text-white">
      <Navbar/>
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
          <div>
            <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-emerald-700 transition mb-2" to="/cart">
              <ArrowLeft className="w-4 h-4 stroke-[3]"/> Kembali ke Keranjang
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Form Pengiriman & Checkout
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border-2 border-slate-900 rounded-lg text-xs font-bold text-emerald-950 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0"/>
            Transaksi Aman & Terverifikasi
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Pengiriman */}
          <form 
            onSubmit={handleProcessOrder} 
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-5 text-xs font-medium"
          >
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <MapPin className="w-5 h-5 text-emerald-600 stroke-[2.5]"/>
              <h3 className="text-base font-black uppercase tracking-wider text-black">Alamat Pengiriman</h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                Nama Penerima <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={shipping.name}
                onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                Nomor WhatsApp Penerima <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="081234567890"
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                Alamat Lengkap Pengiriman <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows="3"
                placeholder="Nama Jalan, No. Rumah, RT/RW, Desa/Kecamatan, Kabupaten, Kode Pos"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition resize-none"
              ></textarea>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600 stroke-[2.5]"/>
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                  Metode Pembayaran
                </label>
              </div>
              <select
                value={shipping.method}
                onChange={(e) => setShipping({ ...shipping, method: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black cursor-pointer transition"
              >
                <option value="Transfer Bank (QRIS)" className="text-black">Transfer Bank / Instant QRIS</option>
                <option value="COD (Bayar di Tempat)" className="text-black">COD (Bayar saat Pengambilan di Kebun)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin"/> Memproses Transaksi...
                </>
              ) : (
                `Bayar Sekarang • Rp ${totalPrice.toLocaleString('id-ID')}`
              )}
            </button>
          </form>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <ShoppingBag className="w-5 h-5 text-emerald-600 stroke-[2.5]"/>
              <h3 className="text-base font-black uppercase tracking-wider text-black">Ringkasan Barang</h3>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y-2 divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-slate-900 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-black text-sm leading-tight">{item.name}</h4>
                      <span className="font-semibold text-slate-600 text-[11px]">
                        {item.qty} x Rp {Number(item.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-black text-sm pl-2">
                    Rp {(item.qty * Number(item.price || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-slate-900 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-700 text-xs">
                <span>Subtotal Produk</span>
                <span className="text-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-slate-700 text-xs">
                <span>Biaya Pengiriman</span>
                <span className="text-emerald-700 uppercase font-black">Gratis / Penyesuaian</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-black text-black uppercase text-xs tracking-wider">Total Pembayaran</span>
                <span className="text-xl font-black text-emerald-700">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer/>
    </div>
  );
}