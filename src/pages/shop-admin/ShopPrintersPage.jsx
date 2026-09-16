import React, { useState, useEffect } from 'react';
import { 
  Printer, HardDriveDownload, CheckCircle, RefreshCw, KeyRound, 
  Send, ShieldAlert, Cpu, Sparkles, Plus, Trash2 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ShopPrintersPage() {
  const { toast } = useToast();
  const [printers, setPrinters] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pairingModal, setPairingModal] = useState(false);
  const [pairingCode, setPairingCode] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const loadPrinters = async () => {
    try {
      setLoading(true);
      const res = await api.getPrinters();
      if (res.success) {
        setPrinters(res.printers || []);
        setAgent(res.agent || null);
      }
    } catch (err) {
      console.error('Error fetching printers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrinters();
  }, []);

  const handleCreatePairCode = async () => {
    try {
      const res = await api.createPairingCode();
      if (res.success) {
        setPairingCode(res.pairingCode);
        setPairingModal(true);
        toast.info('Windows Pairing Code Generated', `Code ${res.pairingCode} is valid for 15 minutes.`, { tag: res.pairingCode });
      }
    } catch (err) {
      toast.error('Pairing Code Failed', err.message || 'Error generating pairing code.');
    }
  };

  const handleTestPrint = async (printerId) => {
    try {
      toast.info('Dispatching Test Print', 'Sending diagnostic test job to Windows agent spooler...');
      setTestResult('Sending test print command to Windows Agent...');
      const res = await api.triggerTestPrint(printerId);
      if (res.success) {
        setTestResult(res.message);
        toast.success('Test Print Dispatched', res.message);
        setTimeout(() => setTestResult(null), 4000);
      }
    } catch (err) {
      setTestResult('Failed to dispatch test print: ' + err.message);
      toast.error('Test Print Failed', err.message || 'Windows agent may be offline.');
    }
  };

  const handleDeletePrinter = async (printerId, printerName) => {
    if (!window.confirm(`Are you sure you want to remove print queue "${printerName}"?`)) {
      return;
    }
    try {
      await api.deletePrinter(printerId);
      setPrinters(printers.filter(p => p._id !== printerId));
      toast.warning('Printer Removed', `Queue "${printerName}" unlinked from counter.`, { tag: printerName });
    } catch (err) {
      toast.error('Removal Failed', err.message || 'Could not delete printer queue.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Printers &amp; Windows Agent</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your hardware spoolers, printer capabilities, and Windows agent connections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreatePairCode}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Pair Windows PC</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
          <Printer className="w-4 h-4 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Windows Print Agent Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Physical Counter PC Spooler</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Machine: <strong className="text-slate-700 dark:text-slate-200">{agent?.machineName || 'Windows PC (Agent not paired)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              agent?.status === 'ONLINE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${agent?.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {agent?.status === 'ONLINE' ? 'Spooler Online' : 'Waiting for Pairing'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The Windows Print Agent routes print jobs directly to physical printer trays according to document specifications (Color vs B&amp;W, Single vs Duplex).
        </p>
      </div>

      {/* Registered / Discovered Printers List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
          Configured Printers &amp; Queues ({printers.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading printers...</div>
        ) : printers.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Printer className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Printers Found</h4>
            <p className="text-xs text-slate-400">Pair your Windows Agent to automatically discover installed printers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {printers.map(p => (
              <div 
                key={p._id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.hardwareModel}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-semibold">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Paper: {p.supportedPaperSizes?.join(', ') || 'A4'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${p.isColorCapable ? 'bg-purple-500/10 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                      {p.isColorCapable ? 'Full Color' : 'B&W Laser'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${p.isDuplexCapable ? 'bg-blue-500/10 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                      {p.isDuplexCapable ? 'Auto-Duplex' : 'Single Side'}
                    </span>
                    {p.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                        Default Spooler
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {/* Delete Print Queue */}
                  <button
                    type="button"
                    onClick={() => handleDeletePrinter(p._id, p.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Remove Print Queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestPrint(p._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3 text-emerald-400" />
                    <span>Print Test Page</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pairing Code Modal */}
      {pairingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Windows Agent Pairing Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter this 6-digit code in the PrintFlow Agent running on your shopkeeper PC:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-3xl font-black font-mono tracking-widest text-emerald-400">
              {pairingCode}
            </div>

            <p className="text-[11px] text-slate-500">
              Code expires in 15 minutes. Once paired, your Windows printers will sync automatically.
            </p>

            <button
              type="button"
              onClick={() => setPairingModal(false)}
              className="w-full py-3 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
