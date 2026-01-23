'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  alpha, 
  LinearProgress,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Cpu, 
  Terminal,
  MoreVertical
} from 'lucide-react';

const agents = [
  { id: '8821', name: 'Intercepter_Alpha', status: 'ONLINE', cpu: 12, memory: '45MB', uptime: '14d 2h', load: 65 },
  { id: '9902', name: 'Settler_Beta', status: 'ONLINE', cpu: 8, memory: '32MB', uptime: '14d 2h', load: 42 },
  { id: '1122', name: 'Auditor_Gamma', status: 'ONLINE', cpu: 4, memory: '128MB', uptime: '5d 18h', load: 12 },
  { id: '5541', name: 'Vault_Delta', status: 'STANDBY', cpu: 1, memory: '12MB', uptime: '42d 1h', load: 5 },
];

export default function FleetStatusView() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Fleet Status</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 1, fontWeight: 500 }}>
          Monitoring of autonomous agent nodes across the network.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {agents.map((agent) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={agent.id}>
            <Paper sx={{ p: 2.5, borderRadius: 4, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: 'primary.main', borderRadius: 2, width: 36, height: 36 }}>
                  <Cpu size={18} />
                </Avatar>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <MoreVertical size={16} />
                </IconButton>
              </Box>
              
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', fontFamily: 'JetBrains Mono, monospace' }}>ID: {agent.id}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: '1rem' }}>{agent.name}</Typography>
              
              <Chip 
                label={agent.status} 
                size="small" 
                sx={{ 
                  height: 18, 
                  fontSize: 9, 
                  fontWeight: 900, 
                  bgcolor: agent.status === 'ONLINE' ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                  color: agent.status === 'ONLINE' ? 'primary.main' : 'text.secondary',
                  mb: 2
                }} 
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary' }}>SYSTEM LOAD</Typography>
                    <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'primary.main' }}>{agent.load}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={agent.load} 
                    sx={{ height: 4, borderRadius: 2, bgcolor: alpha('#fff', 0.05) }} 
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box>
                    <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'text.secondary' }}>CPU</Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 800 }}>{agent.cpu} Core</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 8, fontWeight: 700, color: 'text.secondary' }}>UPTIME</Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 800 }}>{agent.uptime}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', mb: 3 }}>
          <Terminal size={20} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' } }}>Node Logs</Typography>
        </Box>
        <Box sx={{ bgcolor: '#000', p: 2, borderRadius: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#94a3b8', border: '1px solid rgba(16, 185, 129, 0.1)', overflowX: 'auto' }}>
          <Typography sx={{ color: 'primary.main', mb: 1, whiteSpace: 'nowrap' }}>[10:52:01] INF :: Intercepter_Alpha :: Routed 402 to 0x821...F18</Typography>
          <Typography sx={{ mb: 1, whiteSpace: 'nowrap' }}>[10:51:44] DBG :: Settler_Beta :: Validating signature auth...</Typography>
          <Typography sx={{ mb: 1, whiteSpace: 'nowrap' }}>[10:51:12] INF :: Auditor_Gamma :: Policy passed (+2.4%)</Typography>
          <Typography sx={{ color: '#ef4444', whiteSpace: 'nowrap' }}>[10:50:55] WRN :: Intercepter_Alpha :: Latency &gt; 500ms</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
