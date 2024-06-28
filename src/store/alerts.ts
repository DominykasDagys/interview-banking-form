import { create } from "zustand";
import { AlertColor } from "@mui/material";

interface AlertState {
  opened: boolean;
  message: string;
  color?: AlertColor;
  closeAlert: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const DEFAULT_STATE = {
  opened: false,
  message: "",
};

export const useAlertStore = create<AlertState>((set) => ({
  ...DEFAULT_STATE,
  closeAlert: () => set(DEFAULT_STATE),
  success: (message) => set({ opened: true, message, color: "success" }),
  error: (message) => set({ opened: true, message, color: "error" }),
}));
