import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Clock, CheckCircle2, AlertCircle, Printer, RefreshCw,
  Check, X, DollarSign, PackageCheck, User, Phone, ArrowUpRight,
  Truck, Store, MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export default function ShopDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('printflow_cached_shop_stats');
      return cached ? JSON.parse(cached) : null;
    } catch (_) { return null; }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('printflow_cached_shop_orders');
      return cached ? JSON.parse(cached) : [];
    } catch (_) { return []; }
  });
  const [loading, setLoading] = useState(!stats && orders.length === 0);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Track known order IDs to notify shopkeeper of newly arriving orders in real time
  const knownOrderIds = useRef(new Set());
  const initialLoadDone = useRef(false);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getOrders({ limit: 40 })
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.stats);
        try { localStorage.setItem('printflow_cached_shop_stats', JSON.stringify(statsRes.value.stats)); } catch (_) { }
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) {
        const freshOrders = ordersRes.value.orders || [];

        // Check for newly received orders after initial dashboard load
        if (initialLoadDone.current) {
          const newOrders = freshOrders.filter(o => !knownOrderIds.current.has(o._id || o.publicToken));
          newOrders.forEach(no => {
            toast.info(
              'New Print Order Received!',
              `${no.customerName || 'Customer'} placed order #${no.publicToken} (₹${((no.pricingSnapshot?.totalPaise || 0) / 100).toFixed(2)}).`,
              { tag: `#${no.publicToken}` }
            );
          });
        }

        freshOrders.forEach(o => knownOrderIds.current.add(o._id || o.publicToken));
        initialLoadDone.current = true;

        setOrders(freshOrders);
        try { localStorage.setItem('printflow_cached_shop_orders', JSON.stringify(freshOrders)); } catch (_) { }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // SSE connection for realtime updates / polling fallback
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Quick Actions
  const handleAccept = async (id) => {
    const target = orders.find(o => o._id === id);
    try {
      await api.acceptOrder(id);
      toast.success(
        'Order Accepted!',
        `Order #${target?.publicToken || ''} moved to printing queue.`,
        { tag: `#${target?.publicToken}` }
      );
      loadData();
    } catch (err) {
      toast.error('Accept Failed', err.message || 'Error accepting order');
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    const token = rejectModal.publicToken;
    try {
      await api.rejectOrder(rejectModal._id, rejectReason);
      setRejectModal(null);
      setRejectReason('');
      toast.warning(
        'Order Rejected',
        `Order #${token} rejected. Customer has been notified.`,
        { tag: `#${token}` }
      );
      loadData();
    } catch (err) {
      toast.error('Reject Failed', err.message || 'Error rejecting order');
    }
  };

  const handleMarkReady = async (id) => {
    const target = orders.find(o => o._id === id);
    try {
      await api.markOrderReady(id);
      toast.success(
        'Prints Ready for Collection!',
        `Order #${target?.publicToken || ''} is marked ready. Customer notified.`,
        { tag: `#${target?.publicToken}` }
      );
      loadData();
    } catch (err) {
      toast.error('Update Failed', err.message || 'Error marking ready');
    }
  };

  const handleCashPaid = async (id) => {
    const target = orders.find(o => o._id === id);
    try {
      await api.markCashPaid(id);
      toast.success(
        'Cash Payment Recorded',
        `Payment collected for Order #${target?.publicToken || ''}.`,
        { tag: `#${target?.publicToken}` }
      );
      loadData();
    } catch (err) {
      toast.error('Payment Error', err.message || 'Error recording cash payment');
    }
  };

  const handleMarkDelivered = async (id) => {
    const target = orders.find(o => o._id === id);
    try {
      await api.markOrderDelivered(id);
      toast.success(
        'Order Completed & Handed Over',
        `Order #${target?.publicToken || ''} marked delivered.`,
        { tag: `#${target?.publicToken}` }
      );
      loadData();
    } catch (err) {
      toast.error('Delivery Error', err.message || 'Error marking order as delivered');
    }
  };

  if (loading && !stats) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const revenueINR = ((stats?.todayRevenuePaise || 0) / 100).toFixed(2);
  const activeOrders = orders.filter(o => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'REJECTED');

  return (
    <div className="space-y-8">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-display text-emerald-400">₹{revenueINR}</span>
            <span className="text-xs text-slate-500">Collected</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Queue Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-display text-white">{activeOrders.length}</span>
            <span className="text-xs text-blue-400 font-semibold">{stats?.pendingCount || 0} New</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pages Printed</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-display text-blue-400">{stats?.todayPagesPrinted || 0}</span>
            <span className="text-xs text-slate-500">Sheets processed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Hardware Status</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className={`w-2 h-2 rounded-full ${stats?.isAgentOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              <span>{stats?.isAgentOnline ? 'Agent Connected' : 'Agent Offline'}</span>
            </div>
            <span className="text-xs text-slate-400">{stats?.onlinePrinters || 0} Printers</span>
          </div>
        </div>
      </div>

      {/* Live Print Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <span>Live Counter Queue</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                {activeOrders.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">Incoming requests appear instantly. Collect cash, mark delivered, and fulfill orders.</p>
          </div>
          <button
            onClick={loadData}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">Queue is clear</h4>
            <p className="text-xs text-slate-400">New customer requests will show up here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map(order => {
              const amountINR = ((order.pricingSnapshot?.totalPaise || 0) / 100).toFixed(2);
              let totalPages = 0;
              order.files?.forEach(f => { totalPages += ((f.pageCount || 1) * (f.copies || 1)); });

              return (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                        {order.publicToken}
                      </span>
                      <StatusBadge status={order.orderStatus} />

                      {/* Fulfillment Badge */}
                      {order.fulfillmentType === 'DELIVERY' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Truck className="w-3 h-3" />
                          <span>Delivery</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          <Store className="w-3 h-3" />
                          <span>Pickup</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                      <span className="font-semibold text-white flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {order.customerName || 'Guest Customer'}
                      </span>
                      {order.customerPhone && (
                        <span className="text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {order.customerPhone}
                        </span>
                      )}
                      <span className="text-slate-400">
                        {order.files?.length} file(s) · <strong className="text-white">{totalPages}</strong> total pages
                      </span>
                      {order.assignedPrinterName && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <Printer className="w-3 h-3" />
                          {order.assignedPrinterName}
                        </span>
                      )}
                    </div>

                    {/* Delivery Address display if Delivery */}
                    {order.fulfillmentType === 'DELIVERY' && order.deliveryAddress && (
                      <div className="text-[11px] text-amber-300 flex items-center gap-1.5 pt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Address: <strong>{order.deliveryAddress}</strong></span>
                        {order.deliveryNotes && <span className="text-slate-400">({order.deliveryNotes})</span>}
                      </div>
                    )}
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Bill</span>
                      <span className="text-base font-extrabold text-emerald-400 font-display">₹{amountINR}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Step A: Accept / Reject when SUBMITTED */}
                      {order.orderStatus === 'SUBMITTED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAccept(order._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectModal(order)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Step B: Mark Ready when ACCEPTED or PRINTING */}
                      {(order.orderStatus === 'ACCEPTED' || order.orderStatus === 'QUEUED' || order.orderStatus === 'PRINTING') && (
                        <button
                          type="button"
                          onClick={() => handleMarkReady(order._id)}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Mark Ready</span>
                        </button>
                      )}

                      {/* Step C: Cash Received button (when UNPAID) */}
                      {order.paymentStatus === 'UNPAID' && (
                        <button
                          type="button"
                          onClick={() => handleCashPaid(order._id)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 shadow-md ${order.orderStatus === 'CUSTOMER_RECEIVED'
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20 ring-2 ring-amber-400/50 animate-pulse'
                              : 'bg-blue-500 hover:bg-blue-400 text-slate-950'
                            }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>
                            {order.orderStatus === 'CUSTOMER_RECEIVED'
                              ? 'Collect Cash & Complete'
                              : 'Cash Received'}
                          </span>
                        </button>
                      )}

                      {/* Step D: Delivered option appearing after payment is PAID, until user clicks 'I have received prints' */}
                      {order.paymentStatus === 'PAID' && order.orderStatus !== 'COMPLETED' && (
                        <>
                          {order.orderStatus === 'DELIVERED' ? (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Delivered (Awaiting Customer Receipt)</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMarkDelivered(order._id)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{order.fulfillmentType === 'DELIVERY' ? 'Mark Delivered' : 'Hand Over / Delivered'}</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* Inspect Specs */}
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="View file specs"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Reject Print Request {rejectModal.publicToken}</h3>
            <p className="text-xs text-slate-400">Please provide a reason. The customer will see this message in real-time.</p>
            <textarea
              rows="3"
              placeholder="e.g. Paper tray empty, printer undergoing maintenance, or file corrupt."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Specs Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-blue-400">{selectedOrder.publicToken}</span>
                <h3 className="text-base font-bold text-white">Document Specifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'None'}</p>
                <p><strong>Fulfillment:</strong> {selectedOrder.fulfillmentType || 'COUNTER_PICKUP'}</p>
                {selectedOrder.deliveryAddress && (
                  <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                )}
                {selectedOrder.deliveryNotes && (
                  <p><strong>Notes:</strong> {selectedOrder.deliveryNotes}</p>
                )}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Documents</h4>
              {selectedOrder.files?.map((file, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{file.originalName}</span>
                    <span className="font-mono text-emerald-400">₹{((file.calculatedPricePaise || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 grid grid-cols-2 gap-1 pt-1">
                    <span>Copies: <strong className="text-slate-200">{file.copies}</strong></span>
                    <span>Pages: <strong className="text-slate-200">{file.pageCount}</strong></span>
                    <span>Color: <strong className="text-slate-200">{file.colorMode}</strong></span>
                    <span>Sides: <strong className="text-slate-200">{file.sides}</strong></span>
                    <span>Size: <strong className="text-slate-200">{file.paperSize}</strong></span>
                    <span>Finishing: <strong className="text-slate-200">{file.finishing}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
