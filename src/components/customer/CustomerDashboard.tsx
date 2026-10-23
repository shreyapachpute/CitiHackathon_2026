import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateTime, getRiskBadgeClasses } from '../../utils/formatters';
import { Transaction } from '../../types';
import { InitiatePaymentModal } from './InitiatePaymentModal';
import { ReportFraudModal } from './ReportFraudModal';
import {
  Wallet,
  ShieldCheck,
  Send,
  AlertTriangle,
  History,
  FileWarning,
  CheckCircle2,
  ShieldAlert,
  Search,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
  Sliders,
  HelpCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    customer,
    transactions,
    riskRequests,
    fraudReports,
    activeSidebarTab,
    setActiveSidebarTab
  } = useApp();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTxnForFraud, setSelectedTxnForFraud] = useState<Transaction | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const latestAdvisory = riskRequests[0];

  const filteredTransactions = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.recipientName.toLowerCase().includes(q) ||
      t.recipientAccountId.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Tab: HOME (Personalized Banking App) */}
      {(!activeSidebarTab || activeSidebarTab === 'HOME' || !['PAYMENTS', 'SECURITY', 'DISPUTES', 'HISTORY', 'SERVICES'].includes(activeSidebarTab)) && (
        <div className="space-y-6">
          
          {/* Welcome User & Verified Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, <span className="text-blue-700">{customer.name}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {customer.bankName} • Account ID: <span className="font-mono font-semibold text-slate-700">{customer.id}</span>
              </p>
            </div>

            {/* Account Status Badge (Removed Deposits, Security, Cards tabs) */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Account • Real-Time AI Fraud Shield Active</span>
            </div>
          </div>

          {/* Hero Row: Signature Blue Gradient Banking Card + ArthGuard AI Protection Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Signature Blue Gradient Banking Card */}
            <div className="lg:col-span-7 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-900/25 flex flex-col justify-between relative overflow-hidden border border-blue-500/30">
              
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Top Row */}
              <div className="flex items-center justify-between z-10">
                <span className="text-sm font-semibold tracking-wide text-blue-100">
                  Savings A/C
                </span>
                <span className="font-mono text-sm tracking-wider font-medium text-blue-100">
                  {customer.accountNumberFormatted}
                </span>
              </div>

              {/* Card Center: Available Balance */}
              <div className="my-8 z-10">
                <div className="flex items-center space-x-2 text-xs text-blue-200 font-medium">
                  <span>Available Balance</span>
                  <button
                    onClick={() => setShowBalance(prev => !prev)}
                    className="p-1 hover:text-white transition-colors"
                    title="Toggle balance visibility"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 font-mono tracking-tight">
                  {showBalance ? formatINR(customer.balance) : '₹ ••••••••'}
                </div>
              </div>

              {/* Card Bottom Row: Pill Buttons */}
              <div className="flex items-center justify-between z-10 pt-4 border-t border-white/15">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveSidebarTab('HISTORY')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab('HISTORY')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition-colors"
                  >
                    View Statements
                  </button>
                </div>

                <button
                  onClick={() => setActiveSidebarTab('SECURITY')}
                  className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center space-x-1"
                >
                  <span>View Summary</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Card: ArthGuard AI Protection Hub (Replaces removed Products section, styled in matching Blue Gradient) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-800 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-7 border border-blue-500/40 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-teal-300" />
                    <h3 className="font-bold text-white text-sm">ArthGuard AI Defense</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    PROTECTION ACTIVE
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-blue-200 text-[11px] block">Customer Safety Rating</span>
                      <span className="text-lg font-bold text-emerald-300 font-mono">12/100 • Safe</span>
                    </div>
                    <div className="text-right">
                      <span className="text-blue-200 text-[11px] block">Threat Interceptions</span>
                      <span className="text-sm font-semibold text-white">0 Flags on Account</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-blue-100/90 pt-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                      <span>Instant AI scan prior to payment dispatch</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                      <span>Automated warning dialog for high-risk recipients</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                      <span>Direct 24/7 escalation to bank fraud investigator</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-900 rounded-xl font-bold shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Money</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('SECURITY')}
                  className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center space-x-1"
                >
                  <span>Risk Directory</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Section: "Your go-to actions" (Matching the grid in the reference image) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Your Go-To Actions</h3>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer">Customize ✏</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* Action 1: Send Money / Initiate Payment */}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Send className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Send Money</span>
                <span className="text-[10px] text-slate-500 block">Instant Transfer</span>
              </button>

              {/* Action 2: Automated Risk Radar */}
              <button
                onClick={() => setActiveSidebarTab('SECURITY')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Risk Radar</span>
                <span className="text-[10px] text-slate-500 block">Threat Ratings</span>
              </button>

              {/* Action 3: Report Fraud / Dispute */}
              <button
                onClick={() => setActiveSidebarTab('HISTORY')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-rose-400 bg-slate-50/60 hover:bg-rose-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FileWarning className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Dispute Txn</span>
                <span className="text-[10px] text-slate-500 block">Report Fraud</span>
              </button>

              {/* Action 4: Manage Debit Limits */}
              <button
                onClick={() => setActiveSidebarTab('SERVICES')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Card Limits</span>
                <span className="text-[10px] text-slate-500 block">Security Controls</span>
              </button>

              {/* Action 5: Fixed Deposit Booster */}
              <button
                onClick={() => setActiveSidebarTab('HOME')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Open FD / RD</span>
                <span className="text-[10px] text-slate-500 block">7.85% Returns</span>
              </button>

              {/* Action 6: 24/7 Fraud Desk Support */}
              <button
                onClick={() => setActiveSidebarTab('DISPUTES')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/60 transition-all text-center group flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 block">Help Center</span>
                <span className="text-[10px] text-slate-500 block">Bank Cyber Cell</span>
              </button>

            </div>
          </div>

          {/* Real-Time Recipient Threat Advisory Banner */}
          {latestAdvisory && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-rose-600 animate-pulse" />
                  <h4 className="font-bold text-sm text-slate-900">
                    ArthGuard Live Threat Advisory: {latestAdvisory.recipientName}
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {latestAdvisory.riskScore}/100 Critical Risk
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {latestAdvisory.explanation}
              </p>
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-rose-700 font-bold uppercase">
                  Recommendation: {latestAdvisory.recommendedAction || 'CANCEL PAYMENT'}
                </span>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors"
                >
                  Initiate New Transfer
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab: PAYMENTS */}
      {activeSidebarTab === 'PAYMENTS' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Digital Payments & Fund Transfers</h2>
              <p className="text-xs text-slate-500">
                Instant UPI, IMPS, and NEFT payments protected by ArthGuard Real-Time Fraud Intelligence.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Launch Payment Terminal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[11px]">Daily Transfer Limit</span>
              <div className="text-base font-bold text-slate-800">₹5,00,000 / Day</div>
              <span className="text-[10px] text-emerald-600 font-medium">Standard Retail Limits Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[11px]">Instant Automated Risk Pre-Score</span>
              <div className="text-base font-bold text-slate-800">Real-Time AI Scan</div>
              <span className="text-[10px] text-blue-600 font-medium">Scored prior to clearing</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[11px]">High-Risk Confirmation Hold</span>
              <div className="text-base font-bold text-slate-800">Active Warning Dialog</div>
              <span className="text-[10px] text-amber-600 font-medium">Prevents accidental scams</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SECURITY & RISK RADAR */}
      {activeSidebarTab === 'SECURITY' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">ArthGuard Security & Risk Radar</h2>
            <p className="text-xs text-slate-500">
              Live counterparty threat rating directory and published safety advisories from the bank cyber fraud desk.
            </p>
          </div>

          <div className="space-y-4">
            {riskRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadgeClasses(req.riskLevel || 'Low').badge}`}>
                      {req.riskLevel} ({req.riskScore}/100)
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Logged on {formatDateTime(req.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px]">Counterparty:</span>
                    <div className="font-semibold text-slate-800">{req.recipientName} ({req.recipientAccountId})</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Sample Amount:</span>
                    <div className="font-mono font-bold text-slate-900">{formatINR(req.amount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Safety Advice:</span>
                    <div className="font-bold uppercase text-slate-800">{req.recommendedAction?.replace(/_/g, ' ') || 'PROCEED'}</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                  <strong>Bank Advisory:</strong> {req.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: DISPUTES & FRAUD REPORTS */}
      {activeSidebarTab === 'DISPUTES' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Fraud Reports & Dispute Management</h2>
            <p className="text-xs text-slate-500">
              Track the progress of your submitted fraud cases and bank account-action reviews.
            </p>
          </div>

          {fraudReports.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No fraud cases filed.</p>
          ) : (
            <div className="space-y-4">
              {fraudReports.map(report => (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{report.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {report.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-700 font-semibold">{report.fraudCategory}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600 text-sm">{formatINR(report.amount)}</span>
                  </div>

                  <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 text-[11px]">
                    <strong>Statement:</strong> {report.description}
                  </p>

                  <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 text-blue-900 text-[11px]">
                    <strong>Investigator Findings:</strong> {report.investigatorFindings || 'Case undergoing multi-hop trace analysis.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: STATEMENTS / TRANSACTION HISTORY */}
      {activeSidebarTab === 'HISTORY' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Account Statements & Transaction History</h2>
              <p className="text-xs text-slate-500">
                Full ledger of digital transactions with real-time risk scores and 1-click fraud dispute reporting.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search recipient or Txn ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Transaction / UTR</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Safety Rating</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(txn => {
                  const badgeStyles = getRiskBadgeClasses(txn.riskLevel);
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{txn.id}</span>
                        <p className="text-[10px] font-mono text-slate-400">{txn.utr}</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{txn.recipientName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{txn.recipientAccountId}</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs text-slate-600 truncate">{txn.description}</td>
                      <td className="py-3 px-3 text-slate-500">{formatDateTime(txn.timestamp)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">{formatINR(txn.amount)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeStyles.badge}`}>
                          {txn.riskScore}/100 ({txn.riskLevel})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {txn.hasFraudReport ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            FRAUD REPORTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                            COMPLETED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {txn.hasFraudReport ? (
                          <span className="text-[11px] text-slate-400 italic">Disputed</span>
                        ) : (
                          <button
                            onClick={() => setSelectedTxnForFraud(txn)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-sm inline-flex items-center space-x-1"
                          >
                            <AlertTriangle className="h-3 w-3 text-rose-600" />
                            <span>Report Fraud</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: SERVICES / LIMITS */}
      {activeSidebarTab === 'SERVICES' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Security Center & Account Limits</h2>
            <p className="text-xs text-slate-500">
              Configure daily transaction thresholds, biometric authentication, and automated fraud kill-switches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">UPI & IMPS Transfer Limits</h4>
              <p className="text-slate-500">Current Per-Transaction Limit: <strong>₹1,00,000</strong></p>
              <input type="range" min="10000" max="500000" defaultValue="100000" className="w-full accent-blue-600 cursor-pointer" />
              <span className="text-[10px] text-slate-400 block">Move slider to adjust single transaction cap</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">ArthGuard AI Protection Mode</h4>
              <p className="text-slate-500">High-Risk Confirmation Warning: <strong>Always Enabled</strong></p>
              <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-semibold text-[11px]">
                <ShieldCheck className="h-4 w-4" />
                <span>Real-Time Smurfing & Mule Account Blocker Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPaymentModal && (
        <InitiatePaymentModal onClose={() => setShowPaymentModal(false)} />
      )}

      {selectedTxnForFraud && (
        <ReportFraudModal
          transaction={selectedTxnForFraud}
          onClose={() => setSelectedTxnForFraud(null)}
        />
      )}

    </div>
  );
};
