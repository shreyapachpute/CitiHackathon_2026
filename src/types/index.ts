export type UserRole = 'CUSTOMER' | 'INVESTIGATOR' | 'SELECTION';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ScenarioId = 'ONE_CRORE' | 'TELEGRAM_SCAM' | 'SMURFING_RING' | 'CLEAN_PAYMENT';

export interface CustomerAccount {
  id: string;
  name: string;
  customerId: string;
  accountNumberFormatted: string;
  balance: number;
  savingsBalance: number;
  currentBalance: number;
  riskScore: number;
  riskLevel: RiskLevel;
  email: string;
  phone: string;
  bankName: string;
}
 
export interface RecipientPreset {
  id: string;
  accountNumber: string;
  name: string;
  bankName: string;
  category: string;
  simulatedRiskLevel: RiskLevel;
  simulatedRiskScore: number;
  behaviorNote: string;
  accountAge: string;
  kycStatus: string;
  connectedMuleCount: number;
}

export interface RiskEvidenceSummary {
  accountAge: string;
  accountCreationDate: string;
  kycStatus: string;
  inflow24h: number;
  outflow24h: number;
  velocityScore: number; // 0 - 100
  dormancyBreak: boolean;
  muleProbabilityScore: number; // 0 - 100
  isolationForestAnomaly: number; // 0 - 100
  anomalyFlags: string[];
  connectedMuleAccounts: number;
  geoMismatches: string;
}

export interface RiskRequest {
  id: string;
  customerAccountId: string;
  recipientAccountId: string;
  recipientName: string;
  amount: number;
  description: string;
  timestamp: string;
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED';
  completedAt?: string;
  investigatorId?: string;
  investigatorName?: string;
  riskScore?: number;
  riskLevel?: RiskLevel;
  explanation?: string;
  internalNotes?: string;
  recommendedAction?: 'PROCEED' | 'PROCEED_WITH_CAUTION' | 'CANCEL';
  evidenceSummary: RiskEvidenceSummary;
}

export interface Transaction {
  id: string;
  senderAccountId: string;
  senderName: string;
  recipientAccountId: string;
  recipientName: string;
  amount: number;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'FLAGGED' | 'REPORTED_FRAUD' | 'FROZEN';
  riskScore: number;
  riskLevel: RiskLevel;
  riskRequestId?: string;
  utr: string;
  hasFraudReport: boolean;
  fraudCaseId?: string;
  isSimulated: boolean;
}

export type NodeType = 'CUSTOMER' | 'RECIPIENT' | 'MULE' | 'LAYER_2' | 'CASHOUT' | 'CRYPTO';

export interface FundFlowNode {
  id: string; // Account Number
  label: string;
  ownerName: string;
  type: NodeType;
  riskLevel: RiskLevel;
  riskScore: number;
  balance: number;
  flagged: boolean;
  status: 'ACTIVE' | 'FLAGGED' | 'FREEZE_PENDING' | 'FROZEN';
  bank: string;
  location: string;
  layer: number;
  x?: number;
  y?: number;
  details?: {
    accountAge: string;
    kycStatus: string;
    totalInflow: number;
    totalOutflow: number;
    associatedCases: string[];
  };
}

export interface FundFlowEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
  transactionId: string;
  status: 'COMPLETED' | 'SUSPICIOUS' | 'FLAGGED';
  hop: number;
  description?: string;
}

// Graph 2: Identity Link Network Types
export type LinkTypeKey = 'add' | 'hom' | 'ssn' | 'bus';

export interface IdentityLink {
  account: string;
  type: LinkTypeKey;
  value: string;
}

export interface IdentityLinkConfig {
  label: string;
  linkName: string;
  color: string;
  stroke: string;
}

export interface FraudReport {
  id: string;
  transactionId: string;
  customerAccountId: string;
  customerName: string;
  recipientAccountId: string;
  recipientName: string;
  amount: number;
  transactionDate: string;
  reportedAt: string;
  fraudCategory: string;
  description: string;
  supportingNotes: string;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'FREEZE_REQUESTED' | 'CONFIRMED_FRAUD' | 'RESOLVED';
  investigatorFindings?: string;
  associatedFreezeRequestId?: string;
}

export interface FreezeRequest {
  id: string;
  caseId: string;
  targetAccountId: string;
  targetAccountName: string;
  targetBank: string;
  freezeType: 'TOTAL_DEBIT_FREEZE' | 'PARTIAL_LIEN' | 'ACCOUNT_SUSPENSION';
  freezeAmount?: number;
  reason: string;
  justification: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING_BANK_AUTHORIZATION' | 'APPROVED' | 'REJECTED';
  decisionTimestamp?: string;
  approvingAuthority?: string;
  disclaimer: string;
}  
