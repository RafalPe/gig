"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SuccessToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const eventSubmitted = searchParams.get("event_submitted");

    if (eventSubmitted === "true") {
      toast.success("Wydarzenie wysłane do weryfikacji!");

      window.history.replaceState(null, "", "/");
    }
  }, [searchParams]);

  return null;
}
