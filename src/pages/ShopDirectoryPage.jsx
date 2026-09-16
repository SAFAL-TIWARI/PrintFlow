import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Phone, ArrowRight, Search, ShieldCheck, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { api } from '../services/api';

export default function ShopDirectoryPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchShops() {
      try {
        const res = await api.getShops();
        if (res.success) {
          setShops(res.shops || []);
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(search.toLowerCase()) ||
    (shop.city && shop.city.toLowerCase().includes(search.toLowerCase())) ||
    (shop.tagline && shop.tagline.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5" />
            Verified Print Counters
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Find an Authorized PrintPulse Shop
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Select a verified Xerox or digital printing counter to open their live mobile kiosk, upload your files, and collect your prints.
          </p>

          <div className="mt-6 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by shop name, campus, or city (e.g. Delhi, Vidisha)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm shadow-lg transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-56 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No print shops found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new counter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
              <div 
                key={shop.slug}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-display text-lg">
                      {shop.name.charAt(0)}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {shop.tagline || 'Fast & High Quality Document Prints'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{shop.city ? `${shop.city}, ${shop.state || ''}` : 'Local Campus Counter'}</span>
                    </div>
                    {shop.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{shop.contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{shop.isAcceptingOrders !== false ? 'Accepting Orders Now' : 'Counter Paused'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">/shop/{shop.slug}</span>
                  <Link
                    to={`/shop/${shop.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all group-hover:translate-x-0.5"
                  >
                    <span>Print Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
