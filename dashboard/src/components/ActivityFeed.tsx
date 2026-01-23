'use client';

import * as React from 'react';
import { 
  Paper, Box, Typography, Chip, Divider, List, ListItem, 
  ListItemIcon, ListItemText, CircularProgress, alpha 
} from '@mui/material';
import { 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon,
  Timeline as FeedIcon
} from '@mui/icons-material';
import { Transaction } from '@/app/types';

interface ActivityFeedProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function ActivityFeed({ transactions, loading }: ActivityFeedProps) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FeedIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.2rem' }} />
          <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE_TRANSACTIONS</Typography>
        </Box>
        <Chip 
          label="REALTIME_SYNC" 
          size="small" 
          sx={{ 
            height: 20, 
            fontSize: '0.6rem', 
            fontWeight: 800, 
            bgcolor: alpha('#00ffff', 0.1), 
            color: 'primary.main',
            border: '1px solid rgba(0, 255, 255, 0.2)'
          }} 
        />
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
        {loading && transactions.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={20} sx={{ color: 'primary.main', mb: 2 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>INITIALIZING_STREAMS...</Typography>
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ py: 10, px: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>NO_INTERCEPTIONS_DETECTED</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', mt: 1, display: 'block' }}>Waiting for machine-to-machine traffic...</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 2.5,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } 
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    {tx.status === 'SETTLED' || tx.status === 'success' ? (
                      <Box sx={{ color: 'primary.main', display: 'flex' }}><SuccessIcon sx={{ fontSize: '1.2rem' }} /></Box>
                    ) : (
                      <Box sx={{ color: 'error.main', display: 'flex' }}><ErrorIcon sx={{ fontSize: '1.2rem' }} /></Box>
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                          {tx.merchant}
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: tx.status === 'FAILED' || tx.status === 'error' ? 'error.main' : 'primary.main', fontFamily: 'var(--font-geist-mono)' }}>
                          {tx.amount} <Typography component="span" variant="caption" sx={{ opacity: 0.5 }}>USDC</Typography>
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600 }}>
                          {tx.time} • ID: {tx.id.substring(0, 8)}
                        </Typography>
                        {tx.error && (
                          <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.65rem', fontWeight: 700 }}>
                            {tx.error.toUpperCase()}
                          </Typography>
                        )}
                      </Box>
                    } 
                  />
                </ListItem>
                {index < transactions.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.03)' }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}