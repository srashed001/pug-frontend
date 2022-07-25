import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import PugApi from "../api/api";

const inputOptions = {
  width: {
    xs: "90%",
    sm: "80%",
  },
};

function SignupFormCredentials({ control, errors, getValues }) {
  return (
    <>
      <Controller
        name="username"
        control={control}
        rules={{
          required: "required",
          validate: async () => {
            const { username } = getValues();
            const res = await PugApi.checkUsername(username);
            if (!res.status) return true;
            return `${username} is already taken`;
          },
        }}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              variant="standard"
              sx={{...inputOptions, marginTop: 5}}
              error={!!errors.username}
              helperText={
                errors.username ? errors.username.message : "username"
              }
            />
          </>
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: "required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            type={"password"}
            sx={inputOptions}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : "password"}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "required",
          validate: () => {
            const { password, confirmPassword } = getValues();
            if (password !== confirmPassword)
              return "new passwords do not match";
            return true;
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            type={"password"}
            sx={inputOptions}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword
                ? errors.confirmPassword.message
                : "confirm password"
            }
          />
        )}
      />
    </>
  );
}

export default SignupFormCredentials;
