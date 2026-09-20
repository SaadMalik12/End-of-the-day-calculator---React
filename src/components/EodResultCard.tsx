import React, { useState } from 'react';
import { LogOut, Check, Copy, AlertCircle, Sun, Coffee, Briefcase } from 'lucide-react';
import type { EodCalculationResult } from '../types/calculator';
import { formatDuration, formatTime12 } from '../utils/timeUtils';

interface EodResultCardProps {
  calculation: EodCalculationResult;
}

export const EodResultCard: React.FC<EodResultCardProps> = ({ calculation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `My End of Day (EOD) is ${calculation.eodFormatted12} (Entry: ${formatTime12(calculation.entryTime)}, Breaks: ${formatDuration(calculation.totalBreakMinutes)})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="card eod-hero-card">
      <div className="eod-badge-tag">
        <LogOut className="w-4 h-4 mr-1.5" />
        TARGET DEPARTURE TIME
      </div>

      <div className="eod-main-display">
        <div className="eod-time-wrapper">
          <span className="eod-time-headline">{calculation.eodFormatted12}</span>
          <span className="eod-time-sub">({calculation.eodTime} 24h)</span>
        </div>

        {calculation.isNextDay && (
          <div className="next-day-pill">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Departs next day
          </div>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          title="Copy EOD details to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-icon-wrap">
            <Sun className="w-4 h-4 text-sky-500" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Office Entry</span>
            <span className="metric-val">{formatTime12(calculation.entryTime)}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap">
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Target Work</span>
            <span className="metric-val">{formatDuration(calculation.workDurationMinutes)}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap">
            <Coffee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Breaks</span>
            <span className="metric-val text-amber">{formatDuration(calculation.totalBreakMinutes)}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap">
            <LogOut className="w-4 h-4 text-purple-500" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Time in Office</span>
            <span className="metric-val">{formatDuration(calculation.totalOfficeMinutes)}</span>
          </div>
        </div>
      </div>

      {calculation.warnings.length > 0 && (
        <div className="calculation-warnings">
          {calculation.warnings.map((warn, i) => (
            <div key={i} className="warning-line">
              <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
