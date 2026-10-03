import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, Trash2, Calendar, Users, Phone, FileText, Loader2 } from 'lucide-react';

export default function AdminReservations() {
  const { reservations = [], loading, updateReservationStatus, deleteReservation } = useAdmin();
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Handler untuk Mengubah Status Penerimaan Reservasi
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    if (updateReservationStatus) {
      await updateReservationStatus(id, newStatus);
    }
    setUpdatingId(null);
  };

  // Handler Hapus Reservasi
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data reservasi ini?')) {
      if (deleteReservation) {
        await deleteReservation(id);
      }
    }
  };

  // Filter pencarian berdasarkan nama, kode, nomor HP, atau nama layanan
  const filteredReservations = reservations.filter((rsv) =>
    (rsv.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (rsv.reservation_code || '').toLowerCase().includes(search.toLowerCase()) ||
    (rsv.phone || '').includes(search) ||
    (rsv.service_title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Manajemen Layanan Wisata
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Kelola Reservasi Kunjungan
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Daftar pengajuan reservasi dari pengunjung beserta status persetujuan.
          </p>
        </div>
      </div>

      {/* Pencarian & Ringkasan */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Cari nama, kode, atau layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-black placeholder:font-normal placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <span className="text-xs font-black uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-xl border-2 border-slate-900">
          Total: {reservations.length} Reservasi
        </span>
      </div>

      {/* Tabel Reservasi */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {loading ? (
          <div className="p-16 text-center text-slate-600 space-y-3 font-bold">
            <Loader2 className="w-10 h-10 mx-auto text-emerald-600 animate-spin stroke-[2.5]" />
            <p className="text-xs text-black uppercase tracking-wide">Menyinkronkan data reservasi...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-2">
            <Calendar className="w-12 h-12 mx-auto text-slate-400 stroke-[2]" />
            <p className="font-black text-sm text-black uppercase tracking-wide">Belum ada reservasi masuk.</p>
            <p className="text-xs font-semibold">Form reservasi yang diisi oleh pengunjung akan otomatis muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">Kode & Layanan</th>
                  <th className="p-4 border-r-2 border-slate-900">Pemesan & WA</th>
                  <th className="p-4 border-r-2 border-slate-900">Kategori</th>
                  <th className="p-4 border-r-2 border-slate-900">Tgl Kunjungan</th>
                  <th className="p-4 border-r-2 border-slate-900">Peserta</th>
                  <th className="p-4 border-r-2 border-slate-900 max-w-xs">Catatan Tambahan</th>
                  <th className="p-4 border-r-2 border-slate-900">Status Penerimaan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-600 font-bold">
                      Tidak ada reservasi yang cocok dengan kata kunci "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((rsv) => (
                    <tr key={rsv.id} className="hover:bg-slate-50 transition">
                      
                      {/* Kode & Layanan */}
                      <td className="p-4 border-r-2 border-slate-100">
                        <span className="font-mono font-black text-emerald-700 block text-xs">
                          {rsv.reservation_code || `RSV-${rsv.id}`}
                        </span>
                        <span className="font-black text-black text-sm uppercase tracking-wide block mt-0.5">{rsv.service_title}</span>
                      </td>

                      {/* Pemesan & WhatsApp */}
                      <td className="p-4 border-r-2 border-slate-100">
                        <span className="font-black text-black text-sm block leading-tight">{rsv.name}</span>
                        <a
                          href={`https://wa.me/${rsv.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline inline-flex items-center gap-1 text-[11px] font-bold mt-1"
                        >
                          <Phone className="w-3 h-3 stroke-[2.5]" /> {rsv.phone}
                        </a>
                      </td>

                      {/* Kategori */}
                      <td className="p-4 border-r-2 border-slate-100">
                        <span className="bg-slate-100 text-black border-2 border-slate-900 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">
                          {rsv.category || 'Personal'}
                        </span>
                      </td>

                      {/* Tanggal Kunjungan */}
                      <td className="p-4 font-black text-emerald-800 border-r-2 border-slate-100">
                        {rsv.visit_date}
                      </td>

                      {/* Jumlah Peserta */}
                      <td className="p-4 font-black text-black border-r-2 border-slate-100">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" /> {rsv.total_people} Orang
                        </span>
                      </td>

                      {/* Catatan Tambahan */}
                      <td className="p-4 text-slate-700 max-w-xs truncate font-semibold border-r-2 border-slate-100" title={rsv.notes}>
                        {rsv.notes ? (
                          <span className="inline-flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.5]" /> {rsv.notes}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      {/* Dropdown / Selection Status Penerimaan */}
                      <td className="p-4 border-r-2 border-slate-100">
                        <div className="relative">
                          {updatingId === rsv.id ? (
                            <span className="inline-flex items-center gap-1 text-slate-600 text-[10px] font-black uppercase">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 stroke-[2.5]" /> Mengubah...
                            </span>
                          ) : (
                            <select
                              value={rsv.status || 'Pending'}
                              onChange={(e) => handleStatusChange(rsv.id, e.target.value)}
                              className={`p-2 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none border-2 border-slate-900 cursor-pointer transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                                rsv.status === 'Confirmed' || rsv.status === 'Disetujui'
                                  ? 'bg-emerald-100 text-emerald-950'
                                  : rsv.status === 'Cancelled' || rsv.status === 'Ditolak'
                                  ? 'bg-rose-100 text-rose-950'
                                  : 'bg-amber-100 text-amber-950'
                              }`}
                            >
                              <option value="Pending">🟡 Pending (Menunggu)</option>
                              <option value="Confirmed">🟢 Disetujui (Confirmed)</option>
                              <option value="Cancelled">🔴 Ditolak (Cancelled)</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Aksi Hapus */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(rsv.id)}
                          className="p-2.5 text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                          title="Hapus Reservasi"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
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