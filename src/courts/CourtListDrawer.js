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
import {  useNavigate } from "react-router-dom";

export default function CourtsListDrawer({ loadInfoWindow, handleClickOpen }) {
  const navigate = useNavigate()
  const courts = useSelector(selectAllCourts);
  const [state, setState] = useState(false);
  const my = useSelector((state) => state.my);
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
                      color="text.primary"
                    >
                      {court.vicinity}
                    </Typography>

                    {court.rating && (
                      <Typography
                        sx={{ display: "block", fontSize: 14 }}
                        color="text.primary"
                      >
                        rating: {court.rating}
                      </Typography>
                    )}
                      <Box>
                        <Button
                  
                          onClick={() => {
                            loadInfoWindow({ placeId: court.place_id });
                          }}
                          >
                          Details
                        </Button>
                          {my.username && (
                        <Button
                          onClick={() => {
                            loadInfoWindow({ placeId: court.place_id }, true);
                            handleClickOpen();
                          }}
                        >
                          Create Game
                        </Button>
                    )}
                          {!my.username && (
                        <Button
                          onClick={() => {
                            navigate('/login')
                          }}
                        >
                          login to create game
                        </Button>
                    )}
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
