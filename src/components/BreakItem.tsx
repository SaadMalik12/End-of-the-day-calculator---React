import React from 'react';
import { Utensils, Coffee, Sun, Clock, Trash2 } from 'lucide-react';
import type { BreakCategory, BreakItemData } from '../types/calculator';
import { calculateBreakDuration, formatDuration, formatTime12 } from '../utils/timeUtils';

interface BreakItemProps {
  breakData: BreakItemData;
  onUpdate: (id: string, updated: Partial<BreakItemData>) => void;
  onRemove: (id: string) => void;
}

const getCategoryIcon = (cat: BreakCategory) => {
  switch (cat) {
    case 'lunch':
      return <Utensils className="w-4 h-4 text-orange-500" />;
    case 'prayer':
      return <Sun className="w-4 h-4 text-emerald-500" />;
    case 'tea':
      return <Coffee className="w-4 h-4 text-amber-500" />;
    case 'other':
    default:
      return <Clock className="w-4 h-4 text-purple-500" />;
  }
};

export const BreakItem: React.FC<BreakItemProps> = ({ breakData, onUpdate, onRemove }) => {
  const duration = calculateBreakDuration(breakData.startTime, breakData.endTime);

  return (
    <div className={`break-item-card category-${breakData.category}`}>
      <div className="break-item-top">
        <div className="break-title-area">
          <span className="category-icon-bubble">{getCategoryIcon(breakData.category)}</span>
          <input
            type="text"
            className="break-name-input"
            value={breakData.name}
            onChange={(e) => onUpdate(breakData.id, { name: e.target.value })}
            placeholder="Break Name (e.g. Lunch / Prayer)"
          />
        </div>

        <div className="break-actions-area">
          <span className={`duration-badge ${duration <= 0 ? 'duration-warning' : ''}`}>
            {formatDuration(duration)}
          </span>
          <button
            type="button"
            className="btn-icon-danger"
            onClick={() => onRemove(breakData.id)}
            title="Delete this break"
            aria-label="Delete break"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="break-times-row">
        <div className="time-field-group">
          <label className="time-sublabel">Start</label>
          <div className="input-with-subtext">
            <input
              type="time"
              className="time-picker-sm"
              value={breakData.startTime}
              onChange={(e) => onUpdate(breakData.id, { startTime: e.target.value })}
            />
            <span className="time-preview-12">{formatTime12(breakData.startTime)}</span>
          </div>
        </div>

        <div className="time-separator">→</div>

        <div className="time-field-group">
          <label className="time-sublabel">End</label>
          <div className="input-with-subtext">
            <input
              type="time"
              className="time-picker-sm"
              value={breakData.endTime}
              onChange={(e) => onUpdate(breakData.id, { endTime: e.target.value })}
            />
            <span className="time-preview-12">{formatTime12(breakData.endTime)}</span>
          </div>
        </div>

        <div className="category-select-group">
          <label className="time-sublabel">Type</label>
          <select
            className="category-dropdown-sm"
            value={breakData.category}
            onChange={(e) => onUpdate(breakData.id, { category: e.target.value as BreakCategory })}
          >
            <option value="lunch">Lunch</option>
            <option value="prayer">Prayer</option>
            <option value="tea">Tea/Coffee</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};
