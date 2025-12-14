"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type EventViewContextType = {
  isMapExpanded: boolean;
  toggleMap: () => void;
  setMapExpanded: (expanded: boolean) => void;
};

const EventViewContext = createContext<EventViewContextType | undefined>(
  undefined
);

export function EventViewProvider({ children }: { children: ReactNode }) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const toggleMap = () => setIsMapExpanded((prev) => !prev);
  const setMapExpanded = (expanded: boolean) => setIsMapExpanded(expanded);

  return (
    <EventViewContext.Provider
      value={{ isMapExpanded, toggleMap, setMapExpanded }}
    >
      {children}
    </EventViewContext.Provider>
  );
}

export function useEventView() {
  const context = useContext(EventViewContext);
  if (context === undefined) {
    throw new Error("useEventView must be used within an EventViewProvider");
  }
  return context;
}
