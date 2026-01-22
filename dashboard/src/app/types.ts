export interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  status: 'success' | 'error';
  time: string;
  error?: string;
  timestamp?: number;
}
