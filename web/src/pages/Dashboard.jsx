import { useNavigate } from 'react-router-dom';
import { authService } from '../authService';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  return (
    <button onClick={handleLogout} className="text-red-500">Sign Out</button>
  );
}