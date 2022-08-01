import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ActivityWrapper from "../activity/ActivityWrapper";
import { v4 } from "uuid";

import { fetchMyActivity } from "../store/my/mySlice";
import HomepageActivitySelect from "./HomepageActivitySelect";

function HomepageActivity() {
  const activities = useSelector((state) => state.my.activity);
  const myActivities = useSelector((state) => state.my.myActivity);
  const dispatch = useDispatch();
  const myUsername = useSelector((state) => state.my.username);
  const { control, watch } = useForm({
    defaultValues: {
      activityMode: "following",
    },
  });
  const { activityMode } = watch();

  useEffect(() => {
    if (myUsername) {
      dispatch(fetchMyActivity(myUsername));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUsername]);

  return (
    <Stack>
      <HomepageActivitySelect control={control} />
      <Stack
        mt={4}
        spacing={2}
        sx={{
          padding: 1,
        }}
      >
        {activityMode === "following" ? (
          activities.length ? (
            activities.map((activity) => (
              <ActivityWrapper key={v4()} activity={activity} />
            ))
          ) : (
            <Typography sx={{ fontSize: 20, textAlign: "center" }}>
              Currently following no users
            </Typography>
          )
        ) : myActivities.length ? (
          myActivities.map((activity) => (
            <ActivityWrapper key={v4()} activity={activity} />
          ))
        ) : (
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            You have no activity
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default HomepageActivity;
