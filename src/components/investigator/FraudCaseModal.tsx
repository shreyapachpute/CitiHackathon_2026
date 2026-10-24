import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FraudReport } from '../../types';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { FreezeRequestModal } from './FreezeRequestModal';
import {
  X, 
  AlertOctagon,
  FileText,
  GitBranch,
  Lock,
  CheckCircle,
  Save,
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';

interface FraudCaseModalProps {
  caseReport: FraudReport;
  onClose: () => void;
  onJumpToGraphNode?: (nodeId: string) => void;
}

export const FraudCaseModal: React.FC<FraudCaseModalProps> = ({ caseReport, onClose, onJumpToGraphNode }) => {
  const { updateFraudCase, transactions, riskRequests } = useApp();

  const [status, setStatus] = useState(caseReport.status);
  const [investigatorFindings, setInvestigatorFindings] = useState(
    caseReport.investigatorFindings ||
      'Telemetry verifies recipient ICIC-00910291 is a Tier-1 mule account. Rapid fund dispersion into 4 secondary mule nodes and overseas OTC desk confirmed. Immediate debit freeze warranted.'
  );
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  // Find original transaction
  const txn = transactions.find(t => t.id === caseReport.transactionId);
  const riskReq = riskRequests.find(r => r.recipientAccountId === caseReport.recipientAccountId);

  const handleSaveFindings = () => {
    updateFraudCase(caseReport.id, {
      status,
      investigatorFindings: investigatorFindings.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 text-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-850 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600/30 border border-rose-500/40 rounded-xl text-rose-400">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Fraud Incident Case Dossier</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  {caseReport.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {caseReport.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Victim: <span className="font-semibold text-slate-200">{caseReport.customerName}</span> ({caseReport.customerAccountId}) • Reported on {formatDateTime(caseReport.reportedAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          
          {/* Left Column: Case Information & Statement (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Financial Overview Card */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Disputed Transaction
                </span>
                <span className="text-xl font-mono font-extrabold text-rose-400">
                  {formatINR(caseReport.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-700/60">
                <div>
                  <span className="text-slate-400">Transaction ID:</span>
                  <div className="font-mono text-slate-200 font-semibold">{caseReport.transactionId}</div>
                </div>
                <div>
                  <span className="text-slate-400">Transaction Date:</span>
                  <div className="text-slate-200">{formatDateTime(caseReport.transactionDate)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Suspect Account:</span>
                  <div className="font-mono text-rose-300 font-bold">{caseReport.recipientAccountId}</div>
                </div>
                <div>
                  <span className="text-slate-400">Suspect Name:</span>
                  <div className="text-slate-200 font-semibold">{caseReport.recipientName}</div>
                </div>
              </div>
            </div>

            {/* Victim Statement */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] block">
                Victim Statement & Modus Operandi:
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {caseReport.description}
              </p>
              {caseReport.supportingNotes && (
                <div className="text-slate-400 text-[11px] pt-1">
                  <strong>Supporting Evidence Notes:</strong> {caseReport.supportingNotes}
                </div>
              )}
            </div>

            {/* Money Trail Inspection Shortcut */}
            <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 p-4 rounded-xl border border-indigo-800/50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <GitBranch className="h-4 w-4 text-teal-400" />
                  <span>Inspect Layered Money Trail on Fund-Flow Canvas</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Trace where {formatINR(caseReport.amount)} moved after hitting {caseReport.recipientAccountId}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onJumpToGraphNode) onJumpToGraphNode(caseReport.recipientAccountId);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center space-x-1 transition-colors shrink-0"
              >
                <span>Open Graph Trail</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: Case Management & Freeze Request (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800/90 p-5 rounded-xl border border-slate-700 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span className="font-bold uppercase tracking-wider text-white text-xs">
                  Case Management & Action
                </span>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Investigation Status:
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-1 focus:ring-rose-500"
                >
                  <option value="SUBMITTED">SUBMITTED (Pending Review)</option>
                  <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION (Active Trace)</option>
                  <option value="FREEZE_REQUESTED">FREEZE REQUESTED (Bank Nodal Hold)</option>
                  <option value="CONFIRMED_FRAUD">CONFIRMED FRAUD (Syndicate Match)</option>
                  <option value="RESOLVED">RESOLVED (Closed)</option>
                </select>
              </div>

              {/* Findings Editor */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Investigator Findings & Evidence:
                </label>
                <textarea
                  rows={4}
                  value={investigatorFindings}
                  onChange={e => setInvestigatorFindings(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-teal-400 font-mono text-[11px]"
                  placeholder="Record investigation findings, linked mule nodes, and syndicate affiliation..."
                />
              </div>

              {/* Save Findings Button */}
              <button
                type="button"
                onClick={handleSaveFindings}
                className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Save className="h-3.5 w-3.5 text-teal-300" />
                <span>Save Findings & Update Status</span>
              </button>
            </div>

            {/* Primary Action: Launch Account Freeze Request */}
            <div className="pt-4 border-t border-slate-700">
              <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-900/60 mb-3 space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-300 font-bold">
                  <Lock className="h-4 w-4" />
                  <span>Execute Simulated Account Freeze</span>
                </div>
                <p className="text-[11px] text-rose-200/80">
                  Target: <span className="font-mono font-semibold">{caseReport.recipientAccountId}</span>. Freezes all outbound credits to preserve remaining funds for victim restitution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFreezeModal(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Lock className="h-4 w-4" />
                <span>Submit Simulated Account Freeze</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {showFreezeModal && (
        <FreezeRequestModal
          caseId={caseReport.id}
          defaultAccountId={caseReport.recipientAccountId}
          defaultAccountName={caseReport.recipientName}
          defaultAmount={caseReport.amount}
          onClose={() => {
            setShowFreezeModal(false);
            setStatus('FREEZE_REQUESTED');
          }}
        />
      )}
    </div>
  );
};
