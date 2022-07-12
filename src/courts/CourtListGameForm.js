import { Button, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddressAutoComplete from "../forms/AddressAutoComplete";
import { createGame } from "../store/games/gamesSlice";

const inputOptions = {
  width: {
    xs: "100%",
    sm: "80%",
  },
};

function CourtListGameForm({ location }) {
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
      address: location.address,
      city: location.city,
      state: location.state,
      createdBy: my.username,
    },
    mode: "onChange",
  });

  function dispatchCreateGame(data) {
    dispatch(
      createGame({
        data,
        createdBy: {
          username: my.username,
          firstName: my.user.firstName,
          lastName: my.user.lastName,
          profileImg: my.user.profileImg,
        },
      })
    )
      .unwrap()
      .then(({ game, createdBy }) => {
        navigate(`/invites/${game.id}`);
      });
  }

  useEffect(() => {
    reset({ ...location, createdBy: my.username });
  }, [location, my.username, reset]);

  useEffect(() => {
    setValue("createdBy", my.username);
  }, [my.username, setValue]);

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(dispatchCreateGame)}
      alignItems="center"
      minWidth={600}
      mt={5}
      sx={{ paddingX: { xs: 1, sm: 0 }, minWidth: { xs: "auto", sm: 600 } }}
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
  );
}

export default CourtListGameForm;
