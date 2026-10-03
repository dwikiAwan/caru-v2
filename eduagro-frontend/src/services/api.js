import axios from 'axios';

// Inisialisasi Instance Axios dengan Base URL API Laravel
const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Endpoint server Laravel (php artisan serve)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor Request: Otomatis selipkan Bearer Token dari LocalStorage pada setiap Request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eduagro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Tangani Error Token Expired / Unauthenticated (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Hapus session jika token tidak valid / terautentikasi
      localStorage.removeItem('eduagro_token');
      localStorage.removeItem('eduagro_user');
    }
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Hapus session jika token tidak valid
      localStorage.removeItem('eduagro_token');
      localStorage.removeItem('eduagro_user');

      // Hindari redirect jika error 401 berasal dari halaman /login itu sendiri
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;