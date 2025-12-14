"use client";
import { useEventView } from "./EventViewContext";
import { Box, Button, Collapse } from "@mui/material";
import { useState } from "react";
import DynamicEventMap from "./DynamicEventMap";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MapIcon from "@mui/icons-material/Map";

type Props = {
  lat: number;
  lng: number;
  locationName: string;
};

export default function InlineMap({ lat, lng, locationName }: Props) {
  const { isMapExpanded, toggleMap } = useEventView();
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = () => {
    if (!hasBeenOpened) setHasBeenOpened(true);
    toggleMap();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="text"
        size="small"
        startIcon={<MapIcon />}
        endIcon={isMapExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={handleToggle}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          "&:hover": { color: "primary.main", bgcolor: "transparent" },
        }}
      >
        {isMapExpanded ? "Ukryj mapę" : "Zobacz na mapie"}
      </Button>
      <Collapse in={isMapExpanded} timeout="auto">
        {hasBeenOpened && (
          <Box
            sx={{
              mt: 2,
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <DynamicEventMap lat={lat} lng={lng} locationName={locationName} />
          </Box>
        )}
      </Collapse>
    </Box>
  );
}
