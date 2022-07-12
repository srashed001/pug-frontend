
import { useEffect, useState } from "react";
import PugApi from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { resetMyStatus } from "../store/my/mySlice";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Stack, styled, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import HomepageGames from "./HomepageGames";
import EditProfile from "../forms/EditProfile";
import InvitesList from "../invites/InvitesList";
import HomepageActivity from "./HomepageActivity";

const StyledTab = styled(Tab)(`
color: #FFFFFF;
&.Mui-selected {
  color: #F9AEB0
`);

function Homepage() {
  const token = PugApi.token;
  const myStatus = useSelector((state) => state.my.status);
  const error = useSelector((state) => state.my.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const navigation = {
    0: <HomepageActivity />,
    1: <HomepageGames />,
    2: <InvitesList />,
    4: <EditProfile />,
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  function getThreads() {
    navigate("/threads/inbox");
  }


  useEffect(() => {
    dispatch(resetMyStatus());
  }, []);


  if (!token)
    return (
      <div>
        <h1>Homepage</h1>
        <h3>Not currently logged in</h3>
      </div>
    );

  if (myStatus === "loading") {
    return <LoadingSpinner />;
  } else if (myStatus === "failed") {
    return <div>{error}</div>;
  } else if (myStatus === "succeeded") {
    return (
      <Stack mt={2}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "#F24346",
            position: "fixed",
            zIndex: "11",
            color: "#FFFFFF",
            boxShadow: 3
          }}
        >
          <Tabs variant="scrollable" scrollButtons="auto" value={tab} onChange={handleChangeTab}>
            <StyledTab label="Activity" />
            <StyledTab label="Games" />
            <StyledTab label="Invites" />
            <StyledTab label="Inbox" onClick={getThreads} />
            <StyledTab label="Profile" />
          </Tabs>
        </Box>
        <Box mt={6}>
        {navigation[tab]}
        </Box>
      </Stack>
    );
  }
}

export default Homepage;
