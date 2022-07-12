import {
  Avatar,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import "./mapStyles.css";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarRateIcon from "@mui/icons-material/StarRate";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function CourtInfoWindow({ selected, handleClickOpen, location }) {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded((expanded) => !expanded);
  };

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Avatar
          variant={"rounded"}
          component={"div"}
          sx={{ width: { xs: "auto", sm: 150 }, height: { xs: 150, sm: 150 } }}
          src={selected.photos ? selected.photos[0].getUrl() : "courtIcon.svg"}
          alt="court image"
        />
        <Stack padding={1}>
          <Typography sx={{ fontSize: { xs: 16, sm: 20 } }}>
            {selected.name}
          </Typography>
          <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
            Address:{" "}
          </Typography>
          <Divider flexItem />
          <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>
            {location.address}
          </Typography>
          <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>
            {location.city}, {location.state}
          </Typography>
          <Box sx={{ paddingY: 1 }}>
            {selected.opening_hours ? (
              selected.opening_hours.isOpen() ? (
                <Chip
                  size="small"
                  sx={{ backgroundColor: "#80b918", color: "#ffffff" }}
                  label={"open"}
                />
              ) : (
                <Chip size="small" label={"closed"} />
              )
            ) : null}
          </Box>
          {handleClickOpen && (
            <Box>
              <Button onClick={handleClickOpen} sx={{ color: "#161A1D" }}>
                create game
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
      <Box sx={{ position: "absolute" }}>
        {selected.rating && (
          <Chip
            icon={<StarRateIcon />}
            size="small"
            color={"success"}
            label={selected.rating}
            sx={{ backgroundColor: "#ffb703" }}
          />
        )}
      </Box>

      {selected.opening_hours?.weekday_text && (
        <>
          <Typography
            sx={{ borderRadius: 0, marginBottom: 1, padding: 0.5 }}
            component={Paper}
          >
            Hours:
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-label="Show hours of Operation"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Typography>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Stack>
              {selected.opening_hours.weekday_text.map((day) => (
                <Typography key={day} variant="caption">{day}</Typography>
              ))}
            </Stack>
          </Collapse>
        </>
      )}
    </Stack>
  );
}

export default CourtInfoWindow;
