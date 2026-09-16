import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Store, CheckCircle, XCircle, AlertCircle, RefreshCw, 
  BarChart2, Users, FileText, Trash2, ExternalLink, Clock, Check, Eye
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [shops, setShops] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // default to pending requests if any
  const [shopToDelete, setShopToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, shopsRes, logsRes] = await Promise.allSettled([
        api.getPlatformStats(),
        api.getAllPlatformShops(),
        api.getAuditLogs()
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.stats);
      }
      if (shopsRes.status === 'fulfilled' && shopsRes.value?.success) {
        const loadedShops = shopsRes.value.shops || [];
        setShops(loadedShops);
        // If there are pending shops, show pending tab first
        const hasPending = loadedShops.some(s => s.status === 'PENDING');
        if (hasPending && activeTab === 'pending') {
          setActiveTab('pending');
        } else if (!hasPending && activeTab === 'pending') {
          setActiveTab('shops');
        }
      }
      if (logsRes.status === 'fulfilled' && logsRes.value?.success) {
        setLogs(logsRes.value.logs || []);
      }
    } catch (err) {
      console.error('Error fetching platform admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (shopId, newStatus) => {
    try {
      setActionLoading(true);
      await api.updateShopStatus(shopId, newStatus);
      if (newStatus === 'APPROVED') {
        toast.success('Shop Counter Approved', 'Granted active live kiosk and dashboard access.');
      } else if (newStatus === 'SUSPENDED') {
        toast.warning('Shop Counter Suspended', 'Shop kiosk temporarily deactivated from network.');
      } else {
        toast.info('Status Updated', `Shop status set to ${newStatus}.`);
      }
      await loadData();
    } catch (err) {
      toast.error('Update Failed', err.message || 'Error updating shop status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!shopToDelete) return;
    const deletedName = shopToDelete.name;
    try {
      setActionLoading(true);
      await api.deleteShop(shopToDelete._id);
      setShopToDelete(null);
      toast.warning('Shop Counter Deleted', `"${deletedName}" and its queues were permanently removed.`, { tag: 'DELETED' });
      await loadData();
    } catch (err) {
      toast.error('Deletion Failed', err.message || 'Error deleting shop.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInspectShop = (shop) => {
    sessionStorage.setItem('inspected_shop_id', shop._id);
    sessionStorage.setItem('inspected_shop_name', shop.name);
    sessionStorage.setItem('inspected_shop_slug', shop.slug);
    toast.info('Inspection Mode Active', `Viewing live counter operations for "${shop.name}".`, { tag: `/shop/${shop.slug}` });
    navigate(`/shop-admin?shopId=${shop._id}`);
  };

  const pendingShops = shops.filter(s => s.status === 'PENDING');
  const activeAndOtherShops = shops.filter(s => s.status !== 'PENDING');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">Platform Super Admin</h1>
              <p className="text-xs text-slate-400">Global multi-tenant governance, shop approvals, and control panel.</p>
            </div>
          </div>

          <button
            onClick={() => {
              loadData();
              toast.info('Refreshing Platform', 'Syncing network stats, shops, and audit logs.');
            }}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Platform Stats</span>
          </button>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-amber-400">{pendingShops.length}</span>
              <span className="text-xs text-amber-400 font-semibold">Needs Approval</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Print Shops</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-white">{stats?.activeShops || 0}</span>
              <span className="text-xs text-emerald-400 font-semibold">{stats?.totalShops || 0} Total</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Network Orders</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-blue-400">{stats?.totalOrders || 0}</span>
              <span className="text-xs text-slate-500">All shops</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Platform Gross GMV</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-emerald-400">
                ₹{((stats?.totalRevenuePaise || 0) / 100).toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">Processed</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Registration Requests</span>
            {pendingShops.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-950 text-amber-300 font-black">
                {pendingShops.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shops')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'shops'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>All Print Shops ({shops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail ({logs.length})</span>
          </button>
        </div>

        {/* TAB 1: PENDING SHOP REQUESTS */}
        {activeTab === 'pending' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">New Shop Registration Requests</h3>
                <p className="text-[11px] text-slate-400">Review pending counters and approve them to grant dashboard access.</p>
              </div>
              <span className="text-xs text-amber-400 font-semibold">{pendingShops.length} Pending</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Shop Details</th>
                    <th className="px-4 py-3">Owner Contact</th>
                    <th className="px-4 py-3">Location / City</th>
                    <th className="px-4 py-3">Requested At</th>
                    <th className="px-4 py-3 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pendingShops.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-500">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold text-slate-600 dark:text-slate-400">No pending registration requests</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-600">All registered shop counters have been reviewed.</p>
                      </td>
                    </tr>
                  ) : (
                    pendingShops.map((shop) => (
                      <tr key={shop._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white text-sm">{shop.name}</div>
                          <div className="font-mono text-emerald-400 text-[11px]">/shop/{shop.slug}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-white font-medium">{shop.ownerId?.name || 'Owner'}</div>
                          <div className="text-slate-300 font-mono text-[11px]">{shop.contactPhone}</div>
                          <div className="text-slate-500 text-[10px]">{shop.contactEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div>{shop.city || 'Campus'}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-xs">{shop.address}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(shop.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(shop._id, 'APPROVED')}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Request</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setShopToDelete(shop)}
                              disabled={actionLoading}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Reject & Delete Shop"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ALL PRINT SHOPS */}
        {activeTab === 'shops' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">All Print Shops</h3>
                <p className="text-[11px] text-slate-400">Click any shop name to inspect its live orders, dashboard, and settings.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Shop Name (Click to Inspect)</th>
                    <th className="px-4 py-3">Slug / Link</th>
                    <th className="px-4 py-3">City / Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shops.map((shop) => (
                    <tr key={shop._id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Shop Name clickable for instant inspection */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleInspectShop(shop)}
                          className="text-left font-bold text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
                        >
                          <span className="underline decoration-slate-700 group-hover:decoration-emerald-400">{shop.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <span className="text-[10px] text-slate-500">{shop.ownerId?.name || 'Owner'}</span>
                      </td>

                      <td className="px-4 py-3 font-mono text-emerald-400">/shop/{shop.slug}</td>

                      <td className="px-4 py-3">
                        <div className="text-slate-200">{shop.city || 'Delhi'}</div>
                        <div className="text-slate-500 text-[10px] font-mono">{shop.contactPhone}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          shop.status === 'APPROVED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : shop.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {shop.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleInspectShop(shop)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Inspect Shop Dashboard & Controls"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(shop._id, shop.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED')}
                            disabled={actionLoading}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              shop.status === 'APPROVED'
                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {shop.status === 'APPROVED' ? 'Suspend' : 'Activate'}
                          </button>

                          {/* Delete Shop Icon */}
                          <button
                            type="button"
                            onClick={() => setShopToDelete(shop)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                            title="Permanently Delete Shop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Actor Role</th>
                    <th className="px-4 py-3">Resource</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">No privileged audit logs recorded yet.</td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id}>
                        <td className="px-4 py-3 text-slate-500 font-mono">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-white">{log.action}</td>
                        <td className="px-4 py-3 text-emerald-400">{log.actorRole}</td>
                        <td className="px-4 py-3 text-slate-300">{log.resource}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Deleting Shop */}
        {shopToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Shop Counter?</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to permanently delete <strong>{shopToDelete.name}</strong>?
                </p>
                <p className="text-[11px] text-rose-400 pt-1">
                  This will remove all associated print orders, queues, printers, and user login records.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShopToDelete(null)}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteShop}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Yes, Delete Shop'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
