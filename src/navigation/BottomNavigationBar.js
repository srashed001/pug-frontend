import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #FFFFFF;
  &.Mui-selected {
    color: #F9AEB0
  }
`);

export default function BottomNavigationBar() {
  const location = useLocation();
  const [value, setValue] = useState(0);
  if (location.pathname.slice(0, 11) === "/threads/t/") return null;
  return (
    <Box sx={{ width: "80%" }}>
      <BottomNavigation
        showLabels
        sx={{
          width: "100%",
          height: 75,
          position: "fixed",
          bottom: 0,
          backgroundColor: "#7F090B",
          zIndex: 10,
        }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label={<Typography sx={{ fontSize: 10 }}>Home</Typography>}
          icon={<HomeIcon />}
          component={NavLink}
          to={"/"}
        />
        <BottomNavigationAction
          label={<Typography sx={{ fontSize: 10 }}>Users</Typography>}
          icon={<PeopleIcon />}
          component={NavLink}
          to={"/users"}
        />
        <BottomNavigationAction
          label={<Typography sx={{ fontSize: 10 }}>Games</Typography>}
          icon={<SportsBasketballIcon />}
          component={NavLink}
          to={"/games"}
        />
        <BottomNavigationAction
          label={<Typography sx={{ fontSize: 10 }}>Courts</Typography>}
          icon={<LocationOnIcon />}
          component={NavLink}
          to={"/courts"}
        />
      </BottomNavigation>
    </Box>
  );
}
