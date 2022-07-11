import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import Invite from "./Invites";

import { fetchInitialMy, resetMyStatus } from "../store/my/mySlice";
import { selectInvitesReceived, selectInvitesSent } from "../store/invites/invitesSlice";

function InvitesList() {
  const invites = useSelector((state) => state.invites.entities);
  const error = useSelector((state) => state.my.error);
  const my = useSelector((state) => state.my);
  const [state, setState] = useState("received");
  const [title, setTitle] = useState(null);
  const [fetched, setFetched] = useState(false);
  const invitesReceived = useSelector(state => selectInvitesReceived(state, my.username))
  const invitesSent = useSelector(state => selectInvitesSent(state, my.username))

  const dispatch = useDispatch();
  console.log(my);

    // useEffect(() => {
    //   return () => {
    //     dispatch(resetMyStatus());
    //     setFetched(false);
    //   };
    // }, []);

  if (my.status === "loading") {
    return <LoadingSpinner />;
  } else if (my.status === "failed") {
    return <div>{error}</div>;
  } else if (my.status === "succeeded") {
      const myInvites = state === 'received' ? invitesReceived : invitesSent
    //   state === 'received' ? setTitle(`Invites Received`) : setTitle('Invites Sent')

    return (
      <div>
        <h1>{title}</h1>
        <div>
          <button onClick={() => setState("received")}>Received</button>
          <button onClick={() => setState("sent")}>Sent</button>
        </div>
        <div>
                  {myInvites.map(invite => (
                      <Invite key={invite.id} invite={invite} state={state} />
                  ))}
              </div>
      </div>
    );
  }
}

export default InvitesList;
