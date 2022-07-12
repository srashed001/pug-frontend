import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";
import CalendarIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "../store/users/usersSlice";

function ActivityGameCard({ game, disabled = false }) {
  const {
    id,
    address,
    city,
    createdBy,
    daysDiff,
    players,
    state,
    time,
    title,
  } = game;

  const user = useSelector((state) =>
    selectUserById(state, createdBy.username)
  );

  return (
    <CardActionArea disabled={disabled} component={Link} to={`/games/g/${id}`}>
      <Card
        sx={{
          display: "flex",
          padding: 1,
          boxShadow: 3,
          width: "auto",
          borderRadius: 0,
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          sx={{ padding: 0.5, paddingLeft: 1, marginLeft: 2 }}
        >
          <Grid>
            <Typography
              component="div"
              variant="h6"
              sx={{
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 0.5,
              }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid sx={{ marginBottom: 2 }}>
            <Chip
              icon={<LocationIcon />}
              label={`${city}, ${state}`}
              size="small"
              sx={{ fontSize: 10, marginRight: 1, marginBottom: 1 }}
            />
            {players.length ? (
              <Chip
                icon={<GroupIcon />}
                label={players.length}
                size="small"
                sx={{ fontSize: 10, marginRight: 1, marginBottom: 1 }}
              />
            ) : null}
            <Chip
              icon={<CalendarIcon />}
              label={
                <span>
                  <Box
                    sx={{
                      color: daysDiff < 0 ? `#E64154` : "green",
                      display: "inline-flex",
                    }}
                  >
                    {Math.abs(daysDiff)}
                  </Box>
                  {daysDiff < 0 ? " days ago" : " days til game"}
                </span>
              }
              size="small"
              sx={{ fontSize: 10, marginBottom: 1 }}
            />
          </Grid>
          <Grid>
            <Typography
              component="div"
              variant="body1"
              sx={{
                fontFamily: "Roboto",
                fontSize: 12,
                color: "#555555",
              }}
            >
              <strong>Host:</strong> {user.firstName} {user.lastName}
            </Typography>
            <Typography
              component="div"
              variant="body1"
              sx={{
                fontFamily: "Roboto",
                fontSize: 12,
                color: "#555555",
              }}
            >
              <strong>Address:</strong> {address}
            </Typography>
            <Typography
              component="div"
              variant="body1"
              sx={{ fontFamily: "Roboto", fontSize: 12, color: "#555555" }}
            >
              <strong>Time:</strong> {time}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </CardActionArea>
  );
}

export default ActivityGameCard;
