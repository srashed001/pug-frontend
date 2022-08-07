import GameDetailsNav from "./GameDetailsNav";
import GameDetailsDescription from "./GameDetailsDescription";
import GameDetailsAddressDate from "./GameDetailsAddressDate";
import GameDetailsPlayers from "./GameDetailsPlayers";
import GameDetailsComment from "./GameDetailsComments";
import { Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectGameById } from "../store/games/gamesSlice";
import { useEffect, useState, useTransition } from "react";
import { selectCommentsByGame } from "../store/comments/commentsSlice";
import { fetchGame } from "../store/games/gamesSlice";
import initialGame from "../common/initialGame";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import GameDetailsHost from "./GameDetailsHost";

function GameDetails({ panTo, gameId, setLocation }) {
  const dispatch = useDispatch();
  const game = useSelector((state) => selectGameById(state, gameId));
  const gameComments = useSelector((state) =>
    selectCommentsByGame(state, gameId)
  );
  const users = useSelector((state) => state.users.entities);
  const myUsername = useSelector((state) => state.my.username);
  const [resource, setResource] = useState(initialGame);
  const [isPending, setTransition] = useTransition();

  useEffect(() => {
    dispatch(fetchGame(gameId))
      .unwrap()
      .then(({ details }) => {
        async function panToGame(game) {
          const { address, city, state } = game;
          try {
            const results = await getGeocode({
              address: `${address}, ${city}, ${state}`,
            });
            const { lat, lng } = await getLatLng(results[0]);
            setLocation((state) => ({ lat, lng }));
            panTo({ lat, lng });
          } catch (error) {
            console.log(error);
          }
        }
        panToGame(details);
      });
  }, [dispatch, gameId, panTo, setLocation]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...game })));
  }, [game]);

  const joined = resource.players.find((player) => player === myUsername);

  console.log(resource)

  return (
    <Stack sx={{ opacity: isPending ? 0.8 : 1 }}>
      <Typography sx={{ padding: 1 }} component={"div"} variant={"h4"}>
        {resource.title}
      </Typography>
      <GameDetailsNav game={resource} joined={joined} />
      <GameDetailsDescription body={resource.description} />
      <GameDetailsAddressDate game={resource} />
      <GameDetailsHost game={resource} />
      <GameDetailsPlayers game={resource} />
      <GameDetailsComment
        game={resource}
        comments={gameComments}
        users={users}
      />
    </Stack>
  );
}

export default GameDetails;
