import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Star, Loader2 } from 'lucide-react';

export default function Contact() {
  const { addMessage } = useAdmin();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '', rating: 5 });

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (addMessage) {
      await addMessage(form);
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', message: '', rating: 5 });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        
        {/* Header Seksi Kontak */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-emerald-200/80 shadow-xs">
            Hubungi Pengurus Kebun
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Kontak & Ulasan Pengunjung
          </h1>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Sampaikan pertanyaan, konfirmasi reservasi kelompok, atau bagikan ulasan pengalaman Anda berkunjung ke Eduagrowisata Caru.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informasi Kebun (Card Putih Solid + Shadow & Border Tegas) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Informasi Kebun & Lokasi
            </h2>
            
            <div className="space-y-5 text-xs text-slate-600 font-medium">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <strong className="block text-slate-900 font-extrabold text-xs">Alamat Lahan:</strong>
                  <p className="leading-relaxed">Dusun Caru, Desa Bajang, Kec. Mlarak, Kabupaten Ponorogo, Jawa Timur 63472</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <strong className="block text-slate-900 font-extrabold text-xs">WhatsApp Pengurus:</strong>
                  <p className="leading-relaxed">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <strong className="block text-slate-900 font-extrabold text-xs">Email Resmi:</strong>
                  <p className="leading-relaxed">info@eduagrowisatacaru.or.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200/80 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <strong className="block text-slate-900 font-extrabold text-xs">Jam Operasional:</strong>
                  <p className="leading-relaxed">Senin - Minggu (08.00 - 16.00 WIB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Kirim Pesan & Rating (Card Putih Solid + Shadow Tegas) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Kirim Pesan atau Ulasan
            </h2>

            {submitted ? (
              <div className="py-10 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Terima Kasih Atas Ulasan Anda!</h3>
                <p className="text-xs text-slate-600 font-medium">Pesan dan penilaian Anda telah tersimpan dan akan ditinjau oleh pengurus kebun.</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1.5">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      placeholder="Masukkan nama Anda"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1.5">Nomor WhatsApp</label>
                    <input
                      required
                      type="text"
                      placeholder="0812xxxxxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                    />
                  </div>
                </div>

                {/* Input Rating Bintang Interaktif */}
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1.5">Penilaian Pengalaman</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/90 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setForm({ ...form, rating: star })}
                        className="p-1 transition transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= form.rating
                              ? 'text-amber-400 fill-amber-400 stroke-none'
                              : 'text-slate-300 fill-slate-200 stroke-none'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-slate-600 ml-2">
                      ({form.rating} / 5 Bintang)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-extrabold mb-1.5">Pesan atau Ulasan</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Tuliskan ulasan atau pertanyaan Anda seputar kebun..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Mengirimkan Ulasan...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Kirim Ulasan / Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}