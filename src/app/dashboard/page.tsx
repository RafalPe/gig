'use client';
import { useGetUserDashboardQuery } from '@/lib/redux/userApi';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import MyEventsTab from '@/components/dashboard/MyEventsTab';
import MyGroupsTab from '@/components/dashboard/MyGroupsTab';
import SettingsTab from '@/components/SettingsTab';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
function CustomTabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useGetUserDashboardQuery();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Nie udało się załadować danych dashboardu.
        </Alert>
      </Container>
    );
  }

  const { myGroups = [], myEvents = [] } = data || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        Twoje Centrum
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<GroupIcon />} label={`Moje Ekipy (${myGroups.length})`} />
          <Tab
            icon={<EventIcon />}
            label={`Moje Zgłoszenia (${myEvents.length})`}
          />
          <Tab icon={<SettingsIcon />} label="Ustawienia" />
        </Tabs>
      </Paper>

      <CustomTabPanel value={tabValue} index={0}>
        <MyGroupsTab groups={myGroups} />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <MyEventsTab events={myEvents} />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <SettingsTab />
      </CustomTabPanel>
    </Container>
  );
}