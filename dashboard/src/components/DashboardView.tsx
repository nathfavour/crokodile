'use client';

import React from 'react';
import { 
  Grid, 
  Paper, 
  Box, 
  Typography, 
  Button, 
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CreditCard, Bot, Zap, ShieldCheck } from 'lucide-react';
import { Transaction } from '@/app/types';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 180 },
  { name: 'Sat', value: 600 },
  { name: 'Sun', value: 450 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  unit?: string;
}

const StatCard = ({ title, value, change, icon: Icon, unit }: StatCardProps) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: { xs: 2, md: 3 }, 
      borderRadius: 4, 
      position: 'relative', 
      overflow: 'hidden',
      '&:hover .icon-bg': { opacity: 0.15 },
      transition: 'all 0.3s ease',
      height: '100%'
    }}
  >
    <Box 
      className="icon-bg"
      sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        p: 2, 
        opacity: 0.08, 
        transition: 'opacity 0.3s ease',
        color: 'primary.main',
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Icon size={64} />
    </Box>
    <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', tracking: '0.15em', mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>${value}</Typography>
      {unit && <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.secondary' }}>{unit}</Typography>}
    </Box>
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: change.startsWith('+') ? 'primary.main' : '#ef4444' }}>
        {change}
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>from yesterday</Typography>
    </Box>
  </Paper>
);

export default function DashboardView() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const displayTransactions: Transaction[] = transactions.length > 0 ? transactions.slice(0, 5) : [
    { id: 'mock-1', merchant: 'CloudCompute-ZK', hash: '0x821...F18', amount: '42.50', agentId: 'Agent_018', time: '12:44:02.12', status: 'SETTLED', timestamp: '', merchantDomain: '' , currency: 'USDC' },
    { id: 'mock-2', merchant: 'Node-Charging-88', hash: '0x321...E29', amount: '112.00', agentId: 'Agent_012', time: '12:42:10.05', status: 'SETTLED', timestamp: '', merchantDomain: '' , currency: 'USDC' },
    { id: 'mock-3', merchant: 'DataLake-S3', hash: '0x992...B04', amount: '8.12', agentId: 'Agent_099', time: '12:41:55.30', status: 'SETTLED', timestamp: '', merchantDomain: '' , currency: 'USDC' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="USDC Balance (Cronos)" value="124,500.00" change="+5.2%" icon={CreditCard} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Active Agents" value="42" unit="/ 50" change="98.4% Uptime" icon={Bot} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total 24h Volume" value="842.50" unit="USDC" change="+1,204 Transactions" icon={Zap} />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' } }}>Spending Insights</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>Volume projection across the X402 economy</Typography>
              </Box>
              <Box sx={{ display: 'flex', bgcolor: alpha('#10b981', 0.05), border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: 2, p: 0.5 }}>
                {['1D', '1W', '1M'].map(t => (
                  <Button 
                    key={t} 
                    size="small"
                    sx={{ 
                      minWidth: { xs: 36, md: 44 }, 
                      fontSize: 10, 
                      fontWeight: 800,
                      borderRadius: 1.5,
                      color: t === '1W' ? '#000' : 'primary.main',
                      bgcolor: t === '1W' ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: t === '1W' ? 'primary.light' : alpha('#10b981', 0.1)
                      }
                    }}
                  >
                    {t}
                  </Button>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ height: { xs: 200, md: 300 }, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                    dy={10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0c1410', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'primary.main' }}>
              <ShieldCheck size={18} />
              <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Reasoning</Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 3, textTransform: 'uppercase', fontWeight: 800 }}>LLM Audit: Settlement Logic Trace</Typography>
            
            <Box sx={{ 
              flexGrow: 1, 
              bgcolor: 'rgba(0,0,0,0.4)', 
              borderRadius: 3, 
              p: 3, 
              overflowY: 'auto',
              border: '1px solid rgba(16, 185, 129, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <Box>
                <Typography component="span" sx={{ color: 'primary.main', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>[08:42:12] :: </Typography>
                <Typography component="span" sx={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>ANALYZING AGENT_042 INTERCEPT</Typography>
              </Box>
              
              <Box sx={{ pl: 2, borderLeft: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}><Box component="span" sx={{ color: 'primary.dark', mr: 1 }}>&gt;</Box>TARGET: MERCHANT_ID_8819</Typography>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}><Box component="span" sx={{ color: 'primary.dark', mr: 1 }}>&gt;</Box>EVALUATION: <Box component="span" sx={{ color: 'primary.main' }}>402 Standard Response Required.</Box></Typography>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
                  <Box component="span" sx={{ color: 'primary.dark', mr: 1 }}>&gt;</Box>LOGIC: 
                  <Box component="span" sx={{ color: 'primary.light' }}> &quot;Merchant wallet verified. Latency threshold met. 12.50 USDC request within autonomous budget (+2.4% buffer). Reasoning: Essential AWS compute replenishment.&quot;</Box>
                </Typography>
              </Box>

              <Box sx={{ bgcolor: alpha('#10b981', 0.05), border: '1px solid rgba(16, 185, 129, 0.1)', p: 2, borderRadius: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', mb: 0.5 }}>DECISION: APPROVED</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>Reasoning chain 100% consistent with safety parameters.</Typography>
              </Box>

              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Typography sx={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>VERIFIED_BY_ZK_PROOF: 0x82...a12</Typography>
                <Typography sx={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>SHA-256</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
            <Zap size={20} style={{ animation: 'pulse-light 2s infinite' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' } }}>Real-Time Snaps</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Stream Active</Typography>
            <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
          </Box>
        </Box>

        <TableContainer sx={{ position: 'relative', minHeight: 200, overflowX: 'auto' }}>
          {loading && transactions.length === 0 && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <CircularProgress size={24} sx={{ color: 'primary.main' }} />
            </Box>
          )}
          <Table sx={{ minWidth: { xs: 800, md: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Merchant / Entity</TableCell>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Amount (USDC)</TableCell>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Intercept Agent</TableCell>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Time (UTC)</TableCell>
                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayTransactions.map((tx, i) => (
                <TableRow 
                  key={tx.id || i} 
                  sx={{ 
                    '&:hover': { bgcolor: alpha('#10b981', 0.02) },
                    '& td': { borderBottom: '1px solid rgba(16, 185, 129, 0.05)' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 32, height: 32, bgcolor: alpha('#10b981', 0.1), borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                        <Zap size={14} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{tx.merchant}</Typography>
                        <Typography sx={{ fontSize: 10, color: 'text.secondary', fontFamily: 'JetBrains Mono, monospace' }}>{tx.hash ? (tx.hash.substring(0, 10) + '...') : ''}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{tx.amount}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{tx.agentId}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{tx.time || tx.timestamp}</TableCell>
                  <TableCell>
                    <Box component="span" sx={{ 
                      fontSize: 10, 
                      fontWeight: 800, 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 10, 
                      bgcolor: alpha('#10b981', 0.1), 
                      color: 'primary.main',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      {tx.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" sx={{ fontWeight: 800, fontSize: 11 }}>Audit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <style jsx global>{`
        @keyframes pulse-light {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
