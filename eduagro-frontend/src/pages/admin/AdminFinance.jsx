import { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Wallet, TrendingUp, Calendar, ShoppingBag, Filter, FileText } from 'lucide-react';

export default function AdminFinance() {
  const { orders = [], reservations = [] } = useAdmin();

  // State Filter Waktu
  const [filterType, setFilterType] = useState('all'); // 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. Normalisasi dan Gabungkan Data Transaksi
  const allTransactions = useMemo(() => {
    const orderItems = orders
      .filter((o) => {
        const status = (o.status || '').toLowerCase();
        return status === 'selesai' || status === 'dikirim' || status === 'diproses' || status === 'pengiriman' || status === 'pengemasan';
      })
      .map((o) => ({
        id: `ORD-${o.id}`,
        type: 'Pesanan Online',
        categoryTag: 'Marketplace Produk',
        name: o.customer || o.customer_name || o.name || 'Pelanggan',
        phone: o.phone || '-',
        date: o.created_at || o.date || new Date().toISOString().split('T')[0],
        amount: Number(o.total || o.total_price || 0),
        status: o.status || 'Selesai',
      }));

    const reservationItems = reservations
      .filter((r) => {
        const status = (r.status || '').toLowerCase();
        return status === 'confirmed' || status === 'disetujui' || status === 'selesai';
      })
      .map((r) => {
        const pricePerPerson = r.price_per_person || 25000;
        const totalAmount = r.total || r.total_price || (Number(r.total_people || 1) * pricePerPerson);

        return {
          id: r.reservation_code || `RSV-${r.id}`,
          type: 'Reservasi Wisata',
          categoryTag: r.service_title || r.category || 'Kunjungan Kebun',
          name: r.name || 'Pengunjung',
          phone: r.phone || '-',
          date: r.visit_date || r.created_at || new Date().toISOString().split('T')[0],
          amount: Number(totalAmount),
          status: r.status || 'Disetujui',
        };
      });

    return [...orderItems, ...reservationItems].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, reservations]);

  // 2. Filter Transaksi Berdasarkan Pilihan Admin
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);

      if (filterType === 'daily') {
        return item.date === selectedDate;
      }
      if (filterType === 'weekly') {
        const target = new Date(selectedDate);
        const startOfWeek = new Date(target);
        startOfWeek.setDate(target.getDate() - 7);
        return itemDate >= startOfWeek && itemDate <= target;
      }
      if (filterType === 'monthly') {
        const target = new Date(selectedDate);
        return (
          itemDate.getMonth() === target.getMonth() &&
          itemDate.getFullYear() === target.getFullYear()
        );
      }
      if (filterType === 'yearly') {
        return itemDate.getFullYear().toString() === selectedYear;
      }
      if (filterType === 'custom') {
        if (!startDate || !endDate) return true;
        return item.date >= startDate && item.date <= endDate;
      }
      return true; // 'all'
    });
  }, [allTransactions, filterType, selectedDate, selectedYear, startDate, endDate]);

  // 3. Kalkulasi Statistik & Pembeda Kategori
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let reservationRevenue = 0;
    let onlineOrderRevenue = 0;

    filteredTransactions.forEach((tx) => {
      totalRevenue += tx.amount;
      if (tx.type === 'Reservasi Wisata') {
        reservationRevenue += tx.amount;
      } else if (tx.type === 'Pesanan Online') {
        onlineOrderRevenue += tx.amount;
      }
    });

    const resPercentage = totalRevenue > 0 ? ((reservationRevenue / totalRevenue) * 100).toFixed(1) : 0;
    const ordPercentage = totalRevenue > 0 ? ((onlineOrderRevenue / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      reservationRevenue,
      onlineOrderRevenue,
      resPercentage,
      ordPercentage,
      totalCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Laporan Keuangan & Kas
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Keuangan & Pendapatan
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Rekapitulasi seluruh pemasukan dari reservasi wisata dan pemesanan produk online secara real-time.
          </p>
        </div>
      </div>

      {/* Baris Filter Waktu & Kategori */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black">
            <Filter className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            <span>Filter Periode Pemasukan:</span>
          </div>

          {/* Tombol Pilihan Filter */}
          <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider">
            {[
              { id: 'all', label: 'Semua Waktu' },
              { id: 'daily', label: 'Per Hari' },
              { id: 'weekly', label: 'Per Minggu' },
              { id: 'monthly', label: 'Per Bulan' },
              { id: 'yearly', label: 'Per Tahun' },
              { id: 'custom', label: 'Rentang Tanggal' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`px-3.5 py-2 rounded-xl border-2 border-slate-900 transition cursor-pointer text-[11px] ${
                  filterType === btn.id
                    ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-slate-100 text-black hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Spesifik Berdasarkan Filter yang Dipilih */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center gap-3 text-xs font-bold">
          {(filterType === 'daily' || filterType === 'weekly' || filterType === 'monthly') && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-black uppercase text-[11px]">Acuan Tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none font-bold text-black cursor-pointer"
              />
            </div>
          )}

          {filterType === 'yearly' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-black uppercase text-[11px]">Pilih Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none font-black text-black cursor-pointer"
              >
                {['2024', '2025', '2026', '2027', '2028'].map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap w-full">
              <span className="text-black uppercase text-[11px]">Dari:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none font-bold text-black"
              />
              <span className="text-black uppercase text-[11px]">Sampai:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none font-bold text-black"
              />
            </div>
          )}

          <div className="ml-auto text-black font-black uppercase text-[11px] bg-slate-100 px-3.5 py-2 rounded-xl border-2 border-slate-900">
            Total Transaksi: {stats.totalCount} Data
          </div>
        </div>
      </div>

      {/* Grid Kartu Ringkasan & Pembeda Kategori Pendapatan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Pendapatan Keseluruhan */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-emerald-500 text-slate-950 border-2 border-slate-900 rounded-xl w-fit">
            <Wallet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Pendapatan Bersih</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 pt-3 border-t-2 border-slate-800 flex items-center justify-between font-bold">
            <span>Akumulasi kategori</span>
            <span className="text-emerald-400 font-black">100%</span>
          </p>
        </div>

        {/* Pendapatan Kategori: Reservasi Wisata */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-indigo-100 text-indigo-950 border-2 border-slate-900 rounded-xl w-fit">
            <Calendar className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Pendapatan Reservasi Wisata</span>
            <h3 className="text-2xl font-black text-black mt-1">
              Rp {stats.reservationRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs font-black">
            <span className="text-slate-600 uppercase text-[10px]">Kontribusi:</span>
            <span className="bg-indigo-100 text-indigo-950 px-2.5 py-1 rounded-md border-2 border-slate-900 text-[10px]">
              {stats.resPercentage}% dari total
            </span>
          </div>
        </div>

        {/* Pendapatan Kategori: Pemesanan Online / Produk */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="p-3 bg-emerald-100 text-emerald-950 border-2 border-slate-900 rounded-xl w-fit">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Pendapatan Pesanan Online</span>
            <h3 className="text-2xl font-black text-black mt-1">
              Rp {stats.onlineOrderRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs font-black">
            <span className="text-slate-600 uppercase text-[10px]">Kontribusi:</span>
            <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-md border-2 border-slate-900 text-[10px]">
              {stats.ordPercentage}% dari total
            </span>
          </div>
        </div>

      </div>

      {/* Tabel Detail Rincian Transaksi Pendapatan */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <div className="p-6 border-b-2 border-slate-900 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-black text-base uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700 stroke-[2.5]" /> Rincian Riwayat Aliran Kas Masuk
          </h3>
          <span className="text-[11px] font-black uppercase text-slate-600">Urutan Terbaru</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-2">
            <FileText className="w-12 h-12 mx-auto text-slate-400 stroke-[2]" />
            <p className="font-black text-sm text-black uppercase tracking-wide">Tidak ada catatan pendapatan pada periode ini.</p>
            <p className="text-xs font-semibold">Ubah filter waktu di atas untuk melihat data transaksi lainnya.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">ID Transaksi</th>
                  <th className="p-4 border-r-2 border-slate-900">Kategori Sumber</th>
                  <th className="p-4 border-r-2 border-slate-900">Nama Pelanggan / Pengunjung</th>
                  <th className="p-4 border-r-2 border-slate-900">Tanggal Transaksi</th>
                  <th className="p-4 border-r-2 border-slate-900">Status</th>
                  <th className="p-4 text-right">Jumlah Pemasukan</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono font-black text-emerald-700 border-r-2 border-slate-100">{tx.id}</td>
                    <td className="p-4 border-r-2 border-slate-100">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border-2 border-slate-900 ${
                          tx.type === 'Reservasi Wisata'
                            ? 'bg-indigo-100 text-indigo-950'
                            : 'bg-emerald-100 text-emerald-950'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 border-r-2 border-slate-100">
                      <strong className="block text-black font-black text-sm">{tx.name}</strong>
                      <span className="text-[11px] font-semibold text-slate-600">{tx.phone}</span>
                    </td>
                    <td className="p-4 font-black text-black border-r-2 border-slate-100">{tx.date}</td>
                    <td className="p-4 border-r-2 border-slate-100">
                      <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-md text-[10px] font-black uppercase border-2 border-slate-900">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-700 text-sm">
                      + Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}