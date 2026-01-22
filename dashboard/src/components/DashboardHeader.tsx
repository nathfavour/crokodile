'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface DashboardHeaderProps {
  error: string | null;
  onRefresh: () => void;
}

export default function DashboardHeader({ error, onRefresh }: DashboardHeaderProps) {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #00ffff', boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold', letterSpacing: '0.2em' }}>
          🐊 <Box component="span" sx={{ ml: 1, color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>CROKODILE</Box>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography variant="caption" sx={{ color: error ? 'error.main' : '#00ffff', mr: 1, fontWeight: 'bold' }}>
            {error ? 'DISCONNECTED' : 'ENGINE_ONLINE'}
          </Typography>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: error ? 'error.main' : '#00ffff',
            boxShadow: error ? 'none' : '0 0 10px #00ffff',
            animation: error ? 'none' : 'pulse 2s infinite'
          }} />
        </Box>
        <IconButton color="inherit" onClick={onRefresh} sx={{ color: '#00ffff' }}>
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </AppBar>
  );
}
