import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  Printer, CheckCircle2, Clock, AlertCircle, PackageCheck,
  CreditCard, Banknote, ShieldCheck, ArrowLeft, Download, RefreshCw,
  Truck, MapPin, MessageCircle, Send, Check
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import { useLanguage, LanguageToggle } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from '../context/ThemeContext';

export default function OrderTrackingPage() {
  const { token } = useParams();
  const location = useLocation();
  const { lang, t, isHindi } = useLanguage();
  const { toast } = useToast();
  const [order, setOrder] = useState(() => {
    try {
      const cached = localStorage.getItem(`printpulse_order_${token}`);
      return cached ? JSON.parse(cached) : null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);
  const [payingOnline, setPayingOnline] = useState(false);

  // Delivery Modal State
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [deliveryAddressInput, setDeliveryAddressInput] = useState('');
  const [deliveryNotesInput, setDeliveryNotesInput] = useState('');
  const [deliveryPhoneInput, setDeliveryPhoneInput] = useState('');
  const [requestingDelivery, setRequestingDelivery] = useState(false);

  // Track previous status to notify customer of live status updates
  const prevStatusRef = useRef(order?.orderStatus);

  // Notify on mount if redirected from WhatsApp sending
  useEffect(() => {
    if (location.state?.whatsappSent) {
      toast.info(t.waToastTitle, t.waToastSub, { tag: `#${token}` });
    }
  }, [location.state, token, t]);

  // Fetch Order
  const fetchOrder = async () => {
    try {
      const res = await api.trackOrder(token);
      if (res.success && res.order) {
        if (prevStatusRef.current && prevStatusRef.current !== res.order.orderStatus) {
          const newStatus = res.order.orderStatus;
          if (newStatus === 'ACCEPTED') {
            toast.info(isHindi ? 'ऑर्डर स्वीकृत हुआ' : 'Order Accepted!', isHindi ? 'दुकानदार ने आपका प्रिंट अनुरोध स्वीकार कर लिया है।' : 'Shopkeeper has accepted your print job.', { tag: `#${token}` });
          } else if (newStatus === 'PRINTING') {
            toast.info(isHindi ? 'प्रिंटिंग जारी है' : 'Printing in Progress', isHindi ? 'आपके दस्तावेज़ प्रिंटर पर प्रिंट हो रहे हैं।' : 'Your documents are currently being printed.', { tag: `#${token}` });
          } else if (newStatus === 'READY') {
            toast.success(isHindi ? 'प्रिंट काउंटर पर तैयार है!' : 'Prints Ready for Collection!', isHindi ? 'कृपया काउंटर पर आकर अपने प्रिंट प्राप्त करें।' : 'Your print order is ready at the counter.', { tag: `#${token}` });
          } else if (newStatus === 'OUT_FOR_DELIVERY') {
            toast.info(isHindi ? 'डिलीवरी के लिए रवाना' : 'Out for Delivery', isHindi ? 'डिलीवरी पार्टनर प्रिंट लेकर निकल चुका है।' : 'Delivery staff is on the way with your prints.', { tag: `#${token}` });
          } else if (newStatus === 'DELIVERED') {
            toast.success(isHindi ? 'प्रिंट डिलीवर हो गए!' : 'Prints Delivered!', isHindi ? 'आपके प्रिंट आपके पते पर डिलीवर कर दिए गए हैं।' : 'Your prints have arrived at your delivery address.', { tag: `#${token}` });
          } else if (newStatus === 'COMPLETED') {
            toast.success(isHindi ? 'ऑर्डर संपन्न!' : 'Order Completed!', isHindi ? 'प्रिंट सत्यापित और बिल चुकता। धन्यवाद!' : 'Your order is finalized and verified. Thank you!', { tag: `#${token}` });
          } else if (newStatus === 'REJECTED') {
            toast.error(isHindi ? 'ऑर्डर अस्वीकृत' : 'Order Rejected', res.order.rejectionReason || (isHindi ? 'दुकानदार इस समय ऑर्डर पूरा नहीं कर सकता।' : 'Shopkeeper could not fulfill this order.'), { tag: `#${token}` });
          }
        }
        prevStatusRef.current = res.order.orderStatus;
        setOrder(res.order);
        setError(null);
        try {
          localStorage.setItem(`printpulse_order_${token}`, JSON.stringify(res.order));
          const recent = JSON.parse(localStorage.getItem('printpulse_recent_orders') || '[]');
          const updated = [
            {
              token: res.order.publicToken,
              customerName: res.order.customerName,
              shopName: res.order.shop?.name || 'Print Shop',
              totalAmount: res.order.pricingSnapshot?.totalPaise ? (res.order.pricingSnapshot.totalPaise / 100) : 0,
              orderStatus: res.order.orderStatus,
              updatedAt: new Date().toISOString()
            },
            ...recent.filter(r => r.token !== res.order.publicToken)
          ].slice(0, 15);
          localStorage.setItem('printpulse_recent_orders', JSON.stringify(updated));
        } catch (_) { }
      } else {
        const cached = localStorage.getItem(`printpulse_order_${token}`);
        if (cached) {
          try {
            setOrder(JSON.parse(cached));
            setError(null);
          } catch (_) {
            setError(res.message || 'Ticket not found');
          }
        } else {
          setError(res.message || 'Ticket not found');
        }
      }
    } catch (err) {
      const cached = localStorage.getItem(`printpulse_order_${token}`);
      if (cached) {
        try {
          setOrder(JSON.parse(cached));
          setError(null);
        } catch (_) {
          setError(err.message || 'Error tracking ticket');
        }
      } else {
        setError(err.message || 'Error tracking ticket');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Setup EventSource for real-time order status updates
    let es = null;
    try {
      es = new EventSource(`/api/public/realtime/order/${token}`);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.orderStatus) {
            fetchOrder();
          }
        } catch (err) { }
      };
      es.addEventListener('ORDER_STATUS_CHANGED', fetchOrder);
      es.addEventListener('ORDER_ACCEPTED', fetchOrder);
      es.addEventListener('ORDER_READY', fetchOrder);
      es.addEventListener('PAYMENT_SUCCESS', fetchOrder);
      es.addEventListener('ORDER_COMPLETED', fetchOrder);
    } catch (e) { }

    // Polling fallback every 4s
    const interval = setInterval(fetchOrder, 4000);

    return () => {
      if (es) es.close();
      clearInterval(interval);
    };
  }, [token]);

  // Customer verifies prints received
  const handlePrintReceived = async () => {
    try {
      setConfirmingReceipt(true);
      const res = await api.confirmReceived(token);
      if (res.success) {
        toast.success(
          isHindi ? 'प्राप्ति की पुष्टि हुई!' : 'Receipt Confirmed!',
          isHindi ? 'आपने प्रिंट प्राप्ति की पुष्टि कर दी है।' : 'You have confirmed receiving your prints.',
          { tag: `#${token}` }
        );
        await fetchOrder();
      }
    } catch (err) {
      toast.error(
        isHindi ? 'पुष्टि विफल' : 'Verification Error',
        err.message || 'Error verifying receipt'
      );
    } finally {
      setConfirmingReceipt(false);
    }
  };

  // Customer requests delivery on their order
  const handleRequestDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddressInput.trim()) {
      toast.warning(
        isHindi ? 'पता आवश्यक है' : 'Address Required',
        isHindi ? 'कृपया अपना डिलीवरी पता दर्ज करें।' : 'Please enter your delivery address'
      );
      return;
    }
    try {
      setRequestingDelivery(true);
      const res = await api.requestDelivery(token, {
        deliveryAddress: deliveryAddressInput.trim(),
        deliveryNotes: deliveryNotesInput.trim(),
        customerPhone: deliveryPhoneInput.trim()
      });
      if (res.success) {
        setDeliveryModal(false);
        toast.success(
          isHindi ? 'डिलीवरी अनुरोध भेजा गया!' : 'Delivery Requested!',
          isHindi ? 'दुकानदार को आपका डिलीवरी पता भेज दिया गया है।' : 'Your delivery details have been submitted to the shop.',
          { tag: `#${token}` }
        );
        await fetchOrder();
      }
    } catch (err) {
      toast.error(
        isHindi ? 'अनुरोध विफल' : 'Request Failed',
        err.message || 'Failed to request delivery'
      );
    } finally {
      setRequestingDelivery(false);
    }
  };

  // Online Razorpay Payment Trigger
  const handleOnlinePayment = async () => {
    try {
      setPayingOnline(true);
      const rzpRes = await api.createRazorpayOrder(token);
      if (!rzpRes.success) {
        toast.error(
          isHindi ? 'भुगतान शुरू नहीं हो सका' : 'Payment Failed',
          'Could not initiate online payment.'
        );
        return;
      }

      // Simulate payment verification flow
      setTimeout(async () => {
        const verifyRes = await api.verifyPayment({
          publicToken: token,
          razorpayOrderId: rzpRes.razorpayOrderId,
          razorpayPaymentId: 'pay_' + Date.now(),
          razorpaySignature: 'sig_mock_verified'
        });

        if (verifyRes.success) {
          toast.success(
            isHindi ? 'भुगतान सत्यापित!' : 'Payment Verified!',
            isHindi ? 'UPI भुगतान सफलतापूर्वक प्राप्त हुआ।' : 'Online payment completed successfully.',
            { tag: `#${token}` }
          );
          fetchOrder();
        } else {
          toast.error(
            isHindi ? 'भुगतान सत्यापन विफल' : 'Verification Failed',
            verifyRes.message || 'Payment verification failed'
          );
        }
        setPayingOnline(false);
      }, 1500);

    } catch (err) {
      toast.error(
        isHindi ? 'भुगतान त्रुटि' : 'Payment Error',
        err.message || 'Payment initiation failed'
      );
      setPayingOnline(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">Loading Order Status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'Please verify your ticket number.'}</p>
          <Link to="/" className="inline-block px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = order.orderStatus === 'COMPLETED';
  const isReady = order.orderStatus === 'READY';
  const isDelivered = order.orderStatus === 'DELIVERED';
  const isOutForDelivery = order.orderStatus === 'OUT_FOR_DELIVERY';
  const isDeliveryRequested = order.orderStatus === 'DELIVERY_REQUESTED' || order.fulfillmentType === 'DELIVERY';
  const isPaid = order.paymentStatus === 'PAID';
  const isCustomerReceived = order.orderStatus === 'CUSTOMER_RECEIVED';
  const isRejected = order.orderStatus === 'REJECTED';
  const totalINR = ((order.pricingSnapshot?.totalPaise || 0) / 100).toFixed(2);

  const formatTimelineStatus = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return t.statusSubmitted || (isHindi ? 'ऑर्डर सबमिट हुआ (Submitted)' : 'Order Placed (Submitted)');
      case 'ACCEPTED':
        return t.statusAccepted || (isHindi ? 'काउंटर द्वारा स्वीकृत (Accepted)' : 'Accepted by Counter');
      case 'PRINTING':
        return t.statusPrinting || (isHindi ? 'प्रिंट हो रहा है (Printing)' : 'Printing in Progress');
      case 'READY':
        return t.statusReady || (isHindi ? 'काउंटर पर तैयार (Ready)' : 'Ready for Pickup');
      case 'OUT_FOR_DELIVERY':
        return t.statusOutForDelivery || (isHindi ? 'डिलीवरी के लिए रवाना (Out for Delivery)' : 'Out for Delivery');
      case 'DELIVERED':
        return t.statusDelivered || (isHindi ? 'डिलीवर हुआ (Delivered)' : 'Delivered');
      case 'COMPLETED':
        return t.statusCompleted || (isHindi ? 'ऑर्डर संपन्न (Completed)' : 'Order Completed');
      case 'REJECTED':
        return t.statusRejected || (isHindi ? 'ऑर्डर अस्वीकृत (Rejected)' : 'Order Rejected');
      case 'CANCELLED':
        return t.statusCancelled || (isHindi ? 'ऑर्डर रद्द (Cancelled)' : 'Order Cancelled');
      default:
        return status;
    }
  };

  const formatDeliveryStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return isHindi ? 'प्रतीक्षारत (Pending)' : 'PENDING';
      case 'OUT_FOR_DELIVERY':
        return isHindi ? 'डिलीवरी के लिए रवाना' : 'OUT FOR DELIVERY';
      case 'DELIVERED':
        return isHindi ? 'डिलीवर हुआ' : 'DELIVERED';
      default:
        return status || (isHindi ? 'प्रतीक्षारत' : 'PENDING');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-16 selection:bg-emerald-500 selection:text-white">


      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium">
            <ArrowLeft className="w-4 h-4" />
            {t.home}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrder}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={t.refresh}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
              #{order.publicToken}
            </span>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        {/* Ticket Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Printer className="w-7 h-7" />
          </div>

          <div>
            <p className="text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">{t.trackTitle}</p>
            <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white mt-0.5">
              {order.publicToken}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {t.customerLabel}: <span className="text-slate-900 dark:text-white font-semibold">{order.customerName}</span> · {t.counterLabel}:{' '}
              <span className="text-slate-700 dark:text-slate-200">{order.shop?.name || 'Local Print Shop'}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <StatusBadge status={order.orderStatus} size="lg" />
          </div>

          {order.assignedPrinterName && (
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-center gap-2">
              <Printer className="w-4.5 h-4.5 text-blue-400" />
              <span>{t.assigned}: <strong className="text-slate-900 dark:text-white">{order.assignedPrinterName}</strong></span>
            </div>
          )}

          {isRejected && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 text-left">
              <strong>{t.orderRejected}</strong> {order.rejectionReason}
            </div>
          )}
        </div>

        {/* Fulfillment & Delivery Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              {order.fulfillmentType === 'DELIVERY' ? (
                <Truck className="w-4 h-4 text-blue-400" />
              ) : (
                <PackageCheck className="w-4 h-4 text-emerald-400" />
              )}
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {order.fulfillmentType === 'DELIVERY' ? t.homeDelivery : t.counterPickup}
              </h3>
            </div>

            {/* If counter pickup and order not yet completed, allow switching to delivery */}
            {order.fulfillmentType !== 'DELIVERY' && !isCompleted && !isRejected && (
              <button
                type="button"
                onClick={() => setDeliveryModal(true)}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-semibold transition-colors"
              >
                <Truck className="w-3 h-3" />
                <span>{t.requestDeliveryBtn}</span>
              </button>
            )}
          </div>

          {order.fulfillmentType === 'DELIVERY' ? (
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>{t.deliveryTo}:</strong> {order.deliveryAddress || 'Address on file'}</span>
              </p>
              {order.deliveryNotes && (
                <p className="text-slate-400 text-[11px] pl-5">{t.notes}: {order.deliveryNotes}</p>
              )}
              <div className="pt-1 flex items-center gap-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400">{t.deliveryStatus}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.deliveryStatus === 'DELIVERED'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-blue-500/10 text-blue-400'
                  }`}>
                  {formatDeliveryStatus(order.deliveryStatus)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{t.counterPickupAt}:</strong>{' '}
                  {order.shop?.address
                    ? `${order.shop.address}${order.shop.city ? `, ${order.shop.city}` : ''}`
                    : t.collectInPerson}
                </span>
              </p>
              <p className="text-slate-400 text-[11px] pl-5">
                {t.receivedAtCounterNote} ({order.shop?.name || 'Local Print Counter'})
              </p>
            </div>
          )}
        </div>

        {/* Customer Received Prints but Cash Payment Still Pending */}
        {isCustomerReceived && order.paymentStatus === 'UNPAID' && !isCompleted && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{t.printsConfirmedReceived}</span>
            </div>
            <p>
              {isHindi ? (
                <>आपने अपने प्रिंट सत्यापित कर लिए हैं। कृपया डिलीवरी स्टाफ या काउंटर पर <strong>₹{totalINR} नकद</strong> दें या नीचे UPI से ऑनलाइन भरें।</>
              ) : (
                <>You have verified your prints. Please hand <strong>₹{totalINR} cash</strong> to the delivery staff or pay online via UPI below to complete this ticket.</>
              )}
            </p>
          </div>
        )}

        {/* Action Phase 1: Customer Verifies Receipt (Shown when READY, PAID, OUT_FOR_DELIVERY, or DELIVERED until customer confirms) */}
        {!isCompleted && !isRejected && !isCustomerReceived && (isReady || isDelivered || isOutForDelivery || isPaid) && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <PackageCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isDelivered
                    ? t.printsDeliveredMsg
                    : order.fulfillmentType === 'DELIVERY'
                      ? (isPaid ? t.printsDispatchedMsg : t.printsPackagedMsg)
                      : t.printsReadyCounterMsg}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {order.paymentStatus === 'PAID'
                    ? t.paymentVerifiedNote
                    : t.inspectAndCollectNote}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrintReceived}
                disabled={confirmingReceipt}
                className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {confirmingReceipt ? (
                  <span>{t.confirmingReceipt}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.confirmReceivedBtn}</span>
                  </>
                )}
              </button>

              {/* If paid via UPI and user wants to trigger delivery completion */}
              {isPaid && order.fulfillmentType === 'DELIVERY' && (
                <button
                  type="button"
                  onClick={handlePrintReceived}
                  disabled={confirmingReceipt}
                  className="py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t.requestDeliveryBtn}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Phase 2: Payment (If unpaid) */}
        {order.paymentStatus === 'UNPAID' && !isCompleted && !isRejected && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{t.completePayment}</h3>
                <p className="text-xs text-slate-400">{t.totalAmountDue}</p>
              </div>
              <span className="text-2xl font-black font-display text-blue-400">₹{totalINR}</span>
            </div>

            <div className="grid grid-cols-2  gap-3 pt-1">
              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={payingOnline}
                className="p-4 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 hover:opacity-95 transition-all"
              >
                <CreditCard className="w-5 h-5" />
                <span>{payingOnline ? t.processingUpi : t.payWithUpi}</span>
              </button>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <Banknote className="w-5 h-5 text-blue-400 mx-auto" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.payCash}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {order.fulfillmentType === 'DELIVERY' ? t.payCashDeliverySub : t.payCashPickupSub}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completed Receipt Card */}
        {isCompleted && (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.printCompletedTitle}</h3>
            <p className="text-xs text-slate-300">
              {t.printCompletedSub}
            </p>
          </div>
        )}

        {/* Order Items Specification List */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{t.perFileDetails}</h3>
            <span className="text-xs text-slate-400">{order.files?.length} {isHindi ? 'फ़ाइलें' : 'file(s)'}</span>
          </div>

          <div className="space-y-3">
            {order.files?.map((file, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{file.originalName}</span>
                  <span className="font-mono font-bold text-emerald-400 shrink-0">
                    ₹{((file.pricePaise || 0) / 100).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {file.copies} {file.copies > 1 ? t.copiesCount : t.copyCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {file.pageCount} {t.pagesCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {file.paperSize}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-semibold ${file.colorMode === 'COLOR' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                    {file.colorMode === 'COLOR' ? t.colorText : t.bwText}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {file.sides === 'SINGLE' ? t.singleSidedText : t.duplexText}
                  </span>
                  {file.finishing && file.finishing !== 'NONE' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      {file.finishing}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white">{t.grandTotal}</span>
            <span className="text-base font-extrabold text-emerald-400 font-display">₹{totalINR}</span>
          </div>
        </div>

        {/* Live Timeline Audit */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
            {t.realtimeTimeline}
          </h3>

          <div className="space-y-4 pl-2 relative border-l border-slate-800">
            {order.timeline?.map((step, idx) => (
              <div key={idx} className="relative pl-4 space-y-0.5">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-900"></span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{formatTimelineStatus(step.status)}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {step.note && <p className="text-[11px] text-slate-400">{step.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal: Deliver My Prints */}
      {deliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRequestDeliverySubmit}
            className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">{t.deliveryModalTitle}</h3>
              <p className="text-xs text-slate-400">
                {t.deliveryModalSub}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t.deliveryAddressLabel} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.deliveryAddressPlaceholder}
                  value={deliveryAddressInput}
                  onChange={(e) => setDeliveryAddressInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder={t.phonePlaceholder}
                  value={deliveryPhoneInput}
                  onChange={(e) => setDeliveryPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t.notes}
                </label>
                <input
                  type="text"
                  placeholder={t.deliveryNotesPlaceholder}
                  value={deliveryNotesInput}
                  onChange={(e) => setDeliveryNotesInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeliveryModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={requestingDelivery}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
              >
                {requestingDelivery ? t.processing : isPaid ? `${t.requestDeliveryBtn} (${t.upiPaid})` : t.confirmDeliveryReq}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
