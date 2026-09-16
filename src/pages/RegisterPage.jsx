import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, 
  Eye, EyeOff, CheckCircle2, Navigation, Loader2, Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    city: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);

  const handlePhoneChange = (e) => {
    // Only accept numeric digits up to 10 characters
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: val });
  };

  const handleFetchLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('GPS Unsupported', 'Geolocation is not supported by your browser.');
      return;
    }

    setFetchingLocation(true);
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
            'Local Campus';
          const road = data.address?.road || '';
          const state = data.address?.state || '';

          setFormData((prev) => ({
            ...prev,
            city: cityFound,
            address: road ? `${road}, ${cityFound}, ${state}` : `${cityFound}, ${state}`
          }));
          toast.info('GPS Location Applied', `Auto-detected location: ${cityFound}`);
        } catch (err) {
          // Fallback to coordinates
          setFormData((prev) => ({
            ...prev,
            city: `GPS Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`
          }));
          toast.info('GPS Coordinates Stored', `(${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        setFetchingLocation(false);
        toast.warning('Location Error', `Could not fetch location: ${err.message}. Please enter manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      toast.warning('Invalid Phone Number', 'Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await register(formData);
      if (res?.requiresApproval) {
        setSubmittedForApproval(true);
        toast.success('Registration Submitted!', 'Your shop request has been sent for admin review.');
      } else {
        toast.success('Account Created', 'Welcome to PrintFlow!');
        navigate('/shop-admin');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error('Registration Failed', err.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
          {submittedForApproval ? (
            /* Approval Pending Confirmation Screen */
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-white">Registration Submitted</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Pending Admin Approval
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  Thank you for registering <strong>{formData.shopName}</strong>! Your account request has been sent to the Platform Admin panel.
                </p>
                <p className="text-xs text-slate-400">
                  Once your shop counter request is reviewed and approved by the admin, you will be able to sign in to your dashboard and activate your kiosks.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  to="/login"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Go to Login Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
                  <Store className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold font-display text-white">Create Shop Counter</h1>
                <p className="text-xs text-slate-400">
                  Register your print counter. Account will be activated upon admin approval.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {/* Print Shop Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Print Shop Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Xerox & Digital Prints"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Owner Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* City / Location with Live GPS Button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">
                      City / Campus Location <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleFetchLiveLocation}
                      disabled={fetchingLocation}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      title="Fetch live location via GPS"
                    >
                      {fetchingLocation ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3" />
                          <span>Fetch Live Location</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. University North Campus, Delhi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 10 Digit Mobile Number */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact Mobile (10 Digits) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="1234567890"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono tracking-wider transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {formData.phone.length}/10 digits entered
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="owner@printshop.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Choose a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting Request...' : 'Register Counter for Approval'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                Already registered?{' '}
                <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
                  Log in here
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
