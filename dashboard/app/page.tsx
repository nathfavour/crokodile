'use client';

import * as React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Badge,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  AccountBalanceWallet as WalletIcon,
  Security as PolicyIcon,
  Receipt as TransactionIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  status: 'success' | 'error';
  time: string;
  error?: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError('Connection to engine lost');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Settled', value: `$${(transactions.filter(t => t.status === 'success').length * 0.01).toFixed(2)}`, icon: <TransactionIcon color="primary" /> },
    { label: 'USDC Balance', value: '2,450.00', icon: <WalletIcon color="secondary" /> },
    { label: 'Active Policies', value: '1', icon: <PolicyIcon color="info" /> },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            🐊 <Box component="span" sx={{ ml: 1, color: 'primary.main' }}>CROKODILE</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Typography variant="caption" sx={{ color: error ? 'error.main' : 'success.main', mr: 1 }}>
              {error ? 'DISCONNECTED' : 'ENGINE ONLINE'}
            </Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: error ? 'error.main' : 'success.main' }} />
          </Box>
          <IconButton color="inherit" onClick={fetchTransactions}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          {stats.map((stat) => (
            <Grid item xs={12} md={4} key={stat.label}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                    <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Main Feed */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden', minHeight: 400 }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Live activity feed</Typography>
                <Chip label="Real-time" size="small" color="primary" variant="outlined" />
              </Box>
              <Divider />
              {loading && transactions.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : transactions.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No transactions intercepted yet.</Typography>
                  <Typography variant="caption" color="text.secondary">Run `make run CMD="..."` to see activity.</Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {transactions.map((tx, index) => (
                    <React.Fragment key={tx.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemIcon>
                          {tx.status === 'success' ? <SuccessIcon color="primary" /> : <ErrorIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography fontWeight="bold">{tx.merchant}</Typography>}
                          secondary={
                            <Box component="span">
                              <Typography component="span" variant="caption" sx={{ display: 'block' }}>{tx.time}</Typography>
                              {tx.error && <Typography component="span" variant="caption" color="error">{tx.error}</Typography>}
                            </Box>
                          } 
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography fontWeight="bold" color={tx.status === 'error' ? 'error.main' : 'inherit'}>
                            {tx.amount}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">USDC</Typography>
                        </Box>
                      </ListItem>
                      {index < transactions.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Local Policy</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">Daily Budget</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, mr: 2 }}>
                    <Box sx={{ 
                      width: `${Math.min(100, (transactions.filter(t => t.status === 'success').length * 0.01 / 100) * 100)}%`, 
                      height: '100%', 
                      bgcolor: 'primary.main', 
                      borderRadius: 4 
                    }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.min(100, (transactions.filter(t => t.status === 'success').length * 0.01 / 100) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  ${(transactions.filter(t => t.status === 'success').length * 0.01).toFixed(2)} / $100.00 limit
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>Agent Signature</Typography>
              <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  local-agent-001
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
