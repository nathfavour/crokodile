'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  alpha, 
  LinearProgress,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Bot, 
  ShieldCheck, 
  Plus, 
  CreditCard, 
  Settings, 
  Activity, 
  Save, 
  RotateCcw,
  AlertTriangle,
  X
} from 'lucide-react';
import { Agent } from '@/app/types';

export default function PolicyManagerView() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPolicies = React.useCallback(async () => {
    try {
      const response = await fetch('/api/policies');
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
        if (data.length > 0 && !editingAgent) {
          setEditingAgent(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch policies:', err);
    } finally {
      setLoading(false);
    }
  }, [editingAgent]);

  React.useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleSave = async () => {
    if (!editingAgent) return;
    setSaving(true);
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAgent),
      });
      if (response.ok) {
        await fetchPolicies();
      }
    } catch (err) {
      console.error('Failed to save policy:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDomain = () => {
    if (!newDomain || !editingAgent) return;
    setEditingAgent({
      ...editingAgent,
      allowedDomains: [...editingAgent.allowedDomains, newDomain]
    });
    setNewDomain('');
  };

  const removeDomain = (domain: string) => {
    if (!editingAgent) return;
    setEditingAgent({
      ...editingAgent,
      allowedDomains: editingAgent.allowedDomains.filter(d => d !== domain)
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, height: 'calc(100vh - 160px)' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Policy Manager</Typography>
            <Typography sx={{ fontSize: 14, color: 'primary.main', mt: 1, fontWeight: 700 }}>
              Configure guardrails and budget limits for M2M agents.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 3, 
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
              fontWeight: 800
            }}
          >
            Add New Agent
          </Button>
        </Box>

        <Grid container spacing={3}>
          {[
            { label: 'Total Daily Ceiling', value: '$5,000.00', icon: CreditCard },
            { label: 'Active Agents', value: '12', icon: Bot },
            { label: 'Avg. Utilization', value: '42.8%', icon: Activity },
          ].map((stat, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Paper sx={{ p: 3, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, opacity: 0.05, color: 'primary.main' }}>
                  <stat.icon size={64} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', tracking: '0.1em' }}>{stat.label}</Typography>
                  <stat.icon size={14} color="#065f46" />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
            <Settings size={20} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Managed Agents</Typography>
          </Box>

          <Grid container spacing={3}>
            {agents.map((agent) => (
              <Grid size={{ xs: 12, md: 6 }} key={agent.id}>
                <Paper 
                  onClick={() => setEditingAgent(agent)}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: editingAgent?.id === agent.id ? 'primary.main' : 'rgba(16, 185, 129, 0.1)',
                    bgcolor: editingAgent?.id === agent.id ? alpha('#10b981', 0.05) : '#0c1410',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', fontFamily: 'JetBrains Mono, monospace' }}>ID: {agent.id}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{agent.name}</Typography>
                    </Box>
                    <Chip 
                      label={agent.status} 
                      size="small"
                      sx={{ 
                        fontSize: 10, 
                        fontWeight: 900, 
                        letterSpacing: '0.1em',
                        bgcolor: agent.status === 'ACTIVE' ? alpha('#10b981', 0.1) : 
                                 agent.status === 'EDITING' ? alpha('#3b82f6', 0.1) : alpha('#64748b', 0.1),
                        color: agent.status === 'ACTIVE' ? 'primary.main' : 
                               agent.status === 'EDITING' ? '#3b82f6' : 'text.secondary',
                        border: '1px solid',
                        borderColor: 'inherit'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Daily Budget Progress</Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main' }}>${agent.currentSpend.toFixed(2)} / ${agent.dailyBudget.toFixed(2)}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(agent.currentSpend / agent.dailyBudget) * 100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 10, 
                        bgcolor: alpha('#10b981', 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: agent.status === 'PAUSED' ? 'text.secondary' : 'primary.main',
                          borderRadius: 10
                        }
                      }}
                    />
                  </Box>

                  <Button 
                    fullWidth 
                    variant={editingAgent?.id === agent.id ? 'contained' : 'outlined'}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3, 
                      fontSize: 12, 
                      fontWeight: 800,
                      ...(editingAgent?.id === agent.id ? {} : { borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' })
                    }}
                  >
                    {editingAgent?.id === agent.id && agent.status === 'EDITING' ? 'Editing...' : 'Manage Policy'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Sidebar Editor */}
      <Box sx={{ 
        width: 400, 
        borderLeft: '1px solid rgba(16, 185, 129, 0.15)', 
        bgcolor: '#08120e', 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 4, 
        overflowY: 'auto' 
      }}>
        {editingAgent ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
              <ShieldCheck size={20} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Policy: {editingAgent.name}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', tracking: '0.1em', mb: 1.5 }}>Daily Spending Limit</Typography>
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={editingAgent.dailyBudget}
                  onChange={(e) => setEditingAgent({...editingAgent, dailyBudget: parseFloat(e.target.value) || 0})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ '& p': { color: 'text.secondary', fontWeight: 800 } }}>$</InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: '#0c1410', 
                      borderRadius: 3,
                      '& fieldset': { borderColor: 'rgba(16, 185, 129, 0.2)' },
                      '&:hover fieldset': { borderColor: 'primary.main' }
                    } 
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', tracking: '0.1em', mb: 1.5 }}>Max Per Request</Typography>
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  defaultValue={10.00}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ '& p': { color: 'text.secondary', fontWeight: 800 } }}>$</InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: '#0c1410', 
                      borderRadius: 3,
                      '& fieldset': { borderColor: 'rgba(16, 185, 129, 0.2)' },
                      '&:hover fieldset': { borderColor: 'primary.main' }
                    } 
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', tracking: '0.1em' }}>Allowed Domains</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {editingAgent.allowedDomains.map((domain, i) => (
                    <Chip 
                      key={i} 
                      label={domain} 
                      onDelete={() => removeDomain(domain)}
                      deleteIcon={<X size={14} color="#10b981" />}
                      sx={{ 
                        bgcolor: alpha('#10b981', 0.1), 
                        color: 'primary.main', 
                        fontWeight: 600, 
                        fontSize: 12, 
                        borderRadius: 2,
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        '& .MuiChip-deleteIcon:hover': { color: '#ef4444' }
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField 
                    fullWidth
                    size="small"
                    placeholder="Add domain..."
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: '#0c1410', 
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'rgba(16, 185, 129, 0.1)' }
                      },
                      '& .MuiInputBase-input': { fontSize: 12 }
                    }}
                  />
                  <Button 
                    onClick={handleAddDomain}
                    variant="outlined"
                    sx={{ 
                      minWidth: 80, 
                      borderRadius: 2, 
                      fontWeight: 800, 
                      fontSize: 12,
                      bgcolor: alpha('#10b981', 0.05)
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                  sx={{ py: 2, borderRadius: 3, fontWeight: 800, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<RotateCcw size={18} />}
                  sx={{ py: 2, borderRadius: 3, fontWeight: 800, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Reset to Default
                </Button>
              </Box>

              <Paper sx={{ p: 2, bgcolor: alpha('#f97316', 0.05), border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: 3, display: 'flex', gap: 1.5 }}>
                <AlertTriangle size={20} color="#f97316" style={{ flexShrink: 0 }} />
                <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: 1.6, color: 'rgba(255,160,100,0.8)' }}>
                  <Box component="span" sx={{ fontWeight: 800, color: '#f97316', mr: 0.5 }}>Note:</Box>
                  Increasing the daily limit for high-frequency agents may require additional collateral in your Cronos wallet.
                </Typography>
              </Paper>
            </Box>
          </>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, gap: 2 }}>
            <Bot size={48} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Select an agent to edit policy</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
