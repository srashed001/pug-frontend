import { Button, Grid, Typography, Stack, Paper } from "@mui/material";
import ProfileGameCard from "./ProfileGameCard";

function ProfileGamesList({ games, set }) {
  const gameSets = {
    gamesHostedPending: {
      title: "Games Hosted (pending)",
      caption: "upcoming games hosted by user",
      url: "",
    },
    gamesHostedResolved: {
      title: "Games Hosted (resolved)",
      caption: "past games hosted by user",
    },
    gamesJoinedPending: {
      title: "Games Joined (pending)",
      caption: "upcoming games joined by user",
      url: "",
    },
    gamesJoinedResolved: {
      title: "Games Joined (resolved)",
      caption: "past games joined by user",
    },
    inactiveGames: {
      title: "Inactive Games",
      caption: "games inactivated by user",
    },
  };

  const headings = gameSets[set];

  return (
    <Grid container sx={{ boxShadow: 3 }}>
      <Grid item xs={12}>
        <Paper
          sx={{ position: "relative", zIndex: 3, boxShadow: 3, padding: 1 }}
        >
          <Typography component={"div"} sx={{ fontSize: { xs: "20px" } }}>
            {headings.title}: {games.length}
          </Typography>
          <Typography component={"div"} variant={"caption"}>
            {headings.caption}
          </Typography>
        </Paper>

        <Stack
          direction="row"
          sx={{ overflowX: "auto", backgroundColor: "rgba(211, 211, 211, .7)" }}
        >
          {games.length ? (
            games.map((game) => <ProfileGameCard inactive={set === 'inactiveGames'} key={game.id} game={game} />)
          ) : (
            <Typography
              sx={{
                height: 200,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              component={"div"}
              variant={"h3"}
            >
              No Games
            </Typography>
          )}
        </Stack>
        <Button
          sx={{
            width: "auto",
            color: "black",
            borderRadius: 0,
          }}
          disabled={!games.length}
        >
          view all
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProfileGamesList;
