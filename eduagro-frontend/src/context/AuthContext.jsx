import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eduagro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Pasang Token ke Header Axios jika session tersimpan di LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('eduagro_token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const getFirstName = (userData) => {
    if (!userData) return '';
    const nameStr = userData.name || userData.fullName || userData.username || '';
    return nameStr.trim().split(' ')[0] || '';
  };

  // 1. Registrasi User Baru via API Laravel
  const register = async (name, username, email, password) => {
    try {
      const response = await API.post('/register', {
        name,
        username,
        email: email || `${username}@eduagro.com`,
        password,
      });

      const { access_token, user: userData } = response.data;

      if (access_token) {
        localStorage.setItem('eduagro_token', access_token);
        API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      }

      localStorage.setItem('eduagro_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const errors = err.response?.data?.errors;
      let errorMsg = err.response?.data?.message || 'Gagal melakukan registrasi.';
      if (errors) {
        errorMsg = Object.values(errors).flat().join(' ');
      }
      return { success: false, message: errorMsg };
    }
  };

  // 2. Login User / Admin via API Laravel
  // Login User / Admin via API Laravel
const login = async (username, password) => {
  try {
    const response = await API.post('/login', {
      username,
      password,
    });

    const { access_token, user: userData } = response.data;

    const updatedUser = {
      ...userData,
      role: userData.role || (username.toLowerCase() === 'admin' ? 'admin' : 'customer'),
    };

    if (access_token) {
      localStorage.setItem('eduagro_token', access_token);
      API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }

    localStorage.setItem('eduagro_user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    return { success: true, user: updatedUser };
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Username/Email atau password salah!';
    return { success: false, message: errorMsg };
  }
};

  // 3. Logout User / Admin via API Laravel
  const logout = async () => {
    try {
      await API.post('/logout');
    } catch (err) {
      console.warn('Gagal menghapus token di server:', err);
    } finally {
      localStorage.removeItem('eduagro_token');
      localStorage.removeItem('eduagro_user');
      delete API.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        firstName: getFirstName(user),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// PERHATIKAN BARIS INI: Pastikan useAuth diekspor dengan keyword 'export'
export const useAuth = () => useContext(AuthContext);