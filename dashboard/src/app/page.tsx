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
  Container
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
  Wallet
} from 'lucide-react';
import DashboardView from '@/components/DashboardView';
import AuditLogView from '@/components/AuditLogView';
import PolicyManagerView from '@/components/PolicyManagerView';
import { ViewType } from './types';

const drawerWidth = 260;

export default function AppLayout() {
  const [currentView, setCurrentView] = React.useState<ViewType>('DASHBOARD');
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);

  const navItems = [
    { id: 'DASHBOARD' as ViewType, label: 'Eye Dashboard', icon: LayoutDashboard },
    { id: 'POLICY' as ViewType, label: 'Policy Manager', icon: ShieldCheck },
    { id: 'AUDIT' as ViewType, label: 'Transaction Audit', icon: History },
    { id: 'LEDGER' as ViewType, label: 'Fleet Status', icon: Activity },
    { id: 'SYSTEM' as ViewType, label: 'System Health', icon: Server },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Sidebar */}
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
            color: '#000'
          }}>
            <ShieldCheck size={24} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>Crokodile</Typography>
            <Typography sx={{ fontSize: 10, color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', mt: 0.5, letterSpacing: '0.1em' }}>
              Cronos X402 Suite
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
                  },
                  '&.Mui-selected': {
                    bgcolor: alpha('#10b981', 0.1),
                    '&:hover': {
                      bgcolor: alpha('#10b981', 0.15),
                    },
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
            startIcon={<Settings size={20} />} 
            sx={{ 
              justifyContent: 'flex-start', 
              color: 'text.secondary',
              px: 2,
              '&:hover': { color: 'primary.main' }
            }}
          >
            Settings
          </Button>
          
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<Plus size={20} />}
            sx={{ 
              py: 1.5, 
              borderRadius: 3,
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)'
            }}
          >
            Deploy New Agent
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

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(16, 185, 129, 0.1)', bgcolor: alpha('#060d0b', 0.8), backdropFilter: 'blur(12px)' }}>
          <Toolbar sx={{ height: 80, px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'primary.main' }}>
                  System Online
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Activity size={14} color="#059669" />
                  <Typography sx={{ fontSize: 11, fontWeight: 700 }}>12ms LATENCY</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldCheck size={14} color="#059669" />
                  <Typography sx={{ fontSize: 11, fontWeight: 700 }}>BLOCK: 84,203,119</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#0c1a15', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: 2,
                px: 2,
                width: 260,
                transition: 'all 0.2s',
                '&:focus-within': { width: 320, borderColor: 'primary.main' }
              }}>
                <Search size={18} color="#94a3b8" />
                <InputBase 
                  placeholder="Search Agent ID or Merchant" 
                  sx={{ ml: 1, flex: 1, fontSize: 13, color: 'text.primary' }} 
                />
              </Box>

              <IconButton sx={{ color: 'text.secondary' }}>
                <Badge variant="dot" color="primary">
                  <Bell size={20} />
                </Badge>
              </IconButton>

              <Button
                variant={isWalletConnected ? 'outlined' : 'contained'}
                onClick={() => setIsWalletConnected(!isWalletConnected)}
                startIcon={<Wallet size={16} />}
                sx={{
                  px: 3,
                  height: 40,
                  fontSize: 12,
                  fontWeight: 800,
                  borderWidth: 1.5,
                  '&:hover': { borderWidth: 1.5 },
                  ...(isWalletConnected ? {
                    color: 'primary.main',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    bgcolor: alpha('#10b981', 0.05)
                  } : {})
                }}
              >
                {isWalletConnected ? '0x8b8...22F8' : 'CONNECT WALLET'}
              </Button>

              <Avatar src="https://picsum.photos/seed/user/32" sx={{ width: 32, height: 32, border: '1px solid rgba(16, 185, 129, 0.3)' }} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* View Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            {currentView === 'DASHBOARD' && <DashboardView />}
            {currentView === 'AUDIT' && <AuditLogView />}
            {currentView === 'POLICY' && <PolicyManagerView />}
            {currentView === 'LEDGER' && (
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="h6">Fleet Management coming soon...</Typography>
              </Box>
            )}
            {currentView === 'SYSTEM' && (
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="h6">System Diagnostics coming soon...</Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}