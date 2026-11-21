import { useState, useEffect } from "react";
import { EventContext } from "./eventContextDef";
import { readStorage, writeStorage, db } from "../services/db";
import { todayString } from "../utils/dateUtils";

export function EventProvider({ children }) {
  const [events, setEvents] = useState(() => readStorage("dayflow-events", []));
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayString());

  useEffect(() => {
    writeStorage("dayflow-events", events);
    try {
      db.events.clear().then(() => db.events.bulkAdd(events)).catch(() => {});
    } catch {
      // fallback silent
    }
  }, [events]);

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      title: eventData.title.trim(),
      date: eventData.date || selectedDate,
      time: eventData.time || "",
      description: eventData.description || "",
      updatedAt: new Date().toISOString()
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id, eventData) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...eventData,
              title: eventData.title.trim(),
              updatedAt: new Date().toISOString()
            }
          : e
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const getEventsForDate = (dateStr) => {
    return events
      .filter((e) => e.date === dateStr)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        calendarDate,
        setCalendarDate,
        selectedDate,
        setSelectedDate,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
