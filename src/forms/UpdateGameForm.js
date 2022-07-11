import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createGame, fetchGame, updateGame } from "../store/games/gamesSlice";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Box,
  Stack,
  InputLabel,
} from "@mui/material";
import stateOptions from "../common/selectOptionsStates";
import {
  GoogleMap,
  useLoadScript,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import GeoLocationApi from "../api/GeoLocationApi";
import AddressAutoComplete from "./AddressAutoComplete";
import { selectGameById } from "../store/my/mySlice";
import { useEffect, useState } from "react";
import initialGame from "../common/initialGame";

const createGameSchema = yup.object().shape({
  title: yup.string().required().max(25),
  description: yup.string().required,
  date: yup.date().required(),
  time: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required().max(25),
  state: yup.string().required().max(2),
});

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const inputOptions = {
  width: {
    xs: "100%",
    sm: "80%",
  },
};

function UpdateGameForm({ address, city, state }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: api_key,
    libraries,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const my = useSelector((state) => state.my);
  const { gameId } = useParams();
  const game = useSelector((state) => selectGameById(state, gameId));

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

  console.log(stateOptions, errors);

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading maps";
  console.log(isLoaded);

  return (
    <>
      <Typography
        component={Paper}
        sx={{
          marginY: 1,
          padding: 1,
          fontSize: { xs: "20px", sm: "24px" },
          borderRadius: 0,
          boxShadow: "1px 1px 3px #D3D3D3",
        }}
      >
        Update Game Information
      </Typography>
      <Stack
        component="form"
        sx={{ padding: 2}}
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
              rows={5}
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
    </>
  );
}

export default UpdateGameForm;
