import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type ConfirmRetryGameDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmRetryGameDialog = ({
  open,
  onClose,
  onConfirm,
}: ConfirmRetryGameDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        ゲームを最初からやり直してよろしいですか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          このまま実行すると、保存しているゲームは削除されます。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={onConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRetryGameDialog;
