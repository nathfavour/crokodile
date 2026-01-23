'use client';

import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Cyan
      light: '#e0ffff',
      dark: '#00cccc',
    },
    secondary: {
      main: '#00ffff',
    },
    background: {
      default: '#0a0a0a', // Deep charcoal-black
      paper: '#121212',   // Slightly lighter for layers
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(0, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Inter, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          scrollbarColor: 'rgba(0, 255, 255, 0.3) transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 255, 255, 0.2)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 255, 0.4)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0a0a0a', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#121212',
          border: '1px solid rgba(0, 255, 255, 0.05)',
          transition: 'all 0.2s ease-in-out',
        },
        outlined: {
          borderColor: 'rgba(0, 255, 255, 0.1)',
          '&:hover': {
            borderColor: 'rgba(0, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 8px rgba(0, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(0, 255, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 255, 255, 0.4)',
            backgroundColor: '#33ffff',
          },
        },
        outlinedPrimary: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: alpha('#00ffff', 0.05),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
        outlined: {
          borderColor: 'rgba(0, 255, 255, 0.3)',
        },
      },
    },
  },
});

export default theme;
