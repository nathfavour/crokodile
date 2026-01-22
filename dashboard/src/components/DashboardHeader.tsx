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
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          🐊 <Box component="span" sx={{ ml: 1, color: 'primary.main' }}>CROKODILE</Box>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography variant="caption" sx={{ color: error ? 'error.main' : 'success.main', mr: 1 }}>
            {error ? 'DISCONNECTED' : 'ENGINE ONLINE'}
          </Typography>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: error ? 'error.main' : 'success.main' }} />
        </Box>
        <IconButton color="inherit" onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
