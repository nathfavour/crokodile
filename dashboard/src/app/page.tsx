'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GavelIcon from '@mui/icons-material/Gavel';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e676',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
  typography: {
    fontFamily: 'monospace',
  },
});

export default function Dashboard() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, pb: 2 }}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            🐊 CROKODILE DASHBOARD
          </Typography>
          <Typography variant="body2" color="text.secondary">
            M2M Economy Real-time Monitoring
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Live Snaps (402 Intercepts)
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="GET https://api.openai.com/v1/chat/completions" 
                    secondary="HTTP 402 PAYMENT REQUIRED"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ color: 'warning.main', variant: 'caption' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="POST https://api.anthropic.com/v1/messages" 
                    secondary="SETTLED (0.005 USDC)"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ color: 'primary.main', variant: 'caption' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', mb: 2 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Wallet Balance</Typography>
              <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
                1,240.50 USDC
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cronos Mainnet (EIP-3009)
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <GavelIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Policy Status</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Reasoning Audit: <Box component="span" sx={{ color: 'primary.main' }}>ACTIVE</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Daily Limit: 50.00 USDC
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}