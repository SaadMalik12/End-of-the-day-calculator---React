import React from 'react';
import { Calendar } from 'lucide-react';
import type { BreakItemData, EodCalculationResult } from '../types/calculator';
import { formatDuration, formatTime12, timeToMinutes } from '../utils/timeUtils';

interface DayTimelineProps {
  calculation: EodCalculationResult;
  breaks: BreakItemData[];
}

interface Segment {
  type: 'work' | 'break';
  label: string;
  category?: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  percentage: number;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({ calculation, breaks }) => {
  const { entryTime, eodTime, totalOfficeMinutes } = calculation;

  if (totalOfficeMinutes <= 0) return null;

  const entryMinutes = timeToMinutes(entryTime);
  let eodMinutes = timeToMinutes(eodTime);
  if (eodMinutes < entryMinutes) {
    eodMinutes += 1440;
  }

  // Sort breaks by chronological start time
  const sortedBreaks = [...breaks]
    .map((b) => {
      let bStart = timeToMinutes(b.startTime);
      let bEnd = timeToMinutes(b.endTime);
      if (bStart < entryMinutes && bStart + 1440 < eodMinutes) {
        bStart += 1440;
        bEnd += 1440;
      }
      if (bEnd < bStart) {
        bEnd += 1440;
      }
      return {
        ...b,
        startM: bStart,
        endM: bEnd,
        durM: bEnd - bStart,
      };
    })
    .sort((a, b) => a.startM - b.startM);

  // Build segments (work vs break intervals)
  const segments: Segment[] = [];
  let pointer = entryMinutes;

  sortedBreaks.forEach((b) => {
    // If there's work time before this break
    if (b.startM > pointer) {
      const workDur = Math.min(b.startM - pointer, eodMinutes - pointer);
      if (workDur > 0) {
        segments.push({
          type: 'work',
          label: 'Work',
          startMinutes: pointer,
          endMinutes: pointer + workDur,
          durationMinutes: workDur,
          percentage: (workDur / totalOfficeMinutes) * 100,
        });
      }
      pointer = b.startM;
    }

    // Add break segment
    const breakDur = b.durM;
    if (breakDur > 0 && pointer < eodMinutes) {
      segments.push({
        type: 'break',
        label: b.name || 'Break',
        category: b.category,
        startMinutes: pointer,
        endMinutes: pointer + breakDur,
        durationMinutes: breakDur,
        percentage: (breakDur / totalOfficeMinutes) * 100,
      });
      pointer = pointer + breakDur;
    }
  });

  // Final work segment up to EOD
  if (pointer < eodMinutes) {
    const finalWorkDur = eodMinutes - pointer;
    segments.push({
      type: 'work',
      label: 'Work',
      startMinutes: pointer,
      endMinutes: eodMinutes,
      durationMinutes: finalWorkDur,
      percentage: (finalWorkDur / totalOfficeMinutes) * 100,
    });
  }

  return (
    <div className="card timeline-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-indigo">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="card-title">Day Schedule Visualizer</h2>
            <p className="card-desc">Visual distribution of your work and break intervals</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Visual Bar */}
        <div className="timeline-bar-container">
          <div className="timeline-bar">
            {segments.map((seg, idx) => (
              <div
                key={idx}
                className={`timeline-segment seg-${seg.type} ${seg.category ? `seg-cat-${seg.category}` : ''}`}
                style={{ width: `${Math.max(2, seg.percentage)}%` }}
                title={`${seg.label} (${formatDuration(seg.durationMinutes)})`}
              >
                {seg.percentage > 10 && (
                  <span className="segment-label">
                    {seg.label} <small>({formatDuration(seg.durationMinutes)})</small>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="timeline-markers">
            <div className="marker marker-start">
              <span className="marker-label">Entry</span>
              <span className="marker-time">{formatTime12(entryTime)}</span>
            </div>
            <div className="marker marker-end">
              <span className="marker-label">End of Day</span>
              <span className="marker-time">{calculation.eodFormatted12}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="timeline-legend">
          <div className="legend-item">
            <span className="legend-chip chip-work" />
            <span>Work Time ({formatDuration(calculation.workDurationMinutes)})</span>
          </div>
          <div className="legend-item">
            <span className="legend-chip chip-lunch" />
            <span>Lunch</span>
          </div>
          <div className="legend-item">
            <span className="legend-chip chip-prayer" />
            <span>Prayer</span>
          </div>
          <div className="legend-item">
            <span className="legend-chip chip-tea" />
            <span>Tea / Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};
