import {
  Grid,
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function NewThreadUserCard({ user, users, setUsers }) {
  const { username, firstName, lastName, city, state, profileImg } = user;

  function handleAddUser(user) {
    const newUser = { [user.username]: user };
    setUsers((state) => ({ ...state, ...newUser }));
  }
  function handleRemoveUser({ username }) {
    setUsers((state) => {
      const { [username]: user, ...rest } = state;
      return rest;
    });
  }

  return (
    <Grid sx={{ padding: 1 }} container>
      <Grid
        item
        xs={2}
        sm={1.5}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Avatar
          src={profileImg}
          sx={{ height: { xs: 50, sm: 75 }, width: { xs: 50, sm: 75 } }}
        />
      </Grid>
      <Grid item xs sx={{ paddingLeft: { xs: 1 } }}>
        <Stack>
          <Typography
            component={"h6"}
            sx={{
              fontFamily: "Roboto",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {firstName} {lastName}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#555555", fontSize: 12, marginBottom: 1 }}
          >
            {username}
          </Typography>
          <Box>
            <Chip
              icon={<LocationIcon />}
              label={`${city}, ${state}`}
              size="small"
              sx={{ fontSize: 10, marginRight: 1, marginBottom: 1 }}
            />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={2} sm={1}>
        {!users[user.username] ? (
          <IconButton
            onClick={() => handleAddUser(user)}
            color="primary"
            sx={{ marginLeft: 3 }}
            component="span"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleRemoveUser(user)}
            color="error"
            sx={{ marginLeft: 3 }}
            component="span"
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}

export default NewThreadUserCard;
