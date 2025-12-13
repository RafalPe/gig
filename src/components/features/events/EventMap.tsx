"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box, Paper, Typography } from "@mui/material";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import LocationOnIcon from "@mui/icons-material/LocationOn";

type Props = {
  lat: number;
  lng: number;
  locationName: string;
};

export default function EventMap({ lat, lng, locationName }: Props) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!lat || !lng) return null;

  if (!mapboxToken) {
    return (
      <Paper
        elevation={1}
        sx={{
          mt: 3,
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: "grey.100",
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Mapa niedostępna (Brak konfiguracji Mapbox).
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 3,
        borderRadius: 3,
        overflow: "hidden",
        height: 350,
        position: "relative",
      }}
    >
      <Map
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Marker latitude={lat} longitude={lng} anchor="bottom">
          <LocationOnIcon
            color="secondary"
            sx={{
              fontSize: 48,
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))",
              cursor: "pointer",
              transform: "translateY(4px)",
            }}
          />
        </Marker>
      </Map>

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          bgcolor: "rgba(255,255,255,0.9)",
          px: 2,
          py: 1,
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: "80%",
          backdropFilter: "blur(4px)",
        }}
      >
        <Typography variant="caption" fontWeight="bold" color="text.primary">
          {locationName}
        </Typography>
      </Box>
    </Paper>
  );
}
