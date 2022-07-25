import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function DeleteThreadButton({  deleteThread }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteThread = () => {
    deleteThread();
    setOpen(false);
  };
  return (
    <Box>
      <IconButton color="error" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete messages`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteThread}>yes</Button>
          <Button onClick={handleClose}>no</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteThreadButton;
