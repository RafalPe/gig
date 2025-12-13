"use client";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), {
  ssr: false,
  loading: () => (
    <Skeleton
      variant="rectangular"
      height={350}
      sx={{ mt: 3, borderRadius: 3 }}
    />
  ),
});

type Props = {
  lat: number;
  lng: number;
  locationName: string;
};

export default function DynamicEventMap({ lat, lng, locationName }: Props) {
  return <EventMap lat={lat} lng={lng} locationName={locationName} />;
}
