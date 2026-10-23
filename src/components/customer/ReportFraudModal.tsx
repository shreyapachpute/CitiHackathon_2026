import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { AlertOctagon, X, ShieldAlert, CheckCircle, FileText, Send } from 'lucide-react';

interface ReportFraudModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const ReportFraudModal: React.FC<ReportFraudModalProps> = ({ transaction, onClose }) => {
  const { submitFraudReport } = useApp();

  const [fraudCategory, setFraudCategory] = useState('High-Yield Investment / Telegram Scam');
  const [description, setDescription] = useState(
    'Victim was lured via Telegram/WhatsApp into a fake forex and crypto investment portal promising 40% guaranteed returns. After transferring funds, the administrator blocked communication and demanded additional taxes.'
  );
  const [supportingNotes, setSupportingNotes] = useState(
    'Attached Telegram handle @apex_wealth_support and transaction UTR copy. Recipient account was claimed to be an institutional liquidity partner.'
  );
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a description of the fraud incident.');
      return;
    }

    const caseId = submitFraudReport({
      transactionId: transaction.id,
      fraudCategory,
      description: description.trim(),
      supportingNotes: supportingNotes.trim()
    });

    setSubmittedCaseId(caseId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-700 to-rose-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <AlertOctagon className="h-5 w-5 text-rose-200" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Report Fraudulent Transaction</h3>
              <p className="text-xs text-rose-200">
                Official Incident Reporting to Bank Fraud Prevention Cell
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submittedCaseId ? (
          /* Submission Success State */
          <div className="p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-lg shadow-rose-500/20">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Fraud Incident Registered
              </span>
              <h4 className="text-2xl font-bold text-slate-800 mt-2 font-mono">
                {submittedCaseId}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your fraud report has been successfully dispatched to the Bank Fraud Investigator Queue. The investigator will review the fund trail and initiate simulated account-freeze workflows.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-slate-800 font-semibold">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reported Amount:</span>
                <span className="font-semibold text-rose-600">{formatINR(transaction.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Account:</span>
                <span className="font-mono text-slate-800">{transaction.recipientAccountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-800">{fraudCategory}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Prefilled Transaction Context Summary */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Transaction Ref:</span>
                <span className="font-mono font-semibold text-slate-700">{transaction.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Transferred Amount:</span>
                <span className="font-bold text-rose-600 text-sm">{formatINR(transaction.amount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Date & Time:</span>
                <span className="text-slate-700">{formatDateTime(transaction.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Recipient Account ID:</span>
                <span className="font-mono text-slate-700">{transaction.recipientAccountId} ({transaction.recipientName})</span>
              </div>
            </div>

            {/* Fraud Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fraud Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={fraudCategory}
                onChange={e => setFraudCategory(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="High-Yield Investment / Telegram Scam">High-Yield Investment / Telegram Scam</option>
                <option value="UPI Impersonation / Fake QR Phishing">UPI Impersonation / Fake QR Phishing</option>
                <option value="Digital Arrest / Law Enforcement Impersonation">Digital Arrest / Law Enforcement Impersonation</option>
                <option value="Fake Job Offer / Task-Based Remittance Scam">Fake Job Offer / Task-Based Remittance Scam</option>
                <option value="Unauthorized Debit / Account Takeover">Unauthorized Debit / Account Takeover</option>
                <option value="Mule Routing / Smurfing Diversion">Mule Routing / Smurfing Diversion</option>
              </select>
            </div>

            {/* Incident Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description of Incident <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain what happened, how the scam was pitched, and communication channels used..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Supporting Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Notes / Evidence
              </label>
              <textarea
                rows={2}
                value={supportingNotes}
                onChange={e => setSupportingNotes(e.target.value)}
                placeholder="List reference links, phone numbers, Telegram IDs, screenshots, or any accomplice details..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 italic">
              Prototype Disclaimer: This report will appear in the Bank Investigator Portal queue to simulate multi-hop fund tracing and account freezing workflows.
            </p>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Fraud Report</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
