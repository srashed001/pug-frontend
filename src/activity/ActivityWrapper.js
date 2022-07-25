import ActivateGame from "../activity/ActivateGame";
import AddGameComment from "../activity/AddGameComment";
import DeactivateGame from "../activity/DeactivateGame";
import Follow from "../activity/Follow";
import InviteAccepted from "../activity/InviteAccepted";
import InviteCancelled from "../activity/InviteCancelled";
import InviteDenied from "../activity/InviteDenied";
import InviteSent from "../activity/InviteSent";
import JoinGame from "../activity/JoinGame";
import LeaveGame from "../activity/LeaveGame";
import Unfollow from "../activity/Unfollow";

function ActivityWrapper({ activity }) {
  const { operation } = activity;

  const activityComponents = {
    D: <DeactivateGame activity={activity} />,
    C: <ActivateGame activity={activity} />,
    L: <LeaveGame activity={activity} />,
    J: <JoinGame activity={activity} />,
    GCC: <AddGameComment activity={activity} />,
    FF: <Follow activity={activity} />,
    UF: <Unfollow activity={activity} />,
    IA: <InviteAccepted activity={activity} />,
    ID: <InviteDenied activity={activity} />,
    IX: <InviteCancelled activity={activity} />,
    IS: <InviteSent activity={activity} />,
  };
  return activityComponents[operation];
}

export default ActivityWrapper;
