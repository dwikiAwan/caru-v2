import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Calendar, 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  PackageCheck,
  Ticket,
  Printer,
  Sparkles,
  MapPin,
  QrCode,
  AlertCircle,
  HelpCircle,
  Search,
  Check,
  History,
  Activity,
  Receipt,
  FileText
} from 'lucide-react';

export default function UserChat() {
  const { reservations = [], orders = [], messages = [], addMessage } = useAdmin();
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'orders' | 'help'
  const [userPhone, setUserPhone] = useState('');
  
  // State Form Laporan Masalah (Array untuk Multi-Select Checkbox)
  const [reportCategories, setReportCategories] = useState(['Kendala Reservasi Kunjungan']);
  const [refCode, setRefCode] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Helper Toggle Checkbox Kategori Masalah
  const toggleCategory = (categoryId) => {
    setReportCategories((prev) => {
      if (prev.includes(categoryId)) {
        if (prev.length === 1) return prev; 
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Helper untuk cek apakah tanggal kunjungan sudah lewat hari ini
  const isDatePassed = (dateString) => {
    if (!dateString) return false;
    const visitDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visitDate < today;
  };

  // Filter Data Sesuai Nomor WA User
  const filteredReservations = userPhone 
    ? reservations.filter(r => (r.phone || '').includes(userPhone))
    : reservations;

  const filteredOrders = userPhone 
    ? orders.filter(o => (o.phone || '').includes(userPhone))
    : orders;

  const filteredMessages = userPhone 
    ? messages.filter(m => (m.phone || '').includes(userPhone))
    : messages;

  // Pemisahan Reservasi Aktif vs Riwayat
  const activeReservations = filteredReservations.filter(r => {
    const status = (r.status || '').toLowerCase();
    const passed = isDatePassed(r.visit_date);
    return (status === 'pending' || status === 'menunggu') && !passed;
  });

  const historyReservations = filteredReservations.filter(r => {
    const status = (r.status || '').toLowerCase();
    const passed = isDatePassed(r.visit_date);
    return status === 'confirmed' || status === 'disetujui' || status === 'cancelled' || status === 'ditolak' || passed;
  });

  // Pemisahan Pesanan Aktif vs Riwayat
  const activeOrders = filteredOrders.filter(o => {
    const status = (o.status || '').toLowerCase();
    return status === 'pending' || status === 'menunggu verifikasi' || status === 'diproses' || status === 'pengemasan' || status === 'dikirim' || status === 'pengiriman';
  });

  const historyOrders = filteredOrders.filter(o => {
    const status = (o.status || '').toLowerCase();
    return status === 'selesai' || status === 'dibatalkan';
  });

  // Helper Parser Item Belanja
  const renderItems = (items) => {
    if (!items) return <span className="text-slate-500 italic">Tidak ada detail item</span>;
    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <ul className="list-disc list-inside space-y-1 mt-1 text-black font-semibold">
            {parsed.map((item, idx) => (
              <li key={idx}>
                <span className="font-extrabold text-black">{item.name || item.title || item.product_name}</span>{' '}
                <span className="font-black text-emerald-800">({item.quantity || item.qty || 1}x)</span>
                {item.price && (
                  <span className="text-slate-700 text-xs">
                    {' '}@ Rp {Number(item.price).toLocaleString('id-ID')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        );
      }
    } catch (e) {}
    return <span className="text-black font-bold">{String(items)}</span>;
  };

  // Helper Array Item untuk Modal Kwitansi
  const getParsedItems = (items) => {
    if (!items) return [];
    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [{ name: String(items), qty: 1, price: 0 }];
  };

  // Helper Badge Status Reservasi
  const renderReservationBadge = (status, visitDate) => {
    const s = (status || '').toLowerCase();
    const passed = isDatePassed(visitDate);

    if (s === 'confirmed' || s === 'disetujui') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Disetujui {passed && '(Selesai)'}
        </span>
      );
    }
    if (s === 'cancelled' || s === 'ditolak') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <XCircle className="w-4 h-4 text-rose-700 stroke-[2.5]" /> Ditolak
        </span>
      );
    }
    if (passed) {
      return (
        <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <Clock className="w-4 h-4 text-slate-600 stroke-[2.5]" /> Kadaluarsa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
        <Clock className="w-4 h-4 text-amber-700 stroke-[2.5]" /> Menunggu Verifikasi
      </span>
    );
  };

  // Helper Badge Status Pesanan
  const renderOrderBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'selesai') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <PackageCheck className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Selesai
        </span>
      );
    }
    if (s === 'dikirim' || s === 'pengiriman') {
      return (
        <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <Truck className="w-4 h-4 text-sky-700 stroke-[2.5]" /> Dalam Pengiriman
        </span>
      );
    }
    if (s === 'diproses' || s === 'pengemasan') {
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <Clock className="w-4 h-4 text-indigo-700 stroke-[2.5]" /> Diproses Gudang
        </span>
      );
    }
    if (s === 'dibatalkan') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
          <XCircle className="w-4 h-4 text-rose-700 stroke-[2.5]" /> Dibatalkan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-slate-900">
        <Clock className="w-4 h-4 text-amber-700 stroke-[2.5]" /> Menunggu Verifikasi
      </span>
    );
  };

  // Handler Kirim Laporan Masalah
  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportDetail.trim()) return;

    setIsSending(true);
    const categoryString = reportCategories.join(', ');

    if (addMessage) {
      await addMessage({
        name: 'Pengunjung Web',
        phone: userPhone || '0812xxxx',
        message: `[LAPORAN MASALAH - ${categoryString}] Ref: ${refCode || '-'} | Detail: ${reportDetail}`,
        type: categoryString
      });
    }
    setIsSending(false);
    setReportDetail('');
    setRefCode('');
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 4000);
  };

  const categories = [
    { id: 'Kendala Reservasi Kunjungan', title: 'Kendala Reservasi Kunjungan', desc: 'Jadwal tidak sesuai, konfirmasi tiket terlambat, dll.' },
    { id: 'Kendala Pesanan & Produk Marketplace', title: 'Kendala Pesanan & Produk', desc: 'Barang belum sampai, kesalahan item, pengemasan, dll.' },
    { id: 'Kendala Pembayaran / Transaksi', title: 'Kendala Pembayaran / Transaksi', desc: 'Sudah transfer tapi status belum terverifikasi.' },
    { id: 'Pertanyaan & Layanan Lainnya', title: 'Pertanyaan & Layanan Lainnya', desc: 'Pertanyaan umum mengenai lokasi atau kebun.' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-black flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Dashboard Status dengan Neo-Brutalist Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="bg-emerald-100 border-2 border-slate-900 text-emerald-950 text-[11px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block">
              Layanan Mandiri Pengunjung
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black pt-1">
              Status Kunjungan & Pesanan
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              Pantau status reservasi, unduh kwitansi pesanan, atau laporkan kendala transaksi Anda.
            </p>
          </div>

          {/* Filter Berdasarkan No WA */}
          <div className="w-full md:w-80 space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-black">
              Cari Riwayat via No. WhatsApp:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 stroke-[2.5]" />
              <input
                type="text"
                placeholder="Contoh: 08123456789"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-black placeholder:font-normal placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigasi Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-200 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'reservations'
                ? 'bg-emerald-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'text-slate-800 hover:bg-slate-300/80'
            }`}
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" /> Reservasi ({filteredReservations.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'text-slate-800 hover:bg-slate-300/80'
            }`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" /> Pesanan ({filteredOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'help'
                ? 'bg-rose-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'text-slate-800 hover:bg-slate-300/80'
            }`}
          >
            <AlertCircle className="w-4 h-4 stroke-[2.5]" /> Laporkan Kendala
          </button>
        </div>

        {/* 1. SEKSI TAMPILAN STATUS RESERVASI */}
        {activeTab === 'reservations' && (
          <div className="space-y-8">
            
            {/* RESERVASI AKTIF */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                <Activity className="w-4 h-4 text-amber-600 stroke-[2.5]" /> Reservasi Aktif (Sedang Diproses)
              </h2>

              {activeReservations.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-center space-y-2">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto stroke-[2]" />
                  <p className="font-extrabold text-xs text-slate-700">Tidak ada reservasi aktif yang sedang dalam pengajuan.</p>
                </div>
              ) : (
                activeReservations.map((rsv) => (
                  <div key={rsv.id} className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-black text-emerald-700 block">
                          Kode Tiket: {rsv.reservation_code || `RSV-${rsv.id}`}
                        </span>
                        <h3 className="font-black text-black text-base uppercase tracking-wide">{rsv.service_title}</h3>
                      </div>
                      <div>{renderReservationBadge(rsv.status, rsv.visit_date)}</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-200 text-xs font-bold text-black">
                      <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Pemesan</span>{rsv.name}</div>
                      <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">WhatsApp</span>{rsv.phone}</div>
                      <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Tanggal</span><span className="text-emerald-700 font-black">{rsv.visit_date}</span></div>
                      <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Peserta</span>{rsv.total_people} Orang</div>
                    </div>

                    <div className="p-3.5 bg-amber-50 rounded-xl border-2 border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0 stroke-[2.5]" />
                      <span>Pengajuan reservasi Anda sedang dalam antrean verifikasi pengelola. Mohon tunggu beberapa saat.</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIWAYAT RESERVASI */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                <History className="w-4 h-4 text-slate-600 stroke-[2.5]" /> Riwayat Kunjungan & Tiket Selesai
              </h2>

              {historyReservations.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-center text-xs font-bold text-slate-600">
                  Belum ada riwayat kunjungan sebelumnya.
                </div>
              ) : (
                historyReservations.map((rsv) => {
                  const isApproved = (rsv.status || '').toLowerCase() === 'confirmed' || (rsv.status || '').toLowerCase() === 'disetujui';

                  return (
                    <div key={rsv.id} className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                        <div>
                          <span className="font-mono text-xs font-black text-slate-600 block">
                            Kode Tiket: {rsv.reservation_code || `RSV-${rsv.id}`}
                          </span>
                          <h3 className="font-black text-black text-base uppercase tracking-wide">{rsv.service_title}</h3>
                        </div>
                        <div>{renderReservationBadge(rsv.status, rsv.visit_date)}</div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-200 text-xs font-bold text-black">
                        <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Pemesan</span>{rsv.name}</div>
                        <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">WhatsApp</span>{rsv.phone}</div>
                        <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Tanggal</span>{rsv.visit_date}</div>
                        <div><span className="text-slate-600 text-[10px] uppercase font-extrabold block">Peserta</span>{rsv.total_people} Orang</div>
                      </div>

                      {isApproved && (
                        <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wide">
                              <Sparkles className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> E-Ticket Resmi Kunjungan
                            </span>
                            <p className="text-[11px] font-semibold text-emerald-900">
                              Reservasi Anda telah disetujui. Buka tiket untuk ditunjukkan di lokasi kebun.
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedTicket(rsv)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Ticket className="w-4 h-4 stroke-[2.5]" /> Buka E-Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 2. SEKSI TAMPILAN STATUS PESANAN MARKETPLACE */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            
            {/* PESANAN AKTIF */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                <Activity className="w-4 h-4 text-sky-600 stroke-[2.5]" /> Pesanan Dalam Proses & Pengiriman
              </h2>

              {activeOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto stroke-[2]" />
                  <p className="font-extrabold text-xs text-slate-700">Tidak ada transaksi pesanan yang sedang berlangsung.</p>
                </div>
              ) : (
                activeOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-black text-emerald-700 block">
                          Kode Order: #ORD-{ord.id}
                        </span>
                        <h3 className="font-black text-black text-base uppercase tracking-wide">
                          Total: Rp {Number(ord.total || ord.total_price || 0).toLocaleString('id-ID')}
                        </h3>
                      </div>
                      <div>{renderOrderBadge(ord.status)}</div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 text-xs space-y-2 font-medium">
                      <strong className="block text-black font-black uppercase text-[11px] border-b border-slate-200 pb-1">Detail Barang:</strong>
                      {renderItems(ord.items || ord.items_summary)}
                    </div>

                    <div className="p-3.5 bg-sky-50 rounded-xl border-2 border-sky-300 text-xs text-sky-950 font-bold flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-sky-700 shrink-0 stroke-[2.5]" />
                      <span>
                        {(ord.status || '').toLowerCase() === 'dikirim' || (ord.status || '').toLowerCase() === 'pengiriman'
                          ? 'Pesanan Anda saat ini sedang dikirim oleh kurir menuju lokasi Anda.'
                          : (ord.status || '').toLowerCase() === 'diproses' || (ord.status || '').toLowerCase() === 'pengemasan'
                          ? 'Produk sedang dikemas dan dipersiapkan dengan rapi oleh tim gudang.'
                          : 'Pesanan telah berhasil dicatat dan sedang menunggu verifikasi pembayaran oleh admin.'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIWAYAT PESANAN SELESAI */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                <History className="w-4 h-4 text-slate-600 stroke-[2.5]" /> Riwayat Transaksi Selesai & Kwitansi
              </h2>

              {historyOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-center text-xs font-bold text-slate-600">
                  Belum ada riwayat pesanan selesai sebelumnya.
                </div>
              ) : (
                historyOrders.map((ord) => {
                  const isCompleted = (ord.status || '').toLowerCase() === 'selesai';

                  return (
                    <div key={ord.id} className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                        <div>
                          <span className="font-mono text-xs font-black text-slate-600 block">
                            Kode Order: #ORD-{ord.id}
                          </span>
                          <h3 className="font-black text-black text-base uppercase tracking-wide">
                            Total: Rp {Number(ord.total || ord.total_price || 0).toLocaleString('id-ID')}
                          </h3>
                        </div>
                        <div>{renderOrderBadge(ord.status)}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 text-xs space-y-2 font-medium">
                        <strong className="block text-black font-black uppercase text-[11px] border-b border-slate-200 pb-1">Detail Barang:</strong>
                        {renderItems(ord.items || ord.items_summary)}
                      </div>

                      {/* TOMBOL KWITANSI PEMBAYARAN */}
                      {isCompleted && (
                        <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wide">
                              <Receipt className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Kwitansi Pembayaran Lunas
                            </span>
                            <p className="text-[11px] font-semibold text-emerald-900">
                              Pesanan telah selesai. Anda dapat mencetak atau mengunduh bukti pembayaran resmi di sini.
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedReceipt(ord)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 stroke-[2.5]" /> Cetak Kwitansi
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 3. SEKSI PUSAT BANTUAN & LAPORAN MASALAH (MULTI CHECKBOX) */}
        {activeTab === 'help' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
            <div className="border-b-2 border-slate-200 pb-3">
              <h2 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600 stroke-[2.5]" /> Laporkan Kendala / Masalah Transaksi
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Centang kategori masalah di bawah ini agar pengelola dapat memproses laporan Anda dengan cepat.
              </p>
            </div>

            {sendSuccess && (
              <div className="p-4 bg-emerald-100 border-2 border-slate-900 text-emerald-950 text-xs rounded-xl font-extrabold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 stroke-[2.5]" /> Laporan masalah Anda berhasil dikirim ke Pengelola. Tim kami akan segera menindaklanjuti.
              </div>
            )}

            <form onSubmit={handleSendReport} className="space-y-5 text-xs font-medium">
              
              {/* CHECKBOX MULTI-SELECT KATEGORI MASALAH */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                    Pilih Kategori Masalah (Bisa Lebih Dari Satu):
                  </label>
                  <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {reportCategories.length} Dipilih
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const isSelected = reportCategories.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-rose-50 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {/* Checkbox Icon */}
                        <div className={`w-5 h-5 rounded-md border-2 border-slate-900 flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <h4 className={`font-black text-xs ${isSelected ? 'text-black' : 'text-slate-800'}`}>
                            {cat.title}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-600 mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                    Nomor WhatsApp Anda <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                    Kode Tiket / Kode Order (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: RSV-ABC123 atau #ORD-1"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 font-mono transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                  Detail Masalah yang Dialami <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Jelaskan secara spesifik kendala yang Anda alami saat berkunjung atau bertransaksi..."
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 leading-relaxed resize-none transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending || !reportDetail.trim()}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black uppercase tracking-wider text-xs border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSending ? (
                  <span>Mengirim Laporan...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" /> Kirim Laporan Masalah
                  </>
                )}
              </button>
            </form>

            {/* Riwayat Laporan Sebelumnya */}
            {filteredMessages.length > 0 && (
              <div className="pt-6 border-t-2 border-slate-200 space-y-3">
                <h3 className="text-xs font-black text-black uppercase tracking-wider">
                  Riwayat Laporan Masalah Anda
                </h3>
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-900 text-xs space-y-1 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <span className="font-black text-rose-700 block uppercase">{msg.type || 'Laporan'}</span>
                    <p className="text-black font-bold">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: TIKET DIGITAL RESMI (PRINTABLE) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden space-y-0">
            <div className="bg-emerald-700 p-6 text-white text-center space-y-1 border-b-2 border-slate-900">
              <span className="bg-white text-emerald-950 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider border border-slate-900">
                E-Ticket Kunjungan Resmi
              </span>
              <h3 className="text-2xl font-black pt-2 uppercase tracking-tight">Eduagrowisata Caru</h3>
              <p className="text-xs text-emerald-100 flex items-center justify-center gap-1 font-bold">
                <MapPin className="w-3.5 h-3.5" /> Ponorogo, Jawa Timur
              </p>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs bg-white text-black">
              <div className="flex justify-between items-center border-b-2 border-dashed border-slate-300 pb-3">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Kode Tiket</span>
                  <span className="font-mono font-black text-emerald-700 text-base">
                    {selectedTicket.reservation_code || `RSV-${selectedTicket.id}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Status</span>
                  <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-md border border-slate-900">
                    VALID / DISETUJUI
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-600 text-[10px] uppercase font-extrabold block">Layanan Wisata</span>
                  <strong className="text-black text-sm uppercase font-black">{selectedTicket.service_title}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 text-xs font-bold">
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-extrabold block">Nama</span>
                    {selectedTicket.name}
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-extrabold block">Kategori</span>
                    {selectedTicket.category || 'Personal'}
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-extrabold block">Tanggal</span>
                    <span className="text-emerald-700 font-black">{selectedTicket.visit_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-extrabold block">Peserta</span>
                    {selectedTicket.total_people} Orang
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center space-y-2">
                <div className="p-4 bg-slate-900 text-white rounded-xl border-2 border-slate-900 flex items-center justify-center gap-3">
                  <QrCode className="w-10 h-10 text-emerald-400 shrink-0" />
                  <div className="text-left text-[10px] font-bold">
                    <p className="text-slate-100 uppercase tracking-wider">Verifikasi Tiket Lokasi</p>
                    <p className="text-slate-300 font-normal">Tunjukkan QR / Kode ini ke petugas loket.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="grow py-3 bg-slate-100 hover:bg-slate-200 text-black font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" /> Cetak Tiket
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 transition cursor-pointer text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KWITANSI BUKTI PEMBAYARAN RESMI (PRINTABLE) */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden space-y-0">
            
            {/* Header Kwitansi */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-start border-b-2 border-slate-900">
              <div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  Kwitansi Pembayaran Resmi
                </span>
                <h3 className="text-2xl font-black pt-2 uppercase tracking-tight">Eduagrowisata Caru</h3>
                <p className="text-[10px] text-slate-300 font-semibold">Ponorogo, Jawa Timur • Indonesia</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">No. Transaksi</span>
                <span className="font-mono text-emerald-400 font-black text-base">#ORD-{selectedReceipt.id}</span>
              </div>
            </div>

            {/* Rincian Kwitansi */}
            <div className="p-6 space-y-5 text-xs bg-white text-black font-sans">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-900 font-bold">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Diterima Dari</span>
                  {selectedReceipt.customer_name || selectedReceipt.customer || selectedReceipt.name || 'Pelanggan'}
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">No. WhatsApp</span>
                  {selectedReceipt.phone || '-'}
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Status</span>
                  <span className="inline-block bg-emerald-100 text-emerald-950 font-black px-2.5 py-0.5 rounded border border-slate-900 text-[10px] uppercase">
                    LUNAS / SELESAI
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Metode</span>
                  Marketplace Direct
                </div>
              </div>

              {/* Tabel Rincian Barang */}
              <div className="space-y-2">
                <span className="font-black text-black uppercase text-xs tracking-wider block">Rincian Pembelian Produk:</span>
                <div className="border-2 border-slate-900 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-black font-black border-b-2 border-slate-900 text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Item Produk</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Harga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-slate-200 font-bold text-black">
                      {getParsedItems(selectedReceipt.items || selectedReceipt.items_summary).map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">{item.name || item.title || item.product_name}</td>
                          <td className="p-3 text-center text-emerald-700 font-black">{item.quantity || item.qty || 1}</td>
                          <td className="p-3 text-right">
                            Rp {Number(item.price || 0).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Pengesahan */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-slate-300">
                <div>
                  <span className="text-[10px] text-emerald-800 font-black uppercase block">PENGESAHAN DITERIMA</span>
                  <span className="text-[10px] text-slate-600 italic font-semibold">Terima kasih atas kunjungan & pembelian Anda!</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 uppercase font-black block">Total Pembayaran</span>
                  <span className="text-xl font-black text-emerald-700">
                    Rp {Number(selectedReceipt.total || selectedReceipt.total_price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Tombol Cetak / Tutup */}
              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="grow py-3 bg-slate-100 hover:bg-slate-200 text-black font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" /> Cetak Kwitansi
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 transition cursor-pointer text-xs"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}