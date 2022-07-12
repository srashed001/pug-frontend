import { useSelector } from "react-redux";
import { selectUserById } from "../store/users/usersSlice";
import {
  Avatar,
  Typography,
  Paper,
  Grid,
  Stack,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";

function GameDetailsHost({ game }) {
  const user = useSelector((state) =>
    selectUserById(state, game.createdBy.username)
  );

  if (user)
    return (
      <>
        <Typography
          component={Paper}
          sx={{
            marginY: 1,
            padding: 1,
            fontSize: { xs: "20px", sm: "24px" },
            borderRadius: 0,
            boxShadow: "1px 1px 3px #D3D3D3",
          }}
        >
          Game Host:
        </Typography>
        <CardActionArea component={Link} to={`/users/u/${user.username}`}>
          <Grid container sx={{ paddingX: 1 }}>
            <Grid item xs sx={{ display: "inline-flex", alignItems: "center" }}>
              <Avatar
                src={user.profileImg}
                sx={{ width: 100, height: 100, margin: 1 }}
              />
              <Stack sx={{ paddingLeft: 1 }}>
                <Typography variant="h5">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography>
                  {user.city}, {user.state}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardActionArea>
      </>
    );
}

export default GameDetailsHost;
