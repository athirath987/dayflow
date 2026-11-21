import { useState, useEffect } from "react";
import { HabitContext } from "./habitContextDef";
import { readStorage, writeStorage, defaultHabits, db } from "../services/db";
import { todayString } from "../utils/dateUtils";

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(() => {
    const stored = readStorage("dayflow-habits", defaultHabits);
    const today = todayString();
    return stored.map((h) => {
      if (h.history) return h;
      return {
        id: h.id,
        name: h.name,
        history: h.done ? { [today]: true } : {}
      };
    });
  });

  useEffect(() => {
    writeStorage("dayflow-habits", habits);
    try {
      db.habits.clear().then(() => db.habits.bulkAdd(habits)).catch(() => {});
    } catch {
      // fallback silent
    }
  }, [habits]);

  const today = todayString();

  const isHabitDoneToday = (habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    return Boolean(habit?.history?.[today]);
  };

  const isHabitDoneOnDate = (habitId, dateStr) => {
    const habit = habits.find((h) => h.id === habitId);
    return Boolean(habit?.history?.[dateStr]);
  };

  const toggleHabitToday = (habitId) => {
    toggleHabitOnDate(habitId, today);
  };

  const toggleHabitOnDate = (habitId, dateStr) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const current = Boolean(habit.history?.[dateStr]);
        const updatedHistory = { ...habit.history };
        if (current) {
          delete updatedHistory[dateStr];
        } else {
          updatedHistory[dateStr] = true;
        }
        return {
          ...habit,
          history: updatedHistory
        };
      })
    );
  };

  const addHabit = (name) => {
    if (!name.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: name.trim(),
      history: {}
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id, newName) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: newName.trim() } : h))
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const getStreak = (habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit || !habit.history) return 0;

    let streak = 0;
    const checkDate = new Date();

    const todayStr = todayString();
    if (habit.history[todayStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
      if (habit.history[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const completedTodayCount = habits.filter((h) => isHabitDoneToday(h.id)).length;
  const totalHabitsCount = habits.length;

  return (
    <HabitContext.Provider
      value={{
        habits,
        today,
        isHabitDoneToday,
        isHabitDoneOnDate,
        toggleHabitToday,
        toggleHabitOnDate,
        addHabit,
        updateHabit,
        deleteHabit,
        getStreak,
        completedTodayCount,
        totalHabitsCount
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}
