"use client";
import { useEventView } from "./EventViewContext";
import { Skeleton } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export default function EventHeaderImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [coverScale, setCoverScale] = useState(1);
  const { isMapExpanded } = useEventView();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageDimensionsRef = useRef<{ width: number; height: number } | null>(
    null
  );

  const calculateScale = useCallback(() => {
    if (!containerRef.current || !imageDimensionsRef.current) return;

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();
    const { width: imageW, height: imageH } = imageDimensionsRef.current;

    if (containerW === 0 || containerH === 0 || imageW === 0 || imageH === 0)
      return;

    const scaleContain = Math.min(containerW / imageW, containerH / imageH);
    const scaleCover = Math.max(containerW / imageW, containerH / imageH);

    const ratio = scaleCover / scaleContain;

    setCoverScale(ratio);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      calculateScale();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [calculateScale]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: isLoaded ? 0 : 1,
          transition: "opacity 0.5s",
          zIndex: 10,
        }}
      />

      {/* LAYER 1: Background Blur (Always Cover) 
          - Acts as the backdrop for the gap areas when zoomed out.
      */}
      <Image
        src={src}
        alt=""
        fill
        style={{
          objectFit: "cover",
          opacity: isLoaded ? 1 : 0,
          filter: "blur(20px) brightness(0.7)",
          transition: "opacity 0.5s ease-in-out",
        }}
        priority
        sizes="(max-width: 768px) 100vw, 40vw"
        aria-hidden="true"
      />

      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: "contain",
          opacity: isLoaded ? 1 : 0,
          transform: isMapExpanded ? "scale(1)" : `scale(${coverScale})`,
          transition: "transform 0.8s ease-in-out, opacity 0.5s",
          zIndex: 2,
        }}
        priority
        sizes="(max-width: 768px) 100vw, 40vw"
        onLoad={(e) => {
          imageDimensionsRef.current = {
            width: e.currentTarget.naturalWidth,
            height: e.currentTarget.naturalHeight,
          };
          calculateScale();
          setIsLoaded(true);
        }}
      />
    </div>
  );
}
