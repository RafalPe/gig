import { Button, Typography, Container } from "@mui/material";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Welcome to Next.js with MUI!
        </Typography>
        <Button variant="contained">Button 😱</Button>
      </Box>
    </Container>
  );
}
