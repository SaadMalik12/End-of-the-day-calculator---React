import React from 'react';
import { CheckCircle2, Clock, Coffee, Sparkles } from 'lucide-react';
import type { LiveStatusInfo } from '../types/calculator';
import { formatDuration } from '../utils/timeUtils';

interface LiveStatusBadgeProps {
  liveStatus: LiveStatusInfo;
}

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({ liveStatus }) => {
  const { status, currentBreak, progressPercentage, remainingMinutes } = liveStatus;

  const renderBadgeContent = () => {
    switch (status) {
      case 'not-started':
        return (
          <div className="status-badge-inner status-not-started">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="status-text">Shift not started yet</span>
          </div>
        );
      case 'on-break':
        return (
          <div className="status-badge-inner status-on-break">
            <span className="pulse-indicator pulse-amber" />
            <Coffee className="w-4 h-4 mr-1.5 text-amber-500" />
            <span className="status-text">
              Currently on break: <strong>{currentBreak?.name || 'Break'}</strong>
            </span>
          </div>
        );
      case 'completed':
        return (
          <div className="status-badge-inner status-completed">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
            <span className="status-text">
              <strong>Shift Complete!</strong> You have fulfilled your office hours 🎉
            </span>
          </div>
        );
      case 'working':
      default:
        return (
          <div className="status-badge-inner status-working">
            <span className="pulse-indicator pulse-green" />
            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-500" />
            <span className="status-text">
              Currently Working • <strong>{formatDuration(remainingMinutes)}</strong> left until departure
            </span>
          </div>
        );
    }
  };

  return (
    <div className="live-status-container">
      <div className="live-status-header">
        {renderBadgeContent()}
        <span className="progress-percent-label">{progressPercentage}% Day Completed</span>
      </div>

      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill progress-fill-${status}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
