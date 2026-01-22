'use client';

import * as React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
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
      icon: <TransactionIcon sx={{ color: '#00ffff' }} /> 
    },
    { 
      label: 'USDC Balance', 
      value: '2,450.00', 
      icon: <WalletIcon sx={{ color: '#00ffff' }} /> 
    },
    { 
      label: 'Active Policies', 
      value: '1', 
      icon: <PolicyIcon sx={{ color: '#00ffff' }} /> 
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
          <Card variant="outlined" sx={{ bgcolor: '#050505', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, p: 1, border: '1px solid rgba(0, 255, 255, 0.2)', bgcolor: 'rgba(0, 255, 255, 0.05)' }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography color="#b0b0b0" variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#00ffff', textShadow: '0 0 5px rgba(0, 255, 255, 0.3)' }}>{stat.value}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
}
