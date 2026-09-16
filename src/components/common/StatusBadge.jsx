import React from 'react';
import { 
  Clock, CheckCircle, AlertCircle, Printer, Check, XCircle, DollarSign, PackageCheck
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function StatusBadge({ status, size = 'md' }) {
  const { lang } = useLanguage();

  const configs = {
    SUBMITTED: { label: lang === 'hi' ? 'नया अनुरोध' : 'New Request', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock },
    ACCEPTED: { label: lang === 'hi' ? 'कतार में' : 'In Queue', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle },
    QUEUED: { label: lang === 'hi' ? 'प्रिंटर कतार में' : 'Queued for Agent', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Clock },
    PRINTING: { label: lang === 'hi' ? 'प्रिंट हो रहा है' : 'Printing Spooler', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse', icon: Printer },
    READY: { label: lang === 'hi' ? 'काउंटर पर तैयार' : 'Ready at Counter', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: PackageCheck },
    DELIVERY_REQUESTED: { label: lang === 'hi' ? 'डिलीवरी अनुरोधित' : 'Delivery Requested', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Clock },
    OUT_FOR_DELIVERY: { label: lang === 'hi' ? 'डिलीवरी के लिए रवाना' : 'Out for Delivery', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock },
    DELIVERED: { label: lang === 'hi' ? 'डिलीवर (पुष्टि बाकी)' : 'Delivered (Awaiting Confirmation)', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', icon: PackageCheck },
    CUSTOMER_RECEIVED: { label: lang === 'hi' ? 'प्रिंट प्राप्त' : 'Print Received', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', icon: Check },
    PAYMENT_PENDING: { label: lang === 'hi' ? 'भुगतान बाकी' : 'Payment Pending', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: DollarSign },
    PAID: { label: lang === 'hi' ? 'भुगतान संपन्न' : 'Payment Paid', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: DollarSign },
    COMPLETED: { label: lang === 'hi' ? 'पूर्ण एवं संपन्न' : 'Fulfilled & Completed', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
    REJECTED: { label: lang === 'hi' ? 'अस्वीकृत' : 'Rejected', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: XCircle },
    FAILED: { label: lang === 'hi' ? 'प्रिंट विफल' : 'Print Failed', bg: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertCircle },
    CANCELLED: { label: lang === 'hi' ? 'रद्द' : 'Cancelled', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: XCircle },
  };

  const config = configs[status] || { label: status, bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: Clock };
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
