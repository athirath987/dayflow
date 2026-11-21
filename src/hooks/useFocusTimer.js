import { useContext } from "react";
import { FocusContext } from "../context/focusContextDef";

export function useFocusTimer() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocusTimer must be used within a FocusProvider");
  }
  return context;
}
