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

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [agents, setAgents] = useState<Agent[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const [newDomain, setNewDomain] = useState('');

  const [saving, setSaving] = useState(false);



  const fetchPolicies = React.useCallback(async () => {

    try {

      const response = await fetch('/api/policies');

      if (response.ok) {

        const data = await response.json();

        setAgents(data);

        if (data.length > 0 && !editingAgent && !isMobile) {

          setEditingAgent(data[0]);

        }

      }

    } catch (err) {

      console.error('Failed to fetch policies:', err);

    } finally {

      setLoading(false);

    }

  }, [editingAgent, isMobile]);



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

        if (isMobile) setEditingAgent(null);

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

    <Box sx={{ display: 'flex', gap: { xs: 0, md: 4 }, height: isMobile ? 'auto' : 'calc(100vh - 160px)', flexDirection: { xs: 'column', md: 'row' } }}>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: isMobile ? 'visible' : 'auto' }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>

          <Box>

            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Policy Manager</Typography>

            {!isMobile && (

              <Typography sx={{ fontSize: 14, color: 'primary.main', mt: 1, fontWeight: 700 }}>

                Configure guardrails and budget limits for M2M agents.

              </Typography>

            )}

          </Box>

          <Button 

            variant="contained" 

            startIcon={<Plus size={20} />}

            sx={{ 

              px: { xs: 2, md: 4 }, 

              py: 1.5, 

              borderRadius: 3, 

              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',

              fontWeight: 800,

              fontSize: { xs: 11, md: 13 }

            }}

          >

            Add Agent

          </Button>

        </Box>



        <Grid container spacing={2}>

          {[

            { label: 'Total Daily Ceiling', value: '$5,000', icon: CreditCard },

            { label: 'Active Agents', value: '12', icon: Bot },

            { label: 'Avg. Utilization', value: '42.8%', icon: Activity },

          ].map((stat, i) => (

            <Grid size={{ xs: 12, sm: 4 }} key={i}>

              <Paper sx={{ p: 2.5, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>

                  <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>{stat.label}</Typography>

                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.75rem' } }}>{stat.value}</Typography>

              </Paper>

            </Grid>

          ))}

        </Grid>



        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>

            <Settings size={20} />

            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' } }}>Managed Agents</Typography>

            {loading && <CircularProgress size={16} color="inherit" />}

          </Box>



          <Grid container spacing={2}>

            {agents.map((agent) => (

              <Grid size={{ xs: 12, sm: 6 }} key={agent.id}>

                <Paper 

                  onClick={() => setEditingAgent(agent)}

                  sx={{ 

                    p: { xs: 2.5, md: 4 }, 

                    borderRadius: 4, 

                    cursor: 'pointer',

                    border: '1px solid',

                    borderColor: editingAgent?.id === agent.id ? 'primary.main' : 'rgba(16, 185, 129, 0.1)',

                    bgcolor: editingAgent?.id === agent.id ? alpha('#10b981', 0.05) : '#0c1410',

                    transition: 'all 0.2s ease'

                  }}

                >

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>

                    <Box>

                      <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', fontFamily: 'JetBrains Mono, monospace' }}>ID: {agent.id}</Typography>

                      <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>{agent.name}</Typography>

                    </Box>

                    <Chip 

                      label={agent.status} 

                      size="small"

                      sx={{ fontSize: 9, fontWeight: 900 }}

                    />

                  </Box>



                  <Box sx={{ mb: 4 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>

                      <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary' }}>Daily Progress</Typography>

                      <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'primary.main' }}>${agent.currentSpend} / ${agent.dailyBudget}</Typography>

                    </Box>

                    <LinearProgress 

                      variant="determinate" 

                      value={(agent.currentSpend / agent.dailyBudget) * 100} 

                      sx={{ height: 6, borderRadius: 10 }}

                    />

                  </Box>



                  <Button 

                    fullWidth 

                    variant={editingAgent?.id === agent.id ? 'contained' : 'outlined'}

                    sx={{ py: 1, borderRadius: 2.5, fontSize: 11, fontWeight: 800 }}

                  >

                    Manage Policy

                  </Button>

                </Paper>

              </Grid>

            ))}

          </Grid>

        </Box>

      </Box>



      {/* Editor - Mobile Sheet or Sidebar */}

      <Dialog 

        open={!!editingAgent && isMobile} 

        onClose={() => setEditingAgent(null)}

        fullWidth

        maxWidth="xs"

        PaperProps={{

          sx: { 

            bgcolor: '#08120e', 

            m: 0, 

            position: 'fixed', 

            bottom: 0, 

            borderRadius: '24px 24px 0 0',

            maxHeight: '90vh'

          }

        }}

      >

        <DialogContent sx={{ p: 4 }}>

          {editingAgent && (

            <PolicyEditor 

              agent={editingAgent} 

              onSave={handleSave} 

              onClose={() => setEditingAgent(null)}

              saving={saving}

              setEditingAgent={setEditingAgent}

              newDomain={newDomain}

              setNewDomain={setNewDomain}

              handleAddDomain={handleAddDomain}

              removeDomain={removeDomain}

            />

          )}

        </DialogContent>

      </Dialog>



      {!isMobile && (

        <Box sx={{ width: 400, borderLeft: '1px solid rgba(16, 185, 129, 0.15)', bgcolor: '#08120e', p: 4, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>

          {editingAgent ? (

            <PolicyEditor 

              agent={editingAgent} 

              onSave={handleSave} 

              onClose={() => setEditingAgent(null)}

              saving={saving}

              setEditingAgent={setEditingAgent}

              newDomain={newDomain}

              setNewDomain={setNewDomain}

              handleAddDomain={handleAddDomain}

              removeDomain={removeDomain}

            />

          ) : (

            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, gap: 2 }}>

              <Bot size={48} />

              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Select an agent to edit</Typography>

            </Box>

          )}

        </Box>

      )}

    </Box>

  );

}



function PolicyEditor({ agent, onSave, saving, setEditingAgent, newDomain, setNewDomain, handleAddDomain, removeDomain, onClose }: any) {

  return (

    <>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>

          <ShieldCheck size={20} />

          <Typography variant="h6" sx={{ fontWeight: 800 }}>Policy: {agent.name}</Typography>

        </Box>

        <IconButton onClick={onClose} sx={{ color: 'text.secondary', display: { md: 'none' } }}>

          <X size={24} />

        </IconButton>

      </Box>



      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        <Box>

          <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', mb: 1.5 }}>Daily Limit</Typography>

          <TextField 

            fullWidth

            type="number"

            value={agent.dailyBudget}

            onChange={(e) => setEditingAgent({...agent, dailyBudget: parseFloat(e.target.value) || 0})}

            InputProps={{

              startAdornment: <InputAdornment position="start" sx={{ '& p': { color: 'text.secondary' } }}>$</InputAdornment>,

            }}

          />

        </Box>



        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase' }}>Allowed Domains</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>

            {agent.allowedDomains.map((domain: string, i: number) => (

              <Chip key={i} label={domain} onDelete={() => removeDomain(domain)} size="small" sx={{ borderRadius: 1 }} />

            ))}

          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>

            <TextField fullWidth size="small" placeholder="Add..." value={newDomain} onChange={(e) => setNewDomain(e.target.value)} />

            <Button onClick={handleAddDomain} variant="outlined" sx={{ minWidth: 60 }}>Add</Button>

          </Box>

        </Box>



        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

          <Button variant="contained" onClick={onSave} disabled={saving} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />} sx={{ py: 1.5, fontWeight: 800 }}>

            {saving ? 'Saving...' : 'Save Changes'}

          </Button>

        </Box>

      </Box>

    </>

  );

}
