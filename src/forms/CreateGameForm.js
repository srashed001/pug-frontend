import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGame } from "../store/games/gamesSlice";
import { TextField, Button, Typography, Box, Stack } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";

import GeoLocationApi from "../api/GeoLocationApi";
import AddressAutoComplete from "./AddressAutoComplete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";


const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const inputOptions = {
  width: {
    xs: "100%",
    sm: "100%",
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
    mode: "onChange",
  });

  function goHome() {
    navigate(`/`);
  }

  function dispatchCreateGame(data) {
    console.log({ ...data, createdBy: my.userame });
    dispatch(createGame({ ...data, createdBy: my.username }))
      .unwrap()
      .then((data) => {
        navigate(`/invites/${data.id}`);
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
            onClick={goHome}
          >
            Home
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, padding: 1, color: "#FFFFFF" }}>
            Create New PUG
          </Typography>
        </Box>
      </Box>
      <Stack
        component="form"
        sx={{padding: {xs: 1, sm: 3}}}
        onSubmit={handleSubmit(dispatchCreateGame)}
        alignItems="center"
        mt={15}
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
        />
        <Button onClick={handleSubmit(dispatchCreateGame)}>submit</Button>
      </Stack>
    </Stack>
  );
}

export default CreateGameForm;
