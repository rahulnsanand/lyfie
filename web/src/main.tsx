import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register';
import '@styles/index.css'
import App from '@app/App'
import '@app/providers/I18nProvider';
import { db } from '@shared/persistence/database';

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