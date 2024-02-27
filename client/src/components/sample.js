import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog() {
  const [openEditDilog, setOpenEditDilog] = React.useState(false);

  const handleClickOpenEditDilog = () => {
    setOpenEditDilog(true);
  };

  const handleCloseEditDilog = () => {
    setOpenEditDilog(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpenEditDilog}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openEditDilog}
        onClose={handleCloseEditDilog}
        PaperProps={{
          component: 'form',
          // onSubmit: (event) => {
          //   event.preventDefault();
          //   const formData = new FormData(event.currentTarget);
          //   const formJson = Object.fromEntries(formData.entries());
          //   const email = formJson.email;
          //   console.log(email);
          //   handleCloseEditDilog();
          // },
        }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDilog}>Cancel</Button>
          <Button onClick={editPost}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}