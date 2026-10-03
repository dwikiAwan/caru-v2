import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper untuk mengekstrak data JSON Laravel
  const extractData = (res) => {
    if (!res || !res.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  // Fungsi Fetch Mandiri per Modul (Agar bisa dipanggil spesifik per halaman)
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get('/products');
      setProducts(extractData(res));
    } catch (err) {
      console.error('Error GET /products:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get('/orders');
      setOrders(extractData(res));
    } catch (err) {
      console.error('Error GET /orders:', err);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await API.get('/reservations');
      setReservations(extractData(res));
    } catch (err) {
      console.error('Error GET /reservations:', err);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await API.get('/messages');
      setMessages(extractData(res));
    } catch (err) {
      console.error('Error GET /messages:', err);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await API.get('/posts');
      setPosts(extractData(res));
    } catch (err) {
      console.error('Error GET /posts:', err);
    }
  }, []);

  // Fetch Ringan untuk Dashboard atau Inisialisasi awal
  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchReservations(),
      fetchMessages(),
      fetchPosts(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. PRODUK: Tambah, Update, Hapus (Dengan Optimistic State Update)
  const addProduct = async (productData) => {
    try {
      const response = await API.post('/products', productData);
      if (response.data) {
        await fetchProducts(); // Hanya refresh data produk
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gagal menyimpan produk.' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await API.put(`/products/${id}`, productData);
      if (response.data) {
        await fetchProducts();
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gagal memperbarui produk.' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Update state langsung tanpa fetch ulang semua
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Gagal menghapus produk' };
    }
  };

  // 3. PESANAN
  const addOrder = async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      await fetchOrders();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal membuat pesanan' };
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await API.put(`/orders/${id}/status`, { status });
      if (response.data) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gagal memperbarui status pesanan.' };
    }
  };

  // 4. RESERVASI
  const addReservation = async (rsvData) => {
    try {
      const response = await API.post('/reservations', rsvData);
      await fetchReservations();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal membuat reservasi' };
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const response = await API.put(`/reservations/${id}`, { status });
      if (response.data) {
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gagal memperbarui status reservasi.' };
    }
  };

  const deleteReservation = async (id) => {
    try {
      await API.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  // 5. PESAN KONTAK / TESTIMONI
  const addMessage = async (msgData) => {
    try {
      const response = await API.post('/messages', msgData);
      await fetchMessages();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal mengirim pesan' };
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  // 6. ARTIKEL / BERITA
  const addPost = async (postData) => {
    try {
      const response = await API.post('/posts', postData);
      await fetchPosts();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menyimpan artikel' };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await API.put(`/posts/${id}`, postData);
      if (response.data) {
        await fetchPosts();
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gagal memperbarui artikel.' };
    }
  };

  const deletePost = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        addOrder,
        reservations,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        messages,
        addMessage,
        deleteMessage,
        posts,
        addPost,
        updatePost,
        deletePost,
        loading,
        refreshData: fetchInitialData,
        fetchProducts,
        fetchOrders,
        fetchReservations,
        fetchMessages,
        fetchPosts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);