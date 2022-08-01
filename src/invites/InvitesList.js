import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import Invite from "./Invite";
import {
  selectInvitesReceived,
  selectInvitesSent,
} from "../store/invites/invitesSlice";
import { Stack, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import HomepageInviteSelect from "../homepage/HomepageInviteSelect";

function InvitesList() {
  const myUsername = useSelector((state) => state.my.username);
  const invitesReceived = useSelector((state) =>
    selectInvitesReceived(state, myUsername)
  );
  const invitesSent = useSelector((state) =>
    selectInvitesSent(state, myUsername)
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

  return (
    <Stack mt={4}>
      <Stack
        component={"form"}
        sx={{
          width: "100%",
          backgroundColor: "#E5383B",
          position: "fixed",
          top: "6.5rem",
          zIndex: "10",
          boxShadow: 3,
        }}
      >
        <HomepageInviteSelect control={control} />
      </Stack>
      <Box>
        <Stack
          spacing={1}
          sx={{
            margin: 2,
          }}
        >
          {isPending ? null : resource.length ? (
            resource.map((invite) => (
              <Invite key={invite.id} invite={invite} value={inviteMode} />
            ))
          ) : (
            <Typography sx={{ fontSize: 20, textAlign: "center" }}>
              No invites {inviteMode === "received" ? "received" : "sent"}
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

export default InvitesList;
