import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchGame,
  updateGame,
} from "../store/games/gamesSlice";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";

import GeoLocationApi from "../api/GeoLocationApi";
import AddressAutoComplete from "./AddressAutoComplete";
import { useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// const createGameSchema = yup.object().shape({
//   title: yup.string().required().max(25),
//   description: yup.string().required,
//   date: yup.date().required(),
//   time: yup.string().required(),
//   address: yup.string().required(),
//   city: yup.string().required().max(25),
//   state: yup.string().required().max(2),
// });

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const inputOptions = {
  width: {
    xs: "100%",
    sm: "80%",
  },
};

function UpdateGameForm() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: api_key,
    libraries,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const my = useSelector((state) => state.my);
  const { gameId } = useParams();

  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      address: "",
      city: "",
      state: "",
    },
    // resolver: yupResolver(createGameSchema),
    mode: "onChange",
  });
  
  const returnToGame = () => {
    navigate(`/games/g/${gameId}`)
  }

  useEffect(() => {
    if (my.status === "succeeded") {
      dispatch(fetchGame(gameId))
        .unwrap()
        .then(({ details }) => {
          const { title, description, date, time, address, city, state } =
            details;
          reset({ title, description, date, time, address, city, state });
        });
    }
  }, []);

  function dispatchUpdateGame(data) {
    dispatch(updateGame({ id: gameId, data }))
      .unwrap()
      .then((data) => {
        navigate(`/games/g/${data.id}`);
      });
  }

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading maps";

  return (
    <Stack>
      <Box
        sx={{
          display: "inline-flex",
          backgroundColor: "#F24346",
          position: "fixed",
          top: "3.5rem",
          zIndex: "10",
          width: "100%",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ color: "#FFFFFF", marginX: 1 }}
            startIcon={<ArrowBackIosIcon />}
            onClick={returnToGame}
          >
            Game
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, padding: 1, color: "#FFFFFF" }}>
            Update PUG
          </Typography>
        </Box>
      </Box>
      <Stack
      my={10}
        component="form"
        sx={{ padding: 2 }}
        onSubmit={handleSubmit(dispatchUpdateGame)}
        alignItems="center"
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "title required" }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              sx={inputOptions}
              error={!!errors.title}
              helperText={errors.title ? errors.title.message : "title"}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "description required" }}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              variant="standard"
              sx={inputOptions}
              error={!!errors.description}
              helperText={
                errors.description ? errors.description.message : "description"
              }
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          rules={{ required: "date required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              variant="standard"
              sx={inputOptions}
              error={!!errors.date}
              helperText={errors.date ? errors.date.message : "date"}
            />
          )}
        />
        <Controller
          name="time"
          control={control}
          rules={{ required: "time required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="time"
              inputProps={{ step: 300 }}
              sx={inputOptions}
              variant="standard"
              error={!!errors.time}
              helperText={errors.time ? errors.time.message : "time"}
            />
          )}
        />
        <AddressAutoComplete
          control={control}
          watch={watch}
          setFormValue={setValue}
          reset={reset}
          errors={errors}
          getValues={getValues}
        />
        <Button onClick={handleSubmit(dispatchUpdateGame)}>submit</Button>
      </Stack>
    </Stack>
  );
}

export default UpdateGameForm;
