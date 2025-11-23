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
} from "@mui/material";
import Link from "next/link";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetUserDashboardQuery } from "@/lib/redux/userApi";

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
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nie zgłosiłeś jeszcze żadnych wydarzeń.
            </Typography>
            <Button
              component={Link}
              href="/events/new"
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Dodaj pierwsze wydarzenie
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {myEvents.map((event) => (
              <Paper
                key={event.id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data: {new Date(event.date).toLocaleDateString("pl-PL")}
                  </Typography>
                </Box>
                <Chip
                  icon={
                    event.isVerified ? <CheckCircleIcon /> : <AccessTimeIcon />
                  }
                  label={
                    event.isVerified
                      ? "Zatwierdzone"
                      : "Oczekuje na weryfikację"
                  }
                  color={event.isVerified ? "success" : "warning"}
                  variant="outlined"
                />
              </Paper>
            ))}
          </Box>
        )}
      </CustomTabPanel>
    </Container>
  );
}
