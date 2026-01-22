'use client';

import * as React from 'react';
import { Grid2 as Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  Security as PolicyIcon,
  Receipt as TransactionIcon 
} from '@mui/icons-material';
import { Transaction } from '@/app/types';

interface StatsCardsProps {
  transactions: Transaction[];
}

export default function StatsCards({ transactions }: StatsCardsProps) {
  const totalSettled = transactions
    .filter(t => t.status === 'success')
    .length * 0.01;

  const stats = [
    { 
      label: 'Total Settled', 
      value: `$${totalSettled.toFixed(2)}`, 
      icon: <TransactionIcon color="primary" /> 
    },
    { 
      label: 'USDC Balance', 
      value: '2,450.00', 
      icon: <WalletIcon color="secondary" /> 
    },
    { 
      label: 'Active Policies', 
      value: '1', 
      icon: <PolicyIcon color="info" /> 
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
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
    </>
  );
}
