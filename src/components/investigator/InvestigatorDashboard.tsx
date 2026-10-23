import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FundFlowGraph } from '../graphs/FundFlowGraph';
import { IdentityLinkGraph } from '../graphs/IdentityLinkGraph';
import { RiskWorkspaceModal } from './RiskWorkspaceModal';
import { FraudCaseModal } from './FraudCaseModal';
import { FreezeRequestModal } from './FreezeRequestModal';
import { formatINR, formatDateTime, getRiskBadgeClasses } from '../../utils/formatters';
import { FundFlowNode } from '../../types';
import {
  Shield,
  Activity,
  Layers,
  Share2,
  FileWarning,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Cpu,
  TrendingUp,
  CheckCircle,
  Search,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const InvestigatorDashboard: React.FC = () => {
  const {
    riskRequests,
    fraudReports,
    freezeRequests,
    transactions,
    graphNodes,
    graphEdges,
    activeSidebarTab,
    setActiveSidebarTab,
    activeRequestId,
    setActiveRequestId,
    activeCaseId,
    setActiveCaseId,
    setSelectedGraphNodeId,
    updateFreezeRequestStatus
  } = useApp();

  const [freezeModalNode, setFreezeModalNode] = useState<FundFlowNode | null>(null);

  const flaggedRiskAlerts = riskRequests;
  const activeFraudCases = fraudReports.filter(f => f.status !== 'RESOLVED');
  const pendingFreezes = freezeRequests.filter(f => f.status === 'PENDING_BANK_AUTHORIZATION');

  const activeRequestObj = riskRequests.find(r => r.id === activeRequestId) || null;
  const activeCaseObj = fraudReports.find(c => c.id === activeCaseId) || null;

  const handleJumpToGraphNode = (nodeId: string) => {
    setActiveSidebarTab('FUND_FLOW');
    setSelectedGraphNodeId(nodeId);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Investigator Hero Header (Blue Gradient Box) */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-950 rounded-3xl shadow-xl border border-blue-500/40 p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300 bg-white/15 px-2.5 py-0.5 rounded-full border border-teal-300/30">
                ArthGuard Fraud Operations & AML Intelligence Center
              </span>
              <span className="text-xs text-blue-300">•</span>
              <span className="text-xs font-mono text-blue-200">CYBER-INTEL-BLR-04</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Inspector Vikram Rao
            </h1>
            <p className="text-xs text-blue-200 font-mono">
              Lead Fraud Investigator • Dual-Graph Dynamic Telemetry Active
            </p>
          </div>

          {/* Quick Dual Graph Launchers */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveSidebarTab('FUND_FLOW')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                activeSidebarTab === 'FUND_FLOW'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-teal-200 border border-white/20'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Graph 1: Fund Flow</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('IDENTITY_GRAPH')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                activeSidebarTab === 'IDENTITY_GRAPH'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20'
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span>Graph 2: Identity Links</span>
            </button>
          </div>
        </div>

        {/* KPI Intelligence Stats Bar (Blue Gradient Glassmorphic Boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/15 text-xs relative z-10">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-blue-200 text-[11px] block">High-Risk Intelligence Alerts</span>
            <div className="text-xl font-extrabold text-amber-300 mt-1 font-mono">
              {flaggedRiskAlerts.length}
            </div>
            <span className="text-[10px] text-blue-200">Automated AI Detection</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-blue-200 text-[11px] block">Flagged Mule Nodes</span>
            <div className="text-xl font-extrabold text-rose-300 mt-1 font-mono">
              {graphNodes.filter(n => n.flagged || n.riskScore >= 70).length}
            </div>
            <span className="text-[10px] text-blue-200">Active Layering Hubs</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-blue-200 text-[11px] block">Active Fraud Cases</span>
            <div className="text-xl font-extrabold text-rose-400 mt-1 font-mono">
              {activeFraudCases.length}
            </div>
            <span className="text-[10px] text-blue-200">Customer Dispute Queue</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-blue-200 text-[11px] block">Freeze Requests</span>
            <div className="text-xl font-extrabold text-teal-300 mt-1 font-mono">
              {freezeRequests.length} ({pendingFreezes.length} Pending)
            </div>
            <span className="text-[10px] text-blue-200">Bank Nodal Review</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 col-span-2 sm:col-span-1">
            <span className="text-blue-200 text-[11px] block">Monitored Volume</span>
            <div className="text-xl font-extrabold text-teal-300 mt-1 font-mono">
              {formatINR(graphEdges.reduce((acc, e) => acc + e.amount, 0))}
            </div>
            <span className="text-[10px] text-blue-200">Traced across 4 hops</span>
          </div>
        </div>
      </div>

      {/* Tab: OVERVIEW (Fraud Radar) */}
      {(!activeSidebarTab || activeSidebarTab === 'OVERVIEW' || !['ALERTS', 'FUND_FLOW', 'IDENTITY_GRAPH', 'FRAUD_REPORTS', 'FREEZES', 'MONITORING'].includes(activeSidebarTab)) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Risk Alerts Queue Widget */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-slate-800 text-sm">
                    Automated Risk Alerts & Recipient Investigations ({flaggedRiskAlerts.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSidebarTab('ALERTS')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>View All Alerts</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {flaggedRiskAlerts.map(req => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">{req.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                          (req.riskScore ?? 0) >= 70 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Risk Score: {req.riskScore ?? 92}/100
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Counterparty: <strong className="text-slate-800">{req.recipientName}</strong> (
                        <span className="font-mono">{req.recipientAccountId}</span>) • {formatINR(req.amount)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Automated AI Detection • {formatDateTime(req.timestamp)}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveRequestId(req.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1 shrink-0"
                    >
                      <Cpu className="h-3.5 w-3.5" />
                      <span>Investigate Account</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Threat Radar & Mule Cluster Detection (Rich Blue Gradient Box) */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 border border-blue-500/40 shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-rose-400 animate-pulse" />
                    <h3 className="font-bold text-white text-sm">Active Mule Network Threat</h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-400/30">
                    CRITICAL SEVERITY
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
                    <span className="text-blue-200 text-[11px] block">Detected Syndicate</span>
                    <strong className="text-white text-sm">Rohan Verma & Telegram FX Ring</strong>
                    <p className="text-[11px] text-blue-100/80 mt-0.5">
                      26+ interconnected accounts sharing address & mobile identities across 3 states.
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-blue-100">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Off-ramp risk:</span>
                      <span className="text-rose-300 font-bold">P2P USDT OTC & Karol Bagh ATMs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Layering velocity:</span>
                      <span className="text-amber-300 font-bold">₹1.00 Crore fan-out in 6 minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 relative z-10">
                <button
                  onClick={() => setActiveSidebarTab('FUND_FLOW')}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                >
                  <Layers className="h-4 w-4" />
                  <span>Graph 1 (Trail)</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('IDENTITY_GRAPH')}
                  className="py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Graph 2 (Ring)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Recent Monitored Transactions Preview */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Recent Monitored Payments</h3>
              <button
                onClick={() => setActiveSidebarTab('MONITORING')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View Full Audit Stream
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Txn ID</th>
                    <th className="py-2.5 px-3">Sender → Recipient</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Safety Rating</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.slice(0, 4).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{t.id}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-600">{t.senderName}</span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="font-semibold text-slate-800">{t.recipientName}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(t.amount)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadgeClasses(t.riskLevel).badge}`}>
                          {t.riskScore}/100 ({t.riskLevel})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleJumpToGraphNode(t.recipientAccountId)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]"
                        >
                          Trace Flow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: RISK ALERTS & RECIPIENT INVESTIGATION */}
      {activeSidebarTab === 'ALERTS' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Risk Intelligence Alerts & Telemetry</h2>
            <p className="text-xs text-slate-500">
              Automated AI detection queue: review behavioral anomalies, connected accounts, and publish safety ratings.
            </p>
          </div>

          <div className="space-y-4">
            {flaggedRiskAlerts.map(req => (
              <div
                key={req.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs hover:border-indigo-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{req.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (req.riskScore ?? 0) >= 70 ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {req.riskScore ?? 92}/100 ({req.riskLevel || 'Critical'} Risk)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Timestamp: {formatDateTime(req.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Monitored Account:</span>
                    <div className="font-mono font-bold text-rose-600">{req.recipientAccountId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Entity Name:</span>
                    <div className="font-semibold text-slate-800">{req.recipientName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Sample Transfer Volume:</span>
                    <div className="font-mono font-bold text-slate-900 text-sm">{formatINR(req.amount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">ML Velocity Anomaly:</span>
                    <div className="font-bold text-rose-600">{req.evidenceSummary?.velocityScore || 94}/100</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-200 gap-3">
                  <span className="text-slate-500 italic text-[11px]">
                    Telemetry Summary: {req.evidenceSummary?.anomalyFlags?.[0] || 'Dormancy break and rapid fan-out to mule clusters'}
                  </span>
                  <button
                    onClick={() => setActiveRequestId(req.id)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all self-end sm:self-auto"
                  >
                    <Cpu className="h-4 w-4 text-teal-300" />
                    <span>Open Intelligence Workspace (Inspect & Adjust)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: GRAPH 1 (Fund-Flow Tracing Graph) */}
      {activeSidebarTab === 'FUND_FLOW' && (
        <FundFlowGraph
          onOpenFreezeModalForNode={node => setFreezeModalNode(node)}
        />
      )}

      {/* Tab: GRAPH 2 (Identity Link Network Graph) */}
      {activeSidebarTab === 'IDENTITY_GRAPH' && (
        <IdentityLinkGraph />
      )}

      {/* Tab: FRAUD REPORTS */}
      {activeSidebarTab === 'FRAUD_REPORTS' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fraud Incident Reports Queue</h2>
              <p className="text-xs text-slate-500">
                Customer-reported scam transactions. Inspect money trail and submit simulated debit freezes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800">
              {fraudReports.length} Cases
            </span>
          </div>

          <div className="space-y-4">
            {fraudReports.map(report => (
              <div
                key={report.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-rose-400 bg-slate-50 text-xs space-y-3 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{report.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      {report.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-semibold">{report.fraudCategory}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Reported on {formatDateTime(report.reportedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Victim:</span>
                    <div className="font-semibold text-slate-800">{report.customerName} ({report.customerAccountId})</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Target Account:</span>
                    <div className="font-mono font-bold text-rose-600">{report.recipientAccountId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Original Txn ID:</span>
                    <div className="font-mono text-slate-700">{report.transactionId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Reported Amount:</span>
                    <div className="font-mono font-bold text-rose-600 text-sm">{formatINR(report.amount)}</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                  <strong>Incident Summary:</strong> {report.description}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 text-[11px] font-mono">
                    {report.associatedFreezeRequestId ? (
                      <span className="text-rose-600 font-bold">Freeze Request Linked: {report.associatedFreezeRequestId}</span>
                    ) : (
                      'No freeze order issued yet'
                    )}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleJumpToGraphNode(report.recipientAccountId)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Trace Money Trail</span>
                    </button>

                    <button
                      onClick={() => setActiveCaseId(report.id)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <FileWarning className="h-3.5 w-3.5" />
                      <span>Open Case Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: FREEZE MANAGEMENT */}
      {activeSidebarTab === 'FREEZES' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Account-Freeze Authorization Pipeline</h2>
              <p className="text-xs text-slate-500">
                Official nodal bank authorization workflow for simulated debit freezes under Section 91 CrPC / IT Act.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
              {freezeRequests.length} Total Requests
            </span>
          </div>

          <div className="space-y-4">
            {freezeRequests.map(frz => (
              <div
                key={frz.id}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{frz.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      frz.status === 'APPROVED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : frz.status === 'REJECTED'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    }`}>
                      {frz.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Filed on {formatDateTime(frz.requestedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px]">Target Account:</span>
                    <div className="font-mono font-bold text-rose-600">{frz.targetAccountId}</div>
                    <div className="text-[11px] text-slate-500">{frz.targetBank}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Freeze Type:</span>
                    <div className="font-semibold text-slate-800">{frz.freezeType.replace(/_/g, ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Case Reference:</span>
                    <div className="font-mono text-slate-800">{frz.caseId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Requested By:</span>
                    <div className="font-medium text-slate-800">{frz.requestedBy}</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                  <strong>Justification:</strong> {frz.justification}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-200 gap-3">
                  <div className="text-[11px] text-slate-500 italic">
                    {frz.status === 'APPROVED' ? (
                      <span className="text-rose-600 font-semibold">
                        ✓ Authorization Approved by {frz.approvingAuthority} on {formatDateTime(frz.decisionTimestamp || '')}
                      </span>
                    ) : frz.status === 'REJECTED' ? (
                      <span className="text-slate-500">
                        ✕ Request Rejected by {frz.approvingAuthority}
                      </span>
                    ) : (
                      'Simulate authorized bank nodal officer review:'
                    )}
                  </div>

                  {frz.status === 'PENDING_BANK_AUTHORIZATION' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateFreezeRequestStatus(frz.id, 'APPROVED', 'Nodal Officer Rajesh V. (RBI AML Wing)')
                        }
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Simulate Bank Approval (Freeze Account)</span>
                      </button>

                      <button
                        onClick={() =>
                          updateFreezeRequestStatus(frz.id, 'REJECTED', 'Legal Counsel Review Desk')
                        }
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                      >
                        <span>Simulate Rejection</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: MONITORING */}
      {activeSidebarTab === 'MONITORING' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Inter-Bank Transaction Monitoring Stream</h2>
              <p className="text-xs text-slate-500">
                Audited transaction stream monitored by ArthGuard simulated trust layer.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{transactions.length} Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Transaction / UTR</th>
                  <th className="py-3 px-3">Sender Account</th>
                  <th className="py-3 px-3">Recipient Account</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Safety Rating</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-900">{t.id}</span>
                      <p className="text-[10px] font-mono text-slate-400">{t.utr}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{t.senderName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{t.senderAccountId}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{t.recipientName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{t.recipientAccountId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatINR(t.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadgeClasses(t.riskLevel).badge}`}>
                        {t.riskScore}/100 ({t.riskLevel})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {t.hasFraudReport ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          FRAUD REPORTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                          CLEARED
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleJumpToGraphNode(t.recipientAccountId)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                      >
                        Inspect Trail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeRequestObj && (
        <RiskWorkspaceModal
          request={activeRequestObj}
          onClose={() => setActiveRequestId(null)}
        />
      )}

      {activeCaseObj && (
        <FraudCaseModal
          caseReport={activeCaseObj}
          onClose={() => setActiveCaseId(null)}
          onJumpToGraphNode={handleJumpToGraphNode}
        />
      )}

      {freezeModalNode && (
        <FreezeRequestModal
          defaultAccountId={freezeModalNode.id}
          defaultAccountName={freezeModalNode.ownerName}
          defaultBank={freezeModalNode.bank}
          defaultAmount={freezeModalNode.balance || 2500000}
          onClose={() => setFreezeModalNode(null)}
        />
      )}

    </div>
  );
};
