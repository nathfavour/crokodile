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
    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#050505', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#00ffff', letterSpacing: '0.1em' }}>LOCAL_POLICY</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>Daily Budget Usage</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Box sx={{ flexGrow: 1, height: 4, bgcolor: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.1)', mr: 2 }}>
            <Box sx={{ 
              width: `${percentage}%`, 
              height: '100%', 
              bgcolor: '#00ffff',
              boxShadow: '0 0 10px #00ffff'
            }} />
          </Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#00ffff', fontFamily: 'monospace' }}>
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'rgba(0, 255, 255, 0.5)', fontFamily: 'monospace' }}>
          ${settledAmount.toFixed(2)} / ${budgetLimit.toFixed(2)} LIMIT
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2, borderColor: 'rgba(0, 255, 255, 0.1)' }} />
      
      <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase', display: 'block', mb: 1 }}>Agent Signature</Typography>
      <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 255, 255, 0.02)', border: '1px solid rgba(0, 255, 255, 0.1)' }}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00ffff', wordBreak: 'break-all' }}>
          LOCAL_AGENT_001
        </Typography>
      </Box>
    </Paper>
  );
}
