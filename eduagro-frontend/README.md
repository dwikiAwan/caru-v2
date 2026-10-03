# React + Vite

# Product Requirements Document (PRD)
## Sistem Informasi & Marketplace Eduagrowisata Caru

---

## 1. Problem Statement
Pengelolaan destinasi agrowisata edukasi seringkali menghadapi kendala operasional, seperti:
* **Pemisahan Sistem yang Tidak Efektif:** Pemesanan produk pertanian (marketplace) dan reservasi kunjungan/edukasi kebun sering dikelola secara terpisah atau manual (via WhatsApp), menyulitkan pencatatan kas masuk.
* **Kurangnya Transparansi Laporan Keuangan:** Pengelola kesulitan memisahkan sumber pendapatan antara penjualan produk online dan tiket reservasi wisata secara berkala (harian, mingguan, bulanan, tahunan).
* **Pengalaman Pengguna yang Belum Optimal:** Antarmuka sistem sebelumnya kurang tegas, tidak konsisten secara visual, dan lambat dalam sinkronisasi data dengan server.

---

## 2. Goals
* Menyediakan platform terintegrasi (All-in-One) antara e-commerce produk pertanian dan reservasi wisata edukasi.
* Membangun modul keuangan otomatis yang dapat membedakan kategori pemasukan serta menyediakan filter waktu yang fleksibel bagi pengelola.
* Mengoptimalkan performa sinkronisasi data frontend-backend agar lebih responsif, bersih secara visual (*Professional Solid*), dan andal sebelum masuk tahap *deployment*.

---

## 3. Target Users
* **Pengunjung / Wisatawan / Pembeli:** Masyarakat umum, pelajar, atau keluarga yang ingin membeli produk hasil panen/bibit segar serta memesan tiket kunjungan/edukasi kebun agrowisata.
* **Admin / Pengelola Agrowisata:** Tim internal pengelola kebun yang bertugas mengelola inventaris produk, memverifikasi pesanan marketplace, menyetujui reservasi kunjungan, mengelola artikel edukasi, dan memantau laporan keuangan.

---

## 4. User Stories & User Journey
* **Sebagai Pengunjung**, saya ingin mendaftar dan masuk ke akun dengan mudah melalui halaman autentikasi, lalu memilih produk pertanian untuk dimasukkan ke keranjang dan melanjutkan ke pembayaran.
* **Sebagai Pengunjung**, saya ingin memesan jadwal reservasi kunjungan agrowisata secara online dan mendapatkan kepastian status konfirmasi.
* **Sebagai Admin**, saya ingin melihat rekapitulasi total pendapatan bersih yang dikelompokkan berdasarkan kategori (Reservasi vs Pesanan Online) beserta filter tanggal yang spesifik.
* **As Admin**, saya ingin mengelola data produk, artikel, pesan kontak, dan status pesanan secara real-time tanpa jeda loading yang lama.

---

## 5. Functional Requirements
* **Modul Autentikasi (`AuthContext`, `Login`, `Register`):**
  * Sistem mendukung pendaftaran akun baru dan login berbasis *role* (Admin & Pembeli/User).
  * Fitur "Lupa Kata Sandi" (Forgot Password) interaktif via modal untuk pemulihan akses.
* **Modul Marketplace & Keranjang (`Cart`):**
  * Menampilkan daftar item terpilih, penyesuaian kuantitas (`+` / `-`), penghapusan item, subtotal, dan navigasi ke *checkout*.
* **Modul Admin Dashboard & Operasional (`AdminLayout`, `AdminProducts`, `AdminOrders`, `AdminPosts`, `AdminMessages`):**
  * Manajemen CRUD produk, artikel edukasi, dan penanganan pesan masuk/testimoni.
  * Pembaruan status pesanan dan reservasi secara instan (*Optimistic Updates*).
* **Modul Keuangan & Pendapatan (`AdminFinance`):**
  * Kalkulasi total kas masuk bersih secara otomatis.
  * Pembeda kategori visual antara pendapatan reservasi dan pesanan online.
  * Filter periode laporan: *Semua Waktu, Per Hari, Per Minggu, Per Bulan, Per Tahun (pilihan tahun), dan Rentang Tanggal Kustom*.

---

## 6. Non-Functional Requirements
* **Performa & Responsivitas:** Sinkronisasi data menggunakan pendekatan modular per halaman (*lazy fetching*) untuk menghindari beban *Promise.all* masif saat inisialisasi awal.
* **Desain UI/UX:** Menggunakan standar visual **Professional Solid** (border tegas, sudut membulat elegan, shadow terstruktur, dan warna korporat yang konsisten). Halaman autentikasi dipatenkan 100% pas di *viewport* tanpa *scroll*.
* **Keamanan & Kompatibilitas:** Komunikasi aman antara frontend React dan backend Laravel melalui API, serta mendukung *build production* via Vite.

---

## 7. Scope
* **In Scope:** 
  * Halaman publik, marketplace, keranjang, dan form reservasi kunjungan.
  * Panel kontrol admin lengkap (Dashboard, Produk, Pesanan, Keuangan, Reservasi, Pesan, Artikel).
  * Sistem autentikasi dan manajemen state berbasis Context API.
* **Out of Scope:** 
  * Integrasi payment gateway pihak ketiga secara langsung (menggunakan simulasi pembayaran/checkout manual).
  * Aplikasi mobile native (fokus pada web responsive desktop & mobile browser).

---

## 8. Struktur Folder Proyek (Folder Structure)

```text
src/
├── assets/                  # Aset gambar, ikon, atau ilustrasi statis
├── components/
│   ├── layout/              # Komponen layout utama (Navbar, Footer, AdminLayout)
│   └── ui/                  # Komponen UI pendukung (Modal, Button, Card, dll.)
├── context/
│   ├── AuthContext.jsx      # Manajemen sesi login, register, dan token pengguna
│   ├── CartContext.jsx      # Manajemen keranjang belanja sisi client
│   └── AdminContext.jsx     # Manajemen data operasional admin (Modular fetch & state)
├── pages/
│   ├── admin/               # Halaman panel pengelola
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminFinance.jsx      # Modul rekapitulasi keuangan & filter waktu
│   │   ├── AdminReservations.jsx
│   │   ├── AdminMessages.jsx
│   │   └── AdminPosts.jsx
│   ├── auth/                # Halaman autentikasi
│   │   ├── Login.jsx             # Split-screen auth dengan fitur Lupa Kata Sandi
│   │   └── Register.jsx          # Split-screen pendaftaran akun baru
│   └── public/              # Halaman publik & marketplace
│       ├── Home.jsx
│       ├── Marketplace.jsx
│       └── Cart.jsx              # Keranjang belanja
├── services/
│   └── api.js               # Konfigurasi Axios untuk koneksi ke backend Laravel API
├── App.jsx                  # Konfigurasi routing utama aplikasi (React Router)
├── main.jsx                 # Titik masuk aplikasi React
└── index.css                # Konfigurasi global Tailwind CSS

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
