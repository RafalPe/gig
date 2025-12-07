import { Container, Box, Skeleton, Paper } from "@mui/material";

export default function LoadingEventDetails() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ mb: 3, borderRadius: 1 }}
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 5,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              minHeight: { xs: 300, md: 400 },
              bgcolor: "grey.100",
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1 }} />
            
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="50%" height={32} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="30%" height={32} />
              </Box>
            </Box>

            <Box>
              <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
        </Paper>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Skeleton variant="text" width={300} height={40} />
            <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             {[1, 2, 3].map((item) => (
                <Paper key={item} sx={{ p: 2 }}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width={150} height={24} />
                      </Box>
                      <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                   </Box>
                </Paper>
             ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
