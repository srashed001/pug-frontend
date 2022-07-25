import { useEffect, useState } from "react";
import PugApi from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { resetMyStatus, setTab } from "../store/my/mySlice";
import { Link, useNavigate } from "react-router-dom";
import { Stack, styled, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import HomepageGames from "./HomepageGames";
import EditProfile from "../forms/EditProfile";
import InvitesList from "../invites/InvitesList";
import HomepageActivity from "./HomepageActivity";
import PublicHomePage from "./PublicHomepage";

const StyledTab = styled(Tab)(`
color: #FFFFFF;
&.Mui-selected {
  color: #edf2f4
`);

const navigation = {
  0: <HomepageActivity />,
  1: <HomepageGames />,
  2: <InvitesList />,
  4: <EditProfile />,
};
function Homepage() {
  const token = PugApi.token;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tab = useSelector((state) => state.my.tab);

  const handleChangeTab = (e, newValue) => {
    dispatch(setTab(newValue));
  };

  function getThreads() {
    navigate("/threads/inbox");
  }

  useEffect(() => {
    dispatch(resetMyStatus());
  }, []);

  if (!token) return <PublicHomePage />;

  return (
    <Stack mt={2}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#E5383B",
          position: "fixed",
          zIndex: "11",
          color: "#FFFFFF",
          boxShadow: 3,
        }}
      >
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={handleChangeTab}
        >
          <StyledTab label="Activity" />
          <StyledTab label="Games" />
          <StyledTab label="Invites" />
          <StyledTab label="Inbox" onClick={getThreads} />
          <StyledTab label="Profile" />
        </Tabs>
      </Box>
      <Box mt={6}>{navigation[tab]}</Box>
    </Stack>
  );
}

export default Homepage;
