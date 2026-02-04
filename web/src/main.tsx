import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register';
import './index.css'
import App from './App.js'
import './i18n.js';
import { db } from './db/database.js';

registerSW({ immediate: true });

db.open().catch((err) => {
  if (err.name === 'VersionError') {
    console.error("Database version mismatch. Wiping local data...");
    db.delete().then(() => window.location.reload());
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)