import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import Invite from "./Invite";
import {
  selectInvitesReceived,
  selectInvitesSent,
} from "../store/invites/invitesSlice";
import { Stack, Box, Tabs, Tab } from "@mui/material";

function InvitesList() {
  const error = useSelector((state) => state.my.error);
  const my = useSelector((state) => state.my);
  const invitesReceived = useSelector((state) =>
    selectInvitesReceived(state, my.username)
  );
  const invitesSent = useSelector((state) =>
    selectInvitesSent(state, my.username)
  );
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const [resource, setResource] = useState([]);
  const [isPending, setTransition] = useTransition();

  useEffect(() => {
    setTransition(() => {
      setResource((state) => (value === 0 ? invitesReceived : invitesSent));
    });
  }, [invitesReceived, invitesSent, value]);

  if (my.status === "failed") {
    return <div>{error}</div>;
  } else {
    return (
      <Stack mt={4}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Received" />
            <Tab label="Sent" />
          </Tabs>
        </Box>
        <Box>
          <Stack spacing={1} sx={{ margin: 2 }}>
            {resource.map((invite) => (
              <Invite key={invite.id} invite={invite} value={value} />
            ))}
          </Stack>
        </Box>
      </Stack>
    );
  }
}

export default InvitesList;
