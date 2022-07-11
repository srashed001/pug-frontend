import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGame } from "../store/games/gamesSlice";
import { TextField, Button, Typography, Select, MenuItem, Box, Stack, InputLabel } from "@mui/material";
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

function CreateGameForm({ address, city, state }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: api_key,
        libraries,
      });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const my = useSelector((state) => state.my);
  const {
      reset,
    control,
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
      address: address ? address : "",
      city: city ? city : "",
      state: state ? state : "",
    },
    // resolver: yupResolver(createGameSchema),
    mode: 'onChange'
  });

  function dispatchCreateGame(data) {
      console.log({...data, createdBy: my.userame})
    dispatch(createGame({...data, createdBy: my.username}))
      .unwrap()
      .then((data) => {
        navigate(`/invites/${data.id}`);
      });
  }

  console.log(stateOptions, errors);

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading maps";
  console.log(isLoaded)


  return (
      <>
    <Stack
      component="form"
      sx={{padding: 2, boxShadow: 4, margin: 2}}
      onSubmit={handleSubmit(dispatchCreateGame)}
      alignItems="center"
      mt={5}
      >
     
    <Typography    elevation={2}align={'left'} variant='h4' component='div' sx={{margin: 4, width: '80%'}} gutterBottom>pug information</Typography>
       
      <Controller
        name="title"
        control={control}
        rules={{ required: "title required"}}
        render={({ field }) => (
          <TextField
            {...field}
            variant='standard'
            sx={inputOptions}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : 'title'}
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
            variant='standard'
            sx={inputOptions}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : 'description'}
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
            helperText={errors.date ? errors.date.message : 'date'}
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
            helperText={errors.time ? errors.time.message : 'time'}
          />
        )}
      />
       <AddressAutoComplete control={control} watch={watch} setFormValue={setValue} reset={reset} errors={errors} />
      <Button onClick={handleSubmit(dispatchCreateGame)}>submit</Button>
    </Stack>
      </>


  );
}

export default CreateGameForm;
