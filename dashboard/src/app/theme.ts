'use client';

import { createTheme } from '@mui/material/styles';

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
      default: '#000000', // Pitch Black
      paper: '#050505',   // Slightly off-black for depth
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(0, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: 'var(--font-geist-mono), monospace', // Use mono for the "hacker" vibe
  },
  shape: {
    borderRadius: 0, // Sharp edges for a more technical look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          scrollbarColor: '#00ffff #000000',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#000000',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#00ffff',
            borderRadius: '0px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #00ffff',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 255, 255, 0.1)',
          '&:hover': {
            borderColor: 'rgba(0, 255, 255, 0.4)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          border: '1px solid #00ffff',
          color: '#00ffff',
          '&:hover': {
            backgroundColor: '#00ffff',
            color: '#000000',
            boxShadow: '0 0 20px #00ffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#050505',
          border: '1px solid rgba(0, 255, 255, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderColor: '#00ffff',
          color: '#00ffff',
        },
      },
    },
  },
});

export default theme;