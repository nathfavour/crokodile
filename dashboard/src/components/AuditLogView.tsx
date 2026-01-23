'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  alpha, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent
} from '@mui/material';
import { 
  Search, 
  ChevronDown, 
  X, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Activity,
  Zap
} from 'lucide-react';
import { Transaction } from '@/app/types';
import { generateForensicTrace } from '@/services/geminiService';

export default function AuditLogView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [traceLoading, setTraceLoading] = useState(false);
  const [trace, setTrace] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = React.useCallback(async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const displayTransactions: Transaction[] = transactions.length > 0 ? transactions : [
    { id: '1', timestamp: '2023-10-24 14:22:10', agentId: 'AGT-8821-X9', merchantDomain: 'aws.amazon.com', merchant: 'AWS', amount: 1420.00, currency: 'USDC', status: 'SETTLED', hash: '0x4a2e881b7723c3399021da3b8812c99a0122ff10...', merchantDomain: '', reasoning: '', time: '' },
    { id: '2', timestamp: '2023-10-24 14:18:05', agentId: 'AGT-9902-Z4', merchantDomain: 'cloud.google.com', merchant: 'Google Cloud', amount: 890.50, currency: 'USDC', status: 'SETTLED', hash: '0x7b2f992c8834d4400132eb4c9923d00b123ff21...', merchantDomain: '', reasoning: '', time: '' },
    { id: '3', timestamp: '2023-10-24 14:05:42', agentId: 'AGT-1122-K1', merchantDomain: 'openai.com', merchant: 'OpenAI', amount: 320.12, currency: 'USDC', status: 'SETTLED', hash: '0x1c3a445d6677e8899223fa4c5566f11c234ee32...', merchantDomain: '', reasoning: '', time: '' },
    { id: '4', timestamp: '2023-10-24 13:58:12', agentId: 'AGT-5541-M0', merchantDomain: 'stripe.com', merchant: 'Stripe', amount: 15.00, currency: 'USDC', status: 'SETTLED', hash: '0x9d2e112b3344c5566778ab9c1122d33e445ff66...', merchantDomain: '', reasoning: '', time: '' },
  ];

  const fetchTrace = async (tx: Transaction) => {
    setTraceLoading(true);
    const result = await generateForensicTrace(tx);
    setTrace(result);
    setTraceLoading(false);
  };

  useEffect(() => {
    if (selectedTx) {
      fetchTrace(selectedTx);
    }
  }, [selectedTx]);

  return (
    <Box sx={{ display: 'flex', gap: { xs: 0, md: 4 }, height: isMobile ? 'auto' : 'calc(100vh - 160px)', position: 'relative', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: isMobile ? 'visible' : 'auto', pr: selectedTx && !isMobile ? 0 : 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Transaction Audit Log</Typography>
            {!isMobile && (
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 1, fontWeight: 500 }}>
                Real-time history of autonomous M2M settlements on Cronos x402.
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
             <Button 
              variant="outlined" 
              onClick={fetchTransactions}
              endIcon={<ChevronDown size={14} />}
              sx={{ 
                bgcolor: '#0c1410', 
                borderColor: 'rgba(16, 185, 129, 0.2)', 
                color: 'primary.main',
                fontSize: 11,
                fontWeight: 800,
                height: 36
              }}
            >
              All Statuses
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 2.5, borderRadius: 4 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>24h Volume</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '2.125rem' } }}>$1,240,500</Typography>
                <Typography sx={{ color: 'primary.main', fontSize: 11, fontWeight: 800 }}>↗ +12.5%</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 2.5, borderRadius: 4 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>Success Rate</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '2.125rem' } }}>99.92%</Typography>
                <Typography sx={{ color: 'primary.main', fontSize: 11, fontWeight: 800 }}>● +0.01%</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, position: 'relative', overflowX: 'auto' }}>
          {loading && transactions.length === 0 && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.1)', zIndex: 1 }}>
              <CircularProgress size={24} sx={{ color: 'primary.main' }} />
            </Box>
          )}
          <Table sx={{ minWidth: { xs: 600, md: 'auto' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)', px: { xs: 2, md: 3 } }}>Timestamp</TableCell>
                <TableCell align="center" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Agent</TableCell>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Merchant</TableCell>
                <TableCell align="right" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)', px: { xs: 2, md: 3 } }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayTransactions.map((tx) => (
                <TableRow 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: selectedTx?.id === tx.id ? alpha('#10b981', 0.08) : 'transparent',
                    '&:hover': { bgcolor: alpha('#10b981', 0.04) },
                    '& td': { borderBottom: '1px solid rgba(16, 185, 129, 0.05)' }
                  }}
                >
                  <TableCell sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{tx.timestamp}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: 'primary.main', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{tx.agentId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: 13 }}>{tx.merchant}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ px: { xs: 2, md: 3 }, fontWeight: 800, fontSize: 13 }}>
                    {tx.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Forensic Panel - Adapts to Bottom Sheet on Mobile */}
      <Dialog 
        open={!!selectedTx && isMobile} 
        onClose={() => setSelectedTx(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { 
            bgcolor: '#08120e', 
            m: 0, 
            position: 'fixed', 
            bottom: 0, 
            borderRadius: '24px 24px 0 0',
            maxHeight: '80vh'
          }
        }}
      >
        <DialogContent>
          {selectedTx && <ForensicContent tx={selectedTx} trace={trace} loading={traceLoading} onClose={() => setSelectedTx(null)} />}
        </DialogContent>
      </Dialog>

      {!isMobile && (
        <Box sx={{ 
          width: 450, 
          borderLeft: '1px solid rgba(16, 185, 129, 0.15)', 
          bgcolor: '#08120e', 
          p: 4, 
          display: selectedTx ? 'flex' : 'none', 
          flexDirection: 'column', 
          gap: 4, 
          overflowY: 'auto',
          transition: 'all 0.3s ease'
        }}>
          {selectedTx && <ForensicContent tx={selectedTx} trace={trace} loading={traceLoading} onClose={() => setSelectedTx(null)} />}
        </Box>
      )}
    </Box>
  );
}

function ForensicContent({ tx, trace, loading, onClose }: { tx: Transaction, trace: string, loading: boolean, onClose: () => void }) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
          <Search size={20} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Transaction Forensic</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', tracking: '0.1em' }}>Settlement Audit Trace</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary', p: 0.5 }}>
          <X size={24} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 4 }}>
        <Box>
          <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', tracking: '0.1em', mb: 1 }}>Amount</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '2rem', md: '3rem' } }}>{tx.amount} {tx.currency}</Typography>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: '#000', 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 10, 
              fontSize: 10, 
              fontWeight: 900, 
              letterSpacing: '0.1em' 
            }}>
              SETTLED
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(16, 185, 129, 0.1)', p: 2, borderRadius: 3 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.5 }}>Agent ID</Typography>
              <Typography sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{tx.agentId}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(16, 185, 129, 0.1)', p: 2, borderRadius: 3 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.5 }}>Network</Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 800, fontSize: 13 }}>Cronos x402</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <ShieldCheck size={16} />
              <Typography sx={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em' }}>Autonomous Reasoning Trace</Typography>
            </Box>
            <Box sx={{ fontSize: 8, fontWeight: 900, bgcolor: alpha('#10b981', 0.15), color: 'primary.main', px: 1, py: 0.25, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.3)' }}>LLM v4.2</Box>
          </Box>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#0c1410', position: 'relative' }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
                <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 800, letterSpacing: '0.1em' }}>QUERYING NEURAL ENGINE...</Typography>
              </Box>
            ) : (
              <>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6 }}>
                  &quot;{trace}&quot;
                </Typography>
                <Divider sx={{ my: 2.5, borderColor: 'rgba(16, 185, 129, 0.1)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Confidence</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'primary.main' }}>98.4%</Typography>
                </Box>
              </>
            )}
          </Paper>
        </Box>

        <Button 
          variant="contained" 
          fullWidth 
          endIcon={<ExternalLink size={18} />}
          sx={{ py: 2, borderRadius: 3, fontWeight: 800 }}
        >
          Cronos Explorer
        </Button>
      </Box>
    </>
  );
}
