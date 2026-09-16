import React, { createContext, useContext, useState, useEffect } from 'react';
import { Languages } from 'lucide-react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // General & Brand
    loading: 'Loading Print Counter...',
    counterNotAvail: 'Counter Unavailable',
    browseOther: 'Browse other print shops',
    home: 'Home',
    refresh: 'Refresh Status',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    track: 'Track',
    trackArrow: 'Track →',
    active: 'ACTIVE',

    // Toast
    waToastTitle: 'Document details sent on WhatsApp!',
    waToastSub: 'Shopkeeper has been notified with your print specifications.',

    // Kiosk Page
    taglineDefault: 'Upload your documents — set options for each file',
    counter: 'Counter',
    recent: 'Recent',
    recentTitle: 'Recent Print Tickets',
    recentSub: 'Locally saved orders from this device',
    noRecent: 'No recent orders found on this device.',
    noRecentSub: 'Orders you submit will appear here automatically.',
    privacyTitle: 'Privacy: ',
    privacyText: 'Uploads are encrypted and deleted automatically after printing.',
    standardPricing: 'Standard Pricing Rates',
    verifiedRates: 'Verified Counter Rates',
    size: 'Size',
    bw1s: 'B&W 1S',
    bw2s: 'B&W 2S',
    color1s: 'Color 1S',
    color2s: 'Color 2S',
    regular: 'Regular Print',
    idCard: 'ID Card',
    project: 'Project / Binding',
    step1Title: 'Your Name',
    nameReq: 'Enter your full name (required)',
    phoneLabel: 'Mobile Number (Optional, for WhatsApp order updates)',
    phonePlaceholder: 'e.g. 1234567890',
    step2Title: 'Delivery Preference',
    counterPickup: 'Counter Pickup',
    collectAtShop: 'Collect at shop',
    homeDelivery: 'Home / Campus Delivery',
    deliveredToYou: 'Delivered to you',
    deliveryAddressLabel: 'Delivery Address / Room Number',
    deliveryAddressPlaceholder: 'e.g. Hostel Block B, Room 304, North Campus',
    deliveryNotesPlaceholder: 'Special notes (e.g. Call before delivery)',
    step3Title: 'Select Files (Max 10 MB per file)',
    upTo10Mb: 'Up to 10 MB each',
    tapToSelect: 'Tap to select documents',
    supportedTypes: 'PDF, Word, JPG, PNG · Max 10 MB per file',
    heldSecurely: 'Files held securely only until printed',
    mbLimit: 'MB / 10 MB limit',
    copies: 'Copies',
    colorMode: 'Color Mode',
    bwOption: 'Black & White',
    colorOption: 'Full Color',
    sides: 'Sides',
    singleSide: 'Single Side',
    doubleSide: 'Back-to-Back (2-Sided)',
    paper: 'Paper',
    paperA4: 'A4 Standard',
    paperA3: 'A3 Poster',
    paperA5: 'A5 Booklet',
    pagesInDoc: 'Pages in doc',
    finishing: 'Finishing',
    none: 'None',
    spiral: 'Spiral (+₹35)',
    hardBound: 'Hard Bound (+₹150)',
    laminate: 'Laminate (+₹15/pg)',
    step4Title: 'Payment Mode',
    cashOption: 'Cash at Shop / Upon Delivery',
    onlineOption: 'Online UPI',
    cashHelpDelivery: 'Pay cash upon delivery or pay online via UPI.',
    cashHelpPickup: 'Pay after your print is ready and verified at the counter.',
    estimatedTotal: 'Estimated Total',
    uploadAndPrint: 'Upload & Print',
    uploadingWait: 'Submitting & Sending WhatsApp to Shop...',
    enterPin: 'Enter Counter PIN',
    pinPrompt: 'This counter requires the 4-digit code shown on the shop screen.',
    confirmPin: 'Confirm PIN',

    // Order Tracking Page
    trackTitle: 'Print Ticket',
    customerLabel: 'Customer',
    counterLabel: 'Counter',
    assigned: 'Assigned',
    assignedPrinter: 'Assigned Printer',
    orderCancelled: 'Order Cancelled / Rejected',
    orderRejected: 'Order Rejected:',
    deliveryStatus: 'Delivery Status:',
    collectInPerson: 'Collect in-person at counter',
    printsConfirmedReceived: 'Prints Confirmed Received!',
    printsConfirmedReceivedNote: 'You have verified your prints. Please settle payment with delivery staff or counter via UPI/cash.',
    printsDeliveredMsg: 'Your prints have been delivered / handed over!',
    printsDispatchedMsg: 'Payment received! Prints dispatched for delivery.',
    printsPackagedMsg: 'Prints ready & packaged for delivery!',
    printsReadyCounterMsg: 'Your prints are ready at the counter!',
    inspectAndCollectNote: 'Please collect/inspect your prints. Hand cash on receipt or pay via UPI.',
    paymentVerifiedNote: 'Payment verified. Check your prints and confirm receipt to finish.',
    confirmingReceipt: 'Confirming Receipt...',
    completePayment: 'Complete Payment',
    totalAmountDue: 'Total amount due for this print',
    processingUpi: 'Processing UPI...',
    payCash: 'Pay Cash',
    payCashDeliverySub: 'Pay cash on delivery',
    payCashPickupSub: 'Hand cash to shopkeeper',
    printCompletedTitle: 'Print Fulfilled & Completed!',
    printCompletedSub: 'Receipt verified and payment settled. Thank you for using PrintPulse!',
    grandTotal: 'Grand Total',
    realtimeTimeline: 'Realtime Print Timeline',
    processing: 'Processing...',
    upiPaid: 'UPI Paid',
    perFileDetails: 'Files & Specifications',
    copiesCount: 'copies',
    copyCount: 'copy',
    pagesCount: 'pages',
    singleSidedText: 'Single Sided',
    duplexText: '2-Sided Duplex',
    colorText: 'Color',
    bwText: 'B&W',
    paymentStatus: 'Payment Status',
    unpaid: 'Payment Pending (Unpaid)',
    paid: 'Payment Verified & Paid',
    fulfillmentType: 'Fulfillment Method',
    deliveryTo: 'Delivery to',
    counterPickupAt: 'Counter Pickup at Shop',
    receivedAtCounterNote: 'Prints received / collected at shop counter',
    notes: 'Notes',
    payWithUpi: 'Pay with UPI',
    confirmReceivedBtn: 'I Have Received My Prints',
    requestDeliveryBtn: 'Deliver My Prints',
    deliveryModalTitle: 'Request Delivery for Your Prints',
    deliveryModalSub: 'Enter your hostel room or delivery address. Delivery staff will deliver to you.',
    confirmDeliveryReq: 'Confirm & Send Delivery Request',
    cashPendingNote: 'Prints collected. Please settle cash with delivery staff or counter.',
    thankYou: 'Thank you for using PrintPulse! Your prints are ready.',
    statusSubmitted: 'Order Placed (Submitted)',
    statusAccepted: 'Accepted by Counter',
    statusPrinting: 'Printing in Progress',
    statusReady: 'Ready for Pickup',
    statusOutForDelivery: 'Out for Delivery',
    statusDelivered: 'Delivered',
    statusCompleted: 'Order Completed',
    statusRejected: 'Order Rejected',
    statusCancelled: 'Order Cancelled'
  },
  hi: {
    // General & Brand
    loading: 'प्रिंट काउंटर लोड हो रहा है...',
    counterNotAvail: 'काउंटर उपलब्ध नहीं है',
    browseOther: 'अन्य प्रिंट दुकानें देखें',
    home: 'होम',
    refresh: 'स्थिति ताज़ा करें',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    yes: 'हाँ',
    no: 'नहीं',
    track: 'ट्रैक करें',
    trackArrow: 'ट्रैक करें →',
    active: 'सक्रिय',

    // Toast
    waToastTitle: 'व्हाट्सएप पर दस्तावेज़ विवरण भेजा गया!',
    waToastSub: 'दुकानदार को आपके प्रिंट विनिर्देश भेज दिए गए हैं।',

    // Kiosk Page
    taglineDefault: 'दस्तावेज़ अपलोड करें — प्रत्येक फ़ाइल के विकल्प चुनें',
    counter: 'काउंटर',
    recent: 'हालिया',
    recentTitle: 'हालिया प्रिंट टिकट',
    recentSub: 'इस डिवाइस पर स्थानीय रूप से सुरक्षित ऑर्डर',
    noRecent: 'इस डिवाइस पर कोई हालिया ऑर्डर नहीं मिला।',
    noRecentSub: 'आपके द्वारा दिए गए ऑर्डर यहाँ अपने आप दिखाई देंगे।',
    privacyTitle: 'गोपनीयता: ',
    privacyText: 'अपलोड की गई फ़ाइलें एन्क्रिप्ट की जाती हैं और प्रिंटिंग के बाद अपने-आप डिलीट हो जाती हैं।',
    standardPricing: 'मानक प्रिंटिंग दरें',
    verifiedRates: 'सत्यापित काउंटर दरें',
    size: 'साइज़',
    bw1s: 'ब्लैक 1-साइड',
    bw2s: 'ब्लैक 2-साइड',
    color1s: 'रंगीन 1-साइड',
    color2s: 'रंगीन 2-साइड',
    regular: 'साधारण प्रिंट',
    idCard: 'पहचान पत्र (ID Card)',
    project: 'प्रोजेक्ट / बाइंडिंग',
    step1Title: 'आपका नाम',
    nameReq: 'अपना पूरा नाम दर्ज करें (अनिवार्य)',
    phoneLabel: 'मोबाइल नंबर (व्हाट्सएप अपडेट के लिए)',
    phonePlaceholder: 'उदा. 9812345678',
    step2Title: 'डिलीवरी प्राथमिकता',
    counterPickup: 'काउंटर पिकअप',
    collectAtShop: 'दुकान से प्राप्त करें',
    homeDelivery: 'होम / कैंपस डिलीवरी',
    deliveredToYou: 'आपके पते पर डिलीवर',
    deliveryAddressLabel: 'डिलीवरी पता / कमरा नंबर',
    deliveryAddressPlaceholder: 'उदा. हॉस्टल ब्लॉक बी, कमरा 304, नॉर्थ कैंपस',
    deliveryNotesPlaceholder: 'विशेष निर्देश (उदा. पहुंचने पर कॉल करें)',
    step3Title: 'फ़ाइलें चुनें (अधिकतम 10 MB प्रति फ़ाइल)',
    upTo10Mb: 'अधिकतम 10 MB प्रत्येक',
    tapToSelect: 'दस्तावेज़ चुनने के लिए यहाँ टैप करें',
    supportedTypes: 'PDF, Word, JPG, PNG · अधिकतम 10 MB प्रति फ़ाइल',
    heldSecurely: 'फ़ाइलें प्रिंट होने तक ही सुरक्षित रखी जाती हैं',
    mbLimit: 'MB / 10 MB सीमा',
    copies: 'प्रतियाँ (Copies)',
    colorMode: 'कलर मोड',
    bwOption: 'ब्लैक एंड व्हाइट (B&W)',
    colorOption: 'फुल कलर (रंगीन)',
    sides: 'साइड्स (Sides)',
    singleSide: 'एक तरफा (Single Side)',
    doubleSide: 'आगे-पीछे (दो तरफा)',
    paper: 'कागज़ का साइज़',
    paperA4: 'A4 मानक',
    paperA3: 'A3 पोस्टर',
    paperA5: 'A5 बुकलेट',
    pagesInDoc: 'दस्तावेज़ में कुल पेज',
    finishing: 'बाइंडिंग / फिनिशिंग',
    none: 'कोई नहीं',
    spiral: 'स्पाइरल बाइंडिंग (+₹35)',
    hardBound: 'हार्ड बाइंडिंग (+₹150)',
    laminate: 'लैमिनेशन (+₹15/पेज)',
    step4Title: 'भुगतान का माध्यम',
    cashOption: 'दुकान पर / डिलीवरी पर नकद (Cash)',
    onlineOption: 'ऑनलाइन UPI / रेज़रपे',
    cashHelpDelivery: 'डिलीवरी के समय नकद भुगतान करें या ऑनलाइन UPI से भरें।',
    cashHelpPickup: 'प्रिंट तैयार होने पर काउंटर पर नकद या UPI दें।',
    estimatedTotal: 'अनुमानित कुल बिल',
    uploadAndPrint: 'अपलोड करें और प्रिंट भेजें',
    uploadingWait: 'दुकानदार को व्हाट्सएप पर भेजा जा रहा है...',
    enterPin: 'काउंटर पिन दर्ज करें',
    pinPrompt: 'इस काउंटर के लिए दुकान की स्क्रीन पर दिख रहा 4-अंकीय कोड आवश्यक है।',
    confirmPin: 'पिन सत्यापित करें',

    // Order Tracking Page
    trackTitle: 'प्रिंट टोकन टिकट',
    customerLabel: 'ग्राहक का नाम',
    counterLabel: 'प्रिंट काउंटर',
    assigned: 'आवंटित',
    assignedPrinter: 'आवंटित प्रिंटर',
    orderCancelled: 'ऑर्डर अस्वीकृत या रद्द',
    orderRejected: 'ऑर्डर अस्वीकृत:',
    deliveryStatus: 'डिलीवरी स्थिति:',
    collectInPerson: 'काउंटर पर स्वयं आकर प्राप्त करें',
    printsConfirmedReceived: 'प्रिंट प्राप्ति की पुष्टि हो गई!',
    printsConfirmedReceivedNote: 'आपने अपने प्रिंट सत्यापित कर लिए हैं। कृपया डिलीवरी स्टाफ या काउंटर पर नकद/UPI से भुगतान करें।',
    printsDeliveredMsg: 'आपके प्रिंट डिलीवर / सुपुर्द कर दिए गए हैं!',
    printsDispatchedMsg: 'भुगतान प्राप्त हुआ! प्रिंट डिलीवरी के लिए रवाना किए गए।',
    printsPackagedMsg: 'प्रिंट तैयार हैं और डिलीवरी के लिए पैक किए गए हैं!',
    printsReadyCounterMsg: 'आपके प्रिंट काउंटर पर तैयार हैं!',
    inspectAndCollectNote: 'कृपया काउंटर से प्रिंट प्राप्त/जांच करें। रसीद पर नकद दें या UPI से भुगतान करें।',
    paymentVerifiedNote: 'भुगतान सत्यापित हो गया। अपने प्रिंट जांचें और पूरा करने के लिए पुष्टि करें।',
    confirmingReceipt: 'प्राप्ति की पुष्टि की जा रही है...',
    completePayment: 'भुगतान पूरा करें',
    totalAmountDue: 'इस प्रिंट का कुल देय शुल्क',
    processingUpi: 'UPI भुगतान प्रोसेस हो रहा है...',
    payCash: 'नकद (Cash) दें',
    payCashDeliverySub: 'डिलीवरी पर नकद भुगतान करें',
    payCashPickupSub: 'दुकानदार को नकद दें',
    printCompletedTitle: 'प्रिंट संपन्न एवं पूरा हुआ!',
    printCompletedSub: 'रसीद सत्यापित और भुगतान चुकता हो गया। PrintPulse का उपयोग करने के लिए धन्यवाद!',
    grandTotal: 'कुल योग (Grand Total)',
    realtimeTimeline: 'रियलटाइम प्रिंट समयरेखा',
    processing: 'प्रोसेसिंग...',
    upiPaid: 'UPI चुकता',
    perFileDetails: 'दस्तावेज़ एवं विनिर्देश',
    copiesCount: 'प्रतियाँ',
    copyCount: 'प्रति',
    pagesCount: 'पेज',
    singleSidedText: 'एक तरफा',
    duplexText: 'दो तरफा (आगे-पीछे)',
    colorText: 'रंगीन',
    bwText: 'ब्लैक एंड व्हाइट',
    paymentStatus: 'भुगतान की स्थिति',
    unpaid: 'भुगतान बाकी (लंबित)',
    paid: 'भुगतान संपन्न (PAID)',
    fulfillmentType: 'प्राप्ति का तरीका',
    deliveryTo: 'डिलीवरी का पता',
    counterPickupAt: 'दुकान काउंटर पिकअप',
    receivedAtCounterNote: 'प्रिंट दुकान काउंटर पर प्राप्त / एकत्रित किए गए',
    notes: 'विशेष निर्देश',
    payWithUpi: 'UPI से ऑनलाइन भुगतान करें',
    confirmReceivedBtn: 'मुझे मेरे प्रिंट मिल गए हैं',
    requestDeliveryBtn: 'मेरे प्रिंट डिलीवर करें',
    deliveryModalTitle: 'अपने प्रिंट की डिलीवरी का अनुरोध करें',
    deliveryModalSub: 'अपना हॉस्टल कमरा नंबर या डिलीवरी पता दर्ज करें। डिलीवरी स्टाफ आप तक पहुंचाएगा।',
    confirmDeliveryReq: 'पुष्टि करें और डिलीवरी अनुरोध भेजें',
    cashPendingNote: 'प्रिंट प्राप्त हुए। कृपया डिलीवरी स्टाफ या काउंटर पर नकद भुगतान करें।',
    thankYou: 'PrintPulse का उपयोग करने के लिए धन्यवाद! आपके प्रिंट तैयार हैं।',
    statusSubmitted: 'ऑर्डर सबमिट हुआ (Submitted)',
    statusAccepted: 'काउंटर द्वारा स्वीकृत (Accepted)',
    statusPrinting: 'प्रिंट हो रहा है (Printing)',
    statusReady: 'काउंटर पर तैयार (Ready)',
    statusOutForDelivery: 'डिलीवरी के लिए रवाना (Out for Delivery)',
    statusDelivered: 'डिलीवर हुआ (Delivered)',
    statusCompleted: 'ऑर्डर संपन्न (Completed)',
    statusRejected: 'ऑर्डर अस्वीकृत (Rejected)',
    statusCancelled: 'ऑर्डर रद्द (Cancelled)'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('printpulse_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('printpulse_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'en',
      setLang: () => { },
      toggleLanguage: () => { },
      t: translations.en,
      isHindi: false
    };
  }
  return ctx;
}

export function LanguageToggle({ className = '' }) {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all shadow-sm active:scale-95 cursor-pointer font-bold text-xs ${lang === 'hi'
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
          : 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
        } ${className}`}
      title={lang === 'en' ? 'Switch to Hindi (हिन्दी में बदलें)' : 'Switch to English (अंग्रेज़ी में बदलें)'}
      aria-label="Toggle Language"
    >
      <Languages className="w-3.5 h-3.5" />
      <span className="font-mono font-black">{lang === 'en' ? 'EN' : 'HI'}</span>
    </button>
  );
}
