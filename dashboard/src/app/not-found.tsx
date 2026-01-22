'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#000000',
        color: '#00ffff',
        textAlign: 'center',
        p: 3,
        fontFamily: 'monospace',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 0 20px #00ffff' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, letterSpacing: '0.2em' }}>
          SIGNAL LOST: ROUTE NOT FOUND
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
          The requested resource is outside the Crokodile interception range.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          RETURN TO DASHBOARD
        </Button>
      </Container>
    </Box>
  );
}
