import React, { useState, useEffect } from 'react';
import { DollarSign, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ShopPricingPage() {
  const { toast } = useToast();
  const [rates, setRates] = useState({
    A4: { bwOneSidePaise: 200, bwBothSidesPaise: 70, colorOneSidePaise: 500, colorBothSidesPaise: 700 },
    A3: { bwOneSidePaise: 500, bwBothSidesPaise: 700, colorOneSidePaise: 2000, colorBothSidesPaise: 2500 },
    A5: { bwOneSidePaise: 100, bwBothSidesPaise: 60, colorOneSidePaise: 300, colorBothSidesPaise: 400 }
  });
  const [finishingRates, setFinishingRates] = useState({
    spiralBindingPaise: 3500,
    hardBindingPaise: 15000,
    laminationPerSheetPaise: 1500
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await api.getPricingRules();
        if (res.success && res.pricingRule) {
          if (res.pricingRule.rates) setRates(res.pricingRule.rates);
          if (res.pricingRule.finishingRates) setFinishingRates(res.pricingRule.finishingRates);
        }
      } catch (err) {
        console.error('Error fetching pricing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updatePricingRules({ rates, finishingRates });
      if (res.success) {
        setSaveSuccess(true);
        toast.success(
          'Pricing Rules Updated',
          'All new customer kiosks and order cost calculations now reflect these rates.'
        );
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      toast.error('Pricing Update Failed', err.message || 'Error saving dynamic pricing matrix.');
    } finally {
      setSaving(false);
    }
  };

  const updateRate = (size, field, inrValue) => {
    const paise = Math.round(parseFloat(inrValue || 0) * 100);
    setRates({
      ...rates,
      [size]: {
        ...rates[size],
        [field]: paise
      }
    });
  };

  const updateFinishRate = (field, inrValue) => {
    const paise = Math.round(parseFloat(inrValue || 0) * 100);
    setFinishingRates({
      ...finishingRates,
      [field]: paise
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading pricing rules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Dynamic Pricing Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure your per-page and duplex rates for A4, A3, and A5, as well as binding fees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          {saving ? 'Updating Rates...' : <><Save className="w-4 h-4" /> <span>Update Pricing</span></>}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pricing rules saved. All future customer calculations will immediately reflect these rates.</span>
        </div>
      )}

      {/* Pricing Matrix Form */}
      <div className="space-y-6">
        {['A4', 'A3', 'A5'].map((size) => (
          <div key={size} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-display text-xs font-bold">
                {size}
              </span>
              <span>{size} Paper Printing Rates (₹ per page side)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">B&amp;W Single Side</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.10"
                    value={((rates[size]?.bwOneSidePaise || 0) / 100).toFixed(2)}
                    onChange={(e) => updateRate(size, 'bwOneSidePaise', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">B&amp;W Double Side</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.10"
                    value={((rates[size]?.bwBothSidesPaise || 0) / 100).toFixed(2)}
                    onChange={(e) => updateRate(size, 'bwBothSidesPaise', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Color Single Side</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.50"
                    value={((rates[size]?.colorOneSidePaise || 0) / 100).toFixed(2)}
                    onChange={(e) => updateRate(size, 'colorOneSidePaise', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Color Double Side</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.50"
                    value={((rates[size]?.colorBothSidesPaise || 0) / 100).toFixed(2)}
                    onChange={(e) => updateRate(size, 'colorBothSidesPaise', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Finishing & Binding Rates */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Finishing &amp; Binding Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Spiral Binding (per copy)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="1"
                  value={((finishingRates.spiralBindingPaise || 0) / 100).toFixed(2)}
                  onChange={(e) => updateFinishRate('spiralBindingPaise', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hard Binding (per copy)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="1"
                  value={((finishingRates.hardBindingPaise || 0) / 100).toFixed(2)}
                  onChange={(e) => updateFinishRate('hardBindingPaise', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Lamination (per page)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="1"
                  value={((finishingRates.laminationPerSheetPaise || 0) / 100).toFixed(2)}
                  onChange={(e) => updateFinishRate('laminationPerSheetPaise', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
