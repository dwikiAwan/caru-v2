import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, ShoppingBag, Phone, Loader2, ExternalLink } from 'lucide-react';

export default function AdminOrders() {
  const { orders = [], loading, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Handler Perubahan Status Pesanan oleh Admin
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    if (updateOrderStatus) {
      await updateOrderStatus(id, newStatus);
    }
    setUpdatingId(null);
  };

  // Filter pesanan berdasarkan pencarian nama pelanggan, nomor WA, atau kode order
  const filteredOrders = orders.filter((order) => {
    const customerName = (order.customer || order.customer_name || order.name || '').toLowerCase();
    const orderCode = (order.order_code || `ORD-${order.id}` || String(order.id)).toLowerCase();
    const phone = (order.phone || '').toLowerCase();
    const keyword = search.toLowerCase();

    return customerName.includes(keyword) || orderCode.includes(keyword) || phone.includes(keyword);
  });

  // Helper untuk render item (JSON / Array / String)
  const renderItems = (items) => {
    if (!items) return <span className="text-slate-500 italic text-[11px] font-semibold">Tidak ada detail item</span>;

    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(parsed)) {
        return (
          <ul className="list-disc list-inside space-y-1 text-[11px] font-bold text-black">
            {parsed.map((item, idx) => (
              <li key={idx} className="text-black">
                {item.name || item.title || item.product_name} {' '}
                <span className="font-black text-emerald-700">({item.quantity || item.qty || 1}x)</span>
              </li>
            ))}
          </ul>
        );
      }
    } catch {
      // Jika formatnya berupa string biasa
    }
    return <span className="text-[11px] text-black font-bold">{String(items)}</span>;
  };

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Manajemen Transaksi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Kelola Pesanan Customer
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Daftar transaksi masuk dari checkout pengunjung Marketplace Agrowisata.
          </p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Cari pelanggan, WA, atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-black placeholder:font-normal placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* Tabel Pesanan / Loading State */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {loading ? (
          <div className="p-16 text-center text-slate-600 space-y-3 font-bold">
            <Loader2 className="w-10 h-10 mx-auto text-emerald-600 animate-spin stroke-[2.5]" />
            <p className="text-xs text-black uppercase tracking-wide">Menyinkronkan data pesanan dari server...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-slate-600">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto stroke-[2]" />
            <h3 className="text-base font-black text-black uppercase tracking-wide">Belum Ada Pesanan Masuk</h3>
            <p className="text-xs font-semibold text-slate-600 max-w-sm mx-auto leading-relaxed">
              Saat ini belum ada transaksi checkout dari pengunjung. Pesanan baru akan otomatis muncul di sini secara real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">Kode Order</th>
                  <th className="p-4 border-r-2 border-slate-900">Pelanggan</th>
                  <th className="p-4 border-r-2 border-slate-900">WhatsApp</th>
                  <th className="p-4 border-r-2 border-slate-900 max-w-xs">Detail Item</th>
                  <th className="p-4 border-r-2 border-slate-900">Total Bayar</th>
                  <th className="p-4 border-r-2 border-slate-900">Status Pesanan</th>
                  <th className="p-4 text-center">Aksi WA</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-600 font-bold">
                      Tidak ada pesanan yang sesuai dengan kata kunci "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      
                      {/* Kode Order */}
                      <td className="p-4 font-mono font-black text-emerald-700 border-r-2 border-slate-100">
                        {order.order_code || `ORD-${order.id}`}
                      </td>

                      {/* Pelanggan */}
                      <td className="p-4 font-black text-black border-r-2 border-slate-100">
                        {order.customer || order.customer_name || order.name || 'Pelanggan'}
                      </td>

                      {/* WhatsApp */}
                      <td className="p-4 border-r-2 border-slate-100">
                        {order.phone ? (
                          <span className="flex items-center gap-1.5 font-bold text-black">
                            <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0 stroke-[2.5]" /> {order.phone}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      {/* Detail Item */}
                      <td className="p-4 max-w-xs border-r-2 border-slate-100">
                        {renderItems(order.items || order.items_summary)}
                      </td>

                      {/* Total Pembayaran */}
                      <td className="p-4 font-black text-emerald-700 text-sm border-r-2 border-slate-100">
                        Rp {Number(order.total || order.total_price || 0).toLocaleString('id-ID')}
                      </td>

                      {/* Status Pesanan dengan Selection Update */}
                      <td className="p-4 border-r-2 border-slate-100">
                        {updatingId === order.id ? (
                          <span className="inline-flex items-center gap-1 text-slate-600 text-[10px] font-black uppercase">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 stroke-[2.5]" /> Memperbarui...
                          </span>
                        ) : (
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`p-2 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none border-2 border-slate-900 cursor-pointer transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                              order.status === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-950'
                                : order.status === 'Dikirim' || order.status === 'Diproses'
                                ? 'bg-sky-100 text-sky-950'
                                : order.status === 'Dibatalkan'
                                ? 'bg-rose-100 text-rose-950'
                                : 'bg-amber-100 text-amber-950'
                            }`}
                          >
                            <option value="Pending">🟡 Pending (Menunggu)</option>
                            <option value="Diproses">🔵 Diproses</option>
                            <option value="Dikirim">🚚 Dikirim</option>
                            <option value="Selesai">🟢 Selesai</option>
                            <option value="Dibatalkan">🔴 Dibatalkan</option>
                          </select>
                        )}
                      </td>

                      {/* Aksi WhatsApp */}
                      <td className="p-4 text-center">
                        {order.phone ? (
                          <a
                            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3.5 py-2 text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl font-black uppercase tracking-wider transition border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-[10px]"
                            title="Hubungi Pelanggan via WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" /> WA
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}