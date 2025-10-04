import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface FillSpacesModalProps {
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}

export const FillSpacesModal = ({
  open,
  onClose,
  onSubmit,
}: FillSpacesModalProps) => {

  function createSubmit() {
    onClose()
    onSubmit()
  }

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
      <DialogTitle textAlign="center">Create New Spaces</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Creating pre-defined spaces for this day.
        </DialogContentText>
      </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={createSubmit} autoFocus>
        Create
      </Button>
    </DialogActions>
  </Dialog>
  )
}