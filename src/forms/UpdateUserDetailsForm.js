import { forwardRef,  useState } from "react";
import { useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import {  updateProfile } from "../store/my/mySlice";
import {
  FormHelperText,
  TextField,
  Stack,
  Select,
  MenuItem,
  Button,
  Alert,
  Typography
} from "@mui/material";
import statesArr from "../common/50states";
import { useForm, Controller } from "react-hook-form";

const PhoneNumberFormatter = forwardRef((props, ref) => {
  return (
    <NumberFormat
      {...props}
      getInputRef={ref}
      format="###-###-####"
      mask={"_"}
    />
  );
});

const inputOptions = {width: {
    xs: '100%',
    sm: '80%'
}}

function UpdateUserDetailsForm({ bio }) {
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  function testEditProfile(data) {
    dispatch(updateProfile({ username: bio.username, data }))
      .unwrap()
      .then((d) => setSuccess(true));
  }

  return (
    <Stack
      component="form"
      sx={{ padding: 2 }}
      onSubmit={handleSubmit(testEditProfile)}
      alignItems='center'
      justifyContent='center'
    >
      {success ? (
        <Alert onClose={() => setSuccess(false)} severity="success">
          Profile Updated
        </Alert>
      ) : null}
       <Typography align={'left'} variant='h4' component='div' sx={{width: '80%'}} gutterBottom>update information</Typography>

          <Controller
            name="firstName"
            control={control}
            defaultValue={bio.firstName}
            rules={{ required: "required" }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                sx={inputOptions}
                error={!!errors.firstName}
                helperText={
                  errors.firstName ? errors.firstName.message : "first name"
                }
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            defaultValue={bio.lastName}
            rules={{ required: "required" }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                sx={inputOptions}
                error={!!errors.lastName}
                helperText={
                  errors.lastName ? errors.lastName.message : "last name"
                }
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue={bio.email}
            rules={{
              required: "required",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "valid email required",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                sx={inputOptions}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : "email"}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            defaultValue={bio.phoneNumber}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                sx={inputOptions}
                InputProps={{
                  inputComponent: PhoneNumberFormatter,
                }}
                helperText={"phone number"}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            defaultValue={bio.city}
            rules={{ required: "required" }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                sx={inputOptions}
                error={!!errors.city}
                helperText={errors.city ? errors.city.message : "city"}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            defaultValue={bio.state}
            rules={{ required: "required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  variant="standard"
                  sx={inputOptions}
                  error={!!errors.state}
                >
                  {statesArr.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                sx={inputOptions}>
                  {errors.state ? errors.state.message : "state"}
                </FormHelperText>
              </>
            )}
          />

      <Button type="submit" disabled={!isDirty}>
        update
      </Button>
    </Stack>
  );
}

export default UpdateUserDetailsForm;
