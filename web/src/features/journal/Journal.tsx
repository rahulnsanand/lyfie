import { NotionEditor } from "@modules/tiptap";
import "./Journal.css";

export default function Journal() {
  return (
    <div className="journal-layout">
      <NotionEditor />
    </div>
  );
}