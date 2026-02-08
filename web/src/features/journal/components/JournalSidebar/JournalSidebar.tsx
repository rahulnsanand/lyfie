import "./JournalSidebar.css";
import { JournalDay } from "../journalDummyData";

interface JournalSidebarProps {
  days: JournalDay[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onScrollDay: (delta: number) => void;
  onScrollWeek: (delta: number) => void;
}

export default function JournalSidebar({
  days,
  selectedDate,
  onSelect,
  onScrollDay,
  onScrollWeek,
}: JournalSidebarProps) {
  return (
    <aside className="journal-sidebar">
      <div className="sidebar-controls">
        <button onClick={() => onScrollWeek(-1)}>«</button>
        <button onClick={() => onScrollDay(-1)}>▲</button>
        <button onClick={() => onScrollDay(1)}>▼</button>
        <button onClick={() => onScrollWeek(1)}>»</button>
      </div>

      <div className="day-list">
        {days.map((day) => {
          const isActive = day.date === selectedDate;
          const dateObj = new Date(day.date);

          return (
            <div
              key={day.date}
              className={`day-item ${isActive ? "active" : ""}`}
              onClick={() => onSelect(day.date)}
            >
              <div className="day-date">
                {dateObj.toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>

              <div className="day-preview">
                {day.content
                  ? day.content.split("\n")[0]
                  : "No entry"}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
