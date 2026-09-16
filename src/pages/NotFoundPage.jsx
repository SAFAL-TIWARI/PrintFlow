import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center text-slate-100">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <Printer className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-extrabold font-display text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page or Counter Not Found</h2>
        <p className="text-xs text-slate-400">
          The print counter URL or ticket you requested does not exist or has been moved.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/shops"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <span>Find Print Shops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
