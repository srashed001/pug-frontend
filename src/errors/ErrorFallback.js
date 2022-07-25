import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Stack className="publicHomepage" alignItems={"center"}>
      <Box
        sx={{
          width: "80%",
          textAlign: "center",
          marginTop: 10,
          paddingY: 3,
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography sx={{ fontSize: 26 }}>
          Foul: Something went wrong!
        </Typography>
        <Typography sx={{ fontSize: 24, marginBottom: 3 }}>
          {error.message}
        </Typography>
        <Box sx={{ display: "inline-flex", justifyContent: 'center', alignItems: 'center' }}>
          <Button sx={{ marginRight: 1 }} onClick={resetErrorBoundary}>
            Try Again
          </Button>
          <Typography sx={{ textDecoration: "none" }}>
            <Link style={{ textDecoration: "none" }} to={`/`} reloadDocument>
              GO HOME
            </Link>
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default ErrorFallback;
