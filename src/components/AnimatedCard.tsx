"use client";
import { motion } from "framer-motion";
import type { Event } from "@/types";
import EventCard from "./EventCard";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedCard({ event }: { event: Event }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ height: "100%" }}
    >
      <EventCard event={event} />
    </motion.div>
  );
}
