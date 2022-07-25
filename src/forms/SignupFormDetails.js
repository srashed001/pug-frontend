import { FormHelperText, MenuItem, Select, TextField } from "@mui/material";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import statesArr from "../common/50states";

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

const inputOptions = {
  width: {
    xs: "90%",
    sm: "80%",
  },
};

function SignupFormDetails({ control, errors, touchedFields, isValid }) {
  return (
    <>
      <Controller
        name="firstName"
        control={control}
        rules={{ required: "required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            sx={{...inputOptions, marginTop: 5}}
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
        rules={{ required: "required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            sx={inputOptions}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : "last name"}
          />
        )}
      />
      <Controller
        name="birthDate"
        control={control}
        rules={{ required: "birthday required" }}
        render={({ field }) => (
          <TextField
            {...field}
            type="date"
            variant="standard"
            sx={inputOptions}
            error={!!errors.birthDate}
            helperText={errors.birthDate ? errors.birthDate.message : "birthday"}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
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
        rules={{
          minLength: 12,
        }}
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
            <FormHelperText sx={inputOptions}>
              {errors.state ? errors.state.message : "state"}
            </FormHelperText>
          </>
        )}
      />
    </>
  );
}

export default SignupFormDetails;
