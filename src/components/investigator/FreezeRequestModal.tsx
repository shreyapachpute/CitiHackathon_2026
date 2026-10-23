import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { X, Lock, ShieldAlert, CheckCircle, FileText, Send, AlertTriangle } from 'lucide-react';

interface FreezeRequestModalProps {
  caseId?: string;
  defaultAccountId?: string;
  defaultAccountName?: string;
  defaultBank?: string;
  defaultAmount?: number;
  onClose: () => void;
}

export const FreezeRequestModal: React.FC<FreezeRequestModalProps> = ({
  caseId = 'CASE-2026-8812',
  defaultAccountId = 'ICIC-00910291',
  defaultAccountName = 'Apex Wealth / CyberLoot Syndicate',
  defaultBank = 'ICICI Bank',
  defaultAmount = 150000,
  onClose
}) => {
  const { submitFreezeRequest } = useApp();

  const [targetAccountId, setTargetAccountId] = useState(defaultAccountId);
  const [targetAccountName, setTargetAccountName] = useState(defaultAccountName);
  const [targetBank, setTargetBank] = useState(defaultBank);
  const [freezeType, setFreezeType] = useState<'TOTAL_DEBIT_FREEZE' | 'PARTIAL_LIEN' | 'ACCOUNT_SUSPENSION'>(
    'TOTAL_DEBIT_FREEZE'
  );
  const [freezeAmount, setFreezeAmount] = useState<number>(defaultAmount);
  const [reason, setReason] = useState(
    'Mule Account in Multi-Victim Investment Cyber-Fraud Syndicate'
  );
  const [justification, setJustification] = useState(
    'Fund-flow analysis confirms immediate ₹1.5L - ₹10L fan-out to 4 mule accounts within 180 seconds. Inflow linked to customer fraud report under Section 91 CrPC / IT Act simulated provisions. Total debit freeze urgently requested to prevent off-ramp to crypto/cashout.'
  );
  const [submittedFreezeId, setSubmittedFreezeId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = submitFreezeRequest({
      caseId,
      targetAccountId: targetAccountId.trim(),
      targetAccountName: targetAccountName.trim(),
      targetBank: targetBank.trim(),
      freezeType,
      freezeAmount: freezeAmount,
      reason: reason.trim(),
      justification: justification.trim(),
      requestedBy: 'Inspector Vikram Rao (Lead Cyber Fraud Investigator, Cyber Crime Cell)'
    });
    setSubmittedFreezeId(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-2xl max-w-lg w-full border border-blue-700/50 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-red-900 to-rose-950 px-6 py-4 border-b border-rose-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Submit Account Freeze Request</h3>
              <p className="text-xs text-rose-300/80">
                Official Nodal Bank Authorization Workflow (Simulated)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submittedFreezeId ? (
          /* Submission success state */
          <div className="p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-rose-900/40 border border-rose-500/50 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-rose-400 bg-rose-950 px-2.5 py-1 rounded-full border border-rose-800 font-mono">
                {submittedFreezeId}
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                Simulated Freeze Request Submitted
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Request is logged in the Bank Authorization Queue with status <strong>Pending Bank Review</strong>. You can simulate nodal officer approval in the Freeze-Request Manager tab.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Account:</span>
                <span className="font-mono text-white font-semibold">{targetAccountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Freeze Type:</span>
                <span className="font-semibold text-rose-300">{freezeType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold">PENDING BANK AUTHORIZATION</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-600 transition-colors"
            >
              Close & Return
            </button>
          </div>
        ) : (
          /* Freeze form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Target Account Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Account ID</label>
                <input
                  type="text"
                  value={targetAccountId}
                  onChange={e => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Bank Name</label>
                <input
                  type="text"
                  value={targetBank}
                  onChange={e => setTargetBank(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Holder / Entity</label>
              <input
                type="text"
                value={targetAccountName}
                onChange={e => setTargetAccountName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Freeze Type Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Freeze Type</label>
              <select
                value={freezeType}
                onChange={e => setFreezeType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="TOTAL_DEBIT_FREEZE">TOTAL DEBIT FREEZE (Full Outbound Stop)</option>
                <option value="PARTIAL_LIEN">PARTIAL LIEN / DISPUTED AMOUNT HOLD</option>
                <option value="ACCOUNT_SUSPENSION">COMPLETE ACCOUNT SUSPENSION</option>
              </select>
            </div>

            {/* Legal Justification */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Investigator Finding & Justification
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={e => setJustification(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Disclaimer pill */}
            <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-amber-300/90 flex items-start space-x-2 text-[11px]">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Simulated Prototype Notice:</strong> Submitting records a formal freeze request requiring designated nodal bank reviewer sign-off. It does not freeze live commercial accounts or recover actual money.
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/30 transition-all flex items-center space-x-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Freeze Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
