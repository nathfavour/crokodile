'use client';

import * as React from 'react';
import { Container, Grid, Box, Typography, alpha } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <DashboardHeader error={error} onRefresh={fetchTransactions} />

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {error && (
          <Box 
            sx={{ 
              mb: 4, 
              p: 2, 
              borderRadius: 2, 
              border: '1px solid rgba(255, 0, 0, 0.2)', 
              bgcolor: alpha('#ff0000', 0.05),
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', boxShadow: '0 0 10px #ff0000' }} />
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.05em' }}>
              SYSTEM_ALERT: {error.toUpperCase()}
            </Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          <StatsCards transactions={transactions} />

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ height: '600px' }}>
              <ActivityFeed transactions={transactions} loading={loading} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: '600px' }}>
              <PolicyPanel transactions={transactions} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.15)', fontWeight: 600, letterSpacing: '0.1em' }}>
            © 2026 CROKODILE SECURE PROTOCOL • X402_COMPLIANT_NODE
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
