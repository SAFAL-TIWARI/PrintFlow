import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Printer, QrCode, LayoutDashboard, LogOut, Menu, X, 
  Store, Shield, ChevronDown, UserCheck, HardDriveDownload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Printer className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Print<span className="text-emerald-500">Flow</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/#how-it-works" className="hover:text-emerald-400 transition-colors">
            How It Works
          </Link>
          <Link to="/shops" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Store className="w-4 h-4" />
            Find Shops
          </Link>
          <Link to="/#pricing" className="hover:text-emerald-400 transition-colors">
            Pricing
          </Link>
          <Link to="/download" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <HardDriveDownload className="w-4 h-4" />
            Print Agent
          </Link>
          <Link to="/#faq" className="hover:text-emerald-400 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* User / Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle beside login / profile button */}
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-200 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-50 text-sm"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="font-semibold text-white truncate">{user.email}</p>
                    {user.shopName && (
                      <p className="text-xs text-emerald-400 font-medium truncate mt-0.5">
                        🏪 {user.shopName}
                      </p>
                    )}
                  </div>

                  {user.role === 'PLATFORM_SUPER_ADMIN' ? (
                    <>
                      <Link to="/platform-admin" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        Platform Admin
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/shop-admin" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        Live Print Queue
                      </Link>
                      {user.shopSlug && (
                        <Link to={`/shop/${user.shopSlug}`} className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                          <Store className="w-4 h-4 text-amber-400" />
                          View Public Kiosk
                        </Link>
                      )}
                      <Link to="/shop-admin/template" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <QrCode className="w-4 h-4 text-blue-400" />
                        Template Designer
                      </Link>
                      <Link to="/shop-admin/printers" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Printer className="w-4 h-4 text-indigo-400" />
                        Manage Printers
                      </Link>
                      <Link to="/shop-admin/poster" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        Print Counter QR
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
              >
                Register Shop
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger + Theme toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/shops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Find Printing Shops
          </Link>
          <Link
            to="/download"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Download Print Agent
          </Link>
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            How It Works
          </Link>

          {user ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">Signed in as {user.name}</p>
              {user.role === 'PLATFORM_SUPER_ADMIN' ? (
                <Link
                  to="/platform-admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-emerald-400 font-medium"
                >
                  Platform Admin
                </Link>
              ) : (
                <>
                  <Link
                    to="/shop-admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-emerald-400 font-medium"
                  >
                    Shop Dashboard
                  </Link>
                  {user.shopSlug && (
                    <Link
                      to={`/shop/${user.shopSlug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-amber-400 font-medium"
                    >
                      View Kiosk
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={logout}
                className="w-full text-left py-2 text-rose-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-lg"
              >
                Register Your Shop
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
