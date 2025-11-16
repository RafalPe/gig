import { getEvents } from "./api";
import { Event } from "@/types";

global.fetch = jest.fn();

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Event 1",
    artist: "Artist 1",
    date: new Date().toISOString(),
    location: "Location 1",
    description: "Description 1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: null,
  },
];

describe("getEvents", () => {
  it("should return events on successful fetch", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });

    const events = await getEvents(null);
    expect(events).toEqual(mockEvents);
  });

  it("should throw an error on failed fetch", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(getEvents(null)).rejects.toThrow("Failed to fetch events");
  });
});
