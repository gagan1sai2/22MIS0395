import { useState } from 'react';
import { AppBar, Box, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0} color="default">
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 800 }}>
              Notification Center
            </Typography>
          </Box>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box component="main">
        {activeTab === 0 ? <AllNotifications /> : <PriorityInbox />}
      </Box>
    </Box>
  );
}

export default App;
