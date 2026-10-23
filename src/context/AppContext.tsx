import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserRole,
  CustomerAccount,
  RiskRequest,
  Transaction,
  FundFlowNode,
  FundFlowEdge,
  FraudReport,
  FreezeRequest,
  RiskLevel,
  RiskEvidenceSummary,
  IdentityLink,
  ScenarioId
} from '../types';
import {
  SEED_CUSTOMER,
  INITIAL_TRANSACTIONS,
  INITIAL_RISK_REQUESTS,
  INITIAL_FRAUD_REPORTS,
  INITIAL_FREEZE_REQUESTS,
  SEED_GRAPH_NODES,
  SEED_GRAPH_EDGES,
  SEED_IDENTITY_LINKS,
  RECIPIENT_PRESETS
} from '../data/seedData';

interface AppState {
  currentRole: UserRole;
  activeSidebarTab: string;
  activeScenario: ScenarioId;
  customer: CustomerAccount;
  transactions: Transaction[];
  riskRequests: RiskRequest[];
  fraudReports: FraudReport[];
  freezeRequests: FreezeRequest[];
  graphNodes: FundFlowNode[];
  graphEdges: FundFlowEdge[];
  identityLinks: IdentityLink[];
  activeRequestId: string | null;
  activeCaseId: string | null;
  selectedGraphNodeId: string | null;
  selectedIdentityNodeId: string | null;
  notification: { message: string; type: 'info' | 'success' | 'warning' | 'danger' } | null;
}

interface AppContextType extends AppState {
  setRole: (role: UserRole) => void;
  setActiveSidebarTab: (tab: string) => void;
  setActiveScenario: (scenario: ScenarioId) => void;
  setActiveRequestId: (id: string | null) => void;
  setActiveCaseId: (id: string | null) => void;
  setSelectedGraphNodeId: (id: string | null) => void;
  setSelectedIdentityNodeId: (id: string | null) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  clearNotification: () => void;
  createPayment: (data: {
    recipientAccountId: string;
    recipientName: string;
    amount: number;
    description: string;
    riskScore?: number;
    riskLevel?: RiskLevel;
    riskRequestId?: string;
  }) => { transactionId: string; utr: string };
  submitFraudReport: (data: {
    transactionId: string;
    fraudCategory: string;
    description: string;
    supportingNotes: string;
  }) => string;
  updateFraudCase: (caseId: string, updates: Partial<FraudReport>) => void;
  submitFreezeRequest: (data: {
    caseId: string;
    targetAccountId: string;
    targetAccountName: string;
    targetBank: string;
    freezeType: 'TOTAL_DEBIT_FREEZE' | 'PARTIAL_LIEN' | 'ACCOUNT_SUSPENSION';
    freezeAmount?: number;
    reason: string;
    justification: string;
    requestedBy: string;
  }) => string;
  updateFreezeRequestStatus: (
    freezeId: string,
    status: 'APPROVED' | 'REJECTED',
    authorizer: string
  ) => void;
  submitInvestigatorAssessment: (
    requestId: string,
    data: {
      riskScore: number;
      riskLevel: RiskLevel;
      explanation: string;
      internalNotes: string;
      recommendedAction: 'PROCEED' | 'PROCEED_WITH_CAUTION' | 'CANCEL';
    }
  ) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'arthguard_app_state_v3';
const SYNC_CHANNEL = 'arthguard_channel_v3';

const getInitialState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        currentRole: 'SELECTION',
        activeSidebarTab: 'HOME',
        notification: null,
        activeRequestId: null,
        activeCaseId: null,
        selectedGraphNodeId: null,
        selectedIdentityNodeId: null
      };
    }
  } catch (e) {
    console.error('Error loading initial state:', e);
  }

  return {
    currentRole: 'SELECTION',
    activeSidebarTab: 'HOME',
    activeScenario: 'ONE_CRORE',
    customer: SEED_CUSTOMER,
    transactions: INITIAL_TRANSACTIONS,
    riskRequests: INITIAL_RISK_REQUESTS,
    fraudReports: INITIAL_FRAUD_REPORTS,
    freezeRequests: INITIAL_FREEZE_REQUESTS,
    graphNodes: SEED_GRAPH_NODES,
    graphEdges: SEED_GRAPH_EDGES,
    identityLinks: SEED_IDENTITY_LINKS,
    activeRequestId: null,
    activeCaseId: null,
    selectedGraphNodeId: null,
    selectedIdentityNodeId: null,
    notification: null
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      const toSave = {
        activeScenario: state.activeScenario,
        customer: state.customer,
        transactions: state.transactions,
        riskRequests: state.riskRequests,
        fraudReports: state.fraudReports,
        freezeRequests: state.freezeRequests,
        graphNodes: state.graphNodes,
        graphEdges: state.graphEdges,
        identityLinks: state.identityLinks
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

      // Broadcast to other tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(SYNC_CHANNEL);
        channel.postMessage({ type: 'SYNC_STATE', payload: toSave });
        channel.close();
      }
    } catch (e) {
      console.error('Error syncing state to storage:', e);
    }
  }, [
    state.activeScenario,
    state.customer,
    state.transactions,
    state.riskRequests,
    state.fraudReports,
    state.freezeRequests,
    state.graphNodes,
    state.graphEdges,
    state.identityLinks
  ]);

  // Listen for storage / broadcast events across tabs
  useEffect(() => {
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_STATE' && event.data.payload) {
        setState(prev => ({
          ...prev,
          customer: event.data.payload.customer ?? prev.customer,
          transactions: event.data.payload.transactions ?? prev.transactions,
          riskRequests: event.data.payload.riskRequests ?? prev.riskRequests,
          fraudReports: event.data.payload.fraudReports ?? prev.fraudReports,
          freezeRequests: event.data.payload.freezeRequests ?? prev.freezeRequests,
          graphNodes: event.data.payload.graphNodes ?? prev.graphNodes,
          graphEdges: event.data.payload.graphEdges ?? prev.graphEdges,
          identityLinks: event.data.payload.identityLinks ?? prev.identityLinks,
          activeScenario: event.data.payload.activeScenario ?? prev.activeScenario
        }));
      }
    };

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = handleBroadcast;
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(prev => ({
            ...prev,
            customer: parsed.customer ?? prev.customer,
            transactions: parsed.transactions ?? prev.transactions,
            riskRequests: parsed.riskRequests ?? prev.riskRequests,
            fraudReports: parsed.fraudReports ?? prev.fraudReports,
            freezeRequests: parsed.freezeRequests ?? prev.freezeRequests,
            graphNodes: parsed.graphNodes ?? prev.graphNodes,
            graphEdges: parsed.graphEdges ?? prev.graphEdges,
            identityLinks: parsed.identityLinks ?? prev.identityLinks,
            activeScenario: parsed.activeScenario ?? prev.activeScenario
          }));
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const showNotification = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
      setState(prev => ({ ...prev, notification: { message, type } }));
      setTimeout(() => {
        setState(prev => (prev.notification?.message === message ? { ...prev, notification: null } : prev));
      }, 5000);
    },
    []
  );

  const clearNotification = useCallback(() => {
    setState(prev => ({ ...prev, notification: null }));
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setState(prev => ({
      ...prev,
      currentRole: role,
      activeSidebarTab: role === 'INVESTIGATOR' ? 'OVERVIEW' : 'HOME',
      activeRequestId: null,
      activeCaseId: null,
      selectedGraphNodeId: null,
      selectedIdentityNodeId: null
    }));
  }, []);

  const setActiveSidebarTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeSidebarTab: tab }));
  }, []);

  const setActiveScenario = useCallback(
    (scenario: ScenarioId) => {
      setState(prev => {
        let selectedNode = 'ACC-9081-2246';
        if (scenario === 'TELEGRAM_SCAM') selectedNode = 'ICIC-00910291';
        if (scenario === 'SMURFING_RING') selectedNode = 'ACC-5530-8814';
        if (scenario === 'CLEAN_PAYMENT') selectedNode = 'ACC-7712-3305';

        return {
          ...prev,
          activeScenario: scenario,
          selectedGraphNodeId: selectedNode,
          selectedIdentityNodeId: selectedNode
        };
      });

      const labelMap = {
        ONE_CRORE: '₹1.00 Crore Layering Syndicate Fan-Out Hub',
        TELEGRAM_SCAM: 'Telegram Investment Cyber-Fraud Trail',
        SMURFING_RING: 'Hidden Identity Links & Smurfing Ring',
        CLEAN_PAYMENT: 'Clean Verified Merchant Transfer'
      };
      showNotification(`Scenario switched: ${labelMap[scenario]}`, 'info');
    },
    [showNotification]
  );

  const setActiveRequestId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeRequestId: id }));
  }, []);

  const setActiveCaseId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeCaseId: id }));
  }, []);

  const setSelectedGraphNodeId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedGraphNodeId: id }));
  }, []);

  const setSelectedIdentityNodeId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedIdentityNodeId: id }));
  }, []);

  const createPayment = useCallback(
    (data: {
      recipientAccountId: string;
      recipientName: string;
      amount: number;
      description: string;
      riskScore?: number;
      riskLevel?: RiskLevel;
      riskRequestId?: string;
    }): { transactionId: string; utr: string } => {
      const txnId = `TXN-IND-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const utr = `UTR-AG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTxn: Transaction = {
        id: txnId,
        senderAccountId: state.customer.id,
        senderName: state.customer.name,
        recipientAccountId: data.recipientAccountId,
        recipientName: data.recipientName,
        amount: data.amount,
        description: data.description,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        riskScore: data.riskScore ?? 14,
        riskLevel: data.riskLevel ?? 'Low',
        riskRequestId: data.riskRequestId,
        utr: utr,
        hasFraudReport: false,
        isSimulated: true
      };

      const targetNodeId = data.recipientAccountId;
      const existingTarget = state.graphNodes.find(n => n.id === targetNodeId);

      let updatedNodes = [...state.graphNodes];
      if (!existingTarget) {
        const isHighRisk = (data.riskScore ?? 0) >= 70;
        const newNode: FundFlowNode = {
          id: targetNodeId,
          label: data.recipientName.split(' ')[0] + ' (Recv)',
          ownerName: data.recipientName,
          type: 'RECIPIENT',
          riskLevel: data.riskLevel ?? 'Low',
          riskScore: data.riskScore ?? 14,
          balance: data.amount,
          flagged: isHighRisk,
          status: isHighRisk ? 'FLAGGED' : 'ACTIVE',
          bank: 'Recipient Commercial Bank',
          location: 'India',
          layer: 1,
          details: {
            accountAge: 'Simulated Dynamic Node',
            kycStatus: 'Verified Account',
            totalInflow: data.amount,
            totalOutflow: 0,
            associatedCases: []
          }
        };
        updatedNodes.push(newNode);
      }

      const newEdge: FundFlowEdge = {
        id: `edge-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        source: state.customer.id,
        target: targetNodeId,
        amount: data.amount,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        transactionId: txnId,
        status: (data.riskScore ?? 0) >= 70 ? 'FLAGGED' : 'COMPLETED',
        hop: 1,
        description: data.description
      };

      let extraEdges: FundFlowEdge[] = [];
      if ((data.riskScore ?? 0) >= 70 && data.amount >= 100000) {
        const fanoutAmount = Math.floor(data.amount * 0.45);
        extraEdges.push({
          id: `edge-auto-fan-${Date.now()}-1`,
          source: targetNodeId,
          target: 'MULE-HDFC-9101',
          amount: fanoutAmount,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          transactionId: `TXN-AUTO-MULE-1`,
          status: 'FLAGGED',
          hop: 2,
          description: `Automatic fan-out dispersion: ₹${fanoutAmount}`
        });
        extraEdges.push({
          id: `edge-auto-fan-${Date.now()}-2`,
          source: targetNodeId,
          target: 'MULE-AXIS-9102',
          amount: Math.floor(data.amount * 0.45),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          transactionId: `TXN-AUTO-MULE-2`,
          status: 'FLAGGED',
          hop: 2,
          description: `Automatic fan-out dispersion: ₹${Math.floor(data.amount * 0.45)}`
        });
      }

      setState(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          balance: Math.max(0, prev.customer.balance - data.amount)
        },
        transactions: [newTxn, ...prev.transactions],
        graphNodes: updatedNodes,
        graphEdges: [...prev.graphEdges, newEdge, ...extraEdges]
      }));

      showNotification(`Simulated payment of ₹${data.amount.toLocaleString('en-IN')} completed! (ID: ${txnId})`, 'success');
      return { transactionId: txnId, utr };
    },
    [state.customer, state.graphNodes, showNotification]
  );

  const submitFraudReport = useCallback(
    (data: {
      transactionId: string;
      fraudCategory: string;
      description: string;
      supportingNotes: string;
    }): string => {
      const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const txn = state.transactions.find(t => t.id === data.transactionId);

      const newReport: FraudReport = {
        id: caseId,
        transactionId: data.transactionId,
        customerAccountId: state.customer.id,
        customerName: state.customer.name,
        recipientAccountId: txn ? txn.recipientAccountId : 'UNKNOWN',
        recipientName: txn ? txn.recipientName : 'Unknown Recipient',
        amount: txn ? txn.amount : 0,
        transactionDate: txn ? txn.timestamp : new Date().toISOString(),
        reportedAt: new Date().toISOString(),
        fraudCategory: data.fraudCategory,
        description: data.description,
        supportingNotes: data.supportingNotes,
        status: 'SUBMITTED',
        investigatorFindings: 'Case registered from ArthGuard Customer Portal. Transaction trace initialized.'
      };

      setState(prev => ({
        ...prev,
        fraudReports: [newReport, ...prev.fraudReports],
        transactions: prev.transactions.map(t =>
          t.id === data.transactionId
            ? { ...t, status: 'REPORTED_FRAUD', hasFraudReport: true, fraudCaseId: caseId }
            : t
        )
      }));

      showNotification(`Fraud Case ${caseId} reported! Sent to Bank Investigator Queue.`, 'warning');
      return caseId;
    },
    [state.transactions, state.customer, showNotification]
  );

  const updateFraudCase = useCallback(
    (caseId: string, updates: Partial<FraudReport>) => {
      setState(prev => ({
        ...prev,
        fraudReports: prev.fraudReports.map(c => (c.id === caseId ? { ...c, ...updates } : c))
      }));
      showNotification(`Fraud Case ${caseId} updated successfully.`, 'info');
    },
    [showNotification]
  );

  const submitFreezeRequest = useCallback(
    (data: {
      caseId: string;
      targetAccountId: string;
      targetAccountName: string;
      targetBank: string;
      freezeType: 'TOTAL_DEBIT_FREEZE' | 'PARTIAL_LIEN' | 'ACCOUNT_SUSPENSION';
      freezeAmount?: number;
      reason: string;
      justification: string;
      requestedBy: string;
    }): string => {
      const freezeId = `FRZ-REQ-2026-${Math.floor(100 + Math.random() * 900)}`;

      const newFreeze: FreezeRequest = {
        id: freezeId,
        caseId: data.caseId,
        targetAccountId: data.targetAccountId,
        targetAccountName: data.targetAccountName,
        targetBank: data.targetBank,
        freezeType: data.freezeType,
        freezeAmount: data.freezeAmount,
        reason: data.reason,
        justification: data.justification,
        requestedBy: data.requestedBy,
        requestedAt: new Date().toISOString(),
        status: 'PENDING_BANK_AUTHORIZATION',
        disclaimer:
          'SIMULATED ACTION ONLY — Prototype does not execute real banking account holds. Requires designated nodal bank officer authorization.'
      };

      setState(prev => {
        const updatedCases = prev.fraudReports.map(c =>
          c.id === data.caseId
            ? { ...c, status: 'FREEZE_REQUESTED' as const, associatedFreezeRequestId: freezeId }
            : c
        );

        const updatedNodes = prev.graphNodes.map(node =>
          node.id === data.targetAccountId ? { ...node, status: 'FREEZE_PENDING' as const } : node
        );

        return {
          ...prev,
          freezeRequests: [newFreeze, ...prev.freezeRequests],
          fraudReports: updatedCases,
          graphNodes: updatedNodes
        };
      });

      showNotification(`Account Freeze Request ${freezeId} submitted for Bank Authorization!`, 'warning');
      return freezeId;
    },
    [showNotification]
  );

  const updateFreezeRequestStatus = useCallback(
    (freezeId: string, status: 'APPROVED' | 'REJECTED', authorizer: string) => {
      setState(prev => {
        let targetAccountId = '';
        const updatedFreezes = prev.freezeRequests.map(frz => {
          if (frz.id === freezeId) {
            targetAccountId = frz.targetAccountId;
            return {
              ...frz,
              status,
              decisionTimestamp: new Date().toISOString(),
              approvingAuthority: authorizer
            };
          }
          return frz;
        });

        const updatedNodes = prev.graphNodes.map(node => {
          if (node.id === targetAccountId) {
            return {
              ...node,
              status: status === 'APPROVED' ? ('FROZEN' as const) : ('FLAGGED' as const)
            };
          }
          return node;
        });

        return {
          ...prev,
          freezeRequests: updatedFreezes,
          graphNodes: updatedNodes
        };
      });

      showNotification(
        `Freeze Request ${freezeId} marked as ${status} by ${authorizer}.`,
        status === 'APPROVED' ? 'danger' : 'info'
      );
    },
    [showNotification]
  );

  const submitInvestigatorAssessment = useCallback(
    (
      requestId: string,
      data: {
        riskScore: number;
        riskLevel: RiskLevel;
        explanation: string;
        internalNotes: string;
        recommendedAction: 'PROCEED' | 'PROCEED_WITH_CAUTION' | 'CANCEL';
      }
    ) => {
      setState(prev => {
        const updated = prev.riskRequests.map(req => {
          if (req.id === requestId) {
            return {
              ...req,
              status: 'COMPLETED' as const,
              completedAt: new Date().toISOString(),
              investigatorId: 'INV-VK-902',
              investigatorName: 'Inspector Vikram Rao',
              riskScore: data.riskScore,
              riskLevel: data.riskLevel,
              explanation: data.explanation,
              internalNotes: data.internalNotes,
              recommendedAction: data.recommendedAction
            };
          }
          return req;
        });

        return {
          ...prev,
          riskRequests: updated,
          activeRequestId: null
        };
      });

      showNotification(`Risk Advisory published for ${requestId}. Real-time intelligence updated!`, 'success');
    },
    [showNotification]
  );

  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({
      currentRole: 'CUSTOMER',
      activeSidebarTab: 'HOME',
      activeScenario: 'ONE_CRORE',
      customer: SEED_CUSTOMER,
      transactions: INITIAL_TRANSACTIONS,
      riskRequests: INITIAL_RISK_REQUESTS,
      fraudReports: INITIAL_FRAUD_REPORTS,
      freezeRequests: INITIAL_FREEZE_REQUESTS,
      graphNodes: SEED_GRAPH_NODES,
      graphEdges: SEED_GRAPH_EDGES,
      identityLinks: SEED_IDENTITY_LINKS,
      activeRequestId: null,
      activeCaseId: null,
      selectedGraphNodeId: null,
      selectedIdentityNodeId: null,
      notification: { message: 'ArthGuard demo data reset to default state!', type: 'info' }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        setActiveSidebarTab,
        setActiveScenario,
        setActiveRequestId,
        setActiveCaseId,
        setSelectedGraphNodeId,
        setSelectedIdentityNodeId,
        showNotification,
        clearNotification,
        createPayment,
        submitFraudReport,
        updateFraudCase,
        submitFreezeRequest,
        updateFreezeRequestStatus,
        submitInvestigatorAssessment,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
