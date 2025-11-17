import { Container, Box, Skeleton, Paper } from "@mui/material";

export default function LoadingEventDetails() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Skeleton
          variant="rectangular"
          width={100}
          height={36}
          sx={{ mb: 2, borderRadius: 1 }}
        />

        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ borderRadius: 3, mb: 4 }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "5fr 7fr",
            },
            gap: 4,
          }}
        >
          <Box>
            <Skeleton variant="text" width={150} height={40} />
            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ mt: 2, borderRadius: 1 }}
              />
            </Paper>
          </Box>

          <Box>
            <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
            <Paper elevation={1} sx={{ p: 2 }}>
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: 1, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: 1 }}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
