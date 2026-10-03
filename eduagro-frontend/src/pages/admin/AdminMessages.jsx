import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Star, Plus, Trash2, Phone, MessageSquareQuote, X } from 'lucide-react';

export default function AdminMessages() {
  const { messages = [], addMessage, deleteMessage } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '', rating: 5 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addMessage) {
      await addMessage(form);
      setShowModal(false);
      setForm({ name: '', phone: '', message: '', rating: 5 });
    }
  };

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Manajemen Ulasan & Pesan
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Ulasan & Pesan Kontak
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Kelola testimoni pengunjung dan pesan masuk dari form kontak.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Tambah Testimoni Manual
        </button>
      </div>

      {/* Tabel Pesan / Testimoni */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-900 space-y-3 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <MessageSquareQuote className="w-12 h-12 text-slate-400 mx-auto stroke-[2]" />
          <h3 className="text-base font-black text-black uppercase tracking-wide">Belum Ada Pesan atau Ulasan</h3>
          <p className="text-xs font-semibold text-slate-600 max-w-sm mx-auto leading-relaxed">
            Pesan kontak atau ulasan bintang yang dikirimkan pengunjung akan muncul di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">Pengunjung</th>
                  <th className="p-4 border-r-2 border-slate-900">Kontak (WA)</th>
                  <th className="p-4 border-r-2 border-slate-900">Rating</th>
                  <th className="p-4 border-r-2 border-slate-900 max-w-md">Isi Testimoni / Pesan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition">
                    
                    {/* Pengunjung */}
                    <td className="p-4 font-black text-black text-sm border-r-2 border-slate-100">
                      {msg.name}
                    </td>

                    {/* Kontak (WA) */}
                    <td className="p-4 border-r-2 border-slate-100">
                      {msg.phone ? (
                        <span className="flex items-center gap-1.5 font-bold text-black">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0 stroke-[2.5]" /> {msg.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="p-4 border-r-2 border-slate-100">
                      <span className="inline-flex items-center gap-1 font-black text-amber-950 bg-amber-100 px-3 py-1 rounded-md border-2 border-slate-900 text-[10px]">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600 stroke-[2.5]" /> {msg.rating || 5} / 5
                      </span>
                    </td>

                    {/* Isi Pesan */}
                    <td className="p-4 max-w-md leading-relaxed whitespace-pre-line text-black font-semibold border-r-2 border-slate-100">
                      {msg.message}
                    </td>

                    {/* Aksi Hapus */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteMessage && deleteMessage(msg.id)}
                        title="Hapus Pesan"
                        className="p-2.5 text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Testimoni Manual */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-2xl space-y-5 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
            
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-black text-base uppercase tracking-wider">Tambah Testimoni Manual</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border-2 border-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              
              <div className="space-y-1.5">
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                  Nama Pengunjung <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Ari Septyaningrum"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: 08123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">Rating Bintang (1-5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-black outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer transition"
                >
                  <option value={5}>⭐ 5 Bintang (Tampil di Beranda)</option>
                  <option value={4}>⭐ 4 Bintang</option>
                  <option value={3}>⭐ 3 Bintang</option>
                  <option value={2}>⭐ 2 Bintang</option>
                  <option value={1}>⭐ 1 Bintang</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-black font-extrabold uppercase tracking-wide text-[11px]">
                  Pesan / Testimoni Pengalaman <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Tulis testimoni ulasan..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 resize-none transition"
                ></textarea>
              </div>

              <div className="pt-3 border-t-2 border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl font-black uppercase tracking-wider text-black bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 transition cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-xs"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}