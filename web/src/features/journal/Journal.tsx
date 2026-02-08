import { useState } from "react";
import "./Journal.css";
import JournalSidebar from "./components/JournalSidebar/JournalSidebar";
import { generateJournalDays, JournalDay } from "./components/journalDummyData";
const WINDOW_DAYS = 14;

export default function Journal() {
  const [windowStart, setWindowStart] = useState(new Date());
  const [journalContent, setJournalContent] = useState<Record<string, any>>({});

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const days: JournalDay[] = generateJournalDays(
    windowStart,
    WINDOW_DAYS
  );

  const selectedDay =
    days.find((d) => d.date === selectedDate) ?? days[0];

  const scrollDay = (delta: number) => {
    const d = new Date(windowStart);
    d.setDate(d.getDate() + delta);
    setWindowStart(d);
  };

  const scrollWeek = (delta: number) => {
    const d = new Date(windowStart);
    d.setDate(d.getDate() + delta * 7);
    setWindowStart(d);
  };

  return (
    <div className="journal-layout">
      <JournalSidebar
        days={days}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onScrollDay={scrollDay}
        onScrollWeek={scrollWeek}
      />

      {/* Main journal editor area */}
      <div className="journal-editor-container">
      </div>      
    </div>
  );
}
