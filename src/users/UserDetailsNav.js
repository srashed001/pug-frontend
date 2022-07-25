import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import MessageIcon from "@mui/icons-material/Message";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useSelector } from "react-redux";

function UserDetailsNav({ user, state, toggle, initiateNewMessage }) {
  const myUsername = useSelector((state) => state.my.username);
  const navigate = useNavigate();
  const getFollowers = useCallback(() => {
    navigate(`/relationships/f/${user.username}`);
  }, [navigate, user.username]);

  return (
    <Grid container justifyContent={"center"} sx={{ marginTop: 1 }}>
      <Grid item xs={12}>
        <Box>
          <Box sx={{ paddingY: 1, boxShadow: 3 }}>
            <Stack justifyContent="space-evenly" direction="row">
              <Typography component={"div"} variant={"subtitle1"}>
                social
              </Typography>
              <Typography component={"div"} variant={"body1"}>
                games
              </Typography>
            </Stack>
          </Box>
          <Stack
            justifyContent="space-around"
            direction="row"
            sx={{ margin: 1 }}
          >
            <Typography component={"div"} sx={{ fontSize: { xs: "12px" } }}>
              followers:{" "}
              <Link
                style={{ textDecoration: "none" }}
                to={`/relationships/f/${user.username}`}
              >
                {user.followers.ids.length}
              </Link>
            </Typography>
            <Typography component={"div"} sx={{ fontSize: { xs: "12px" } }}>
              following:{" "}
              <Link
                style={{ textDecoration: "none" }}
                to={`/relationships/g/${user.username}`}
              >
                {user.follows.ids.length}
              </Link>
            </Typography>
            <Typography component={"div"} sx={{ fontSize: { xs: "12px" } }}>
              hosted:{" "}
              {user.games.hosted.pending.length +
                user.games.hosted.resolved.length}
            </Typography>
            <Typography component={"div"} sx={{ fontSize: { xs: "12px" } }}>
              joined:{" "}
              {user.games.joined.pending.length +
                user.games.joined.resolved.length}
            </Typography>
          </Stack>
          {myUsername && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 3,
              }}
            >
              {myUsername === user.username ? null : state === "follow" ? (
                <IconButton onClick={toggle} component="span">
                  <PersonAddAlt1Icon />
                </IconButton>
              ) : (
                <IconButton onClick={toggle} component="span">
                  <PersonRemoveAlt1Icon />
                </IconButton>
              )}
              <IconButton
                onClick={getFollowers}
                sx={{ marginLeft: 3 }}
                component="span"
              >
                <PeopleIcon />
              </IconButton>
              {myUsername === user.username ? null : (
                <IconButton
                  onClick={initiateNewMessage}
                  sx={{ marginLeft: 3 }}
                  component="span"
                >
                  <MessageIcon />
                </IconButton>
              )}
            </Box>
          )}
          {!myUsername && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 3,
              }}
            >
              <Typography><Link to={'/login'}>Login</Link> or <Link to={`/signup`}>Signup</Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default UserDetailsNav;
