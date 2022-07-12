import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import Invite from "./Invite";
import {
  selectInvitesReceived,
  selectInvitesSent,
} from "../store/invites/invitesSlice";
import { Stack, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import HomepageInviteSelect from "../homepage/HomepageInviteSelect";

function InvitesList() {
  const error = useSelector((state) => state.my.error);
  const my = useSelector((state) => state.my);
  const invitesReceived = useSelector((state) =>
    selectInvitesReceived(state, my.username)
  );
  const invitesSent = useSelector((state) =>
    selectInvitesSent(state, my.username)
  );

  const [resource, setResource] = useState([]);
  const [isPending, setTransition] = useTransition();

  const { control, watch } = useForm({
    defaultValues: {
      inviteMode: "received",
    },
  });

  const { inviteMode } = watch();

  useEffect(() => {
    setTransition(() => {
      setResource((state) =>
        inviteMode === "received" ? invitesReceived : invitesSent
      );
    });
  }, [inviteMode, invitesReceived, invitesSent]);

  if (my.status === "failed") {
    return <div>{error}</div>;
  } else {
    return (
      <Stack mt={4}>
        <Stack
          component={"form"}
          sx={{
            width: "100%",
            backgroundColor: "#F24346",
            position: "fixed",
            top: "6.5rem",
            zIndex: "10",
            boxShadow: 3,
          }}
        >
          <HomepageInviteSelect control={control} />
        </Stack>
        <Box>
          <Stack spacing={1} sx={{ margin: 2 }}>
            {resource.map((invite) => (
              <Invite key={invite.id} invite={invite} value={inviteMode} />
            ))}
          </Stack>
        </Box>
      </Stack>
    );
  }
}

export default InvitesList;
