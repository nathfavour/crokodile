'use client';

import * as React from 'react';
import { Paper, Typography, Box, Divider, alpha, Tooltip } from '@mui/material';
import { Security as PolicyIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';
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
    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PolicyIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.2rem' }} />
        <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', flexGrow: 1 }}>ACTIVE_POLICIES</Typography>
        <Tooltip title="Policies enforced by the local x402 agent">
          <InfoIcon sx={{ color: 'text.secondary', fontSize: '1rem', cursor: 'pointer' }} />
        </Tooltip>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Daily Budget Usage
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'var(--font-geist-mono)' }}>
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
        
        <Box sx={{ height: 8, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Box 
            sx={{ 
              width: `${percentage}%`, 
              height: '100%', 
              bgcolor: 'primary.main',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
              transition: 'width 1s ease-in-out',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.1) 75%, transparent 75%, transparent)',
                backgroundSize: '1rem 1rem'
              }
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, fontSize: '0.65rem' }}>
            SETTLED: ${settledAmount.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, fontSize: '0.65rem' }}>
            LIMIT: ${budgetLimit.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
      
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
          Security Context
        </Typography>
        
        <Box sx={{ p: 2, bgcolor: alpha('#00ffff', 0.02), borderRadius: 2, border: '1px solid rgba(0, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 700 }}>AGENT_ID</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontFamily: 'var(--font-geist-mono)' }}>LOCAL_AGENT_001</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 700 }}>ENCRYPTION</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontFamily: 'var(--font-geist-mono)' }}>AES_256_GCM</Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.6rem', textAlign: 'center', display: 'block' }}>
          SECURELY_MANAGED_BY_CROKODILE_PROTOCOL
        </Typography>
      </Box>
    </Paper>
  );
}