import React from 'react';
import { LogIn, Clock, Briefcase } from 'lucide-react';
import { formatTime12 } from '../utils/timeUtils';

interface EntryTimeCardProps {
  entryTime: string;
  onEntryTimeChange: (time: string) => void;
  onSetToNow: () => void;
  workDurationHours: number;
  onWorkDurationChange: (hours: number) => void;
}

export const EntryTimeCard: React.FC<EntryTimeCardProps> = ({
  entryTime,
  onEntryTimeChange,
  onSetToNow,
  workDurationHours,
  onWorkDurationChange,
}) => {
  return (
    <div className="card entry-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-primary">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <h2 className="card-title">Office Arrival</h2>
            <p className="card-desc">Specify when you entered the office</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="entry-input-section">
          <div className="time-input-container">
            <label htmlFor="entry-time-input" className="input-label">
              Check-in Time
            </label>
            <div className="input-with-preview">
              <input
                id="entry-time-input"
                type="time"
                value={entryTime}
                onChange={(e) => onEntryTimeChange(e.target.value)}
                className="time-picker-input"
                required
              />
              <div className="time-12h-pill">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime12(entryTime)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSetToNow}
            className="btn btn-outline"
            title="Set arrival time to current time"
          >
            <Clock className="w-4 h-4" />
            <span>Set to Now</span>
          </button>
        </div>

        <div className="work-hours-section">
          <div className="work-hours-header">
            <label htmlFor="work-hours-input" className="input-label flex-row-center">
              <Briefcase className="w-4 h-4 mr-1.5" />
              Target Work Duration
            </label>
            <span className="work-hours-value">{workDurationHours} Hours</span>
          </div>

          <div className="work-hours-controls">
            {[7.5, 8, 8.5, 9].map((hours) => (
              <button
                key={hours}
                type="button"
                className={`pill-option ${workDurationHours === hours ? 'active' : ''}`}
                onClick={() => onWorkDurationChange(hours)}
              >
                {hours}h
              </button>
            ))}
            <div className="custom-hours-wrapper">
              <input
                id="work-hours-input"
                type="number"
                min="1"
                max="16"
                step="0.25"
                value={workDurationHours}
                onChange={(e) => onWorkDurationChange(Math.max(1, parseFloat(e.target.value) || 1))}
                className="number-input-sm"
                title="Custom hours"
              />
              <span className="input-unit">hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
