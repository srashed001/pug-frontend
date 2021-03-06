import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  alpha,
} from "@mui/material";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserById } from "../store/users/usersSlice";

function Unfollow({ activity }) {
  const {
    primaryuser: primaryUsername,
    secondaryuser: secondaryUsername,
    stamp,
  } = activity;
  const primaryUser = useSelector((state) =>
    selectUserById(state, primaryUsername)
  );
  const secondaryUser = useSelector((state) =>
    selectUserById(state, secondaryUsername)
  );

  return (
    <Card elevation={3}>
      <CardHeader
        sx={{ backgroundColor: alpha("#A5ACB1", 0.5), boxShadow: 2 }}
        avatar={
          <Avatar
            src={primaryUser.profileImg}
            sx={{ backgroundColor: "#FFFFFF", boxShadow: 3 }}
          />
        }
        title={`${primaryUser.firstName} ${primaryUser.lastName}`}
        subheader={`${formatDistanceToNowStrict(new Date(stamp))}`}
      />
      <CardContent>
        <Typography sx={{ fontSize: { xs: 12 } }}>
          <Link
            to={`/users/u/${primaryUser.username}`}
          >{`${primaryUser.firstName} ${primaryUser.lastName}`}</Link>{" "}
          has unfollowed{" "}
          <Link
            to={`/users/u/${secondaryUser.username}`}
          >{`${secondaryUser.firstName} ${secondaryUser.lastName}`}</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Unfollow;
