import { Event } from "@/types";

export type EventsResponse = {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function getEvents(searchQuery: string | null, page: number = 1, limit: number = 9): Promise<EventsResponse> {
  const searchParam = searchQuery ? `&search=${searchQuery}` : "";
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/events?page=${page}&limit=${limit}${searchParam}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}