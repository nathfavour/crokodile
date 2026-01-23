'use client';

import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981', // Emerald 500
      light: '#34d399',
      dark: '#059669',
      contrastText: '#000000',
    },
    background: {
      default: '#060d0b', // Deep dark green/black
      paper: '#0c1410',   // Slightly lighter emerald-black
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: 'rgba(16, 185, 129, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#060d0b',
          color: '#e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0c1410',
          border: '1px solid rgba(16, 185, 129, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
        },
        containedPrimary: {
          backgroundColor: '#10b981',
          '&:hover': {
            backgroundColor: '#34d399',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0c1410',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;