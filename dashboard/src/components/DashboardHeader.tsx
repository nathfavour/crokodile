'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Container, alpha } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface DashboardHeaderProps {
  error: string | null;
  onRefresh: () => void;
}

export default function DashboardHeader({ error, onRefresh }: DashboardHeaderProps) {
  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 2, 
                bgcolor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
              }}
            >
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1 }}>🐊</Typography>
            </Box>
            <Typography 
              variant="h6" 
              noWrap 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '0.15em', 
                background: 'linear-gradient(90deg, #fff 0%, #00ffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem'
              }}
            >
              CROKODILE
            </Typography>
            <Box sx={{ ml: 2, px: 1, py: 0.25, borderRadius: 1, border: '1px solid rgba(0, 255, 255, 0.2)', bgcolor: alpha('#00ffff', 0.05) }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.05em' }}>v2.0.4-PRO</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1.5, textAlign: 'right' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Status
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: error ? 'error.main' : 'primary.main', fontSize: '0.75rem' }}>
                  {error ? 'CONNECTION_LOST' : 'ACTIVE_SECURE'}
                </Typography>
              </Box>
              <Box 
                className={!error ? 'pulse-indicator' : ''}
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: error ? 'error.main' : 'primary.main',
                  boxShadow: error ? 'none' : '0 0 10px #00ffff',
                }} 
              />
            </Box>
            
            <IconButton 
              size="small"
              onClick={onRefresh} 
              sx={{ 
                color: 'text.secondary',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                '&:hover': {
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  bgcolor: alpha('#00ffff', 0.05)
                }
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}