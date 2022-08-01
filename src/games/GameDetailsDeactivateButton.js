import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useDispatch } from "react-redux";
import { deactivateGame } from "../store/games/gamesSlice";
import { setTab } from "../store/my/mySlice";
import { useNavigate } from "react-router-dom";

function GameDetailsDeactivateButton({ gameId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeactivateGame = () => {
    dispatch(setTab(1));
    dispatch(deactivateGame(gameId));
    navigate("/");
    setOpen(false);
  };
  return (
    <>
      <Button color="error" onClick={handleClickOpen}>
        Deactivate
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{`Are you sure you want to deactivate game`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeactivateGame}>yes</Button>
          <Button onClick={handleClose}>no</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GameDetailsDeactivateButton;
