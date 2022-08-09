import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/my/mySlice";
import { Box, Typography, Grid, Paper, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import heic2any from "heic2any";

import imageFormatter from "./imageFormatter";
import { useErrorHandler } from "react-error-boundary";

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
          accept="image/*,.heic"
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

function UploadImageCard({ bio }) {
  const initialState = {
    mainState: "initial",
    selectedFile: bio.profileImg,
  };

  const loadingState = {
    mainState: "loading",
    selectedFile: "loadingSpinner.svg",
  };

  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useErrorHandler();
  const imgRef = useRef();

  const handleUploadClick = async (event) => {
    const reader = new FileReader();
    let file = event.target.files[0];
    const fileType = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();

    if (fileType === "heic") {
      try {
        setState((state) => loadingState);
        file = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.5 });
      } catch (err){
        handleError({message: 'Error uploading HEIC file'})
      }
    }

    reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setState((state) => ({
        mainState: "uploaded",
        selectedFile: reader.result,
      }));
    };
  };

  const handleViewProfile = () => {
    navigate(`/users/u/${bio.username}`);
  };

  async function updatePhoto() {
    const formattedURL = await imageFormatter(imgRef.current.children[0]);
    dispatch(
      updateProfile({
        username: bio.username,
        data: { profileImg: formattedURL },
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
              <Button
                sx={{ fontSize: 12 }}
                endIcon={<PersonIcon />}
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Avatar
        sx={{
          height: { xs: 100, sm: 100 },
          width: { xs: 100, sm: 100 },
          backgroundColor: "#ffffff",
          boxShadow: 3,
          position: "absolute",
          top: 50,
          left: 20,
        }}
        src={state.selectedFile}
        ref={imgRef}
      />
    </Stack>
  );
}

export default UploadImageCard;
