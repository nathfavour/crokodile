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
  );
}
