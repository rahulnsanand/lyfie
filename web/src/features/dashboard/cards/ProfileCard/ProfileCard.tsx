import { useState, MouseEvent } from "react";
import { InfoIcon } from "@phosphor-icons/react";
import "./ProfileCard.css";


export default function ProfileCard() {
  const [showVersionInfo, setShowVersionInfo] = useState(false);

  // TEMP assumptions (later fetched from GitHub)
  const currentVersion = "1.2.1";
  const latestVersion = "1.3.0";
  const isOutdated = currentVersion !== latestVersion;

  function handleInfoClick(e: MouseEvent) {
    e.stopPropagation(); // ⛔ prevent opening settings
    setShowVersionInfo((v) => !v);
  }

  return (
    <div
      className="profile-inner-layout"
      style={{ cursor: "pointer" }}
    >
      {/* --- Top Section --- */}
      <div className="profile-top-section">
        <div className="profile-avatar">RA</div>
        <div className="profile-meta">
          <h4 className="profile-name">Rahul Anand</h4>
          <span className="profile-email">admin@burgerlife.in</span>
        </div>
      </div>

      {/* --- Stats --- */}
      <div className="profile-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Currency</span>
          <span className="stat-value">INR</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Timezone</span>
          <span className="stat-value">IST</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Unit</span>
          <span className="stat-value">Metric</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Theme</span>
          <span className="stat-value">Dark</span>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="profile-card-footer">
        <div className="version-container">
          <span className={`version-text ${isOutdated ? "outdated" : ""}`}>
            lyfie v{currentVersion}
          </span>

          {isOutdated && (
            <>
              <span className="version-dot" />
              <InfoIcon
                size={14}
                className="version-info-icon"
                onClick={handleInfoClick}
              />

              {showVersionInfo && (
                <div className="version-popover" onClick={(e) => e.stopPropagation()}>
                  <strong>Update available</strong>
                  <p>
                    Youre running lyfie v{currentVersion}.  
                    A newer version (v{latestVersion}) is available with fixes and improvements.
                  </p>
                  <span className="popover-hint">
                    Updating keeps your dashboard secure and smooth.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <span className="status-text">status [online]</span>
      </footer>
    </div>
  );
}
