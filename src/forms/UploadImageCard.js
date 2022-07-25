import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/my/mySlice";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

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
        <Button endIcon={<PhotoCamera />} sx={{color: '#ffffff'}} component="span">
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

function UploadImageCard({ bio }) {
  const initialState = {
    mainState: "initial",
    selectedFile: bio.profileImg,
  };

  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate()

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

  const handleViewProfile = () => {
    navigate(`/users/u/${bio.username}`)
  }

  function updatePhoto() {
    dispatch(
      updateProfile({
        username: bio.username,
        data: { profileImg: state.selectedFile },
      })
    );
    setState((state) => ({ ...state, mainState: "initial" }));
  }

  function cancelUpdatePhoto() {
    setState(initialState);
  }

  return (

      <Stack sx={{ border: "lightpink", position: "relative" }}>
        <Grid container sx={{}}>
          <Grid item xs={12}>
            <Paper
              sx={{
                height: "100px",
                backgroundColor: "rgba(164, 22, 26,.5)",
                borderRadius: 0,
                boxShadow: 2,
                display: 'flex',
                alignItems: 'flex-end'
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
        <Grid container>
          <Grid item xs={12}>
            <Paper sx={{ borderRadius: 0, boxShadow: 0 }}>
              <Box paddingLeft={18} marginY={1} paddingBottom={1}>
                <Typography
                  sx={{
                    fontSize: { xs: "20px", sm: "30px" },
                    lineHeight: 1,
                  }}
                  component="div"
                >
                  {bio.firstName} {bio.lastName}
                </Typography>
                <Button sx={{fontSize: 12}} endIcon={<PersonIcon />} onClick={handleViewProfile}>View Profile</Button>
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
      </Stack>
 
  );
}

export default UploadImageCard;
