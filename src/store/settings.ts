import { Language } from "@/types/settings";
import { create } from "zustand";

interface SettingsState {
  language: Language;
  setLanguage: (language: Language) => void;
}

const DEFAULT_STATE: Omit<SettingsState, "setLanguage"> = {
  language: 'en',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_STATE,
  setLanguage: (language) => set({ language }),
}));