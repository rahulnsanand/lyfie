import "./JournalCard.css";
import { useNavigate } from "react-router-dom";


export default function JournalCard() {
  const navigate = useNavigate();

  return (
    <div
      className="journal-inner-layout"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/journal")}
    >
      
    </div>
  );
}
