import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Box, Typography, Grid, Paper, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";


const Input = styled("input")({
  display: "none",
});

function UploadPhotoButtons({
  mainState,
  cancelUpdatePhoto,
  updatePhoto,
  handleUploadClick,
}) {
  if (mainState === "initial")
    return (
      <label htmlFor="contained-button-file">
        <Input
          onChange={handleUploadClick}
          accept="image/*"
          id="contained-button-file"
          type="file"
        />
        <Button
          endIcon={<PhotoCamera />}
          sx={{ color: "#ffffff" }}
          component="span"
        >
          Update
        </Button>
      </label>
    );

  return (
    <>
      <Button onClick={updatePhoto}>save</Button>
      <Button onClick={cancelUpdatePhoto}>cancel</Button>
    </>
  );
}

function SignupFormPicture({
  getValues,
  setActiveStep,
  handleSubmit,
  signup
}) {
  const {
    username,
    firstName,
    lastName,
    birthDate,
    city,
    state: st,
    email,
    profileImg,
    phoneNumber,
  } = getValues();
  const initialState = {
    mainState: "initial",
    selectedFile: profileImg,
  };

  const [state, setState] = useState(initialState);
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();

  const handleUploadClick = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setState((state) => ({
        mainState: "uploaded",
        selectedFile: reader.result,
      }));
    };
  };

  function updatePhoto() {
    setState((state) => ({ ...state, mainState: "initial" }));
  }

  function cancelUpdatePhoto() {
    setState(initialState);
  }

  const dispatchRegisterUser = async (data) => {
    const {confirmPassword, phoneNumber, ...rest} = data
    let user = {...rest, profileImg: state.selectedFile}
    if(phoneNumber) {
        user = {...user, phoneNumber}
    }
    const res = await signup(user)
    if (res.success) {
        navigate(`/`);
      } else {
        setFormErrors(res.errors);
      }
  };

  return (
    <Stack sx={{ position: "relative", width: "100%" }}>
      <Grid container sx={{}}>
        <Grid item xs={12}>
          <Paper
            sx={{
              height: "100px",
              backgroundColor: "rgba(164, 22, 26,.5)",
              borderRadius: 0,
              boxShadow: 2,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", marginLeft: 18 }}
            >
              <UploadPhotoButtons
                mainState={state.mainState}
                updatePhoto={updatePhoto}
                cancelUpdatePhoto={cancelUpdatePhoto}
                handleUploadClick={handleUploadClick}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          height: { xs: 100, sm: 100 },
          width: { xs: 100, sm: 100 },
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: "50%",
          position: "absolute",
          top: 50,
          left: 20,
        }}
        component="img"
        src={state.selectedFile}
      />
      <Stack sx={{ marginTop: 10, padding: 1 }}>
      {formErrors && (
          <Box sx={{ position: "absolute", top: "6rem", width: "100%" }}>
            <Alert severity="error" onClose={() => setFormErrors(null)}>
              {formErrors}
            </Alert>
          </Box>
        )}
        <Typography sx={{ fontSize: 20 }}>Review</Typography>
        <Divider />
        <Box>
          <Typography sx={{ fontSize: 14, marginY: 1 }}>
            <strong>username:</strong> {username}
          </Typography>
          <Button
            sx={{ fontSize: 12 }}
            onClick={() => setActiveStep((state) => 1)}
          >
            Edit
          </Button>
        </Box>
        <Divider />
        <Box sx={{ marginY: 1 }}>
          <Typography sx={{ fontSize: 14 }}>
            {firstName} {lastName}
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            {format(new Date(birthDate), "PP")}
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            {city}, {st}
          </Typography>
          <Typography sx={{ fontSize: 14 }}>{phoneNumber}</Typography>
          <Typography sx={{ fontSize: 14 }}>{email}</Typography>
          <Button onClick={() => setActiveStep((state) => 0)}>Edit</Button>
        </Box>
      </Stack>
      <Stack sx={{ padding: 1 }}>
        <Button variant="outlined" onClick={handleSubmit(dispatchRegisterUser)}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}

export default SignupFormPicture;
