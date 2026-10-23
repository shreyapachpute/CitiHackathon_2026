import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';

interface AcceptanceTestGuideProps {
  onClose: () => void;
  onOpenPaymentModal?: () => void;
}

export const AcceptanceTestGuide: React.FC<AcceptanceTestGuideProps> = ({ onClose, onOpenPaymentModal }) => {
  const {
    currentRole,
    setRole,
    riskRequests,
    transactions,
    fraudReports,
    freezeRequests,
    setActiveRequestId,
    setActiveCaseId,
    setSelectedGraphNodeId
  } = useApp();
 
  const completedRiskReq = riskRequests.find(r => r.status === 'COMPLETED');
  const reportedFraudTxn = transactions.find(t => t.hasFraudReport);
  const activeFraudCase = fraudReports.find(f => f.status === 'UNDER_INVESTIGATION' || f.status === 'FREEZE_REQUESTED');

  const steps = [
    {
      num: 1,
      title: 'Log in as a customer',
      desc: 'Access the Customer Portal for Aditi Sharma (SBIN-00291048)',
      isComplete: currentRole === 'CUSTOMER',
      actionLabel: 'Switch to Customer',
      action: () => setRole('CUSTOMER')
    },
    {
      num: 2,
      title: 'View real-time recipient risk assessment',
      desc: 'Open Initiate Payment and select Apex Wealth (ICIC-00910291) to view automated 92/100 risk rating',
      isComplete: true,
      actionLabel: 'Open Payment Form',
      action: () => {
        setRole('CUSTOMER');
        if (onOpenPaymentModal) onOpenPaymentModal();
      }
    },
    {
      num: 3,
      title: 'Switch to the investigator account',
      desc: 'Open ArthGuard Fraud Operations Console for Inspector Vikram Rao',
      isComplete: currentRole === 'INVESTIGATOR',
      actionLabel: 'Switch to Investigator',
      action: () => setRole('INVESTIGATOR')
    },
    {
      num: 4,
      title: 'Open risk alert and inspect behavioral & graph telemetry',
      desc: 'Open flagged risk alert to inspect velocity spikes, GNN mule scores, and connected accounts',
      isComplete: currentRole === 'INVESTIGATOR',
      actionLabel: 'Open Intelligence Workspace',
      action: () => {
        setRole('INVESTIGATOR');
        if (riskRequests[0]) setActiveRequestId(riskRequests[0].id);
      }
    },
    {
      num: 5,
      title: 'Publish risk advisory with clear explanation',
      desc: 'Confirm 92/100 Critical Risk score, review explanation, and publish advisory',
      isComplete: !!completedRiskReq,
      actionLabel: 'Review & Publish',
      action: () => {
        setRole('INVESTIGATOR');
        if (riskRequests[0]) setActiveRequestId(riskRequests[0].id);
      }
    },
    {
      num: 6,
      title: 'Switch back to customer & verify updated advisory',
      desc: 'Customer dashboard reflects latest ArthGuard threat advisory and cancel recommendation',
      isComplete: currentRole === 'CUSTOMER',
      actionLabel: 'Verify as Customer',
      action: () => setRole('CUSTOMER')
    },
    {
      num: 7,
      title: 'Initiate a simulated payment',
      desc: 'Initiate payment with high-risk warning confirmation to test detection and tracing',
      isComplete: transactions.length > 3 || (transactions[0] && transactions[0].isSimulated),
      actionLabel: 'Simulate Payment',
      action: () => {
        setRole('CUSTOMER');
        if (onOpenPaymentModal) onOpenPaymentModal();
      }
    },
    {
      num: 8,
      title: 'Switch to investigator & inspect the transaction',
      desc: 'View newly cleared/simulated payment in Transaction Monitoring & Fund Flow Engine',
      isComplete: currentRole === 'INVESTIGATOR',
      actionLabel: 'Investigator Monitoring',
      action: () => setRole('INVESTIGATOR')
    },
    {
      num: 9,
      title: 'Follow money moving through multiple destination accounts',
      desc: 'Explore the Fund Flow Graph (Customer -> Recipient Hub -> 4 Mule Accounts -> Cashout/Crypto)',
      isComplete: true,
      actionLabel: 'View Fund Trail Graph',
      action: () => {
        setRole('INVESTIGATOR');
        setSelectedGraphNodeId('ICIC-00910291');
      }
    },
    {
      num: 10,
      title: 'Return to customer & report fraud against transaction',
      desc: 'Click "Report Fraud" on the completed transaction to submit an incident case',
      isComplete: !!reportedFraudTxn,
      actionLabel: 'Customer: Report Fraud',
      action: () => setRole('CUSTOMER')
    },
    {
      num: 11,
      title: 'Open fraud case in investigator portal',
      desc: 'Inspector reviews original payment, recipient profile, and links to money trail',
      isComplete: currentRole === 'INVESTIGATOR' && !!activeFraudCase,
      actionLabel: 'Investigator: Open Case',
      action: () => {
        setRole('INVESTIGATOR');
        if (activeFraudCase) setActiveCaseId(activeFraudCase.id);
      }
    },
    {
      num: 12,
      title: 'Inspect money trail & submit simulated account-freeze request',
      desc: 'Submit simulated freeze request for the target mule account requiring bank approval',
      isComplete: freezeRequests.length > 0,
      actionLabel: 'Manage Freeze Requests',
      action: () => {
        setRole('INVESTIGATOR');
        if (activeFraudCase) setActiveCaseId(activeFraudCase.id);
      }
    },
    {
      num: 13,
      title: 'Verify both dashboards display updated statuses',
      desc: 'Case status updated to Freeze Requested / Resolved; Freeze Manager reflects approval state',
      isComplete: freezeRequests.some(f => f.status === 'APPROVED' || f.status === 'PENDING_BANK_AUTHORIZATION'),
      actionLabel: 'Verify All Statuses',
      action: () => setRole('INVESTIGATOR')
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-blue-500/40 text-white p-4 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
            <h3 className="font-bold text-sm text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>ArthGuard End-to-End Workflow</span>
              <span className="text-xs font-normal text-slate-400 font-mono">(13/13 Steps)</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Horizontal Step Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3 max-h-72 overflow-y-auto pr-1">
          {steps.map(step => (
            <div
              key={step.num}
              className={`p-3 rounded-xl border text-xs transition-all ${
                step.isComplete
                  ? 'bg-slate-800/80 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-700/80 text-teal-300">
                  Step {step.num}
                </span>
                {step.isComplete ? (
                  <span className="flex items-center text-emerald-400 font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Passed
                  </span>
                ) : (
                  <span className="flex items-center text-amber-400/80 text-[11px]">
                    <Circle className="h-3.5 w-3.5 mr-1" />
                    Pending
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-slate-100 text-xs line-clamp-1">{step.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{step.desc}</p>

              <button
                onClick={step.action}
                className="mt-2.5 w-full flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 font-medium text-[11px] border border-teal-500/30 transition-colors"
              >
                <span>{step.actionLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
