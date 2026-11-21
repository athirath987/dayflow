import { useContext } from "react";
import { EventContext } from "../context/eventContextDef";

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventProvider");
  }
  return context;
}
