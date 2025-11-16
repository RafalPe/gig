import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";
import { Event } from "@/types";

const mockEvent: Event = {
  id: "1",
  name: "Event Name",
  artist: "Artist Name",
  date: "2024-01-01T12:00:00.000Z",
  location: "Event Location",
  description: "Event Description",
  imageUrl: "/images/gig-placeholder.png",
  createdAt: "2024-01-01T12:00:00.000Z",
  updatedAt: "2024-01-01T12:00:00.000Z",
};

describe("EventCard", () => {
  it("should render event data correctly", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Event Name")).toBeInTheDocument();
    expect(screen.getByText("Artist Name")).toBeInTheDocument();
    expect(screen.getByText("1 stycznia 2024")).toBeInTheDocument();
    expect(screen.getByText("Event Location")).toBeInTheDocument();
    expect(screen.getByAltText("Zdjęcie dla Event Name")).toBeInTheDocument();
  });
});
