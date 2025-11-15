import { Container, Typography, Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" component="p" sx={{ ml: 2 }}>
          Ładowanie...
        </Typography>
      </Box>
    </Container>
  );
}
