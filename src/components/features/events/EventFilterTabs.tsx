"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";

export default function EventFilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter =
    searchParams.get("filter") === "past" ? "past" : "upcoming";

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", newValue);
    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  };

  return (
    <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={currentFilter}
        onChange={handleChange}
        aria-label="event filter tabs"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          icon={<EventIcon />}
          iconPosition="start"
          label="Nadchodzące"
          value="upcoming"
        />
        <Tab
          icon={<HistoryIcon />}
          iconPosition="start"
          label="Archiwum"
          value="past"
        />
      </Tabs>
    </Box>
  );
}
