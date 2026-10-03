import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowRight, Check, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function Services() {
  const { addReservation } = useAdmin();
  const [selectedService, setSelectedService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Personal',
    visitDate: '',
    totalPeople: 1,
    notes: '',
  });

  const services = [
    {
      id: 1,
      title: 'Wisata Edukasi & Petik Anggur',
      desc: 'Pengalaman langsung memetik buah anggur dari pohonnya sambil mempelajari karakteristik varietas buah bersama petani berpengalaman.',
      price: 'Rp 25.000 / Orang',
      features: ['Tur Keliling Kebun ±2.560 m²', 'Icip Buah Anggur Segar', 'Pendampingan Pemandu Wisata'],
    },
    {
      id: 2,
      title: 'Pelatihan Budidaya & Pruning',
      desc: 'Sesi privat/kelompok untuk mempelajari teknik grafting, pembentukan percabangan, hingga manajemen nutrisi tanaman anggur.',
      price: 'Rp 150.000 / Peserta',
      features: ['Modul Praktik Budidaya', 'Gratis 1 Bibit Anggur Grafting', 'Sertifikat & Konsultasi'],
    },
    {
      id: 3,
      title: 'Pendampingan Pembuatan Kebun',
      desc: 'Layanan konsultasi dan instalasi perapian greenhouse/sistem peneduh kebun anggur untuk skala pekarangan maupun komersial.',
      price: 'Mulai Rp 1.500.000',
      features: ['Survei & Analisis Kelayakan', 'Desain Sistem Pengairan', 'Penyediaan Bibit & Pupuk'],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (addReservation) {
      const result = await addReservation({
        service_title: selectedService.title,
        name: formData.name,
        phone: formData.phone,
        category: formData.category,
        visit_date: formData.visitDate,
        total_people: Number(formData.totalPeople),
        notes: formData.notes || '',
      });

      setLoading(false);

      if (result && result.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedService(null);
          setFormData({ name: '', phone: '', category: 'Personal', visitDate: '', totalPeople: 1, notes: '' });
        }, 2500);
      } else {
        setErrorMessage(result?.message || 'Gagal mengirim reservasi. Silakan periksa kembali data Anda.');
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar />
      
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        
        {/* Header Seksi Layanan */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-emerald-200/80 shadow-xs">
            Layanan & Edukasi Kebun
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Paket Agrowisata & Pelatihan Budidaya
          </h1>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Pilih paket kunjungan wisata edukasi petik anggur, pelatihan teknik tanam, atau konsultasi pembuatan kebun bersama tim Eduagrowisata Caru.
          </p>
        </div>

        {/* Grid Kartu Paket Layanan (Card Putih Solid + Border & Shadow Tegas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 leading-snug">{service.title}</h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">{service.desc}</p>
                <div className="text-emerald-700 font-black text-2xl pt-2">{service.price}</div>

                <div className="space-y-2.5 pt-5 border-t border-slate-100">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700">
                      <div className="p-1 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setErrorMessage('');
                  setSelectedService(service);
                }}
                className="mt-8 w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Reservasi Layanan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Form Reservasi (Overlay Tegas + Modal Putih Solid) */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
              
              {/* Header Modal */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Form Reservasi Kunjungan</h3>
                  <p className="text-xs text-emerald-700 font-extrabold mt-0.5">{selectedService.title}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Alert Error */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Status Sukses */}
              {submitted ? (
                <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                  <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900">Reservasi Berhasil Dikirim!</h4>
                  <p className="text-xs text-slate-600 font-medium">Data pemesanan telah diteruskan ke pengurus kebun.</p>
                </div>
              ) : (
                /* Form Input Reservasi */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1.5">Kategori Pengunjung</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Personal', 'Sekolah', 'Institusi'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`py-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                            formData.category === cat
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1.5">Nama Pemesan</label>
                      <input
                        required
                        type="text"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1.5">Nomor WhatsApp</label>
                      <input
                        required
                        type="text"
                        placeholder="0812xxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1.5">Tanggal Kunjungan</label>
                      <input
                        required
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1.5">Jumlah Peserta</label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.totalPeople}
                        onChange={(e) => setFormData({ ...formData, totalPeople: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1.5">Catatan Tambahan (Opsional)</label>
                    <textarea
                      rows="2"
                      placeholder="Contoh: Permintaan jam khusus atau kebutuhan rombongan"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900 text-xs font-semibold transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Memproses Reservasi...
                      </>
                    ) : (
                      'Kirim Reservasi Sekarang'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}