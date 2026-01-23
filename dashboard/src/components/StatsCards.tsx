'use client';

import * as React from 'react';
import { Grid, Card, CardContent, Box, Typography, alpha } from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  Security as PolicyIcon,
  Assessment as StatsIcon 
} from '@mui/icons-material';
import { Transaction } from '@/app/types';

interface StatsCardsProps {
  transactions: Transaction[];
}

export default function StatsCards({ transactions }: StatsCardsProps) {
  const totalSettled = transactions
    .filter(t => t.status === 'SETTLED' || t.status === 'success')
    .length * 0.01;

  const stats = [
    { 
      label: 'TOTAL_SETTLED', 
      value: `$${totalSettled.toFixed(2)}`, 
      subValue: 'Last 24h',
      icon: <StatsIcon fontSize="small" />,
      color: '#00ffff'
    },
    { 
      label: 'USDC_RESERVE', 
      value: '2,450.00', 
      subValue: 'Main Wallet',
      icon: <WalletIcon fontSize="small" />,
      color: '#ffffff'
    },
    { 
      label: 'ACTIVE_POLICIES', 
      value: '01', 
      subValue: 'System Wide',
      icon: <PolicyIcon fontSize="small" />,
      color: '#00ffff'
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: stat.color,
                opacity: 0.5
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(stat.color, 0.1), 
                    color: stat.color,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 700, 
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem'
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
              
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800, 
                    color: '#fff', 
                    mb: 0.5,
                    fontFamily: 'var(--font-geist-mono), monospace'
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.4)', 
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                >
                  {stat.subValue}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
}