import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer, QrCode, Shield, Zap, Clock, Smartphone, CheckCircle,
  ArrowRight, Store, HardDriveDownload, Sparkles, Check, ChevronRight, HelpCircle
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function LandingPage() {
  const [calcPages, setCalcPages] = useState(10);
  const [calcColor, setCalcColor] = useState('bw');
  const [calcSides, setCalcSides] = useState('double');

  // Estimate price
  let rate = 2.0;
  if (calcColor === 'bw') {
    rate = calcSides === 'single' ? 2.0 : 0.7; // per side
  } else {
    rate = calcSides === 'single' ? 5.0 : 7.0;
  }
  const estimatedTotal = (calcPages * rate).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Print Counter SaaS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15]">
              Turn any Xerox shop into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">smart print counter.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Scan counter QR. Upload files. Configure B&amp;W or Color in seconds. Physical prints ready before customers even reach the counter. <strong className="text-white font-medium">No WhatsApp chaos. Zero customer app.</strong>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop/saffron-enterprises"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5"
              >
                <span>Try Live Customer Kiosk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-colors"
              >
                <span>Register Your Print Shop</span>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Customer Login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Auto-Purge Document Files</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Windows Print Agent Ready</span>
              </div>
            </div>
          </div>

          {/* Interactive Kiosk Mockup Card */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-400 ml-2 font-mono">printpulse.io/shop/saffron-enterprises</span>
              </div>
              <Link to="/shop/saffron-enterprises" className="text-xs text-emerald-400 font-medium hover:underline flex items-center gap-1">
                Open in new tab <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-3">
                <div className="text-amber-400 text-xl font-bold font-display">Saffron Enterprises</div>
                <p className="text-xs text-slate-400">Premier University Print &amp; Xerox Station</p>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
                  <strong>Privacy First:</strong> Files are processed exclusively for printing and permanently deleted right after completion.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <QrCode className="w-16 h-16 text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-white">Scan at Shop Counter</div>
                <div className="text-[11px] text-slate-400">Instant upload from iPhone &amp; Android</div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Live Ticket:</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PP-1042</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Ready at Counter
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Estimated Total:</span>
                  <span className="text-lg font-bold text-white">₹33.60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Effortless for Customers. Seamless for Shopkeepers.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Say goodbye to customers crowding around the shop PC, sending emails, or waiting in queue for WhatsApp downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg font-display">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Scan Shop QR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer scans the unique QR displayed at the Xerox counter. Directly opens that shop's branded print kiosk on mobile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg font-display">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Upload &amp; Configure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer selects PDFs or images. Configures copies, B&amp;W or Color, duplex sides, and finishing with instant dynamic price calculation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg font-display">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Print Agent Routes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Windows Shop Print Agent running on the shopkeeper PC receives the job, routes it to the designated physical printer, and updates status.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg font-display">
                4
              </div>
              <h3 className="text-lg font-bold text-white">Collect &amp; Auto-Purge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer picks up prints, confirms receipt, and pays via UPI or Cash. All files are automatically deleted from server memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Pricing Estimator */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Interactive Price Engine Demo
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Test how the backend calculates exact pricing dynamically using shop-configured rules and integer paise precision.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Number of Pages</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={calcPages}
                  onChange={(e) => setCalcPages(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Color Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcColor('bw')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${calcColor === 'bw'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    B&amp;W
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcColor('color')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${calcColor === 'color'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    Color
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Sides</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcSides('single')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${calcSides === 'single'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcSides('double')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${calcSides === 'double'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    Double (Duplex)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">Calculated Rate:</p>
                <p className="text-sm font-medium text-slate-200">
                  ₹{rate.toFixed(2)} / page side {calcSides === 'double' ? '(Duplex savings applied)' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Customer Price</p>
                <p className="text-3xl font-extrabold text-emerald-400 font-display">₹{estimatedTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Windows Print Agent Showcase */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <HardDriveDownload className="w-3.5 h-3.5" />
                Windows Print Agent
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
                Connects directly to your Canon, HP, or Epson spooler.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Web browsers cannot physically send raw documents to your USB or LAN printer over the internet. The PrintPulse Windows Agent bridges this gap safely and automatically.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-300">Auto-detects installed Windows printers without manual IP setup.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-300">Routes color documents to color printers, and B&amp;W jobs to fast lasers.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-300">Instant 6-digit hardware pairing code. No root passwords stored on PC.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/download"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-colors"
                >
                  <HardDriveDownload className="w-4 h-4" />
                  Download &amp; Pair Agent
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-500">
                <span>PrintPulse Agent Console v1.0.0</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              </div>
              <p className="text-slate-500">&gt; Initializing PrintPulse Windows Spooler Client...</p>
              <p className="text-slate-400">&gt; Detected Printer: Canon imageRUNNER ADVANCE C3530 (Color / Duplex)</p>
              <p className="text-slate-400">&gt; Detected Printer: HP LaserJet Enterprise M608 (High-speed B&amp;W)</p>
              <p className="text-emerald-400 font-bold">&gt; [OK] Device Token Verified. Heartbeat active.</p>
              <p className="text-amber-400">&gt; [Job Claimed] Ticket: PP-1042 (12 pages, Duplex B&amp;W)</p>
              <p className="text-blue-400">&gt; [Spooling] Sending document to Canon iR-ADV C3530...</p>
              <p className="text-emerald-400">&gt; [Status] Physical printing completed. Order marked READY.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Do customers need to create an account or download an app?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                No. Customers simply scan the QR code with their regular smartphone camera, which opens that shop's dedicated mobile kiosk. A unique ticket number (e.g. PP-1042) is generated automatically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                How are customer files protected?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Uploaded documents are stored in private cloud storage accessible only via short-lived signed URLs. Once the print order is completed or expires, files are permanently purged automatically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Can the shopkeeper accept both Cash and Online UPI?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Yes. The shopkeeper can enable Online UPI and Cash at Counter. The customer confirms "Print Received" before payment becomes active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-950/30 border-t border-emerald-900/30 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold font-display text-white">
            Ready to upgrade your print counter?
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Set up your shop in under 5 minutes. Generate your printable QR counter poster today.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/shops"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              Explore Active Shops
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
