"use client";
import { Event } from "@/types";
import { Box, Paper, Typography } from "@mui/material";
import EventHeaderImage from "./EventHeaderImage";
import InlineMap from "./InlineMap";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function EventDetailsCard({ event }: { event: Event }) {
  const hasCoordinates =
    typeof event.lat === "number" && typeof event.lng === "number";

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          minHeight: { xs: 300, md: 400 },
          position: "relative",
          bgcolor: "grey.100",
        }}
      >
        <EventHeaderImage
          src={event.imageUrl || "/images/gig-placeholder.png"}
          alt={event.name}
        />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "60%" },
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {event.name}
        </Typography>
        <Typography
          variant="h4"
          color="primary.main"
          gutterBottom
          sx={{ mb: 3, fontWeight: "medium" }}
        >
          {event.artist}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarTodayIcon color="action" />
            <Typography variant="h6">
              {new Date(event.date).toLocaleString("pl-PL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocationOnIcon color="action" />
              <Typography variant="h6">{event.location}</Typography>
            </Box>

            {/* Mapa Inline */}
            {hasCoordinates && (
              <Box sx={{ pl: 4.5 }}>
                <InlineMap
                  lat={event.lat!}
                  lng={event.lng!}
                  locationName={event.location}
                />
              </Box>
            )}
          </Box>
        </Box>

        {event.description && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              O wydarzeniu:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {event.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
