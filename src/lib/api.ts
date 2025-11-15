import { Event } from "@/types";

export async function getEvents(searchQuery: string | null): Promise<Event[]> {
  const searchParam = searchQuery ? `?search=${searchQuery}` : "";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events${searchParam}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}
