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
  InputBase, 
  Badge,
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
  Tooltip
} from '@mui/material';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  History, 
  Activity, 
  Server,
  Settings,
  Plus,
  Search,
  Bell,
  Terminal,
  Copy,
  Check,
  Cpu,
  Wifi,
  Zap
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
  const [detecting, setDetecting] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);

  const installCmd = "curl -sL https://crokodile.vercel.app/install.sh | sh";

  const navItems = [
    { id: 'DASHBOARD' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'POLICY' as ViewType, label: 'Policies', icon: ShieldCheck },
    { id: 'AUDIT' as ViewType, label: 'Audit', icon: History },
    { id: 'LEDGER' as ViewType, label: 'Fleet', icon: Activity },
    { id: 'SYSTEM' as ViewType, label: 'System', icon: Server },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const startDetection = () => {
    setDetecting(true);
    setTimeout(() => setDetecting(false), 4000);
  };

  React.useEffect(() => {
    if (cliModalOpen) startDetection();
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
              variant="contained" 
              fullWidth 
              onClick={() => setCliModalOpen(true)}
              startIcon={<Terminal size={18} />}
              sx={{ 
                py: 1.5, 
                borderRadius: 3,
                fontWeight: 800,
                fontSize: 13,
                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)',
                textTransform: 'uppercase'
              }}
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
              {!isMobile && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box className="pulse-indicator" sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'primary.main' }}>
                      System Online
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Activity size={14} color="#059669" />
                      <Typography sx={{ fontSize: 11, fontWeight: 700 }}>12ms</Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: '#0c1a15', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: 2,
                  px: 2,
                  width: 200,
                  transition: 'all 0.2s',
                  '&:focus-within': { width: 280, borderColor: 'primary.main' }
                }}>
                  <Search size={16} color="#94a3b8" />
                  <InputBase 
                    placeholder="Search Node" 
                    sx={{ ml: 1, flex: 1, fontSize: 12, color: 'text.primary' }} 
                  />
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
                  color: '#000',
                  '&:hover': { bgcolor: 'primary.light' }
                }}
              >
                CONNECT CLI
              </Button>

              <Avatar src="https://picsum.photos/seed/user/32" sx={{ width: { xs: 32, md: 32 }, height: { xs: 32, md: 32 }, border: '1px solid rgba(16, 185, 129, 0.3)' }} />
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
                <Typography variant="h6">System Diagnostics Online</Typography>
                <Typography variant="body2">Advanced node health metrics coming in v2.1</Typography>
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
                sx={{ 
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'primary.main' },
                  '& .MuiBottomNavigationAction-label': { fontSize: 10, fontWeight: 700, mt: 0.5 }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Connect CLI Modal */}
      <Dialog 
        open={cliModalOpen} 
        onClose={() => setCliModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#08120e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 4,
            backgroundImage: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent)'
          }
        }}
      >
        <DialogTitle sx={{ px: 4, pt: 4, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Terminal color="#10b981" size={24} />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Link Local CLI</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
              Unlock the full power of machine-to-machine commerce. Install the Crokodile Jaw on your local node to start intercepting 402 traffic.
            </Typography>

            <Box sx={{ bgcolor: '#000', p: 2.5, borderRadius: 3, border: '1px solid rgba(16, 185, 129, 0.1)', position: 'relative' }}>
              <Typography sx={{ color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, pr: 5, wordBreak: 'break-all' }}>
                {installCmd}
              </Typography>
              <Tooltip title={copySuccess ? "Copied!" : "Copy Command"}>
                <IconButton 
                  onClick={handleCopy}
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: copySuccess ? 'primary.main' : 'text.secondary' }}
                >
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: alpha('#10b981', 0.03), 
            border: '1px solid rgba(16, 185, 129, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Wifi size={16} color={detecting ? "#10b981" : "#94a3b8"} className={detecting ? "pulse-indicator" : ""} />
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: detecting ? 'primary.main' : 'text.secondary' }}>
                  {detecting ? 'DETECTING LOCAL NODES...' : 'CLI BRIDGE READY'}
                </Typography>
              </Box>
              {detecting && <Typography sx={{ fontSize: 10, fontWeight: 900, color: 'primary.main' }}>ROLLING...</Typography>}
            </Box>
            
            <Box sx={{ position: 'relative', height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              {detecting ? (
                <LinearProgress 
                  sx={{ 
                    height: 4, 
                    bgcolor: 'transparent',
                    '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' }
                  }} 
                />
              ) : (
                <Box sx={{ width: '100%', height: '100%', bgcolor: 'rgba(16, 185, 129, 0.2)' }} />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cpu size={14} color="#10b981" opacity={0.5} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>LOCAL_ADDR: 127.0.0.1:8080</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Zap size={14} color="#10b981" opacity={0.5} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>AUTO_SYNC: ON</Typography>
              </Box>
            </Box>
          </Box>

          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={() => setCliModalOpen(false)}
            sx={{ mt: 4, py: 2, borderRadius: 3, fontWeight: 900, fontSize: 14 }}
          >
            I'VE INSTALLED THE CLI
          </Button>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pulse-indicator {
          animation: pulse 2s infinite;
        }
      `}</style>
    </Box>
  );
}
