import { Box, Typography, Chip } from "@mui/material";

function NewThreadPartyList({ users }) {
  return (
    <Box sx={{ margin: 1 }}>
      <Typography component="span">To: </Typography>
      {Object.entries(users).map(([k, v]) => (
        <Chip
          key={k}
          sx={{ marginX: 0.5 }}
          label={`${v.firstName} ${v.lastName}`}
        />
      ))}
    </Box>
  );
}

export default NewThreadPartyList;
