import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CourtListGameForm from "./CourtListGameForm";



export default function CourtListCreateGame({ open, handleClose, location }) {

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} maxWidth={'lg'} onClose={handleClose} >
        <DialogTitle sx={{ backgroundColor: "rgba(229, 56, 59)", textAlign: 'center', color: '#ffffff' }}>Create PUG</DialogTitle>
        <DialogContentText align="center" mt={1} >Provide details on your pick up game</DialogContentText>
        <CourtListGameForm location={location} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
