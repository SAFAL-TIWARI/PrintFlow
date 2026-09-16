import React, { useState, useEffect } from 'react';
import { BarChart3, Download, DollarSign, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ShopReportsPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleDownloadCsv = async () => {
    try {
      setDownloading(true);
      toast.info('Exporting Records', 'Generating CSV spreadsheet of all counter transactions...');
      await api.exportOrdersCsv();
      toast.success('CSV Export Completed', 'Orders archive downloaded to your device.');
    } catch (err) {
      toast.error('Export Failed', err.message || 'Error exporting CSV.');
    } finally {
      setDownloading(false);
    }
  };

  const totalRevINR = ((stats?.todayRevenuePaise || 0) / 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Financial &amp; Print Analytics</h1>
          <p className="text-xs text-slate-400">Review print volumes, billing totals, and export accounting records.</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Exporting...' : 'Download All Orders (CSV)'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Revenue Today</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-display text-emerald-400">₹{totalRevINR}</p>
          <p className="text-[11px] text-slate-500">Collected via UPI &amp; Cash at Counter</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black font-display text-slate-900 dark:text-white">{stats?.completedCount || 0}</p>
          <p className="text-[11px] text-slate-500">Physical jobs printed and verified</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Pages Printed</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black font-display text-purple-400">{stats?.todayPagesPrinted || 0}</p>
          <p className="text-[11px] text-slate-500">Cumulative sheets through Windows Agent</p>
        </div>
      </div>

      {/* Breakdown Notice */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Accounting &amp; Data Protection Compliance</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          In accordance with platform security rules, customer files are completely purged from storage after orders are fulfilled. Non-sensitive billing metadata (order token, customer name, date, pages, amount, and payment method) is permanently preserved in your CSV reports for tax and shop accounting purposes.
        </p>
      </div>
    </div>
  );
}
