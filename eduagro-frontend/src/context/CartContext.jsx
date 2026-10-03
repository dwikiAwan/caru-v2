import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Ambil state awal keranjang belanja dari LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('eduagro_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Simpan keranjang ke LocalStorage setiap kali ada perubahan item
  useEffect(() => {
    try {
      localStorage.setItem('eduagro_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Gagal menyimpan keranjang ke local storage:', err);
    }
  }, [cartItems]);

  // Tambah produk ke keranjang
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prevItems.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, qty: (item.qty || 1) + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, qty: quantity }];
    });
  };

  // Ubah kuantitas produk (+1 / -1)
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (String(item.id) === String(id)) {
            const newQty = (item.qty || 1) + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Hapus 1 item dari keranjang
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  // Kosongkan seluruh keranjang belanja (saat checkout sukses)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('eduagro_cart');
  };

  // Hitung total item & total harga secara dinamis
  const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.qty || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);