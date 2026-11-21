import { useState, useEffect } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import { TaskProvider } from "./context/TaskContext";
import { HabitProvider } from "./context/HabitContext";
import { EventProvider } from "./context/EventContext";
import { FocusProvider } from "./context/FocusContext";
import { initializeDatabase } from "./services/db";
import AppShell from "./components/layout/AppShell";
import SettingsModal from "./components/settings/SettingsModal";
import OverviewView from "./features/dashboard/OverviewView";
import TasksView from "./features/tasks/TasksView";
import CalendarView from "./features/calendar/CalendarView";
import HabitsView from "./features/habits/HabitsView";
import FocusView from "./features/focus/FocusView";
import NotesView from "./features/notes/NotesView";
import ProgressView from "./features/progress/ProgressView";
import "./index.css";

export default function App() {
  const [activePage, setActivePage] = useState("Overview");

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <SettingsProvider>
      <TaskProvider>
        <HabitProvider>
          <EventProvider>
            <FocusProvider>
              <AppShell activePage={activePage} setActivePage={setActivePage}>
                {activePage === "Overview" && <OverviewView setActivePage={setActivePage} />}
                {activePage === "Tasks" && <TasksView />}
                {activePage === "Calendar" && <CalendarView />}
                {activePage === "Habits" && <HabitsView />}
                {activePage === "Focus" && <FocusView />}
                {activePage === "Notes" && <NotesView />}
                {activePage === "Progress" && <ProgressView />}
                <SettingsModal />
              </AppShell>
            </FocusProvider>
          </EventProvider>
        </HabitProvider>
      </TaskProvider>
    </SettingsProvider>
  );
}
