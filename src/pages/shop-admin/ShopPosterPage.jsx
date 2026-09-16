import React, { useRef, useState } from 'react';
import { Printer, QrCode, Shield, Zap, Download, Sparkles, Loader2, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ShopPosterPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const posterRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const inspectedSlug = sessionStorage.getItem('inspected_shop_slug');
  const inspectedName = sessionStorage.getItem('inspected_shop_name');

  const shopSlug = inspectedSlug || user?.shopSlug || 'saffron-enterprises';
  const shopName = inspectedName || user?.shopName || 'Saffron Enterprises';

  const kioskUrl = `${window.location.origin}/shop/${shopSlug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(kioskUrl)}&color=0-0-0&bgcolor=255-255-255&margin=10`;

  const handlePrint = () => {
    toast.info('Printing Poster', 'Preparing counter card layout for printing...');
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(kioskUrl);
    toast.success('Kiosk Link Copied', 'Direct customer URL copied to clipboard.', { tag: `/shop/${shopSlug}` });
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 is 210mm x 297mm
      // Card container dimensions
      const cardWidth = 160;
      const cardHeight = 230;
      const startX = (210 - cardWidth) / 2;
      const startY = (297 - cardHeight) / 2;

      // Draw card border
      doc.setDrawColor(15, 23, 42); // slate-900
      doc.setLineWidth(1.2);
      doc.roundedRect(startX, startY, cardWidth, cardHeight, 6, 6);

      // Fast Counter Printing Pill Badge
      doc.setFillColor(209, 250, 229); // emerald-100
      doc.setDrawColor(16, 185, 129); // emerald-500
      doc.roundedRect(startX + 45, startY + 12, 70, 8, 4, 4, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text('FAST COUNTER PRINTING', startX + 80, startY + 17.5, { align: 'center' });

      // Title
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('SCAN TO PRINT', startX + 80, startY + 30, { align: 'center' });

      // Shop Name
      doc.setFontSize(14);
      doc.setTextColor(4, 120, 87); // emerald-700
      doc.text(shopName, startX + 80, startY + 38, { align: 'center' });

      // QR Code Box
      const qrBoxSize = 78;
      const qrBoxX = startX + (cardWidth - qrBoxSize) / 2;
      const qrBoxY = startY + 44;

      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.8);
      doc.roundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 4, 4);

      // Convert QR image to base64 for embedding in PDF
      try {
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        doc.addImage(base64Data, 'PNG', qrBoxX + 4, qrBoxY + 4, qrBoxSize - 8, qrBoxSize - 8);
      } catch (err) {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('QR Code: ' + kioskUrl, startX + 80, qrBoxY + 40, { align: 'center' });
      }

      // URL text
      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(kioskUrl, startX + 80, qrBoxY + qrBoxSize + 7, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Scan with Camera or any UPI / QR App', startX + 80, qrBoxY + qrBoxSize + 12, { align: 'center' });

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(startX + 12, qrBoxY + qrBoxSize + 17, startX + cardWidth - 12, qrBoxY + qrBoxSize + 17);

      // 3 Steps
      const stepY = qrBoxY + qrBoxSize + 24;
      const colW = (cardWidth - 24) / 3;

      // Step 1
      doc.setFillColor(15, 23, 42);
      doc.circle(startX + 16, stepY, 3.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('1', startX + 16, stepY + 2.5, { align: 'center' });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text('Scan QR', startX + 12, stepY + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Opens kiosk", startX + 12, stepY + 14);
      doc.text("directly on phone.", startX + 12, stepY + 18);

      // Step 2
      doc.setFillColor(15, 23, 42);
      doc.circle(startX + 16 + colW, stepY, 3.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('2', startX + 16 + colW, stepY + 2.5, { align: 'center' });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text('Upload File', startX + 12 + colW, stepY + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Choose B&W or", startX + 12 + colW, stepY + 14);
      doc.text("Color & sides.", startX + 12 + colW, stepY + 18);

      // Step 3
      doc.setFillColor(15, 23, 42);
      doc.circle(startX + 16 + colW * 2, stepY, 3.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('3', startX + 16 + colW * 2, stepY + 2.5, { align: 'center' });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text('Pick Up', startX + 12 + colW * 2, stepY + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Show token &", startX + 12 + colW * 2, stepY + 14);
      doc.text("collect prints.", startX + 12 + colW * 2, stepY + 18);

      // Security / Footer Badge
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('No customer app required · Files auto-deleted after printing', startX + 80, startY + cardHeight - 8, { align: 'center' });

      doc.save(`printpulse-counter-qr-${shopSlug}.pdf`);
      toast.success('Counter QR Poster Ready', 'PDF downloaded successfully. Ready to print or laminate.');
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('PDF Generation Failed', err.message || 'Error generating poster PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Print isolation CSS: only #printable-poster-card is printed! */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-poster-card, #printable-poster-card * {
            visibility: visible !important;
          }
          #printable-poster-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 520px !important;
            margin: 0 !important;
            padding: 36px 28px !important;
            box-shadow: none !important;
            border: 3px solid #0f172a !important;
            background: #ffffff !important;
            color: #0f172a !important;
            border-radius: 24px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Screen Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Printable Counter QR Poster</h1>
          <p className="text-xs text-slate-400">
            Print or download only the isolated counter QR card displayed below for your counter stand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold transition-all"
            title="Copy Kiosk URL"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copy Link</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
            <span>{downloadingPdf ? 'Exporting...' : 'Download Card PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Poster</span>
          </button>
        </div>
      </div>

      {/* Isolated Printable Card Container (Exact card requested in user image) */}
      <div className="flex justify-center p-2 sm:p-6">
        <div
          id="printable-poster-card"
          ref={posterRef}
          className="max-w-[480px] w-full bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-10 text-center border-4 border-slate-900 space-y-5 transition-all"
        >
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-emerald-800" />
              <span>FAST COUNTER PRINTING</span>
            </div>
          </div>

          {/* Title & Shop Name */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-950 uppercase">
              SCAN TO PRINT
            </h2>
            <p className="text-base font-bold text-emerald-700">
              {shopName}
            </p>
          </div>

          {/* QR Code Container with Border */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-inner max-w-[260px] mx-auto">
            <img
              src={qrImageUrl}
              alt={`QR Code for ${kioskUrl}`}
              className="w-full h-auto rounded-lg mx-auto block"
            />
          </div>

          {/* URL & Helper */}
          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-slate-800 break-all">{kioskUrl}</p>
            <p className="text-xs text-slate-500">Scan with Camera or any UPI / QR App</p>
          </div>

          {/* 3 Step Instruction */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t-2 border-slate-200 text-left text-xs">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <p className="font-bold text-slate-900">Scan QR</p>
              <p className="text-[11px] text-slate-600 leading-snug">Opens this shop's kiosk directly.</p>
            </div>
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <p className="font-bold text-slate-900">Upload File</p>
              <p className="text-[11px] text-slate-600 leading-snug">Choose B&amp;W or Color &amp; sides.</p>
            </div>
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <p className="font-bold text-slate-900">Pick Up</p>
              <p className="text-[11px] text-slate-600 leading-snug">Show ticket &amp; collect prints.</p>
            </div>
          </div>

          {/* Security / Privacy Badge */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No customer app required · Files auto-deleted after printing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
