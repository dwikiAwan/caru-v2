import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Marketplace from '../pages/public/Marketplace';
import ProductDetail from '../pages/public/ProductDetail';
import Services from '../pages/public/Services';
import Blog from '../pages/public/Blog';
import BlogDetail from '../pages/public/BlogDetail';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Cart from '../pages/public/Cart';
import Checkout from '../pages/public/Checkout';
import UserChat from '../pages/public/UserChat';

// Protected Route Guard
import AdminRoute from '../components/AdminRoute';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminReservations from '../pages/admin/AdminReservations';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminPosts from '../pages/admin/AdminPosts';
import AdminFinance from '../pages/admin/AdminFinance';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/chat" element={<UserChat />} />
        <Route path="/notifications" element={<UserChat />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Automatic Redirect dari /admin ke /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="finance" element={<AdminFinance />} />
          </Route>
        </Route>

        {/* Fallback Route 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}