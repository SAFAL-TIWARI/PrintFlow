import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Shield, CheckCircle2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Printer className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold font-display text-white">
                Print<span className="text-emerald-400">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The modern QR printing platform for Xerox, campus print shops, and digital copy centers. Zero customer app required.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/shops" className="hover:text-emerald-400 transition-colors">Find Local Shops</Link></li>
              <li><Link to="/download" className="hover:text-emerald-400 transition-colors">Windows Print Agent</Link></li>
              <li><Link to="/#pricing" className="hover:text-emerald-400 transition-colors">Shop Pricing</Link></li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Privacy & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero File Retention</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted In Transit</span>
              </li>
              <li className="text-slate-500 text-[11px] leading-normal pt-1">
                Files are auto-purged from cloud servers immediately after print completion.
              </li>
            </ul>
          </div>

          {/* Portal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">For Shopkeepers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Shop Admin Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Register Print Counter</Link></li>
              <li><Link to="/shop/saffron-enterprises" className="text-amber-400/90 hover:text-amber-300 transition-colors">Demo Customer Kiosk</Link></li>
              <li><Link to="/platform-admin" className="text-slate-500 hover:text-slate-400 transition-colors">Platform Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PrintFlow Technologies. Built for speed and reliability.</p>
          <p className="flex items-center gap-1">
            Engineered for high-volume Xerox counters with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
