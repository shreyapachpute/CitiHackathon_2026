import {
  CustomerAccount,
  RecipientPreset,
  RiskRequest,
  Transaction,
  FundFlowNode, 
  FundFlowEdge,
  FraudReport,
  FreezeRequest,
  IdentityLink,
  IdentityLinkConfig,
  LinkTypeKey,
  ScenarioId
} from '../types';

export const SEED_CUSTOMER: CustomerAccount = {
  id: 'ACC-4471-0921',
  name: 'Aarav Mehta',
  customerId: 'CUST-IND-98214',
  accountNumberFormatted: '8853 9945 9962 9942',
  balance: 286450,
  savingsBalance: 286450,
  currentBalance: 2690000,
  riskScore: 14,
  riskLevel: 'Low',
  email: 'aarav.mehta@arthguard.in',
  phone: '+91 98760 43210',
  bankName: 'ArthGuard Digital Banking (Indiranagar Br.)'
};

export const IDENTITY_LINK_CONFIGS: Record<LinkTypeKey, IdentityLinkConfig> = {
  add: { label: 'Address', linkName: 'AddressLink', color: '#ff7b72', stroke: '#b85c00' },
  hom: { label: 'HomePhone', linkName: 'HomePhoneLink', color: '#a371f7', stroke: '#9b1c1c' },
  ssn: { label: 'PAN/Aadhaar', linkName: 'IdentityLink', color: '#f0883e', stroke: '#c19a6b' },
  bus: { label: 'BusPhone', linkName: 'BusPhoneLink', color: '#38bdf8', stroke: '#0284c7' }
};

export const RECIPIENT_PRESETS: RecipientPreset[] = [
  {
    id: 'preset-1',
    accountNumber: 'ACC-7712-3305',
    name: 'Priya Nair (Clean Merchant)',
    bankName: 'Kotak Mahindra Bank',
    category: 'Retail & Office Supplies',
    simulatedRiskLevel: 'Low',
    simulatedRiskScore: 14,
    behaviorNote: 'Established vendor account, 6+ years history, regular retail trade, zero shared identity links.',
    accountAge: '6 Years, 3 Months',
    kycStatus: 'Full Biometric KYC Verified',
    connectedMuleCount: 0
  },
  {
    id: 'preset-2',
    accountNumber: 'ACC-5530-8814',
    name: 'Karan Malhotra (Hidden Identity Ring)',
    bankName: 'Axis Bank',
    category: 'E-commerce Reseller',
    simulatedRiskLevel: 'Medium',
    simulatedRiskScore: 52,
    behaviorNote: 'No prior fraud reports, but shares registered home phone & residential address with flagged mule cluster.',
    accountAge: '5 Months, 12 Days',
    kycStatus: 'Corporate KYC (Re-verification Pending)',
    connectedMuleCount: 2
  },
  {
    id: 'preset-3',
    accountNumber: 'ICIC-00910291',
    name: 'Apex Wealth / CyberLoot Syndicate',
    bankName: 'ICICI Bank',
    category: 'Unregistered Telegram Crypto & FX',
    simulatedRiskLevel: 'Critical',
    simulatedRiskScore: 92,
    behaviorNote: 'Account opened 4 days ago; dormant initial balance, followed by rapid ₹1.2 Cr inflow and instant dispersion to 8 remote mule accounts.',
    accountAge: '4 Days',
    kycStatus: 'Suspicious / Incomplete OTP KYC',
    connectedMuleCount: 6
  },
  {
    id: 'preset-4',
    accountNumber: 'ACC-9081-2246',
    name: 'Rohan Verma (₹1 Cr Layering Hub)',
    bankName: 'HDFC Bank',
    category: 'High-Volume Layering Master Hub',
    simulatedRiskLevel: 'Critical',
    simulatedRiskScore: 96,
    behaviorNote: 'Named in 3 active cyber-fraud cases. 96% of inflow leaves within 2 hours across 10+ accounts. Identity shared with 20+ syndicate nodes.',
    accountAge: '14 Days',
    kycStatus: 'Shell Entity / Impersonated Identity',
    connectedMuleCount: 10
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-IND-2026-90410',
    senderAccountId: 'ACC-4471-0921',
    senderName: 'Aarav Mehta',
    recipientAccountId: 'ACC-7712-3305',
    recipientName: 'Priya Nair (Clean Merchant)',
    amount: 14500,
    description: 'Office Computer Monitor and Peripherals',
    timestamp: '2026-10-21T10:14:00+05:30',
    status: 'COMPLETED',
    riskScore: 14,
    riskLevel: 'Low',
    utr: 'UTR-SBIN-20261021-008129',
    hasFraudReport: false,
    isSimulated: true
  },
  {
    id: 'TXN-IND-2026-90411',
    senderAccountId: 'ACC-4471-0921',
    senderName: 'Aarav Mehta',
    recipientAccountId: 'ACC-5530-8814',
    recipientName: 'Karan Malhotra (Hidden Identity Ring)',
    amount: 45000,
    description: 'Expedited Interstate Freight Logistics',
    timestamp: '2026-10-21T14:32:00+05:30',
    status: 'COMPLETED',
    riskScore: 52,
    riskLevel: 'Medium',
    utr: 'UTR-SBIN-20261021-009418',
    hasFraudReport: false,
    isSimulated: true
  },
  {
    id: 'TXN-IND-2026-90412',
    senderAccountId: 'ACC-4471-0921',
    senderName: 'Aarav Mehta',
    recipientAccountId: 'ICIC-00910291',
    recipientName: 'Apex Wealth / CyberLoot Syndicate',
    amount: 150000,
    description: 'High-Yield Forex Investment Deposit (Telegram Group)',
    timestamp: '2026-10-22T09:15:00+05:30',
    status: 'REPORTED_FRAUD',
    riskScore: 92,
    riskLevel: 'Critical',
    utr: 'UTR-SBIN-20261022-001048',
    hasFraudReport: true,
    fraudCaseId: 'CASE-2026-8812',
    isSimulated: true
  }
];

export const INITIAL_RISK_REQUESTS: RiskRequest[] = [
  {
    id: 'REQ-2026-0041',
    customerAccountId: 'ACC-4471-0921',
    recipientAccountId: 'ICIC-00910291',
    recipientName: 'Apex Wealth / CyberLoot Syndicate',
    amount: 150000,
    description: 'Guaranteed 40% Monthly Return Crypto Plan',
    timestamp: '2026-10-22T09:10:00+05:30',
    status: 'COMPLETED',
    completedAt: '2026-10-22T09:14:00+05:30',
    investigatorId: 'INV-VK-902',
    investigatorName: 'Inspector Vikram Rao',
    riskScore: 92,
    riskLevel: 'Critical',
    explanation: 'Recipient account opened 4 days ago and flagged for abnormal velocity. Rapid fan-out to 4 mule accounts within 180 seconds. High probability of fraudulent investment scam. Transfer cancellation strongly advised.',
    internalNotes: 'Confirmed Tier-1 mule account. Geolocation mismatch in Cambodia. Linked to Telegram syndicate @apex_wealth_fx.',
    recommendedAction: 'CANCEL',
    evidenceSummary: {
      accountAge: '4 Days',
      accountCreationDate: '2026-10-18',
      kycStatus: 'Suspicious Aadhaar OTP KYC',
      inflow24h: 12400000,
      outflow24h: 12150000,
      velocityScore: 94,
      dormancyBreak: true,
      muleProbabilityScore: 92,
      isolationForestAnomaly: 89,
      anomalyFlags: [
        'Dormant account activated with high-value immediate credits',
        'Instant fan-out: 8 outgoing transfers within 180 seconds of credit',
        'Multiple IP geolocations detected across 4 different states in 1 hour',
        'Device fingerprint associated with previously blacklisted syndicate'
      ],
      connectedMuleAccounts: 6,
      geoMismatches: 'SIM circle: Bihar | Login IP: Cambodia VPN | Account Branch: Mumbai'
    }
  },
  {
    id: 'REQ-2026-0042',
    customerAccountId: 'ACC-4471-0921',
    recipientAccountId: 'ACC-9081-2246',
    recipientName: 'Rohan Verma (₹1 Cr Layering Hub)',
    amount: 10000000,
    description: 'Gold Bullion & Syndicate Liquidity Transfer',
    timestamp: '2026-10-22T10:00:00+05:30',
    status: 'COMPLETED',
    completedAt: '2026-10-22T10:05:00+05:30',
    investigatorId: 'INV-VK-902',
    investigatorName: 'Inspector Vikram Rao',
    riskScore: 96,
    riskLevel: 'Critical',
    explanation: 'Known hub in multi-tiered smurfing network. Receives large sums and immediately disperses into micro-layers to defeat AML thresholds. Identity links shared with 20+ accounts.',
    internalNotes: 'Section 91 CrPC alert logged. Suspected Hawala and international crypto offramp.',
    recommendedAction: 'CANCEL',
    evidenceSummary: {
      accountAge: '14 Days',
      accountCreationDate: '2026-10-08',
      kycStatus: 'Impersonated Identity Shell',
      inflow24h: 35000000,
      outflow24h: 34800000,
      velocityScore: 98,
      dormancyBreak: true,
      muleProbabilityScore: 96,
      isolationForestAnomaly: 95,
      anomalyFlags: [
        'Massive layering velocity: ₹1.00 Crore dispersed to 4 sub-mules within 6 minutes',
        'Shares residential address with 3 other flagged accounts',
        'Shares mobile phone number with blacklisted mule network'
      ],
      connectedMuleAccounts: 10,
      geoMismatches: 'SIM circle: Kolkata | IP: Dubai Proxy'
    }
  }
];

export const INITIAL_FRAUD_REPORTS: FraudReport[] = [
  {
    id: 'CASE-2026-8812',
    transactionId: 'TXN-IND-2026-90412',
    customerAccountId: 'ACC-4471-0921',
    customerName: 'Aarav Mehta',
    recipientAccountId: 'ICIC-00910291',
    recipientName: 'Apex Wealth / CyberLoot Syndicate',
    amount: 150000,
    transactionDate: '2026-10-22T09:15:00+05:30',
    reportedAt: '2026-10-22T10:45:00+05:30',
    fraudCategory: 'High-Yield Investment / Telegram Scam',
    description: 'Victim was added to a Telegram channel promising 40% returns on Forex trading. After transferring ₹1,50,000, admin demanded ₹50,000 more for "tax clearance" and deleted the chat history.',
    supportingNotes: 'Attached screenshots of Telegram conversation and fake profit dashboard. The recipient UPI ID was apexwealth.fx@icici.',
    status: 'UNDER_INVESTIGATION',
    investigatorFindings: 'Simulated intelligence indicates the recipient account ICIC-00910291 is a Tier-1 mule account. Received ₹1.5L and dispersed to 4 sub-accounts within 12 minutes.',
    associatedFreezeRequestId: 'FRZ-REQ-2026-0042'
  }
];

export const INITIAL_FREEZE_REQUESTS: FreezeRequest[] = [
  {
    id: 'FRZ-REQ-2026-0042',
    caseId: 'CASE-2026-8812',
    targetAccountId: 'ICIC-00910291',
    targetAccountName: 'Apex Wealth / CyberLoot Syndicate',
    targetBank: 'ICICI Bank',
    freezeType: 'TOTAL_DEBIT_FREEZE',
    freezeAmount: 150000,
    reason: 'Active Cyber-fraud recipient account in multi-victim investment scam',
    justification: 'Immediate debit freeze requested under Section 91 CrPC / IT Act simulated provisions to prevent remaining balance dissipation. Multiple victim reports linked.',
    requestedBy: 'Inspector Vikram Rao (Lead Cyber Fraud Investigator)',
    requestedAt: '2026-10-22T11:10:00+05:30',
    status: 'PENDING_BANK_AUTHORIZATION',
    disclaimer: 'SIMULATED ACTION ONLY — Prototype does not execute real banking account holds. Requires designated nodal bank officer authorization.'
  }
];

// Graph 1: Fund-Flow Nodes for All Scenarios
export const SEED_GRAPH_NODES: FundFlowNode[] = [
  {
    id: 'ACC-4471-0921',
    label: 'Aarav Mehta',
    ownerName: 'Aarav Mehta (Customer)',
    type: 'CUSTOMER',
    riskLevel: 'Low',
    riskScore: 14,
    balance: 286450,
    flagged: false,
    status: 'ACTIVE',
    bank: 'ArthGuard Digital Bank',
    location: 'Bangalore, KA',
    layer: 0,
    details: {
      accountAge: '5 Years',
      kycStatus: 'Verified Citizen KYC',
      totalInflow: 1850000,
      totalOutflow: 1005000,
      associatedCases: []
    }
  },
  {
    id: 'ICIC-00910291',
    label: 'Apex Wealth Hub',
    ownerName: 'Apex Wealth Syndicate (Tier-1 Mule)',
    type: 'RECIPIENT',
    riskLevel: 'Critical',
    riskScore: 92,
    balance: 82000,
    flagged: true,
    status: 'FREEZE_PENDING',
    bank: 'ICICI Bank',
    location: 'Mumbai, MH',
    layer: 1,
    details: {
      accountAge: '4 Days',
      kycStatus: 'Flagged Aadhaar Impersonation',
      totalInflow: 12400000,
      totalOutflow: 12318000,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'ACC-9081-2246',
    label: 'Rohan Verma Hub',
    ownerName: 'Rohan Verma (₹1 Cr Layering Master)',
    type: 'MULE',
    riskLevel: 'Critical',
    riskScore: 96,
    balance: 145000,
    flagged: true,
    status: 'FLAGGED',
    bank: 'HDFC Bank',
    location: 'Kolkata, WB',
    layer: 1,
    details: {
      accountAge: '14 Days',
      kycStatus: 'Shell Entity Corporate KYC',
      totalInflow: 10000000,
      totalOutflow: 9855000,
      associatedCases: ['CASE-2026-8740']
    }
  },
  {
    id: 'ACC-5530-8814',
    label: 'Karan Malhotra',
    ownerName: 'Karan Malhotra (Hidden Identity Ring)',
    type: 'RECIPIENT',
    riskLevel: 'Medium',
    riskScore: 52,
    balance: 95000,
    flagged: false,
    status: 'ACTIVE',
    bank: 'Axis Bank',
    location: 'Delhi, DL',
    layer: 1,
    details: {
      accountAge: '5 Months',
      kycStatus: 'Re-verification Pending',
      totalInflow: 450000,
      totalOutflow: 355000,
      associatedCases: []
    }
  },
  {
    id: 'ACC-7712-3305',
    label: 'Priya Nair',
    ownerName: 'Priya Nair (Verified Merchant)',
    type: 'RECIPIENT',
    riskLevel: 'Low',
    riskScore: 14,
    balance: 420000,
    flagged: false,
    status: 'ACTIVE',
    bank: 'Kotak Mahindra Bank',
    location: 'Chennai, TN',
    layer: 1,
    details: {
      accountAge: '6 Years',
      kycStatus: 'Verified Biometric KYC',
      totalInflow: 850000,
      totalOutflow: 430000,
      associatedCases: []
    }
  },
  {
    id: 'MULE-HDFC-9101',
    label: 'Ramesh K. (Mule 1)',
    ownerName: 'Ramesh Kumar (Recruited Student Mule)',
    type: 'MULE',
    riskLevel: 'High',
    riskScore: 84,
    balance: 12400,
    flagged: true,
    status: 'FLAGGED',
    bank: 'HDFC Bank',
    location: 'Patna, BR',
    layer: 2,
    details: {
      accountAge: '28 Days',
      kycStatus: 'Student Account Bypassed',
      totalInflow: 2500000,
      totalOutflow: 2487600,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'MULE-AXIS-9102',
    label: 'Sita Ram (Mule 2)',
    ownerName: 'Sita Ram Traders (Fake GSTIN)',
    type: 'MULE',
    riskLevel: 'High',
    riskScore: 88,
    balance: 24500,
    flagged: true,
    status: 'FLAGGED',
    bank: 'Axis Bank',
    location: 'Surat, GJ',
    layer: 2,
    details: {
      accountAge: '18 Days',
      kycStatus: 'Fake Proprietorship Certificate',
      totalInflow: 2500000,
      totalOutflow: 2475500,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'MULE-PUNB-9103',
    label: 'Nexus Shell (Mule 3)',
    ownerName: 'Nexus Digital Media Shell Co.',
    type: 'MULE',
    riskLevel: 'Critical',
    riskScore: 91,
    balance: 18900,
    flagged: true,
    status: 'FLAGGED',
    bank: 'Punjab National Bank',
    location: 'Ranchi, JH',
    layer: 2,
    details: {
      accountAge: '12 Days',
      kycStatus: 'Forged Rent Agreement',
      totalInflow: 2500000,
      totalOutflow: 2481100,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'MULE-KOTK-9104',
    label: 'Vikram Ent. (Mule 4)',
    ownerName: 'Vikram Enterprises (Layering Node)',
    type: 'MULE',
    riskLevel: 'High',
    riskScore: 86,
    balance: 31200,
    flagged: true,
    status: 'FLAGGED',
    bank: 'Kotak Mahindra Bank',
    location: 'Jaipur, RJ',
    layer: 2,
    details: {
      accountAge: '21 Days',
      kycStatus: 'Dormant Reactivated',
      totalInflow: 2500000,
      totalOutflow: 2468800,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'CASH-ATM-DELHI-09',
    label: 'Karol Bagh ATM Hub',
    ownerName: 'Cash Dispenser Cluster (Multiple ATM Cards)',
    type: 'CASHOUT',
    riskLevel: 'Critical',
    riskScore: 98,
    balance: 0,
    flagged: true,
    status: 'FLAGGED',
    bank: 'Multi-Bank ATM Network',
    location: 'Karol Bagh, New Delhi',
    layer: 3,
    details: {
      accountAge: 'N/A',
      kycStatus: 'Physical Debit Card Smurfing',
      totalInflow: 2000000,
      totalOutflow: 2000000,
      associatedCases: ['CASE-2026-8812']
    }
  },
  {
    id: 'CRYPTO-BIN-P2P-88',
    label: 'USDT P2P OTC Desk',
    ownerName: 'Overseas Hawala / Crypto Offramp Desk',
    type: 'CRYPTO',
    riskLevel: 'Critical',
    riskScore: 99,
    balance: 0,
    flagged: true,
    status: 'FLAGGED',
    bank: 'Offshore Exchange Wallet',
    location: 'Offshore / Distributed P2P',
    layer: 3,
    details: {
      accountAge: 'N/A',
      kycStatus: 'Unregulated Foreign VASP',
      totalInflow: 4000000,
      totalOutflow: 4000000,
      associatedCases: ['CASE-2026-8812']
    }
  }
];

// Graph 1: Fund-Flow Edges
export const SEED_GRAPH_EDGES: FundFlowEdge[] = [
  // Scenario 1: ₹1.00 Crore Master Layering Transfer
  {
    id: 'edge-cr-1',
    source: 'ACC-4471-0921',
    target: 'ACC-9081-2246',
    amount: 10000000,
    timestamp: '2026-10-22 10:00',
    transactionId: 'TXN-IND-2026-90100',
    status: 'FLAGGED',
    hop: 1,
    description: '₹1.00 Crore Master Layering Transfer'
  },
  {
    id: 'edge-cr-m1',
    source: 'ACC-9081-2246',
    target: 'MULE-HDFC-9101',
    amount: 2500000,
    timestamp: '2026-10-22 10:04',
    transactionId: 'TXN-MULE-2026-01',
    status: 'FLAGGED',
    hop: 2,
    description: 'Layering Hop 1: Fan-out ₹25 Lakh'
  },
  {
    id: 'edge-cr-m2',
    source: 'ACC-9081-2246',
    target: 'MULE-AXIS-9102',
    amount: 2500000,
    timestamp: '2026-10-22 10:05',
    transactionId: 'TXN-MULE-2026-02',
    status: 'FLAGGED',
    hop: 2,
    description: 'Layering Hop 1: Fan-out ₹25 Lakh'
  },
  {
    id: 'edge-cr-m3',
    source: 'ACC-9081-2246',
    target: 'MULE-PUNB-9103',
    amount: 2500000,
    timestamp: '2026-10-22 10:06',
    transactionId: 'TXN-MULE-2026-03',
    status: 'FLAGGED',
    hop: 2,
    description: 'Layering Hop 1: Fan-out ₹25 Lakh'
  },
  {
    id: 'edge-cr-m4',
    source: 'ACC-9081-2246',
    target: 'MULE-KOTK-9104',
    amount: 2500000,
    timestamp: '2026-10-22 10:08',
    transactionId: 'TXN-MULE-2026-04',
    status: 'FLAGGED',
    hop: 2,
    description: 'Layering Hop 1: Fan-out ₹25 Lakh'
  },
  // Scenario 2: Telegram Scam Deposit & Split
  {
    id: 'edge-1',
    source: 'ACC-4471-0921',
    target: 'ICIC-00910291',
    amount: 150000,
    timestamp: '2026-10-22 09:15',
    transactionId: 'TXN-IND-2026-90412',
    status: 'FLAGGED',
    hop: 1,
    description: 'Initial customer fraud deposit (₹1.5 Lakh)'
  },
  {
    id: 'edge-2',
    source: 'ICIC-00910291',
    target: 'MULE-HDFC-9101',
    amount: 75000,
    timestamp: '2026-10-22 09:22',
    transactionId: 'TXN-MULE-2026-11',
    status: 'FLAGGED',
    hop: 2,
    description: 'Split transfer 1'
  },
  {
    id: 'edge-3',
    source: 'ICIC-00910291',
    target: 'MULE-AXIS-9102',
    amount: 65000,
    timestamp: '2026-10-22 09:24',
    transactionId: 'TXN-MULE-2026-12',
    status: 'FLAGGED',
    hop: 2,
    description: 'Split transfer 2'
  },
  // Hop 3: From Mules to Cashout & Crypto
  {
    id: 'edge-4',
    source: 'MULE-HDFC-9101',
    target: 'CASH-ATM-DELHI-09',
    amount: 1000000,
    timestamp: '2026-10-22 10:45',
    transactionId: 'TXN-CASHOUT-01',
    status: 'FLAGGED',
    hop: 3,
    description: 'Physical ATM Cashout in Karol Bagh'
  },
  {
    id: 'edge-5',
    source: 'MULE-AXIS-9102',
    target: 'CASH-ATM-DELHI-09',
    amount: 1000000,
    timestamp: '2026-10-22 10:50',
    transactionId: 'TXN-CASHOUT-02',
    status: 'FLAGGED',
    hop: 3,
    description: 'Physical ATM Cashout in Karol Bagh'
  },
  {
    id: 'edge-6',
    source: 'MULE-PUNB-9103',
    target: 'CRYPTO-BIN-P2P-88',
    amount: 2000000,
    timestamp: '2026-10-22 11:15',
    transactionId: 'TXN-CRYPTO-01',
    status: 'FLAGGED',
    hop: 3,
    description: 'Instant conversion to USDT via P2P OTC Desk'
  },
  {
    id: 'edge-7',
    source: 'MULE-KOTK-9104',
    target: 'CRYPTO-BIN-P2P-88',
    amount: 2000000,
    timestamp: '2026-10-22 11:18',
    transactionId: 'TXN-CRYPTO-02',
    status: 'FLAGGED',
    hop: 3,
    description: 'Instant conversion to USDT via P2P OTC Desk'
  },
  // Scenario 3: Hidden link payment
  {
    id: 'edge-karan-1',
    source: 'ACC-4471-0921',
    target: 'ACC-5530-8814',
    amount: 45000,
    timestamp: '2026-10-21 14:32',
    transactionId: 'TXN-IND-2026-90411',
    status: 'COMPLETED',
    hop: 1,
    description: 'Logistics service payment'
  },
  // Scenario 4: Clean payment
  {
    id: 'edge-priya-1',
    source: 'ACC-4471-0921',
    target: 'ACC-7712-3305',
    amount: 14500,
    timestamp: '2026-10-21 10:14',
    transactionId: 'TXN-IND-2026-90410',
    status: 'COMPLETED',
    hop: 1,
    description: 'Retail office supplies'
  }
];

// Graph 2: Identity Links Network (Shared address, phone, ssn, bus phone)
export const SEED_IDENTITY_LINKS: IdentityLink[] = [
  // Ring core accounts
  { account: 'ACC-9081-2246', type: 'add', value: 'Flat 402, Lotus Tower, Kolkata' },
  { account: 'ACC-9081-2246', type: 'hom', value: '+91 98204-71416' },
  { account: 'ACC-9081-2246', type: 'ssn', value: 'ABCDP6439E' },
  { account: 'ACC-9081-2246', type: 'bus', value: '+91 033-5029698' },

  { account: 'ACC-6641-7020', type: 'add', value: '44/2 MG Road, Ranchi' },
  { account: 'ACC-6641-7020', type: 'hom', value: '+91 98204-66203' },
  { account: 'ACC-6641-7020', type: 'ssn', value: 'XYZPK8153M' },
  { account: 'ACC-6641-7020', type: 'bus', value: '+91 033-5029698' },

  { account: 'ACC-3392-1175', type: 'add', value: 'Flat 402, Lotus Tower, Kolkata' },
  { account: 'ACC-3392-1175', type: 'hom', value: '+91 98204-71416' },
  { account: 'ACC-3392-1175', type: 'ssn', value: 'ABCDP6439E' },

  { account: 'ACC-8820-5513', type: 'add', value: '12 Sector 4, Bokaro' },
  { account: 'ACC-8820-5513', type: 'hom', value: '+91 98204-66203' },
  { account: 'ACC-8820-5513', type: 'ssn', value: 'XYZPK8153M' },

  { account: 'ACC-2205-6670', type: 'add', value: 'Flat 402, Lotus Tower, Kolkata' },
  { account: 'ACC-2205-6670', type: 'hom', value: '+91 98204-71416' },

  // Karan Malhotra (Hidden link: shares home phone & address with the ring!)
  { account: 'ACC-5530-8814', type: 'hom', value: '+91 98204-66203' },
  { account: 'ACC-5530-8814', type: 'add', value: '12 Sector 4, Bokaro' },
  { account: 'ACC-5530-8814', type: 'ssn', value: 'KMALP5521R' },

  // Apex Wealth Syndicate
  { account: 'ICIC-00910291', type: 'hom', value: '+91 98204-66203' },
  { account: 'ICIC-00910291', type: 'add', value: '44/2 MG Road, Ranchi' },
  { account: 'ICIC-00910291', type: 'bus', value: '+91 033-5029698' },

  // Priya Nair (Clean: unique independent identities)
  { account: 'ACC-7712-3305', type: 'ssn', value: 'PNAIR7712K' },
  { account: 'ACC-7712-3305', type: 'hom', value: '+91 91203-31044' },
  { account: 'ACC-7712-3305', type: 'add', value: 'Plot 88, Anna Nagar, Chennai' },

  // Customer Aarav Mehta
  { account: 'ACC-4471-0921', type: 'ssn', value: 'AMEHT4471N' },
  { account: 'ACC-4471-0921', type: 'hom', value: '+91 98760-43210' },
  { account: 'ACC-4471-0921', type: 'add', value: '14 Indiranagar, Bangalore' }
];

// Helper to expand identity links with additional simulated accounts for realistic cluster density
for (let i = 1; i <= 15; i++) {
  const accId = `ACC-31${i * 12}-44${i * 19}`;
  SEED_IDENTITY_LINKS.push(
    { account: accId, type: i % 2 === 0 ? 'add' : 'hom', value: i % 2 === 0 ? 'Flat 402, Lotus Tower, Kolkata' : '+91 98204-66203' },
    { account: accId, type: 'ssn', value: i % 3 === 0 ? 'ABCDP6439E' : `SIMID${i * 881}` }
  );
}
