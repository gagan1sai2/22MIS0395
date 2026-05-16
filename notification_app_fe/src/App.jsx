import { useState } from 'react';
import { AppBar, Box, CssBaseline, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className="app-shell" sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0} color="default">
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: { xs: 1, sm: 1.5 } }}>
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} component="div" sx={{ fontWeight: 800 }}>
              Notification Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review all notifications or jump into the priority inbox.
            </Typography>
          </Stack>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            textColor="primary"
            indicatorColor="primary"
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
          >
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box component="main" className="tab-panel">
        {activeTab === 0 ? <AllNotifications /> : <PriorityInbox />}
      </Box>
    </Box>
  );
}

export default App;
