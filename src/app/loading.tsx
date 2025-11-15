import { Container, Box, Skeleton } from "@mui/material";

export default function Loading() {
  const skeletons = Array.from(new Array(6));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Skeleton variant="text" width={400} height={50} sx={{ mb: 4 }} />

        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {skeletons.map((_, index) => (
            <Box key={index}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 3 }}
              />
              <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
