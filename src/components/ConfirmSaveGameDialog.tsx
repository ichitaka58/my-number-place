import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

type ConfirmSaveGameDialogProps = {
  open: boolean;
  onConfirm: () => void;
};

const ConfirmSaveGameDialog = ({
  open,
  onConfirm,
}: ConfirmSaveGameDialogProps) => {
  return (
    <Dialog open={open} aria-labelledby="confirm-save-dialog-title">
      <DialogTitle id="confirm-save-dialog-title">
        ゲームを保存しました
      </DialogTitle>
      <DialogActions>
        <Button onClick={onConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmSaveGameDialog;
