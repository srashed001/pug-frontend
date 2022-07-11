import {
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
function UserDetailsBio({ user }) {
  return (
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          paddingX: 1,
        }}
        container
      >
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", sm: "center" },
            alignItems: { xs: "flex-start", sm: "center" },
          }}
          xs={"auto"}
        >
          <Box
            sx={{
              height: { xs: 100, sm: 100 },
              width: { xs: 100, sm: 100 },
              backgroundColor: "#ffffff",
              boxShadow: "1px 1px 3px #D3D3D3",
              borderRadius: '50%'
            }}
            component="img"
            src={user.profileImg}
          />
        </Grid>
        <Grid
          item
          xs
          sx={{
            display: "flex",
            alignItems: "stretch",
            marginLeft: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingLeft: 1,
              width: "100%",
            }}
          >
            <Box
            >
              <Typography
                component={"div"}
                sx={{
                  fontSize: { xs: "12px", sm: "12px" },
                }}
              >
                {user.city}, {user.state}
              </Typography>
              <Typography
                component={"div"}
                sx={{
                  fontSize: { xs: "12px", sm: "12px" },
                }}
              >
                Membership:{" "}
                {user.createdOn &&
                  formatDistanceToNowStrict(new Date(user.createdOn))}{" "}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "20px",sm: "30px" },
              }}
              component="div"
            >
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        </Grid>
      </Grid>

  );
}

export default UserDetailsBio;
