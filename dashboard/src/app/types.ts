export interface Transaction {
  id: string;
  timestamp: string;
  agentId: string;
  merchantDomain: string;
  merchant?: string; // Optional to handle different data sources
  amount: number | string;
  currency: string;
  status: 'SETTLED' | 'PENDING' | 'FAILED' | 'success' | 'error';
  hash: string;
  time?: string;
  error?: string;
  reasoning?: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'EDITING';
  dailyBudget: number;
  currentSpend: number;
  allowedDomains: string[];
}

export type ViewType = 'DASHBOARD' | 'AUDIT' | 'POLICY' | 'LEDGER' | 'SYSTEM';