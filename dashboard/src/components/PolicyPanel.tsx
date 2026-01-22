'use client';

import * as React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { Transaction } from '@/app/types';

interface PolicyPanelProps {
  transactions: Transaction[];
}

export default function PolicyPanel({ transactions }: PolicyPanelProps) {
  const settledAmount = transactions
    .filter(t => t.status === 'success')
    .length * 0.01;
  
  const budgetLimit = 100.00;
  const percentage = Math.min(100, (settledAmount / budgetLimit) * 100);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Local Policy</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">Daily Budget</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, mr: 2 }}>
            <Box sx={{ 
              width: `${percentage}%`, 
              height: '100%', 
              bgcolor: 'primary.main', 
              borderRadius: 4 
            }} />
          </Box>
          <Typography variant="body2" fontWeight="bold">
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
          ${settledAmount.toFixed(2)} / ${budgetLimit.toFixed(2)} limit
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
  );
}
