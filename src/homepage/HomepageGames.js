import { Stack } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileGamesList from "../games/ProfileGamesList";
import { resetMyStatus } from "../store/my/mySlice";

function HomepageGames() {
  const my = useSelector((state) => state.my);
  const [resource, setResource] = useState(my);
  const [isPending, setTransition] = useTransition();
  const dispatch = useDispatch();


  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...my })));
  }, [my]);

  if (my.status === "failed") return <div>failed</div>;

  const {
    gamesHostedPending,
    gamesHostedResolved,
    gamesJoinedPending,
    gamesJoinedResolved,
    inactiveGames,
  } = resource;

  console.log(my)

  return (
    <Stack>
      <ProfileGamesList games={Object.values(gamesHostedPending.entities)} set={"gamesHostedPending"} />
      <ProfileGamesList
        games={Object.values(gamesHostedResolved.entities)}
        set={"gamesHostedResolved"}
      />
      <ProfileGamesList games={Object.values(gamesJoinedPending.entities)} set={"gamesJoinedPending"} />
      <ProfileGamesList
        games={Object.values(gamesJoinedResolved.entities)}
        set={"gamesJoinedResolved"}
      />
      <ProfileGamesList
        games={Object.values(inactiveGames.entities)}
        set={"inactiveGames"}
      />
    </Stack>
  );
}

export default HomepageGames;
