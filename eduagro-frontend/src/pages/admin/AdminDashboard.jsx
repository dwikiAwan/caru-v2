import { useAdmin } from '../../context/AdminContext';
import { Package, ShoppingCart, Calendar, Mail, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { 
    products = [], 
    orders = [], 
    reservations = [], 
    messages = [] 
  } = useAdmin() || {};

  // Ambil 5 transaksi & reservasi terbaru
  const recentOrders = orders.slice(0, 5);
  const recentReservations = reservations.slice(0, 5);

  return (
    <div className="space-y-8 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Banner Ringkasan */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider border border-slate-900">
            Panel Kontrol Administrator
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white pt-1">
            Selamat Datang, Admin Agrowisata 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Ringkasan aktivitas transaksi, reservasi, dan ulasan/pesan pengunjung hari ini.
          </p>
        </div>
      </div>

      {/* Grid Statistik Real-time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Pesanan */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-emerald-100 text-emerald-950 border-2 border-slate-900 rounded-xl w-fit">
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Total Pesanan</span>
            <h3 className="text-2xl font-black text-black">{orders?.length || 0} Transaksi</h3>
          </div>
        </div>

        {/* Produk Terdaftar */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-sky-100 text-sky-950 border-2 border-slate-900 rounded-xl w-fit">
            <Package className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Produk Terdaftar</span>
            <h3 className="text-2xl font-black text-black">{products?.length || 0} Item</h3>
          </div>
        </div>

        {/* Reservasi Wisata */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-indigo-100 text-indigo-950 border-2 border-slate-900 rounded-xl w-fit">
            <Calendar className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Reservasi Wisata</span>
            <h3 className="text-2xl font-black text-black">{reservations?.length || 0} Pengajuan</h3>
          </div>
        </div>

        {/* Pesan & Ulasan */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-amber-100 text-amber-950 border-2 border-slate-900 rounded-xl w-fit">
            <Mail className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Pesan & Ulasan</span>
            <h3 className="text-2xl font-black text-black">{messages?.length || 0} Pesan</h3>
          </div>
        </div>

      </div>

      {/* Tabel Ringkasan Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ringkasan Pesanan Terbaru */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
            <h2 className="text-base font-black text-black uppercase tracking-wide">Pesanan Masuk Terbaru</h2>
            <Link 
              to="/admin/orders" 
              className="text-xs font-black uppercase text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-xs font-bold border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              Belum ada transaksi pesanan masuk.
            </div>
          ) : (
            <div className="divide-y-2 divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex justify-between items-center text-xs font-bold">
                  <div>
                    <strong className="block text-black font-extrabold text-sm">{order.customer || order.name}</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{order.order_code || `ORD-${order.id}`}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="block font-black text-emerald-700 text-sm">
                      Rp {Number(order.total || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="bg-amber-100 text-amber-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-slate-900 inline-block">
                      {order.status || 'Menunggu'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ringkasan Reservasi Terbaru */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
            <h2 className="text-base font-black text-black uppercase tracking-wide">Reservasi Wisata Terbaru</h2>
            <Link 
              to="/admin/reservations" 
              className="text-xs font-black uppercase text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {recentReservations.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-xs font-bold border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              Belum ada pengajuan reservasi wisata.
            </div>
          ) : (
            <div className="divide-y-2 divide-slate-100">
              {recentReservations.map((rsv) => (
                <div key={rsv.id} className="py-3 flex justify-between items-center text-xs font-bold">
                  <div>
                    <strong className="block text-black font-extrabold text-sm">{rsv.name}</strong>
                    <span className="text-slate-600 flex items-center gap-1.5 text-[11px] font-semibold mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" /> {rsv.visit_date} ({rsv.total_people} Orang)
                    </span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-950 text-[10px] font-black uppercase px-2.5 py-1 rounded border border-slate-900 shrink-0">
                    {rsv.service_title || rsv.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}