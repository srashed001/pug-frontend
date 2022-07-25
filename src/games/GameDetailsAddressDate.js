import { Typography, Paper, Stack, Divider } from "@mui/material";
import { format } from "date-fns";

function GameDetailsAddressDate({ game }) {
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
        Details:
      </Typography>
      <Stack sx={{ minHeight: 200 }}>
        <Divider textAlign="left">
          <Typography component={"h5"}>Address:</Typography>
        </Divider>
        <Typography variant="body1" sx={{ paddingX: 2 }}>
          {game.address}
        </Typography>
        <Typography variant="body1" sx={{ paddingX: 2 }}>
          {game.city}, {game.state}
        </Typography>
        <Divider textAlign="left">
          <Typography component={"h5"}>Date:</Typography>
        </Divider>
        <Typography variant="body1" sx={{ paddingX: 2 }}>
          {format(new Date(game.date), "PP")}
        </Typography>
        <Typography variant="body1" sx={{ paddingX: 2 }}>
          {format(new Date(`1995-12-17T${game.time}`), "p")}
        </Typography>
      </Stack>
    </>
  );
}

export default GameDetailsAddressDate;
