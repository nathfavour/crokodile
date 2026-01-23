'use client';

import * as React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  IconButton, 
  AppBar, 
  Toolbar, 
  Avatar, 
  alpha,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  History, 
  Activity, 
  Server,
  Terminal,
  Copy,
  Check,
  Wand2,
  Share2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import DashboardView from '@/components/DashboardView';
import AuditLogView from '@/components/AuditLogView';
import PolicyManagerView from '@/components/PolicyManagerView';
import FleetStatusView from '@/components/FleetStatusView';
import { ViewType } from './types';

const drawerWidth = 260;

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentView, setCurrentView] = React.useState<ViewType>('DASHBOARD');
  const [cliModalOpen, setCliModalOpen] = React.useState(false);
  const [payModalOpen, setPayModalOpen] = React.useState(false);
  const [aiModalOpen, setAIModalOpen] = React.useState(false);
  const [detecting, setDetecting] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [aiStep, setAIStep] = React.useState(0);

  const installCmd = "curl -sL https://crokodile.vercel.app/install.sh | sh";

  const navItems = [
    { id: 'DASHBOARD' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'POLICY' as ViewType, label: 'Policies', icon: ShieldCheck },
    { id: 'AUDIT' as ViewType, label: 'Audit', icon: History },
    { id: 'LEDGER' as ViewType, label: 'Fleet', icon: Activity },
    { id: 'SYSTEM' as ViewType, label: 'System', icon: Server },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const startDetecting = () => {
    setDetecting(true);
    setTimeout(() => setDetecting(false), 3000);
  };

  const runAISimulation = () => {
    setAIModalOpen(true);
    setAIStep(1);
    setTimeout(() => setAIStep(2), 1500);
    setTimeout(() => setAIStep(3), 3000);
    setTimeout(() => setAIStep(4), 4500);
  };

  React.useEffect(() => {
    if (cliModalOpen) startDetecting();
  }, [cliModalOpen]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', pb: isMobile ? 8 : 0 }}>
      {/* Sidebar - Desktop Only */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#08120e',
              borderRight: '1px solid rgba(16, 185, 129, 0.1)',
              p: 3,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5, px: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'primary.main', 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}>
              <ShieldCheck size={24} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>Crokodile</Typography>
              <Typography sx={{ fontSize: 10, color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', mt: 0.5, letterSpacing: '0.1em' }}>
                X402 PROTOCOL
              </Typography>
            </Box>
          </Box>

          <List sx={{ flex: 1, py: 0 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setCurrentView(item.id)}
                  selected={currentView === item.id}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    color: currentView === item.id ? 'primary.main' : 'text.secondary',
                    bgcolor: currentView === item.id ? alpha('#10b981', 0.1) : 'transparent',
                    border: currentView === item.id ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                    '&:hover': {
                      bgcolor: alpha('#10b981', 0.05),
                      color: 'primary.main',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    <item.icon size={20} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setPayModalOpen(true)}
              startIcon={<Share2 size={18} />}
              sx={{ py: 1.2, borderRadius: 3, fontWeight: 800, fontSize: 12, borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              Payment Request
            </Button>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => setCliModalOpen(true)}
              startIcon={<Terminal size={18} />}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: 13, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}
            >
              Connect CLI
            </Button>

            <Box sx={{ pt: 3, borderTop: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src="https://picsum.photos/seed/admin/40" sx={{ width: 40, height: 40, border: '1px solid rgba(16, 185, 129, 0.2)' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: 13 }}>Admin_Root</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Pro Enterprise</Typography>
              </Box>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(16, 185, 129, 0.1)', bgcolor: alpha('#060d0b', 0.8), backdropFilter: 'blur(12px)' }}>
          <Toolbar sx={{ height: { xs: 70, md: 80 }, px: { xs: 2, md: 4 } }}>
            {isMobile && (
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <Typography variant="h6" sx={{ fontWeight: 900, fontSize: 18 }}>Crok</Typography>
               </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, flexGrow: 1 }}>
              <Tooltip title="AI Optimization Autopilot">
                <IconButton 
                  onClick={runAISimulation}
                  sx={{ 
                    color: 'primary.main', 
                    bgcolor: alpha('#10b981', 0.1),
                    '&:hover': { bgcolor: alpha('#10b981', 0.2) },
                    animation: 'glow 3s infinite'
                  }}
                >
                  <Wand2 size={20} />
                </IconButton>
              </Tooltip>
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box className="pulse-indicator" sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Nodes: 42</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                  <Chip icon={<Sparkles size={14} />} label="AI_ONLINE" size="small" variant="outlined" sx={{ color: 'primary.main', borderColor: alpha('#10b981', 0.3), fontWeight: 800, fontSize: 10 }} />
                </Box>
              )}

              <Button
                variant="contained"
                onClick={() => setCliModalOpen(true)}
                startIcon={<Terminal size={16} />}
                sx={{
                  px: { xs: 2, md: 3 },
                  height: { xs: 36, md: 40 },
                  fontSize: { xs: 10, md: 12 },
                  fontWeight: 800,
                  bgcolor: 'primary.main',
                  color: '#000'
                }}
              >
                CONNECT
              </Button>

              <Avatar src="https://picsum.photos/seed/user/32" sx={{ width: 32, height: 32, border: '1px solid rgba(16, 185, 129, 0.3)' }} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* View Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl" sx={{ py: { xs: 1, md: 2 }, px: { xs: 0, md: 2 } }}>
            {currentView === 'DASHBOARD' && <DashboardView />}
            {currentView === 'AUDIT' && <AuditLogView />}
            {currentView === 'POLICY' && <PolicyManagerView />}
            {currentView === 'LEDGER' && <FleetStatusView />}
            {currentView === 'SYSTEM' && (
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="h6">System Diagnostics v2.0.4</Typography>
                <Typography variant="body2">Security kernel status: OPTIMAL</Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: alpha('#08120e', 0.95), backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(16, 185, 129, 0.1)' }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentView}
            onChange={(_, newValue) => setCurrentView(newValue)}
            sx={{ bgcolor: 'transparent', height: 70 }}
          >
            {navItems.slice(0, 4).map((item) => (
              <BottomNavigationAction
                key={item.id}
                label={item.label}
                value={item.id}
                icon={<item.icon size={20} />}
                sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* AI Simulation Modal */}
      <Dialog open={aiModalOpen} onClose={() => setAIModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: '#08120e', border: '1px solid #10b981', borderRadius: 4 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 4 }}>
          <Wand2 color="#10b981" />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>AI Optimization</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 4 }}>
          <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: aiStep >= 1 ? '#10b981' : '#333' }} variant={aiStep > 1 ? "determinate" : "indeterminate"} value={100} />
              <Typography sx={{ fontSize: 13, color: aiStep >= 1 ? '#fff' : '#555', fontWeight: aiStep === 1 ? 800 : 400 }}>Scanning fleet behavioral patterns...</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: aiStep >= 2 ? '#10b981' : '#333' }} variant={aiStep > 2 ? "determinate" : "indeterminate"} value={100} />
              <Typography sx={{ fontSize: 13, color: aiStep >= 2 ? '#fff' : '#555', fontWeight: aiStep === 2 ? 800 : 400 }}>Generating new risk guardrails...</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: aiStep >= 3 ? '#10b981' : '#333' }} variant={aiStep > 3 ? "determinate" : "indeterminate"} value={100} />
              <Typography sx={{ fontSize: 13, color: aiStep >= 3 ? '#fff' : '#555', fontWeight: aiStep === 3 ? 800 : 400 }}>Propagating policies to local nodes...</Typography>
            </Box>
            {aiStep >= 4 && (
              <Box sx={{ p: 2, bgcolor: alpha('#10b981', 0.1), borderRadius: 2, border: '1px solid #10b981' }}>
                <Typography sx={{ fontSize: 12, color: '#10b981', fontWeight: 800 }}>SUCCESS: Fleet efficiency improved by 14.2%.</Typography>
              </Box>
            )}
          </Box>
          <Button fullWidth variant="contained" disabled={aiStep < 4} onClick={() => setAIModalOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Payment Request Modal */}
      <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#08120e', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 4 } }}>
        <DialogTitle sx={{ px: 4, pt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinkIcon color="#10b981" size={24} />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Create Payment URI</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField fullWidth label="Amount" defaultValue="0.01" InputProps={{ startAdornment: <InputAdornment position="start">USDC</InputAdornment> }} />
            <TextField fullWidth label="Merchant ID" defaultValue="mock-merchant-042" />
            <Box sx={{ p: 2, bgcolor: '#000', borderRadius: 2, border: '1px solid #333' }}>
              <Typography sx={{ color: '#10b981', fontSize: 12, fontFamily: 'monospace' }}>crok://pay?amt=0.01&m=mock-merchant-042&c=USDC</Typography>
            </Box>
            <Button variant="contained" onClick={() => handleCopy("crok://pay?amt=0.01&m=mock-merchant-042&c=USDC")} startIcon={copySuccess ? <Check size={18} /> : <Copy size={18} />}>
              {copySuccess ? "Copied Request URI" : "Copy Payment URI"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Connect CLI Modal */}
      <Dialog open={cliModalOpen} onClose={() => setCliModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#08120e', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 4 } }}>
        <DialogTitle sx={{ px: 4, pt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Terminal color="#10b981" size={24} />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Link Local CLI</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 4 }}>
          <Box sx={{ mb: 4, mt: 2 }}>
            <Box sx={{ bgcolor: '#000', p: 2.5, borderRadius: 3, border: '1px solid #10b981', position: 'relative' }}>
              <Typography sx={{ color: '#10b981', fontFamily: 'monospace', fontSize: 13 }}>{installCmd}</Typography>
              <IconButton onClick={() => handleCopy(installCmd)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#10b981' }}>
                <Copy size={18} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha('#10b981', 0.03), border: '1px solid #10b981' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: detecting ? 'primary.main' : 'text.secondary' }}>
                {detecting ? 'DETECTING LOCAL NODES...' : 'CLI BRIDGE READY'}
              </Typography>
              {detecting && <CircularProgress size={16} />}
            </Box>
            <LinearProgress variant={detecting ? "indeterminate" : "determinate"} value={100} sx={{ height: 4, borderRadius: 2 }} />
          </Box>
          <Button fullWidth variant="contained" size="large" onClick={() => setCliModalOpen(false)} sx={{ mt: 4, fontWeight: 900 }}>I&apos;VE INSTALLED THE CLI</Button>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
          100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
        }
        .pulse-indicator {
          animation: pulse 2s infinite;
        }
      `}</style>
    </Box>
  );
}