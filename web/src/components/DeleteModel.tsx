import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteModalProps {
  onClose: () => void;
  onSubmit: (value: any) => void;
  open: boolean;
}

export const DeleteModal = ({
  open,
  onClose,
  onSubmit,
}: DeleteModalProps) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            margin: "auto",
            maxWidth: "350px",  // Set your width here
          },
        },
      }}>
      <DialogTitle id="responsive-dialog-title">
        {"Are you absolutely sure?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        This action cannot be undone.
        </DialogContentText>
      </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSubmit} autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
  )
}