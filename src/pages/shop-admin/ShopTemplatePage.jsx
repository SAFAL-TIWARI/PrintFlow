import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Eye, Save, CheckCircle2, FileText, Lock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ShopTemplatePage() {
  const { toast } = useToast();
  const [template, setTemplate] = useState({
    themeColor: '#059669',
    accentColor: '#f59e0b',
    heroTitle: 'Quick QR Print Counter',
    heroSubtitle: 'Instant Xerox, Thesis & Color Printing — Collect at counter in 3 minutes.',
    instructions: 'Tap below to select your PDFs or images. Choose B&W or Color, single or duplex sides, and get your ticket.',
    privacyNote: 'Privacy First: Documents are held securely only for printing and purged immediately after completion.'
  });
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await api.getTemplate();
        if (res.success) {
          if (res.template) setTemplate(res.template);
          if (res.shop) setShop(res.shop);
        }
      } catch (err) {
        console.error('Error loading template:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateTemplate(template);
      if (res.success) {
        setSaveSuccess(true);
        toast.success(
          'Kiosk Template Published',
          'Theme colors, branding, and counter instructions updated live for customers.'
        );
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      toast.error('Template Publish Failed', err.message || 'Error updating template layout.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading template designer...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Visual Template Customizer</h1>
          <p className="text-xs text-slate-400">
            Customize the look and messaging of your customer-facing mobile print kiosk.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          {saving ? 'Publishing...' : <><Save className="w-4 h-4" /> <span>Save &amp; Publish Live</span></>}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Template configuration successfully published live to all counter visitors.</span>
        </div>
      )}

      {/* Split Screen Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Kiosk Content &amp; Branding</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={template.themeColor || '#059669'}
                  onChange={(e) => setTemplate({ ...template, themeColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={template.themeColor || '#059669'}
                  onChange={(e) => setTemplate({ ...template, themeColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Accent Button Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={template.accentColor || '#f59e0b'}
                  onChange={(e) => setTemplate({ ...template, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={template.accentColor || '#f59e0b'}
                  onChange={(e) => setTemplate({ ...template, accentColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hero Title</label>
            <input
              type="text"
              value={template.heroTitle || ''}
              onChange={(e) => setTemplate({ ...template, heroTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={template.heroSubtitle || ''}
              onChange={(e) => setTemplate({ ...template, heroSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Customer Privacy Note</label>
            <textarea
              rows="3"
              value={template.privacyNote || ''}
              onChange={(e) => setTemplate({ ...template, privacyNote: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Order Instructions</label>
            <textarea
              rows="3"
              value={template.instructions || ''}
              onChange={(e) => setTemplate({ ...template, instructions: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Right: Live Simulated Mobile Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Live Mobile Kiosk Preview
            </span>
            <span className="font-mono text-[11px] text-slate-500">Updates live as you type</span>
          </div>

          <div className="border border-slate-800 rounded-[36px] bg-[#111315] p-4 shadow-2xl max-w-sm mx-auto overflow-hidden text-slate-100">
            {/* Phone Speaker Notch */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-4"></div>

            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3
                  className="text-lg font-black font-display tracking-tight"
                  style={{ color: template.accentColor || '#f59e0b' }}
                >
                  {shop?.name || 'Your Print Counter'}
                </h3>
                <p className="text-[10px] text-slate-400">{template.heroSubtitle}</p>
              </div>

              {/* Privacy Banner */}
              <div
                className="rounded-xl p-2.5 text-[10px] leading-relaxed border"
                style={{
                  backgroundColor: 'rgba(5, 150, 105, 0.1)',
                  borderColor: template.themeColor || '#059669',
                  color: '#a7f3d0'
                }}
              >
                <span className="font-bold">Privacy: </span>
                {template.privacyNote}
              </div>

              {/* Service Tab Preview */}
              <div className="grid grid-cols-3 gap-1 bg-[#1a1c20] p-1 rounded-xl text-[10px] font-bold text-center">
                <span className="py-1.5 rounded-lg bg-blue-400 text-slate-950 font-extrabold">Regular</span>
                <span className="py-1.5 text-slate-400">ID Card</span>
                <span className="py-1.5 text-slate-400">Project</span>
              </div>

              {/* Upload Dropzone Preview */}
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center space-y-1">
                <FileText className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-[11px] font-bold text-white">Tap to select files</p>
                <p className="text-[9px] text-slate-500">PDF, Word, JPG · Max 25 MB</p>
              </div>

              {/* Action Button Preview */}
              <button
                type="button"
                className="w-full py-3 rounded-xl font-black text-xs text-slate-950 shadow-md"
                style={{ backgroundColor: template.accentColor || '#f59e0b' }}
              >
                Upload &amp; Print — ₹24.00
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
