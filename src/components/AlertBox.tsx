import { useAlertStore } from "@/store/alerts";
import { Alert, Snackbar } from "@mui/material";

const AlertBox = () => {
  const { message, opened, color, closeAlert } = useAlertStore();

  return (
    <Snackbar open={opened} onClose={closeAlert}>
      <Alert
        onClose={closeAlert}
        severity={color}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertBox;
