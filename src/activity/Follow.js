import {
  alpha,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserById } from "../store/users/usersSlice";

function Follow({ activity }) {
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
        sx={{ backgroundColor: alpha("#A5B1A6", 0.5), boxShadow: 2 }}
        avatar={
          <Avatar
            src={primaryUser.profileImg}
            sx={{ backgroundColor: "#FFFFFF", boxShadow: 3 }}
          />
        }
        title={`${primaryUser.firstName} ${primaryUser.lastName}`}
        subheader={
          <Typography sx={{ fontSize: 12 }}>
            {formatDistanceToNowStrict(new Date(stamp))}
          </Typography>
        }
      />
      <CardContent>
        <Typography sx={{ fontSize: { xs: 12 } }}>
          <Link
            to={`/users/u/${primaryUser.username}`}
          >{`${primaryUser.firstName} ${primaryUser.lastName}`}</Link>{" "}
          has followed{" "}
          <Link
            to={`/users/u/${secondaryUser.username}`}
          >{`${secondaryUser.firstName} ${secondaryUser.lastName}`}</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Follow;
