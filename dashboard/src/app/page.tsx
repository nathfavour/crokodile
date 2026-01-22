'use client';

import * as React from 'react';
import { Container, Grid, Box } from '@mui/material';
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import ActivityFeed from '@/components/ActivityFeed';
import PolicyPanel from '@/components/PolicyPanel';
import { Transaction } from './types';

export default function Dashboard() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTransactions = React.useCallback(async () => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);

    try {
      const apiHost = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiHost}/transactions`, { signal: controller.signal });
      
      clearTimeout(id);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Fetch aborted due to timeout');
      } else {
        console.error('Error fetching transactions:', err);
        setError('Connection to engine lost');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader error={error} onRefresh={fetchTransactions} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <StatsCards transactions={transactions} />

          <Grid size={{ xs: 12, md: 8 }}>
            <ActivityFeed transactions={transactions} loading={loading} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PolicyPanel transactions={transactions} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}