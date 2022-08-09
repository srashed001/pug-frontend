import { Grid, Box, Typography, Stack, Paper, Avatar } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
function UserDetailsHeader({ user }) {
  return (
    <Stack sx={{ border: "lightpink", position: "relative" }}>
      <Grid container sx={{}}>
        <Grid item xs={12}>
          <Paper
            sx={{
              height: "100px",
              backgroundColor: "rgba(164, 22, 26,.5)",
              borderRadius: 0,
              boxShadow: 2,
            }}
          ></Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 0, boxShadow: 0 }}>
            <Box paddingLeft={18} marginY={1} paddingBottom={1}>
              <Typography
                sx={{
                  fontSize: { xs: "20px", sm: "30px" },
                  lineHeight: 1,
                }}
                component="div"
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                component={"div"}
                variant={"caption"}
                sx={{
                  fontSize: { xs: "12px", sm: "12px" },
                  paddingLeft: 0.5,
                }}
              >
                {user.city}, {user.state}
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: "12px", sm: "12px" },
                  paddingLeft: 0.5,
                }}
              >
                Membership:{" "}
                {user.createdOn &&
                  formatDistanceToNowStrict(new Date(user.createdOn))}{" "}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Avatar
        sx={{
          height: { xs: 100, sm: 100 },
          width: { xs: 100, sm: 100 },
          backgroundColor: "#ffffff",
          boxShadow: 3,
          position: "absolute",
          top: 50,
          left: 20,
        }}
        src={user.profileImg}
      />
    </Stack>
  );
}

export default UserDetailsHeader;
