"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useDeleteEventMutation, useGetUserDashboardQuery } from "@/lib/redux/userApi";
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsTab from '@/components/SettingsTab';
import toast from "react-hot-toast";
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ConfirmDialog from "@/components/ConfirmDialog";
import RequestDeleteModal from "@/components/RequestDeleteModal";
import CancelIcon from '@mui/icons-material/Cancel';
import { DashboardEvent } from "@/types";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

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
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [requestModalEventId, setRequestModalEventId] = useState<string | null>(null);
  const [confirmModalEventId, setConfirmModalEventId] = useState<string | null>(null);


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

const handleDeleteClick = (eventId: string, groupsCount: number) => {
    if (groupsCount > 0) {
      setRequestModalEventId(eventId);
    } else {
      setConfirmModalEventId(eventId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmModalEventId) return;

    try {
      await deleteEvent(confirmModalEventId).unwrap();
      toast.success('Zgłoszenie usunięte.');
      setConfirmModalEventId(null);
    } catch {
      toast.error('Nie udało się usunąć zgłoszenia.');
    }
  };

  const renderDeleteStatus = (event: DashboardEvent) => {
    const latestRequest = event.deletionRequests?.[0];

    if (!latestRequest) return null;

    if (latestRequest.status === 'PENDING') {
      return (
        <Chip
          icon={<HourglassEmptyIcon />}
          label="Weryfikacja usuwania"
          color="warning"
          variant="outlined"
          size="small"
        />
      );
    }

    if (latestRequest.status === 'REJECTED') {
      return (
        <Tooltip title="Administrator odrzucił poprzednią prośbę. Możesz spróbować ponownie.">
          <Chip
            icon={<CancelIcon />}
            label="Odmowa usunięcia"
            color="error"
            variant="outlined"
            size="small"
          />
        </Tooltip>
      );
    }

    return null;
  };
  

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
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
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Twoje Centrum
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
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
        {myGroups.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nie należysz jeszcze do żadnej ekipy.
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Znajdź wydarzenie
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {myGroups.map((group) => (
              <Card key={group.id} sx={{ height: "100%" }}>
                <CardActionArea
                  component={Link}
                  href={`/events/${group.event.id}`}
                  sx={{ height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={group.event.imageUrl || "/images/default-event.jpg"}
                    alt={group.event.name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      noWrap
                    >
                      {group.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Wydarzenie: <strong>{group.event.name}</strong>
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {new Date(group.event.date).toLocaleDateString("pl-PL")} •{" "}
                      {group.event.location}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </CustomTabPanel>

     <CustomTabPanel value={tabValue} index={1}>
        {myEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">Nie zgłosiłeś jeszcze żadnych wydarzeń.</Typography>
            <Button component={Link} href="/events/new" variant="outlined" sx={{ mt: 2 }}>
              Dodaj pierwsze wydarzenie
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {myEvents.map((event) => {
              const latestRequest = event.deletionRequests?.[0];
              const isPendingDelete = latestRequest?.status === 'PENDING';

              return (
                <Paper key={event.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{event.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {new Date(event.date).toLocaleDateString('pl-PL')}
                      {event._count.groups > 0 && (
                        <Box component="span" sx={{ ml: 2, color: 'warning.main', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <GroupIcon fontSize="small" /> {event._count.groups} aktywnych ekip
                        </Box>
                      )}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Chip
                        icon={event.isVerified ? <CheckCircleIcon /> : <AccessTimeIcon />}
                        label={event.isVerified ? 'Zatwierdzone' : 'Oczekuje na weryfikację'}
                        color={event.isVerified ? 'success' : 'warning'}
                        variant="outlined"
                        size="small"
                      />
                      {renderDeleteStatus(event)}
                    </Box>
                    
                    <Tooltip title={isPendingDelete ? "Oczekiwanie na decyzję administratora" : (event._count.groups > 0 ? "Poproś o usunięcie" : "Usuń zgłoszenie")}>
                      <span>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(event.id, event._count.groups)}
                          disabled={isDeleting || isPendingDelete}
                        >
                          {event._count.groups > 0 ? <ReportProblemIcon /> : <DeleteIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <SettingsTab />
      </CustomTabPanel>
        <RequestDeleteModal 
        open={!!requestModalEventId} 
        eventId={requestModalEventId}
        onClose={() => setRequestModalEventId(null)}
      />
      <ConfirmDialog
        open={!!confirmModalEventId}
        title="Usuwanie zgłoszenia"
        description="Czy na pewno chcesz trwale usunąć to wydarzenie? Tej operacji nie można cofnąć."
        confirmText="Usuń trwale"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmModalEventId(null)}
      />
    </Container>
  );
}
