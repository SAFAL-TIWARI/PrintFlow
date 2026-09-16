import React from 'react';
import { Link } from 'react-router-dom';
import { HardDriveDownload, CheckCircle, ShieldCheck, Terminal, ArrowRight, Cpu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function DownloadAgentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <HardDriveDownload className="w-3.5 h-3.5" />
            Official Desktop Spooler
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            PrintPulse Windows Print Agent
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            The lightweight physical agent that runs on your counter PC, discovers your Windows printers, and streams print jobs in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-white text-base">Pair with 6-Digit Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open your Shop Admin &gt; Printers page, click "Pair Windows PC", and enter the 6-digit verification code into the agent console.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-white text-base">Automatic Printer Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The agent interrogates the local Windows print spooler and syncs all connected Canon, HP, and Epson devices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-white text-base">Automated Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer orders are leased exclusively, printed to the proper paper tray, and automatically marked ready.
            </p>
          </div>
        </div>

        {/* Console / Launch Instructions */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono text-emerald-400">Release: v1.0.0 (Windows 10 / 11 / Server)</span>
              <h3 className="text-xl font-bold text-white mt-1">Direct Windows PC Execution</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Node.js 18+ Required</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-medium">To run the agent on your counter PC:</p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <p className="text-slate-500"># Navigate to Backend agent directory or download folder</p>
              <p className="text-emerald-400 font-semibold">cd E:\Projects\Print_Project\Backend\agent</p>
              <p className="text-emerald-400 font-semibold">node agent.js</p>
            </div>
            <p className="text-xs text-slate-400">
              When prompted, enter your 6-digit pairing code from your Shop Admin dashboard. Your printers will be discovered instantly!
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Signed and verified for Windows local spooler access.</span>
            </div>
            <Link
              to="/shop-admin/printers"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Get Pairing Code in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
