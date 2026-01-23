export interface Transaction {
  id: string;
  timestamp: string;
  agentId: string;
  merchantDomain: string;
  amount: number;
  currency: string;
  status: 'SETTLED' | 'PENDING' | 'FAILED';
  hash: string;
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