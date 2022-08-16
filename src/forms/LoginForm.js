import {
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "./login.css";
import "../homepage/publicHomepage.css";



const inputOptions = {
  width: {
    xs: "100%",
  },
  marginBottom: 2,
  fontSize: 10,
  color: "black",
};

function LoginForm({ login }) {
  let navigate = useNavigate();

  const {
    reset,

    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [formErrors, setFormErrors] = useState(null);

  async function handleLogin(data) {
    let res = await login(data);
    if (res.success) {
      navigate(`/`);
    } else {
      setFormErrors("Invalid username/password");
      reset();
    }
  }

  function goHome() {
    navigate(`/`);
  }

  const handleSignup = () => {
    navigate("/signup");
  };

  return (

      <Stack className="publicHomepage" sx={{ alignItems: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            backgroundColor: "#E5383B",
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
              Login
            </Typography>
          </Box>
        </Box>
        {formErrors && (
          <Box sx={{ position: "absolute", top: "6rem", width: "100%" }}>
            <Alert severity="error" onClose={() => setFormErrors(null)}>
              {formErrors}
            </Alert>
          </Box>
        )}
        <Stack
          sx={{
            boxShadow: 5,
            padding: 1,
            paddingY: 3,
            margin: 1,
            marginTop: 14,
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
            width: { xs: 300 },
          }}
        >
          <Stack component="form" onSubmit={handleSubmit(handleLogin)}>
            <Controller
              name="username"
              control={control}
              rules={{ required: "username required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  aria-label="username"
                  sx={inputOptions}
                  error={!!errors.username}
                  helperText={
                    errors.username ? errors.username.message : "username"
                  }
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: "password required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  type="password"
                  aria-label="password"
                  sx={inputOptions}
                  error={!!errors.password}
                  helperText={
                    errors.password ? errors.password.message : "password"
                  }
                />
              )}
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
            <Typography
              sx={{ textAlign: "center", marginY: 1 }}
              component={Box}
            >
              Forgot Password?
            </Typography>
          </Stack>
          <Divider />
          <Button onClick={handleSignup}>Create new account</Button>
        </Stack>
      </Stack>

  );
}

export default LoginForm;



