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
  Chip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  Security as PolicyIcon,
  Receipt as TransactionIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

export default function Dashboard() {
  // Mock data for initial render
  const stats = [
    { label: 'Total Settled', value: '$142.50', icon: <TransactionIcon color="primary" /> },
    { label: 'USDC Balance', value: '2,450.00', icon: <WalletIcon color="secondary" /> },
    { label: 'Active Policies', value: '12', icon: <PolicyIcon color="info" /> },
  ];

  const recentTransactions = [
    { id: 1, merchant: 'OpenAI API', amount: '$0.05', status: 'success', time: '2 mins ago' },
    { id: 2, merchant: 'Anthropic Cloud', amount: '$0.12', status: 'success', time: '5 mins ago' },
    { id: 3, merchant: 'Pinecone DB', amount: '$0.01', status: 'error', time: '12 mins ago' },
    { id: 4, merchant: 'Serper.dev', amount: '$0.03', status: 'success', time: '15 mins ago' },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            🐊 <Box component="span" sx={{ ml: 1, color: 'primary.main' }}>CROKODILE</Box>
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
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
            <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Live activity feed</Typography>
                <Chip label="Real-time" size="small" color="primary" variant="outlined" />
              </Box>
              <Divider />
              <List sx={{ p: 0 }}>
                {recentTransactions.map((tx, index) => (
                  <React.Fragment key={tx.id}>
                    <ListItem>
                      <ListItemIcon>
                        {tx.status === 'success' ? <SuccessIcon color="primary" /> : <ErrorIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={tx.merchant} 
                        secondary={tx.time} 
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography fontWeight="bold">{tx.amount}</Typography>
                        <Typography variant="caption" color="text.secondary">USDC</Typography>
                      </Box>
                    </ListItem>
                    {index < recentTransactions.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Policy Overview</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">Global Daily Limit</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, mr: 2 }}>
                    <Box sx={{ width: '65%', height: '100%', bgcolor: 'primary.main', borderRadius: 4 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">65%</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>$65.00 / $100.00 spent today</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>Top Merchants</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label="OpenAI" size="small" />
                <Chip label="Anthropic" size="small" />
                <Chip label="Pinecone" size="small" />
                <Chip label="Google" size="small" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}