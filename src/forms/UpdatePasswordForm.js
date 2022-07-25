import {  useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Typography, Alert, Stack, TextField, Button } from "@mui/material";
import PugApi from "../api/api";
import { useState } from "react";

function UpdatePasswordForm() {
  const my = useSelector((state) => state.my);
  const [success, setSuccess] = useState(false);

  const {
    setError,
    getValues,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  async function resetPassword(data) {
    try {
      const {oldPassword, newPassword} = data
      const res = await PugApi.changePassword(my.username, {oldPassword, newPassword});
      setSuccess(res.status);
      return true;
    } catch (error) {
      setError("oldPassword", { type: "validity", message: error[0] });
    }
  }


  const inputOptions = {width: {
    xs: '100%',
    sm: '80%'
}}

  return (
    <Stack
      alignItems={"center"}
      component="form"
      sx={{ padding: 2 }}
      onSubmit={handleSubmit(resetPassword)}
    >
      {success && (
        <Alert
          sx={{ width: "80%" }}
          severity="success"
          onClose={() => setSuccess(false)}
        >
          {success}
        </Alert>
      )}
      <Typography align={'left'} variant='h4' component='div' sx={{width: '80%'}} gutterBottom>update password</Typography>
      <Controller
        name="oldPassword"
        control={control}
        rules={{
          required: "required",
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            type={"password"}
            sx={inputOptions}
            error={!!errors.oldPassword}
            helperText={
              errors.oldPassword ? errors.oldPassword.message : "password"
            }
          />
        )}
      />
      <Controller
        name="newPassword"
        control={control}
        rules={{ required: "required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            type={"password"}
            sx={inputOptions}
            error={!!errors.newPassword}
            helperText={
              errors.newPassword ? errors.newPassword.message : "new password"
            }
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{ 
            required: "required",
            validate: () => {
                const {newPassword, confirmPassword} = getValues()
                if(newPassword !== confirmPassword) return 'new passwords do not match'
                return true
            }
         }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="standard"
            type={"password"}
            sx={inputOptions}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword ? errors.confirmPassword.message : "confirm new password"
            }
          />
        )}
      />

      <Button type="submit" disabled={!isDirty}>
        update
      </Button>
    </Stack>
  );
}

export default UpdatePasswordForm;
