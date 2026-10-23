import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, User, Search, ArrowRight, CheckCircle2, Lock, GitBranch } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const RoleSelectionModal: React.FC = () => {
  const { setRole, customer, riskRequests } = useApp();

  const flaggedRiskCount = riskRequests.filter(r => (r.riskScore ?? 0) >= 70 || r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="max-w-3xl text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-xs">
          <Shield className="h-4 w-4 text-teal-300" />
          <span>ArthGuard Digital Payment Fraud Intelligence Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Welcome to <span className="bg-gradient-to-r from-blue-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent">ArthGuard</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
          Select an account role to start the prototype. Experience the complete end-to-end fraud defense workflow between a retail bank customer and a fraud operations investigator.
        </p>

        {/* Prototype Disclaimer Banner */}
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-blue-200">
          <Lock className="h-3.5 w-3.5 text-amber-300" />
          <span>Interactive Prototype: All accounts, ledgers, and graph analytics are realistically simulated.</span>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Customer Experience Card (Rich Blue Gradient) */}
        <div className="group relative bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-3xl border border-blue-400/40 p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.01] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                <User className="h-7 w-7 text-blue-100" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20">
                Customer View
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Customer Portal</h2>
            <p className="text-xs text-blue-100/90 mb-6 leading-relaxed">
              Experience the retail banking perspective: view instant automated recipient safety ratings, initiate simulated payments with fraud alerts, and report scam transactions.
            </p>

            {/* Profile snapshot */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2 mb-6 text-xs text-white">
              <div className="flex justify-between text-blue-100">
                <span>Account Holder:</span>
                <span className="font-semibold text-white">{customer.name}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Account ID:</span>
                <span className="font-mono text-white">{customer.id}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Available Balance:</span>
                <span className="font-bold text-emerald-300">{formatINR(customer.balance)}</span>
              </div>
            </div>

            {/* Capabilities list */}
            <ul className="space-y-2.5 text-xs text-blue-100 mb-8">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>Real-Time Recipient Threat Radar & Automated Safety Score</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>High-Risk Payment Prevention & Confirmation Warnings</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>Transaction History & 1-Click Incident Dispute Filing</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setRole('CUSTOMER')}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 relative z-10 cursor-pointer"
          >
            <span>Login as Customer ({customer.name})</span>
            <ArrowRight className="h-4 w-4 text-blue-900" />
          </button>
        </div>

        {/* Bank Investigator Experience Card (Rich Blue Gradient) */}
        <div className="group relative bg-gradient-to-br from-indigo-800 via-blue-800 to-slate-900 rounded-3xl border border-indigo-400/40 p-8 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20 hover:scale-[1.01] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                <Search className="h-7 w-7 text-indigo-100" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/15 text-indigo-100 border border-white/20">
                Fraud Operations
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Bank Investigator Portal</h2>
            <p className="text-xs text-blue-100/90 mb-6 leading-relaxed">
              Professional fraud desk: analyze high-risk intelligence alerts, examine behavioral telemetry & ML anomaly scores, trace multi-hop fund flows, and execute simulated account freezes.
            </p>

            {/* Investigator status badges */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2 mb-6 text-xs text-white">
              <div className="flex justify-between text-blue-100">
                <span>Investigator:</span>
                <span className="font-semibold text-white">Inspector Vikram Rao</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Unit:</span>
                <span className="font-mono text-white">Cyber Crime & AML Cell</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>High-Risk Alerts:</span>
                <span className="font-bold text-amber-300">{flaggedRiskCount} Active Intelligence Alerts</span>
              </div>
            </div>

            {/* Capabilities list */}
            <ul className="space-y-2.5 text-xs text-blue-100 mb-8">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>Simulated Graph Neural & Isolation Forest ML Workspace</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>Interactive Multi-Level Fund-Flow Graph (₹1 Cr Layering)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
                <span>Fraud Incident Triage & Simulated Account-Freeze Requests</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setRole('INVESTIGATOR')}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 relative z-10 cursor-pointer"
          >
            <span>Login as Bank Investigator (Inspector Rao)</span>
            <ArrowRight className="h-4 w-4 text-indigo-950" />
          </button>
        </div>

      </div>

      {/* Shared Data Note */}
      <div className="mt-8 text-center text-xs text-blue-200 flex items-center space-x-2 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/15">
        <GitBranch className="h-4 w-4 text-teal-300 shrink-0" />
        <span>
          <strong>Shared Reactive State:</strong> Actions taken in either portal immediately update the other in real time. You can switch between roles anytime.
        </span>
      </div>

    </div>
  );
};
