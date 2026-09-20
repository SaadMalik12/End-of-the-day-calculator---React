import React from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { formatTime12, getCurrentTimeString } from '../utils/timeUtils';

interface HeaderProps {
  currentDate: Date;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onReset }) => {
  const timeString = getCurrentTimeString(currentDate);
  const formatted12 = formatTime12(timeString);

  return (
    <header className="app-header">
      <div className="header-branding">
        <div className="logo-icon-wrapper">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="header-title">Office EOD Calculator</h1>
          <p className="header-subtitle">Track your 8-hour workday and auto-calculate departure time with breaks</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="current-time-badge" title="Current Local Time">
          <span className="live-dot" />
          <span className="time-label">Now:</span>
          <span className="time-value">{formatted12}</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          title="Reset to default 9:00 AM entry and sample breaks"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};
