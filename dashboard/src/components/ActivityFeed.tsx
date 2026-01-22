'use client';

import * as React from 'react';
import { 
  Paper, Box, Typography, Chip, Divider, List, ListItem, 
  ListItemIcon, ListItemText, CircularProgress 
} from '@mui/material';
import { 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon 
} from '@mui/icons-material';
import { Transaction } from '@/app/types';

interface ActivityFeedProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function ActivityFeed({ transactions, loading }: ActivityFeedProps) {
  return (
    <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden', minHeight: 400, bgcolor: '#050505', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 255, 255, 0.1)' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#00ffff', textShadow: '0 0 5px rgba(0, 255, 255, 0.2)', letterSpacing: '0.1em' }}>LIVE_ACTIVITY_FEED</Typography>
        <Chip label="REAL_TIME" size="small" variant="outlined" sx={{ color: '#00ffff', borderColor: '#00ffff', borderRadius: 0, fontSize: '0.7rem' }} />
      </Box>
      {loading && transactions.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} sx={{ color: '#00ffff' }} />
        </Box>
      ) : transactions.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="#b0b0b0" sx={{ fontFamily: 'monospace' }}>NO_INTERCEPTIONS_DETECTED</Typography>
          <Typography variant="caption" color="rgba(0, 255, 255, 0.5)" sx={{ fontFamily: 'monospace', mt: 1, display: 'block' }}>WAITING_FOR_402_TRAFFIC...</Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {transactions.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <ListItem sx={{ py: 2, '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.03)' } }}>
                <ListItemIcon>
                  {tx.status === 'success' ? <SuccessIcon sx={{ color: '#00ffff' }} /> : <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography fontWeight="bold" sx={{ color: '#ffffff', fontFamily: 'monospace' }}>{tx.merchant.toUpperCase()}</Typography>}
                  secondary={
                    <Box component="span">
                      <Typography component="span" variant="caption" sx={{ display: 'block', color: 'rgba(0, 255, 255, 0.5)', fontFamily: 'monospace' }}>{tx.time.toUpperCase()}</Typography>
                      {tx.error && <Typography component="span" variant="caption" color="error" sx={{ fontFamily: 'monospace' }}>ERROR: {tx.error.toUpperCase()}</Typography>}
                    </Box>
                  } 
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography fontWeight="bold" sx={{ color: tx.status === 'error' ? 'error.main' : '#00ffff', fontFamily: 'monospace' }}>
                    {tx.amount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontFamily: 'monospace' }}>USDC</Typography>
                </Box>
              </ListItem>
              {index < transactions.length - 1 && <Divider sx={{ borderColor: 'rgba(0, 255, 255, 0.05)' }} />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
}
