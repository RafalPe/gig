"use client";
import { Container, Typography, Box, Button } from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Coś poszło nie tak!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={reset}
          sx={{ mt: 2 }}
        >
          Spróbuj ponownie
        </Button>
      </Box>
    </Container>
  );
}
