import { Stack } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
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
  const my = useSelector((state) => state.my);
  const { control, watch } = useForm({
    defaultValues: {
      activityMode: "following",
    },
  });
  const { activityMode } = watch();

  useEffect(() => {
    if (my.status === "succeeded") {
      dispatch(fetchMyActivity(my.username));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [my.status]);


  return (
    <Stack>
      <HomepageActivitySelect control={control} />
      <Stack mt={4} spacing={2} sx={{ padding: 1 }}>
        {activityMode === "following"
          ? activities.map((activity) => (
              <ActivityWrapper key={v4()} activity={activity} />
            ))
          : myActivities.map((activity) => (
              <ActivityWrapper key={v4()} activity={activity} />
            ))}
      </Stack>
    </Stack>
  );
}

export default HomepageActivity;
