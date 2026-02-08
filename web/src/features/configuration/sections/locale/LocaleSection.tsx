import { useState } from "react";
import "./LocaleSection.css";

export default function LocaleSection() {
  const [locale, setLocale] = useState("en-IN");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<"Sunday" | "Monday">("Sunday");

  const now = new Date();

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "numeric",
    hour12: timeFormat === "12",
    timeZone: timezone,
  }).format(now);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeZone: timezone,
  }).format(now);

  return (
    <div className="locale-settings">      
      <div className="settings-group">
        <label>Language / Locale</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="en-IN">English (India)</option>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="hi-IN">Hindi (India)</option>
        </select>
      </div>

      <div className="settings-group">
        <label>Timezone</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">New York</option>
          <option value="Europe/London">London</option>
          <option value="Asia/Dubai">Dubai</option>
          <option value="Asia/Singapore">Singapore</option>
        </select>
      </div>

      <div className="settings-group">
        <label>First Day of Week</label>
        <select value={firstDayOfWeek} onChange={(e) => setFirstDayOfWeek(e.target.value as "Sunday" | "Monday")}>
          <option value="Monday">Monday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      <div className="settings-group">
        <label>Time Format</label>
        <select
          value={timeFormat}
          onChange={(e) => setTimeFormat(e.target.value as "12" | "24")}
        >
          <option value="12">12 Hour</option>
          <option value="24">24 Hour</option>
        </select>
      </div>

      <div className="preview">
        <div className="preview-item">
          <span>Current Time:</span>
          <strong>{formattedTime}</strong>
        </div>

        <div className="preview-item">
          <span>Current Date:</span>
          <strong>{formattedDate}</strong>
        </div>
      </div>
    </div>
  );
}
