import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskRequest, RiskLevel } from '../../types';
import { formatINR, formatDateTime, getRiskBadgeClasses } from '../../utils/formatters';
import { 
  X,
  ShieldAlert,
  Cpu,
  Activity,
  AlertTriangle,
  GitBranch,
  CheckCircle,
  Clock,
  Sliders,
  Send,
  Lock,
  User,
  Zap,
  Layers,
  FileText
} from 'lucide-react';

interface RiskWorkspaceModalProps {
  request: RiskRequest;
  onClose: () => void;
}

export const RiskWorkspaceModal: React.FC<RiskWorkspaceModalProps> = ({ request, onClose }) => {
  const { submitInvestigatorAssessment } = useApp();

  // Initial state derived from request or simulated evidence
  const initialScore = request.riskScore ?? (request.evidenceSummary?.muleProbabilityScore || 92);
  const initialLevel: RiskLevel = request.riskLevel ?? (initialScore >= 80 ? 'Critical' : initialScore >= 50 ? 'High' : initialScore >= 30 ? 'Medium' : 'Low');

  const [riskScore, setRiskScore] = useState<number>(initialScore);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(initialLevel);
  const [recommendedAction, setRecommendedAction] = useState<'PROCEED' | 'PROCEED_WITH_CAUTION' | 'CANCEL'>(
    request.recommendedAction ?? (initialScore >= 70 ? 'CANCEL' : initialScore >= 40 ? 'PROCEED_WITH_CAUTION' : 'PROCEED')
  );

  const [customerExplanation, setCustomerExplanation] = useState<string>(
    request.explanation ||
      (initialScore >= 70
        ? `Warning: Recipient account (${request.recipientAccountId}) was created ${request.evidenceSummary?.accountAge || 'recently'} and has been flagged for abnormal transaction velocity and rapid dispersion into multiple secondary mule accounts. High risk of fraudulent investment/layering scam. Transfer cancellation strongly advised.`
        : `Recipient account has consistent KYC profile and normal trade velocity. No suspicious outbound dispersion detected.`)
  );

  const [internalNotes, setInternalNotes] = useState<string>(
    request.internalNotes ||
      `Telemetry Analysis: Recipient triggered Isolation Forest anomaly flag (${request.evidenceSummary?.isolationForestAnomaly}%). Connected to ${request.evidenceSummary?.connectedMuleAccounts} identified mule hops. Geolocation mismatch detected: ${request.evidenceSummary?.geoMismatches}. Internal Cyber Crime registry alert active.`
  );

  // Sync risk level when score slider moves
  const handleScoreChange = (score: number) => {
    setRiskScore(score);
    if (score >= 80) {
      setRiskLevel('Critical');
      setRecommendedAction('CANCEL');
    } else if (score >= 60) {
      setRiskLevel('High');
      setRecommendedAction('CANCEL');
    } else if (score >= 35) {
      setRiskLevel('Medium');
      setRecommendedAction('PROCEED_WITH_CAUTION');
    } else {
      setRiskLevel('Low');
      setRecommendedAction('PROCEED');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInvestigatorAssessment(request.id, {
      riskScore,
      riskLevel,
      explanation: customerExplanation.trim(),
      internalNotes: internalNotes.trim(),
      recommendedAction
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-2xl max-w-4xl w-full border border-blue-700/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header (Blue Gradient) */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 border-b border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-teal-300">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Fraud Risk Investigation Workspace</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {request.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Simulated ML & GNN Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer: <span className="font-mono text-slate-200">{request.customerAccountId}</span> • Initiated on {formatDateTime(request.timestamp)}
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

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Evidence & Telemetry (8 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Target Transaction & Recipient Dossier */}
            <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Transaction Under Review
                </span>
                <span className="text-lg font-bold text-teal-300 font-mono">
                  {formatINR(request.amount)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Recipient Account ID:</span>
                  <div className="font-mono font-semibold text-slate-200">{request.recipientAccountId}</div>
                </div>
                <div>
                  <span className="text-slate-400">Beneficiary Name:</span>
                  <div className="font-semibold text-slate-200">{request.recipientName}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Payment Purpose:</span>
                  <div className="text-slate-300">{request.description}</div>
                </div>
              </div>
            </div>

            {/* Recipient Account Behavioral Telemetry & Simulated ML */}
            <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Behavioral Anomaly & ML Graph Telemetry
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">
                  [SIMULATED ML RESULTS]
                </span>
              </div>

              {/* ML Telemetry Metric Badges */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Account Age</span>
                  <span className="font-bold text-slate-200">{request.evidenceSummary?.accountAge || '4 Days'}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Velocity Anomaly</span>
                  <span className="font-bold text-rose-400">{request.evidenceSummary?.velocityScore || 94}/100</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">GNN Mule Probability</span>
                  <span className="font-bold text-rose-400">{request.evidenceSummary?.muleProbabilityScore || 92}%</span>
                </div>
              </div>

              {/* Unusual Behavioral Patterns */}
              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Unusual Behavioral Patterns Detected:
                </span>
                <ul className="space-y-1.5">
                  {request.evidenceSummary?.anomalyFlags?.map((flag, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-rose-300/90 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geolocation & Network telemetry */}
              <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 block">Network & Geolocation Telemetry:</span>
                <p className="text-slate-300 font-mono text-[11px] mt-0.5">
                  {request.evidenceSummary?.geoMismatches || 'SIM circle: Bihar | IP: Cambodia VPN'}
                </p>
              </div>
            </div>

            {/* Mini Connected Mule Graph Preview */}
            <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Connected Accounts & Mule Cluster Preview
                  </span>
                </div>
                <span className="text-[10px] text-teal-300 font-mono">
                  {request.evidenceSummary?.connectedMuleAccounts || 6} Linked Mule Hops
                </span>
              </div>

              {/* Diagram */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-around text-xs">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center font-bold mx-auto">
                    Cust
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">Origin</span>
                </div>
                
                <span className="text-teal-400 font-mono text-xs">──────►</span>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-600/30 border-2 border-rose-500 text-rose-300 flex items-center justify-center font-bold mx-auto animate-pulse">
                    Hub
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 mt-1 block font-bold">
                    {request.recipientAccountId}
                  </span>
                </div>

                <span className="text-rose-400 font-mono text-xs">──────►</span>

                <div className="text-center">
                  <div className="flex -space-x-2 justify-center">
                    <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-400 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      M1
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-400 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      M2
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-400 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      M3
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">Layer-2 Mules</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Investigator Decision Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800/90 p-5 rounded-xl border border-slate-700/80 flex flex-col justify-between space-y-4">
            
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-700 mb-3">
                  <Sliders className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Investigator Determination
                  </span>
                </div>

                {/* Risk Score Slider (0 - 100) */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-300">Adjust / Confirm Risk Score:</label>
                    <span className="font-mono text-base font-extrabold text-rose-400">
                      {riskScore}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskScore}
                    onChange={e => handleScoreChange(parseInt(e.target.value, 10))}
                    className="w-full accent-rose-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 (Safe)</span>
                    <span>35 (Med)</span>
                    <span>70 (High)</span>
                    <span>100 (Critical)</span>
                  </div>
                </div>

                {/* Risk Classification Pills */}
                <div className="space-y-1.5 mb-4">
                  <label className="block text-xs font-semibold text-slate-300">
                    Risk Classification:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {(['Low', 'Medium', 'High', 'Critical'] as const).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setRiskLevel(lvl);
                          if (lvl === 'Critical') setRiskScore(92);
                          if (lvl === 'High') setRiskScore(75);
                          if (lvl === 'Medium') setRiskScore(50);
                          if (lvl === 'Low') setRiskScore(15);
                        }}
                        className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all border ${
                          riskLevel === lvl
                            ? lvl === 'Critical'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : lvl === 'High'
                              ? 'bg-red-600 text-white border-red-500'
                              : lvl === 'Medium'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommended Customer Action */}
                <div className="space-y-1.5 mb-4">
                  <label className="block text-xs font-semibold text-slate-300">
                    Recommended Customer Action:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {(['PROCEED', 'PROCEED_WITH_CAUTION', 'CANCEL'] as const).map(act => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setRecommendedAction(act)}
                        className={`py-1.5 px-1 rounded-lg font-bold text-[10px] uppercase transition-all border text-center ${
                          recommendedAction === act
                            ? act === 'CANCEL'
                              ? 'bg-rose-600 text-white border-rose-500'
                              : act === 'PROCEED_WITH_CAUTION'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {act.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Facing Explanation (Visible to Customer) */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center space-x-1">
                      <span>Customer-Facing Explanation:</span>
                    </label>
                    <span className="text-[10px] text-teal-400 font-medium">Visible to customer</span>
                  </div>
                  <textarea
                    rows={3}
                    value={customerExplanation}
                    onChange={e => setCustomerExplanation(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="Clear plain-English explanation for customer..."
                  />
                </div>

                {/* Internal Investigator Notes (Hidden from Customer) */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center space-x-1">
                      <Lock className="h-3 w-3 text-amber-400" />
                      <span>Internal Investigator Notes:</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">Confidential (Hidden)</span>
                  </div>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-amber-900/60 rounded-lg p-2.5 text-amber-200/90 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-[11px]"
                    placeholder="Internal audit notes, AML case tags, officer remarks..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-700 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 text-xs text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Result & Notify Customer</span>
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
