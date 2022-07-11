import {
  Grid,
  Box,
  Typography,
  Chip,
  CardMedia,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function NewThreadUserCard({ user, users, setUsers }) {
  const { username, firstName, lastName, city, state, profileImg, isPrivate } =
    user;

  console.log(users);

  function addUser(user) {
    const newUser = { [user.username]: user };
    setUsers((state) => ({ ...state, ...newUser }));
  }
  function removeUser({ username }) {
    setUsers((state) => {
      const { [username]: user, ...rest } = state;
      return rest;
    });
  }

  return (
    <Grid sx={{ padding: 1}} container>
      <Grid item xs={2} sm={1.5} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Avatar
          src={user.profileImg}
          sx={{ height: { xs: 50, sm: 75 }, width: { xs: 50, sm: 75 } }}
        />
      </Grid>
      <Grid item xs sx={{paddingLeft: {xs: 1}}} >
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
            onClick={() => addUser(user)}
            color="primary"
            sx={{ marginLeft: 3 }}
            component="span"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => removeUser(user)}
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
  //   <Box
  //     sx={{
  //       display: "flex",
  //       padding: 1,
  //       boxShadow: `1px 3px 10px 0px #0000001A`,

  //     }}
  //   >
  //     <CardMedia
  //       component="img"
  //       sx={{marginleft: 4, width: 100, height: 100, borderRadius: 1 }}
  //       image={
  //         "https://image.shutterstock.com/image-photo/basketball-600w-678814261.jpg"
  //       }
  //       alt="profile img"
  //     />
  //         <CardActionArea component={Link} to={`/users/u/${username}`} >
  //     <Grid
  //       container
  //       direction="column"
  //       justifyContent="space-between"

  //       sx={{ padding: 0.5, paddingLeft: 1, marginLeft: 2 }}
  //     >
  //       <Grid item>
  //         <Typography
  //           component="div"
  //           variant="h6"
  //           sx={{
  //             fontFamily: "Roboto",
  //             fontWeight: 700,
  //             fontSize: 16,
  //             marginBottom: 0.5,
  //           }}
  //         >
  //          {username}
  //         </Typography>
  //         <Typography
  //         variant="body1"
  //         sx={{ color: "#555555", fontSize: 12, marginBottom: 1.5 }}
  //       >
  //         {firstName} {lastName}
  //       </Typography>
  //       </Grid>
  //       <Grid item >
  //         <Chip
  //           icon={<LocationIcon />}
  //           label={`${city}, ${state}`}
  //           size="small"
  //           sx={{ fontSize: 10, marginRight: 1, marginBottom: 1 }}
  //         />
  //       </Grid>
  //     </Grid>

  //     </CardActionArea>
  //   </Box>
}

export default NewThreadUserCard;
