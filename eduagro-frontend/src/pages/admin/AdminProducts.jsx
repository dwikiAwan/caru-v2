import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Search, Trash2, Edit3, Package, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function AdminProducts() {
  const { products = [], addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Tambah Baru, Ada ID = Mode Edit
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper untuk menentukan unit mengikut kategori secara automatik
  const getUnitByCategory = (category) => {
    switch (category) {
      case 'Buah':
        return 'kg';
      case 'Bibit':
      case 'Jus':
        return 'qty';
      case 'Keripik':
        return 'pcs';
      default:
        return 'pcs';
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    category: 'Buah',
    price: '',
    stock: '',
    unit: 'kg',
    description: '',
    image: '',
  });

  // Handler pertukaran kategori dalam borang
  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
      unit: getUnitByCategory(category),
    }));
  };

  // Handler Buka Modal Mode Edit
  const handleEditClick = (product) => {
    setEditingId(product.id);
    const cat = product.category || 'Buah';
    setFormData({
      name: product.name || '',
      category: cat,
      price: product.price || '',
      stock: product.stock || '',
      unit: product.unit || getUnitByCategory(cat),
      description: product.description || '',
      image: product.image || '',
    });
    setErrorMessage('');
    setShowModal(true);
  };

  // Handler Buka Modal Mode Tambah Baru
  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Buah',
      price: '',
      stock: '',
      unit: 'kg',
      description: '',
      image: '',
    });
    setErrorMessage('');
    setShowModal(true);
  };

  // Handler Upload Foto Produk (Base64)
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

  // Handler Submit Form (Tambah / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    let result;
    if (editingId) {
      result = await updateProduct(editingId, formData);
    } else {
      result = await addProduct(formData);
    }

    setLoading(false);

    if (result && result.success) {
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Buah', price: '', stock: '', unit: 'kg', description: '', image: '' });
    } else {
      setErrorMessage(result?.message || 'Gagal menyimpan produk ke server.');
    }
  };

  // Handler Hapus Produk
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari database?')) {
      if (deleteProduct) {
        await deleteProduct(id);
      }
    }
  };

  // Filter produk berdasarkan carian
  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-black selection:bg-emerald-500 selection:text-white">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Manajemen Katalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Kelola Produk Agrowisata
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Tambah, edit item, kelola stok, dan foto produk.
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Tambah Produk Baru
        </button>
      </div>

      {/* Baris Pencarian & Total Ringkasan */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-black placeholder:font-normal placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <span className="text-xs font-black uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-xl border-2 border-slate-900">
          Total: {products.length} Produk
        </span>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-2">
            <Package className="w-12 h-12 mx-auto text-slate-400 stroke-[2]" />
            <p className="font-black text-sm text-black uppercase tracking-wide">Belum ada produk terdaftar.</p>
            <p className="text-xs font-semibold">Klik "Tambah Produk Baru" untuk menambahkan buah, bibit, atau produk olahan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-black">
              <thead className="bg-slate-100 text-black font-black uppercase tracking-wider text-[10px] border-b-2 border-slate-900">
                <tr>
                  <th className="p-4 border-r-2 border-slate-900">Foto & Nama Produk</th>
                  <th className="p-4 border-r-2 border-slate-900">Kategori</th>
                  <th className="p-4 border-r-2 border-slate-900">Harga / Satuan</th>
                  <th className="p-4 border-r-2 border-slate-900">Stok</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-600 font-bold">
                      Tidak ada produk yang cocok dengan pencarian "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const displayUnit = p.unit || getUnitByCategory(p.category);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 flex items-center gap-3.5 border-r-2 border-slate-100">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-slate-900 bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-black text-black text-sm block leading-tight">{p.name}</span>
                            <span className="text-[11px] font-semibold text-slate-600 line-clamp-1">{p.description || 'Tidak ada deskripsi'}</span>
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-slate-100">
                          <span className="bg-slate-100 text-black border-2 border-slate-900 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">
                            {p.category || 'Umum'}
                          </span>
                        </td>
                        <td className="p-4 font-black text-emerald-700 text-sm border-r-2 border-slate-100">
                          Rp {Number(p.price || 0).toLocaleString('id-ID')}{' '}
                          <span className="text-[10px] font-bold text-slate-600">/{displayUnit}</span>
                        </td>
                        <td className="p-4 font-black text-black border-r-2 border-slate-100">{p.stock || 0} {displayUnit}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2.5 text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl border-2 border-slate-900 transition cursor-pointer inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Produk */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-5 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
            
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-black text-base uppercase tracking-wider">
                {editingId ? 'Edit Item Produk' : 'Tambah Produk Baru'}
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
              
              {/* Field Upload Foto Produk */}
              <div className="space-y-1.5 border-b-2 border-slate-200 pb-4">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Foto Produk</label>
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
                  Nama Produk <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Buah Anggur Transfiguration"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black cursor-pointer transition"
                  >
                    <option value="Buah">Buah (/kg)</option>
                    <option value="Bibit">Bibit (/qty)</option>
                    <option value="Jus">Jus (/qty)</option>
                    <option value="Keripik">Keripik (/pcs)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">
                    Harga (Rp) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="75000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Satuan Auto</label>
                  <input
                    readOnly
                    type="text"
                    value={`/${formData.unit}`}
                    className="w-full p-3.5 bg-slate-200 border-2 border-slate-900 rounded-xl outline-none font-black text-emerald-800 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">
                  Stok Produk <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="number"
                  placeholder="10"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:font-normal placeholder:text-slate-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-extrabold text-black uppercase tracking-wide text-[11px]">Deskripsi Produk</label>
                <textarea
                  rows="2"
                  placeholder="Keterangan singkat rasa, varietas, atau garansi bibit..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer text-xs"
                >
                  {loading ? 'Menyimpan...' : editingId ? 'Perbarui Produk' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}