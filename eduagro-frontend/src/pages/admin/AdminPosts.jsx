import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Search, Trash2, Edit3, Newspaper, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function AdminPosts() {
  const { posts = [], addPost, updatePost, deletePost } = useAdmin();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Tambah, Ada ID = Mode Edit
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: 'Admin',
    category: 'Berita',
    content: '',
    image: '',
  });

  // Handler Buka Modal Mode Edit
  const handleEditClick = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title || '',
      author: post.author || 'Admin',
      category: post.category || 'Berita',
      content: post.content || '',
      image: post.image || '',
    });
    setErrorMessage('');
    setShowModal(true);
  };

  // Handler Buka Modal Mode Tambah Baru
  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      title: '',
      author: 'Admin',
      category: 'Berita',
      content: '',
      image: '',
    });
    setErrorMessage('');
    setShowModal(true);
  };

  // Handler Upload Gambar Komputer (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Silakan pilih gambar di bawah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler Submit (Tambah atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    let result;
    if (editingId) {
      // Mode Update
      result = await updatePost(editingId, formData);
    } else {
      // Mode Tambah Baru
      result = await addPost(formData);
    }

    setLoading(false);

    if (result && result.success) {
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', author: 'Admin', category: 'Berita', content: '', image: '' });
    } else {
      setErrorMessage(result?.message || 'Gagal menyimpan artikel ke server.');
    }
  };

  // Handler Hapus Artikel
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini dari database?')) {
      if (deletePost) {
        await deletePost(id);
      }
    }
  };

  // Filter artikel berdasarkan judul dari kata kunci pencarian
  const filteredPosts = posts.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Manajemen Publikasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Kelola Artikel & Berita
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Publikasi, edit, dan kelola berita edukasi agrowisata.
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Tulis Artikel Baru
        </button>
      </div>

      {/* Baris Pencarian & Total Ringkasan */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-black placeholder:font-normal placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <span className="text-xs font-black uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-xl border-2 border-slate-900">
          Total: {posts.length} Artikel
        </span>
      </div>

      {/* Tabel Artikel */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-2">
            <Newspaper className="w-12 h-12 mx-auto text-slate-400 stroke-[2]" />
            <p className="font-black text-sm text-black uppercase tracking-wide">Belum ada artikel terbit.</p>
            <p className="text-xs font-semibold">Klik "Tulis Artikel Baru" untuk mempublikasikan artikel pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">Cover & Judul Artikel</th>
                  <th className="p-4 border-r-2 border-slate-900">Kategori</th>
                  <th className="p-4 border-r-2 border-slate-900">Penulis</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-600 font-bold">
                      Tidak ada artikel yang cocok dengan pencarian "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 transition">
                      
                      {/* Cover & Judul */}
                      <td className="p-4 flex items-center gap-3.5 border-r-2 border-slate-100">
                        <img
                          src={post.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500'}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-900 bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-black text-black text-sm block leading-tight line-clamp-1">{post.title}</span>
                          <span className="text-[11px] font-semibold text-slate-600 line-clamp-1 mt-0.5">{post.content}</span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="p-4 border-r-2 border-slate-100">
                        <span className="bg-slate-100 text-black border-2 border-slate-900 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">
                          {post.category || 'Berita'}
                        </span>
                      </td>

                      {/* Penulis */}
                      <td className="p-4 font-black text-black border-r-2 border-slate-100">
                        {post.author || 'Admin'}
                      </td>

                      {/* Aksi */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-2.5 text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2.5 text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                          title="Hapus Artikel"
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

      {/* Modal Tambah / Edit Artikel */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-5 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
            
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-black text-base uppercase tracking-wider">
                {editingId ? 'Edit Artikel / Berita' : 'Tulis Artikel Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border-2 border-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border-2 border-slate-900 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              
              {/* Field Cover Artikel */}
              <div className="space-y-1.5 border-b-2 border-slate-200 pb-4">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Gambar Cover Artikel</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-slate-900 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400 stroke-[2]" />
                    )}
                  </div>
                  <div className="grow space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-black font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 cursor-pointer transition text-[11px] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <Upload className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Upload Komputer
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan URL gambar (https://...)"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black text-[11px] placeholder:font-normal placeholder:text-slate-400 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">
                  Judul Artikel <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Panduan Lengkap Pruning Pohon Anggur"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black cursor-pointer transition"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tips & Trik">Tips & Trik</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Penulis</label>
                  <input
                    type="text"
                    placeholder="Admin"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">
                  Isi Konten Artikel <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows="5"
                  placeholder="Tuliskan berita atau konten artikel agrowisata secara detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 leading-relaxed resize-none transition"
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
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer text-xs"
                >
                  {loading ? 'Menyimpan...' : editingId ? 'Perbarui Artikel' : 'Terbitkan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}