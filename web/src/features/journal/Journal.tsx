import "./Journal.css";
import { LuthorEditor } from "@shared/components/Luthor/LuthorEditor";

export default function Journal() {

  return (
    <div className="p-4" style={{ margin: "50px" }}>
      <LuthorEditor />
    </div>
  );
}