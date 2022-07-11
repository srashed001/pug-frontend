import {
  Box,
  Grid,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserById } from "../store/users/usersSlice";
import { Link } from "react-router-dom";
import { formatDistanceToNowStrict,format } from "date-fns";

function ProfileGameCard({ game }) {
  const {
    id,
    address,
    city,
    createdBy,
    date,
    daysDiff,
    isActive,
    players,
    state,
    time,
    title,
  } = game;

  const user = useSelector((state) => selectUserById(state, game.createdBy.username));

  if (!game.isActive) return null;

  return (
    <Grid
      container
      sx={{
        maxWidth: 250,
        minWidth: 250,
        margin: 1,
        backgroundColor: '#FFFFFF',
        boxShadow: 3,
    
        borderRadius: 2
      }}
    >
      <Grid item xs={12}>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingX: 1,
          }}
        >
          <Typography
            sx={{ fontSize: {xs: '20px', sm:"24px"} }}
            noWrap
            component={"div"}
            marginBottom={2}
            marginTop={2}
          >
            {game.title}
          </Typography>
          <Typography sx={{ fontSize: {xs: '12px', sm: "16px"} }} component={"div"}>
            Address
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: {xs: '12px', sm: "14px"} }} component={"div"}>
            {game.address}
          </Typography>
          <Typography sx={{ fontSize: {xs: '12px', sm: "14px"} }} component={"div"} marginBottom={2}>
            {game.city}, {game.state}
          </Typography>
          <Typography sx={{ fontSize: {xs: '12px', sm: "16px"} }}  component={"div"}>
            Date
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: {xs: '12px', sm: "14px"} }} component={"div"}>
            {format(new Date(game.date), 'PP')}
          </Typography>
          <Typography sx={{ fontSize: {xs: '12px', sm: "14px"} }} component={"div"} marginBottom={2}>
            {format(new Date(`1995-12-17T${game.time}`), 'p')}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider>
          <Box component={Link} to={`/games/g/${game.id}`}>
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
          </Box>
        </Divider>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: 2,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 1,
        }}
      >
        <Typography
          component={"div"}
          sx={{
            fontWeight: "",
            fontSize: { xs: "14px", sm: "14px" },
          }}
        >
          {user.firstName} {user.lastName} {"(host)"}
        </Typography>
        <Typography
          component={"div"}
          sx={{
            fontSize: { xs: "12px", sm: "12px" },
          }}
        >
          created:{" "}
          {formatDistanceToNowStrict(new Date(game.createdOn), {
            addSuffix: "ago",
          })}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProfileGameCard;
