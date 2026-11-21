import { useContext } from "react";
import { HabitContext } from "../context/habitContextDef";

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
