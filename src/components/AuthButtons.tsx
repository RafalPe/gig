"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box, Typography, Avatar } from "@mui/material";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Ładowanie...</p>;
  }

  if (session) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {session.user?.image && <Avatar src={session.user.image} />}
        <Typography>{session.user?.name}</Typography>
        <Button variant="contained" onClick={() => signOut()}>
          Wyloguj się
        </Button>
      </Box>
    );
  }
  return (
    <Button variant="contained" onClick={() => signIn("github")}>
      Zaloguj się z GitHub
    </Button>
  );
}
