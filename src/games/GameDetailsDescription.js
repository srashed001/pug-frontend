import { Paper, Typography } from "@mui/material";

function GameDetailsDescription({ body }) {
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
        Description:
      </Typography>
      <Typography
        variant={"body1"}
        component={Paper}
        sx={{
          marginY: 1,
          paddingLeft: 2,
          minHeight: 100,
          boxShadow: 0,
        }}
      >
        {body}
      </Typography>
    </>
  );
}

export default GameDetailsDescription;
