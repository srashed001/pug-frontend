import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllCourts } from "../store/courts/courtsSlice";
import ViewListIcon from "@mui/icons-material/ViewList";

export default function CourtsListDrawer({ loadInfoWindow, handleClickOpen }) {
  const courts = useSelector(selectAllCourts);
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState((state) => open);
  };

  const list = () => (
    <Box
      sx={{ width: 400 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      ml={2}
    >
      <List>
        {courts.map((court) => (
          <Box key={court.place_id}>
            <ListItem alignItems="flex-start" disablePadding>
              <ListItemAvatar>
                <Avatar
                  src={
                    court.photos ? court.photos[0].getUrl() : "courtIcon.svg"
                  }
                />
              </ListItemAvatar>

              <ListItemText
                primary={court.name}
                secondary={
                  <Box>
                    <Typography
                      sx={{ display: "block", fontSize: 14 }}
                      component="p"
                      color="text.primary"
                    >
                      {court.vicinity}
                    </Typography>

                    {court.rating && (
                      <Typography
                        sx={{ display: "block", fontSize: 14 }}
                        component="p"
                        color="text.primary"
                      >
                        rating: {court.rating}
                      </Typography>
                    )}

                    <Box>
                      <Button
                        sx={{ color: "#161A1D" }}
                        onClick={() => {
                          loadInfoWindow({ placeId: court.place_id });
                        }}
                      >
                        Details
                      </Button>
                      <Button
                        sx={{ color: "#161A1D" }}
                        onClick={() => {
                          loadInfoWindow({ placeId: court.place_id }, true);
                          handleClickOpen();
                        }}
                      >
                        Create Game
                      </Button>
                    </Box>
                  </Box>
                }
              />
            </ListItem>

            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Button
        startIcon={<ViewListIcon />}
        sx={{ color: "#ffffff", fontSize: "10px", fontFamily: "Roboto" }}
        onClick={toggleDrawer(true)}
      >
        List
      </Button>
      <SwipeableDrawer
        anchor={"left"}
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </>
  );
}
