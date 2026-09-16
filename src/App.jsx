import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

import LandingPage from './pages/LandingPage';
import ShopDirectoryPage from './pages/ShopDirectoryPage';
import ShopKioskPage from './pages/ShopKioskPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import DownloadAgentPage from './pages/DownloadAgentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import ShopAdminLayout from './pages/shop-admin/ShopAdminLayout';
import ShopDashboard from './pages/shop-admin/ShopDashboard';
import ShopOrdersPage from './pages/shop-admin/ShopOrdersPage';
import ShopTemplatePage from './pages/shop-admin/ShopTemplatePage';
import ShopPrintersPage from './pages/shop-admin/ShopPrintersPage';
import ShopPricingPage from './pages/shop-admin/ShopPricingPage';
import ShopReportsPage from './pages/shop-admin/ShopReportsPage';
import ShopPosterPage from './pages/shop-admin/ShopPosterPage';
import ShopProfilePage from './pages/shop-admin/ShopProfilePage';

import PlatformDashboard from './pages/platform-admin/PlatformDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/shops" element={<ShopDirectoryPage />} />
                <Route path="/shop/:shopSlug" element={<ShopKioskPage />} />
                <Route path="/track/:token" element={<OrderTrackingPage />} />
                <Route path="/download" element={<DownloadAgentPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Shopkeeper Admin (Also accessible to Platform Super Admin for inspection) */}
                <Route
                  path="/shop-admin"
                  element={
                    <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN', 'SHOP_ADMIN', 'SHOP_STAFF']}>
                      <ShopAdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<ShopDashboard />} />
                  <Route path="orders" element={<ShopOrdersPage />} />
                  <Route path="profile" element={<ShopProfilePage />} />
                  <Route path="template" element={<ShopTemplatePage />} />
                  <Route path="printers" element={<ShopPrintersPage />} />
                  <Route path="pricing" element={<ShopPricingPage />} />
                  <Route path="reports" element={<ShopReportsPage />} />
                  <Route path="poster" element={<ShopPosterPage />} />
                </Route>

                {/* Platform Super Admin */}
                <Route
                  path="/platform-admin"
                  element={
                    <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN']}>
                      <PlatformDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
