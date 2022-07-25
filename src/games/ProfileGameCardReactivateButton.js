import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {useErrorHandler} from "react-error-boundary"
import { reactivateGame } from "../store/games/gamesSlice";
import { setTab } from "../store/my/mySlice";
import { useNavigate } from "react-router-dom";

function ProfileGameCardReactivateButton({ game }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useErrorHandler()
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReactivateGame = () => {
    dispatch(reactivateGame(game.id)).unwrap().then(data => navigate(`/games/update/${data.game.id}`)).catch(err => handleError({message: err.message}));;
    setOpen(false);
  };
  return (
    <>
      <Box sx={{}}>
        <Button disabled={game.daysDiff < 0} color="success" onClick={handleClickOpen}>
          Reactivate
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{`Are you sure you want to reactivate game`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleReactivateGame} >yes</Button>
          <Button onClick={handleClose}>no</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProfileGameCardReactivateButton;
