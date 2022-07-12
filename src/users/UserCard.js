import { Link } from "react-router-dom";
import {
  CardActionArea,
  Card,
  Chip,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

import LocationIcon from "@mui/icons-material/LocationOn";

function UserCard({ user }) {
  const { username, firstName, lastName, city, state, profileImg} =
    user;

  return (
    <CardActionArea component={Link} to={`/users/u/${username}`}>
      <Card
        sx={{
          display: "flex",
          padding: 1,
          boxShadow: `1px 3px 10px 0px #0000001A`,
        }}
      >
        <CardMedia
          component="img"
          sx={{ marginleft: 4, width: 80, height: 80, borderRadius: 1 }}
          image={profileImg}
          alt="profile img"
        />
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          sx={{ padding: 0.5, paddingLeft: 1, marginLeft: 2 }}
        >
          <Grid item>
            <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1 }}>
              {firstName} {lastName}
            </Typography>
            <Typography
              component="div"
              variant="h6"
              sx={{
                fontFamily: "Roboto",
                fontSize: 12,
                color: "#555555",
              }}
            >
              {username}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              icon={<LocationIcon />}
              label={`${city}, ${state}`}
              size="small"
              sx={{ fontSize: 10, marginRight: 1, marginY: 1 }}
            />
          </Grid>
        </Grid>
      </Card>
    </CardActionArea>
  );
}

export default UserCard;
