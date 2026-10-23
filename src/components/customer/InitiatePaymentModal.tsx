import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RECIPIENT_PRESETS } from '../../data/seedData';
import { RecipientPreset, RiskLevel } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  X,
  ShieldCheck,
  Send,
  Info,
  CheckCircle,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Activity
} from 'lucide-react';

interface InitiatePaymentModalProps {
  onClose: () => void;
  prefillRecipient?: { account: string; name: string; amount?: number; description?: string };
}

export const InitiatePaymentModal: React.FC<InitiatePaymentModalProps> = ({ onClose, prefillRecipient }) => {
  const { customer, createPayment, riskRequests } = useApp();

  const [recipientAccountId, setRecipientAccountId] = useState(prefillRecipient?.account || 'ICIC-00910291');
  const [recipientName, setRecipientName] = useState(prefillRecipient?.name || 'Apex Wealth / CyberLoot Syndicate');
  const [amount, setAmount] = useState(prefillRecipient?.amount ? String(prefillRecipient.amount) : '150000');
  const [description, setDescription] = useState(prefillRecipient?.description || 'High-Yield Investment Plan Deposit');

  const [showHighRiskConfirmation, setShowHighRiskConfirmation] = useState(false);
  const [completedPaymentReceipt, setCompletedPaymentReceipt] = useState<{
    txnId: string;
    utr: string;
    amount: number;
    recipientName: string;
    recipientAccount: string;
    riskScore: number;
    riskLevel: RiskLevel;
  } | null>(null);

  // Real-time recipient risk evaluation from existing intelligence or preset
  const matchingRequest = riskRequests.find(
    r => r.recipientAccountId.trim().toLowerCase() === recipientAccountId.trim().toLowerCase()
  );

  const matchedPreset = RECIPIENT_PRESETS.find(
    p => p.accountNumber.trim().toLowerCase() === recipientAccountId.trim().toLowerCase()
  );

  // Compute live real-time risk score automatically
  const computedRiskScore = matchingRequest?.riskScore ?? (matchedPreset ? matchedPreset.simulatedRiskScore : recipientAccountId.includes('ICIC') || recipientAccountId.includes('HDFC') ? 92 : 12);
  const computedRiskLevel: RiskLevel = matchingRequest?.riskLevel ?? (matchedPreset ? matchedPreset.simulatedRiskLevel : computedRiskScore >= 80 ? 'Critical' : computedRiskScore >= 50 ? 'High' : computedRiskScore >= 30 ? 'Medium' : 'Low');

  const handleSelectPreset = (preset: RecipientPreset) => {
    setRecipientAccountId(preset.accountNumber);
    setRecipientName(preset.name);
    if (preset.id === 'preset-3') {
      setAmount('150000');
      setDescription('High-Yield Investment Plan Deposit');
    } else if (preset.id === 'preset-4') {
      setAmount('10000000');
      setDescription('Syndicate Liquidity Transfer (₹1.00 Crore)');
    } else if (preset.id === 'preset-1') {
      setAmount('14500');
      setDescription('Office Computer & Monitor Supplies');
    } else {
      setAmount('45000');
      setDescription('Logistics Interstate Dispatch Charges');
    }
  };

  // Initiate Payment
  const handleInitiatePaymentClick = () => {
    if (!recipientAccountId || !recipientName || !amount) {
      alert('Please enter all required recipient and payment fields.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    // Check if this payment or recipient has a known high risk
    const isKnownHighRisk = computedRiskScore >= 70 || computedRiskLevel === 'Critical' || computedRiskLevel === 'High';

    if (isKnownHighRisk && !showHighRiskConfirmation) {
      setShowHighRiskConfirmation(true);
      return;
    }

    // Proceed with simulation
    executeSimulatedPayment();
  };

  const executeSimulatedPayment = () => {
    const numAmount = parseFloat(amount);
    const result = createPayment({
      recipientAccountId: recipientAccountId.trim(),
      recipientName: recipientName.trim(),
      amount: numAmount,
      description: description.trim(),
      riskScore: computedRiskScore,
      riskLevel: computedRiskLevel,
      riskRequestId: matchingRequest?.id
    });

    setShowHighRiskConfirmation(false);
    setCompletedPaymentReceipt({
      txnId: result.transactionId,
      utr: result.utr,
      amount: numAmount,
      recipientName,
      recipientAccount: recipientAccountId,
      riskScore: computedRiskScore,
      riskLevel: computedRiskLevel
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Send className="h-5 w-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ArthGuard Digital Payment</h3>
              <p className="text-xs text-blue-200">
                Debit Account: <span className="font-mono">{customer.id}</span> ({formatINR(customer.balance)} available)
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

        {/* Payment Completed Receipt State */}
        {completedPaymentReceipt ? (
          <div className="p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Simulated Payment Successful
              </span>
              <h4 className="text-2xl font-bold text-slate-800 mt-2">
                {formatINR(completedPaymentReceipt.amount)} Transferred
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Transaction ID: <span className="font-mono font-semibold text-slate-700">{completedPaymentReceipt.txnId}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-slate-800">{completedPaymentReceipt.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account:</span>
                <span className="font-mono text-slate-800">{completedPaymentReceipt.recipientAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank UTR Ref:</span>
                <span className="font-mono text-slate-800">{completedPaymentReceipt.utr}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Real-Time Risk Rating:</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                  completedPaymentReceipt.riskScore >= 70
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}>
                  {completedPaymentReceipt.riskScore}/100 ({completedPaymentReceipt.riskLevel})
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Prototype Note: Transaction is now tracked in customer history and investigator fund-flow monitor.
            </p>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setCompletedPaymentReceipt(null);
                  onClose();
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Done & View History
              </button>
            </div>
          </div>
        ) : showHighRiskConfirmation ? (
          /* High Risk Warning Confirmation Modal */
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <ShieldAlert className="h-8 w-8 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900">
                  Critical Fraud Alert: High-Risk Recipient Account Detected!
                </h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  ArthGuard real-time threat intelligence has evaluated the recipient account (<span className="font-mono font-semibold">{recipientAccountId}</span>) with a risk score of{' '}
                  <strong>{computedRiskScore}/100 ({computedRiskLevel} Risk)</strong>.
                </p>
                <p className="text-xs text-rose-800 mt-2 font-medium">
                  {matchedPreset?.behaviorNote || matchingRequest?.explanation || 'Simulated graph analysis indicates this account is part of a high-velocity money mule layering syndicate.'}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Prototype Notice:</strong> Proceeding will simulate this payment for testing fraud tracing and investigation workflows. Real funds are never moved.
              </span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowHighRiskConfirmation(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel Transfer (Recommended)
              </button>
              <button
                onClick={executeSimulatedPayment}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <span>Proceed with Simulated Payment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Standard Payment Form with Automated Real-Time Risk Rating */
          <div className="p-6 space-y-5">
            {/* Quick Demo Recipient Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Select Test Recipient Account:</span>
                </label>
                <span className="text-[10px] text-slate-400">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {RECIPIENT_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      recipientAccountId === preset.accountNumber
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 line-clamp-1">{preset.name.split(' ')[0]}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        preset.simulatedRiskLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : preset.simulatedRiskLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {preset.simulatedRiskLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{preset.accountNumber}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sender Account ID
                </label>
                <input
                  type="text"
                  disabled
                  value={`${customer.id} (${customer.name})`}
                  className="w-full text-xs font-mono bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Account ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ICIC-00910291"
                  value={recipientAccountId}
                  onChange={e => setRecipientAccountId(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Wealth Management"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full text-xs font-semibold pl-7 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Description / Purpose
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Investment Scheme Deposit"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Real-Time Automated Risk Assessment Banner */}
            <div className={`p-4 rounded-xl border text-xs transition-all ${
              computedRiskLevel === 'Critical' || computedRiskLevel === 'High'
                ? 'bg-rose-50/90 border-rose-300 text-rose-900'
                : computedRiskLevel === 'Medium'
                ? 'bg-amber-50/90 border-amber-300 text-amber-900'
                : 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                  <span className="font-bold text-xs">
                    ArthGuard Automated Recipient Risk Rating:
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  computedRiskLevel === 'Critical'
                    ? 'bg-rose-200 text-rose-900'
                    : computedRiskLevel === 'High'
                    ? 'bg-red-200 text-red-900'
                    : computedRiskLevel === 'Medium'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {computedRiskScore}/100 ({computedRiskLevel} Risk)
                </span>
              </div>

              <div className="mt-2 space-y-1 text-[11px] leading-relaxed">
                <p>
                  <strong>Intelligence Finding:</strong>{' '}
                  {matchedPreset?.behaviorNote || matchingRequest?.explanation || (
                    computedRiskScore >= 70
                      ? 'Flagged for high-velocity smurfing and rapid fan-out across multiple destination accounts.'
                      : 'Account profile shows regular trade velocity and clean counterparty links.'
                  )}
                </p>
                {computedRiskScore >= 70 && (
                  <p className="font-semibold text-rose-700">
                    ⚠ Warning: High probability of cyber-fraud syndicate affiliation.
                  </p>
                )}
              </div>
            </div>

            {/* Primary Action Button: Initiate Payment */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={handleInitiatePaymentClick}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/30"
              >
                <Zap className="h-4 w-4 text-teal-300" />
                <span>Initiate Simulated Payment</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
