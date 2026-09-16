import React, { useState, useEffect } from 'react';
import { 
  Store, Edit3, MapPin, Phone, Mail, Clock, Shield, Check, 
  AlertCircle, Save, X, Navigation, Loader2, Sparkles, Building 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ShopProfilePage() {
  const { toast } = useToast();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isAcceptingOrders: true,
    accessCodeEnabled: false,
    accessCode: '1234',
    autoDeleteMinutes: 60
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getShopProfile();
      if (res.success && res.shop) {
        setShop(res.shop);
        setFormData({
          name: res.shop.name || '',
          tagline: res.shop.tagline || '',
          description: res.shop.description || '',
          contactPhone: res.shop.contactPhone || '',
          contactWhatsapp: res.shop.contactWhatsapp || '',
          contactEmail: res.shop.contactEmail || '',
          address: res.shop.address || '',
          city: res.shop.city || '',
          state: res.shop.state || '',
          pincode: res.shop.pincode || '',
          isAcceptingOrders: res.shop.isAcceptingOrders ?? true,
          accessCodeEnabled: res.shop.accessCodeEnabled ?? false,
          accessCode: res.shop.accessCode || '1234',
          autoDeleteMinutes: res.shop.autoDeleteMinutes || 60
        });
      }
    } catch (err) {
      console.error('Failed to load shop profile:', err);
      setError('Could not load shop profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFetchLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Location Unavailable', 'Geolocation is not supported in this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityFound =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.state_district ||
            '';
          const road = data.address?.road || '';
          const stateFound = data.address?.state || '';
          const postcode = data.address?.postcode || '';

          setFormData((prev) => ({
            ...prev,
            city: cityFound || prev.city,
            state: stateFound || prev.state,
            pincode: postcode || prev.pincode,
            address: road ? `${road}, ${cityFound}` : prev.address
          }));
          toast.info('Location Detected', `Detected: ${cityFound || 'Local Campus'}`);
        } catch (err) {
          toast.info('GPS Pin Located', `Coordinates: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        toast.warning('GPS Error', err.message || 'Could not fetch device coordinates.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const res = await api.updateShopProfile(formData);
      if (res.success && res.shop) {
        setShop(res.shop);
        setMessage('Shop profile updated successfully!');
        setEditing(false);
        toast.success('Shop Profile Saved', 'Updated contact numbers, WhatsApp, and shop location.');
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save shop details');
      toast.error('Save Failed', err.message || 'Could not update shop profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span>Loading shop profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Shop Profile &amp; Information</h1>
          <p className="text-xs text-slate-400">
            Manage your counter name, contact phone, street address, and live kiosk operating settings.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Shop Details</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* VIEW MODE */}
      {!editing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-semibold block">
                  Public Storefront
                </span>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">{shop?.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{shop?.tagline || 'Local Print Counter'}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                shop?.status === 'APPROVED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {shop?.status}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Storefront Description
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {shop?.description || 'No description provided.'}
              </p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Primary Phone</span>
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{shop?.contactPhone || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact Email</span>
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{shop?.contactEmail || 'N/A'}</p>
              </div>
            </div>

            {/* Location & Address */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Physical Counter Address</span>
              </span>
              <p className="text-xs text-slate-900 dark:text-white font-medium">{shop?.address || 'Shop address not specified'}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>City: <strong className="text-slate-700 dark:text-slate-200">{shop?.city}</strong></span>
                <span>•</span>
                <span>State: <strong className="text-slate-200">{shop?.state || 'N/A'}</strong></span>
                <span>•</span>
                <span>Pincode: <strong className="text-slate-200">{shop?.pincode || 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          {/* Settings & Policies */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
              Operating Preferences
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Accepting Orders</p>
                  <p className="text-[10px] text-slate-400">Controls customer kiosk availability</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  shop?.isAcceptingOrders ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {shop?.isAcceptingOrders ? 'OPEN' : 'PAUSED'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <div>
                  <p className="font-semibold text-white">Counter PIN Access</p>
                  <p className="text-[10px] text-slate-400">Requires customers to enter shop PIN</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  shop?.accessCodeEnabled ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {shop?.accessCodeEnabled ? `PIN: ${shop?.accessCode}` : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <div>
                  <p className="font-semibold text-white">Auto-Delete Files</p>
                  <p className="text-[10px] text-slate-400">Purge customer prints after completion</p>
                </div>
                <span className="font-bold text-slate-200">{shop?.autoDeleteMinutes || 60} mins</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT FORM MODE */
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
              Edit Business Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Shop Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Fast & Reliable Local Xerox"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Storefront Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Phone (10 Digits)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.contactWhatsapp}
                  onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Address with Live GPS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold text-xs">Counter Street Address</label>
                <button
                  type="button"
                  onClick={handleFetchLiveLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {locating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>Update via Live GPS</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop No., Street, Near landmark..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 uppercase font-semibold">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 uppercase font-semibold">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 uppercase font-semibold">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Operating Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAcceptingOrders}
                  onChange={(e) => setFormData({ ...formData, isAcceptingOrders: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="font-semibold text-white">Accepting Orders</p>
                  <p className="text-[10px] text-slate-400">Keep kiosk active for public print requests</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accessCodeEnabled}
                  onChange={(e) => setFormData({ ...formData, accessCodeEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="font-semibold text-white">Enable Counter PIN</p>
                  <p className="text-[10px] text-slate-400">Require PIN before customer uploads</p>
                </div>
              </label>
            </div>

            {formData.accessCodeEnabled && (
              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">4-Digit Access PIN</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                  className="w-36 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
