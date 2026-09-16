export const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_KEY || 'http://localhost:5000/api').replace(/\/$/, '');
const PRIMARY_API_BASE = API_BASE;

function getAuthHeaders(url = '') {
  // Never send stale auth or inspection headers on public authentication endpoints
  if (url.startsWith('/auth/login') || url.startsWith('/auth/register')) {
    return {};
  }
  const token = localStorage.getItem('printpulse_token') || localStorage.getItem('token') || localStorage.getItem('printpulse_token');
  const inspectedShopId = sessionStorage.getItem('inspected_shop_id');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(inspectedShopId ? { 'X-Shop-Id': inspectedShopId } : {})
  };
}

async function request(url, options = {}) {
  const headers = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(url),
    ...options.headers
  };

  // Candidates list for fallback (e.g. proxy /api or 127.0.0.1 in case localhost has IPv6 resolution issues)
  const candidateBases = [PRIMARY_API_BASE];
  if (PRIMARY_API_BASE !== '/api' && !candidateBases.includes('/api')) {
    candidateBases.push('/api');
  }
  if (PRIMARY_API_BASE.includes('localhost') && !candidateBases.includes('http://127.0.0.1:5000/api')) {
    candidateBases.push('http://127.0.0.1:5000/api');
  }

  let lastError = null;
  for (const base of candidateBases) {
    try {
      const response = await fetch(`${base}${url}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      lastError = err;
      // If server responded with an application error (e.g. 400, 401, 403, 404), rethrow immediately
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('Load failed')) {
        throw err;
      }
      // Otherwise it's a network/CORS error, try next candidate base
    }
  }

  // If all candidates failed due to network connection
  if (lastError?.message?.includes('Failed to fetch') || lastError?.name === 'TypeError') {
    throw new Error('Cannot connect to printpulse backend server. Please verify backend is running on port 5000.');
  }
  throw lastError || new Error('Network request failed');
}

export const api = {
  // Public
  getShops: () => request('/public/shops'),
  getShop: (slug) => request(`/public/shops/${slug}`),
  submitOrder: (formData) => request('/public/orders', {
    method: 'POST',
    body: formData,
    isFormData: true
  }),
  trackOrder: (token) => request(`/public/orders/${token}`),
  confirmReceived: (token) => request(`/public/orders/${token}/received`, { method: 'POST' }),
  requestDelivery: (token, payload) => request(`/public/orders/${token}/request-delivery`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Payments
  createRazorpayOrder: (publicToken) => request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ publicToken })
  }),
  verifyPayment: (payload) => request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  markCashPaid: (orderId) => request(`/payments/shop/${orderId}/cash-paid`, { method: 'POST' }),

  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getMe: () => request('/auth/me'),

  // Shop Admin
  getDashboardStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/shop-admin/dashboard${query ? `?${query}` : ''}`);
  },
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/shop-admin/orders?${query}`);
  },
  acceptOrder: (id) => request(`/shop-admin/orders/${id}/accept`, { method: 'POST' }),
  rejectOrder: (id, reason) => request(`/shop-admin/orders/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),
  markOrderReady: (id) => request(`/shop-admin/orders/${id}/ready`, { method: 'POST' }),
  markOrderDelivered: (id) => request(`/shop-admin/orders/${id}/deliver`, { method: 'POST' }),
  getTemplate: () => request('/shop-admin/template'),
  updateTemplate: (data) => request('/shop-admin/template', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  getPrinters: () => request('/shop-admin/printers'),
  createPairingCode: () => request('/shop-admin/printers/pair-code', { method: 'POST' }),
  addOrUpdatePrinter: (data) => request('/shop-admin/printers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deletePrinter: (printerId) => request(`/shop-admin/printers/${printerId}`, {
    method: 'DELETE'
  }),
  triggerTestPrint: (printerId) => request(`/shop-admin/printers/${printerId}/test-print`, { method: 'POST' }),
  getPricingRules: () => request('/shop-admin/pricing'),
  updatePricingRules: (data) => request('/shop-admin/pricing', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  getShopProfile: () => request('/shop-admin/profile'),
  updateShopProfile: (data) => request('/shop-admin/profile', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  exportOrdersCsvUrl: `${API_BASE}/shop-admin/reports/export-csv`,
  exportOrdersCsv: async () => {
    const headers = { ...getAuthHeaders() };
    const response = await fetch(`${API_BASE}/shop-admin/reports/export-csv`, { headers });
    if (!response.ok) throw new Error('Failed to export orders CSV');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Platform Admin
  getPlatformStats: () => request('/platform-admin/dashboard'),
  getAllPlatformShops: () => request('/platform-admin/shops'),
  updateShopStatus: (id, status) => request(`/platform-admin/shops/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteShop: (id) => request(`/platform-admin/shops/${id}`, {
    method: 'DELETE'
  }),
  deleteOrder: (id) => request(`/platform-admin/orders/${id}`, {
    method: 'DELETE'
  }),
  getAuditLogs: () => request('/platform-admin/audit-logs')
};
