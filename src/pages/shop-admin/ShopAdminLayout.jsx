import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ListOrdered, Palette, Printer, DollarSign, 
  BarChart3, QrCode, Store, LogOut, ShieldCheck, ChevronRight,
  ChevronLeft, ChevronDown, User, Shield, ExternalLink, HardDriveDownload,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ThemeToggle } from '../../context/ThemeContext';

export default function ShopAdminLayout() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if admin is inspecting another shop
  const inspectedShopId = sessionStorage.getItem('inspected_shop_id');
  const inspectedShopName = sessionStorage.getItem('inspected_shop_name');
  const inspectedShopSlug = sessionStorage.getItem('inspected_shop_slug');

  const isInspecting = user?.role === 'PLATFORM_SUPER_ADMIN' && !!inspectedShopId;
  const currentShopName = (isInspecting && inspectedShopName) ? inspectedShopName : (user?.shopName || 'Shop Counter');
  const currentShopSlug = (isInspecting && inspectedShopSlug) ? inspectedShopSlug : (user?.shopSlug || null);

  const handleExitInspection = () => {
    sessionStorage.removeItem('inspected_shop_id');
    sessionStorage.removeItem('inspected_shop_name');
    sessionStorage.removeItem('inspected_shop_slug');
    toast.info('Exited Inspection', 'Returned to Platform Super Admin dashboard.');
    navigate('/platform-admin');
  };

  const handleLogout = () => {
    toast.info('Signed Out', 'You have been signed out of PrintPulse.');
    logout();
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Live Queue & Stats', path: '/shop-admin', icon: LayoutDashboard },
    { label: 'All Orders', path: '/shop-admin/orders', icon: ListOrdered },
    { label: 'Printers & Queues', path: '/shop-admin/printers', icon: Printer },
    { label: 'Shop Profile', path: '/shop-admin/profile', icon: Store },
    { label: 'Template Designer', path: '/shop-admin/template', icon: Palette },
    { label: 'Pricing Rules', path: '/shop-admin/pricing', icon: DollarSign },
    { label: 'Reports & CSV', path: '/shop-admin/reports', icon: BarChart3 },
    { label: 'Print Counter QR', path: '/shop-admin/poster', icon: QrCode },
  ];

  // Mobile bottom bar quick links (5 main actions)
  const mobileNavItems = [
    { label: 'Queue', path: '/shop-admin', icon: LayoutDashboard },
    { label: 'Orders', path: '/shop-admin/orders', icon: ListOrdered },
    { label: 'Printers', path: '/shop-admin/printers', icon: Printer },
    { label: 'Profile', path: '/shop-admin/profile', icon: Store },
    { label: 'QR Poster', path: '/shop-admin/poster', icon: QrCode },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Fixed Sidebar */}
      <aside 
        className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-slate-900/95 border-r border-slate-800 p-3 shrink-0 z-20 transition-all duration-300 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Shop Header & Collapse Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 px-1 pt-1">
            <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 shadow-inner">
                <Printer className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <h2 className="text-sm font-bold text-blue-100 dark:text-white" title={currentShopName}>
                    {currentShopName}
                  </h2>
                  <span className="text-[10px] text-emerald-400 font-medium truncate block">
                    {isInspecting ? 'Admin Inspection' : 'Print Counter'}
                  </span>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsed Expand Trigger */}
          {collapsed && (
            <div className="pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

       
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <Link to="/" className="hover:text-slate-200 transition-colors hidden sm:inline">PrintPulse</Link>
            <span className="hidden sm:inline">/</span>
            <span className="font-medium text-slate-300 truncate">
              {navItems.find((i) => i.path === location.pathname)?.label || 'Shop Counter'}
            </span>
          </div>

          {/* Right Header Actions & Rich Profile Menu */}
          <div className="flex items-center gap-3 text-xs">
            {/* Theme Toggle beside profile menu */}
            <ThemeToggle />

            {/* Rich Profile Dropdown Menu (Matches Home Page design) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-200 transition-all focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-inner">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="font-semibold text-xs hidden sm:inline max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 text-xs overflow-hidden divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  {/* User Profile Header */}
                  <div className="px-4 py-3 bg-slate-950/50">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Signed in as</p>
                    <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                    {currentShopName && (
                      <p className="text-[11px] text-emerald-400 font-semibold truncate mt-1 flex items-center gap-1">
                        <Store className="w-3 h-3 shrink-0" />
                        <span>{currentShopName}</span>
                      </p>
                    )}
                  </div>

                  {/* Public Kiosk Link (Shifted into profile menu) */}
                  {currentShopSlug && (
                    <div className="py-1">
                      <Link 
                        to={`/shop/${currentShopSlug}`} 
                        target="_blank" 
                        className="flex items-center justify-between px-4 py-2.5 text-amber-400 hover:bg-slate-800/80 font-semibold transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-400" />
                          <span>Open Public Kiosk</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Internal Links */}
                  <div className="py-1">
                    {user?.role === 'PLATFORM_SUPER_ADMIN' && (
                      <Link 
                        to="/platform-admin" 
                        className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Platform Super Admin</span>
                      </Link>
                    )}
                    <Link 
                      to="/shop-admin/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span>Shop Profile &amp; Settings</span>
                    </Link>
                    <Link 
                      to="/shop-admin/template" 
                      className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span>Template Designer</span>
                    </Link>
                    <Link 
                      to="/shop-admin/poster" 
                      className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Print Counter QR</span>
                    </Link>
                  </div>

                  {/* Sign Out (Shifted into profile menu) */}
                  <div className="py-1">
                    {isInspecting ? (
                      <button
                        type="button"
                        onClick={handleExitInspection}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-amber-400 hover:bg-amber-500/10 font-semibold transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Exit Shop Inspection</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Super Admin Inspection Banner */}
        {isInspecting && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-300 shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Super Admin Mode:</strong> You are actively inspecting and controlling <strong>{currentShopName}</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExitInspection}
              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              Return to Platform Admin
            </button>
          </div>
        )}

        {/* Scrollable Main Content Area (Only content scrolls) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Professional Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around py-2 px-2 shadow-2xl">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
