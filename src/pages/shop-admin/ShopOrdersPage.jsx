import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, RefreshCw, FileText, Download, Trash2, Calendar, User, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function ShopOrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isSuperAdmin = user?.role === 'PLATFORM_SUPER_ADMIN';

  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('printpulse_cached_shop_orders_page');
      return cached ? JSON.parse(cached) : [];
    } catch (_) { return []; }
  });
  const [loading, setLoading] = useState(orders.length === 0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const loadOrders = async (querySearch = search) => {
    try {
      if (orders.length === 0) setLoading(true);
      const res = await api.getOrders({
        search: querySearch,
        status: statusFilter,
        limit: 100
      });
      if (res.success) {
        setOrders(res.orders || []);
        try {
          localStorage.setItem('printpulse_cached_shop_orders_page', JSON.stringify(res.orders || []));
        } catch (_) {}
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Instant real-time debounced search as user types
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      loadOrders(search);
    }, 250);

    return () => clearTimeout(delayTimer);
  }, [search, statusFilter]);

  const handleDeleteOrder = async (orderId, publicToken) => {
    if (!window.confirm(`Are you sure you want to permanently delete order ${publicToken}?`)) {
      return;
    }
    try {
      setDeletingId(orderId);
      await api.deleteOrder(orderId);
      setOrders(orders.filter(o => o._id !== orderId));
      toast.warning('Order Removed', `Order #${publicToken} was permanently deleted from archive.`, { tag: publicToken });
    } catch (err) {
      toast.error('Failed to Delete Order', err.message || 'Server error while deleting order.');
    } finally {
      setDeletingId(null);
    }
  };

  // Generate structured, clean PDF report of orders
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF('landscape');
      const shopName = sessionStorage.getItem('inspected_shop_name') || user?.shopName || 'PrintFlow Counter';
      const timestamp = new Date().toLocaleString();

      // Calculate Summary Stats
      let totalRevenuePaise = 0;
      let totalPages = 0;
      orders.forEach(o => {
        if (o.paymentStatus === 'PAID') {
          totalRevenuePaise += (o.pricingSnapshot?.totalPaise || 0);
        }
        o.files?.forEach(f => {
          totalPages += ((f.pageCount || 1) * (f.copies || 1));
        });
      });

      // PDF Header
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`${shopName} - Order Archive Report`, 14, 18);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Generated on: ${timestamp} | Filter: ${statusFilter} | Total Records: ${orders.length}`, 14, 25);
      doc.text(`Total Pages: ${totalPages} | Paid Revenue: Rs ${(totalRevenuePaise / 100).toFixed(2)}`, 14, 31);

      // Table Data
      const tableHeaders = [
        ['Token', 'Customer / Delivery', 'Files / Pages', 'Printer', 'Amount', 'Payment', 'Status', 'Date & Time']
      ];

      const tableRows = orders.map(o => {
        let pages = 0;
        o.files?.forEach(f => { pages += ((f.pageCount || 1) * (f.copies || 1)); });
        const amountINR = `Rs ${((o.pricingSnapshot?.totalPaise || 0) / 100).toFixed(2)}`;
        const dateStr = new Date(o.createdAt).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const customerDisplay = o.fulfillmentType === 'DELIVERY'
          ? `${o.customerName || 'Guest'} [Del: ${o.deliveryAddress || 'Campus'}]`
          : `${o.customerName || 'Guest'} [Pickup]`;

        return [
          o.publicToken || 'N/A',
          customerDisplay,
          `${o.files?.length || 0} file(s) · ${pages} pgs`,
          o.assignedPrinterName || 'Default',
          amountINR,
          `${o.paymentStatus || 'PENDING'} (${o.paymentMethod || 'CASH'})`,
          o.orderStatus || 'SUBMITTED',
          dateStr
        ];
      });

      autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: 36,
        theme: 'grid',
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });

      doc.save(`printflow-orders-${Date.now()}.pdf`);
      toast.success('PDF Archive Generated', `Successfully downloaded ${orders.length} orders report.`);
    } catch (err) {
      toast.error('PDF Export Failed', err.message || 'Could not generate orders PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Order Archive &amp; History</h1>
          <p className="text-xs text-slate-400">
            Real-time instant search, structured PDF download, and print queue management.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={orders.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Orders PDF</span>
        </button>
      </div>

      {/* Filters & Instant Live Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Type customer name, phone, or token (e.g. PP-1042)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">New Requests</option>
            <option value="ACCEPTED">Accepted / In Queue</option>
            <option value="PRINTING">Printing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            onClick={() => {
              loadOrders();
              toast.info('Refreshing Orders', 'Checking for newly submitted counter orders.');
            }}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Files &amp; Pages</th>
                <th className="px-4 py-3">Printer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                {isSuperAdmin && <th className="px-4 py-3 text-right">Admin Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 9 : 8} className="text-center py-12 text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 9 : 8} className="text-center py-12 text-slate-500">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  let totalPages = 0;
                  o.files?.forEach((f) => {
                    totalPages += (f.pageCount || 1) * (f.copies || 1);
                  });
                  const totalINR = ((o.pricingSnapshot?.totalPaise || 0) / 100).toFixed(2);

                  return (
                    <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-400">{o.publicToken}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-white">{o.customerName || 'Guest'}</div>
                        {o.fulfillmentType === 'DELIVERY' ? (
                          <div className="text-[10px] text-amber-400 font-medium truncate max-w-[150px]" title={o.deliveryAddress}>
                            🛵 {o.deliveryAddress || 'Campus Delivery'}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500">🏢 Counter Pickup</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {o.files?.length} file(s) · {totalPages} pgs
                      </td>
                      <td className="px-4 py-3 text-blue-400 font-medium truncate max-w-[150px]">
                        {o.assignedPrinterName || 'Default'}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-400">₹{totalINR}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {o.paymentStatus} ({o.paymentMethod || 'PENDING'})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.orderStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Admin-only Delete Icon */}
                      {isSuperAdmin && (
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(o._id, o.publicToken)}
                            disabled={deletingId === o._id}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors disabled:opacity-50"
                            title="Delete Order (Admin Only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
