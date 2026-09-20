import React, { useState } from 'react';
import { Coffee, Plus, Utensils, Sun, Clock } from 'lucide-react';
import type { BreakCategory, BreakItemData } from '../types/calculator';
import { BreakItem } from './BreakItem';
import { formatDuration, minutesToTime, timeToMinutes } from '../utils/timeUtils';

interface BreaksCardProps {
  breaks: BreakItemData[];
  onAddBreak: (data: Omit<BreakItemData, 'id'>) => void;
  onUpdateBreak: (id: string, data: Partial<BreakItemData>) => void;
  onRemoveBreak: (id: string) => void;
  onQuickAdd: (category: BreakCategory, durationMinutes: number, name?: string) => void;
  totalBreakMinutes: number;
  entryTime: string;
}

export const BreaksCard: React.FC<BreaksCardProps> = ({
  breaks,
  onAddBreak,
  onUpdateBreak,
  onRemoveBreak,
  onQuickAdd,
  totalBreakMinutes,
  entryTime,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<BreakCategory>('lunch');
  const [customStart, setCustomStart] = useState('13:00');
  const [customEnd, setCustomEnd] = useState('13:45');

  const handleOpenCustomForm = () => {
    // Default smart start time: after entry time + 4h or after last break
    let startM = timeToMinutes(entryTime) + 240;
    if (breaks.length > 0) {
      startM = timeToMinutes(breaks[breaks.length - 1].endTime) + 30;
    }
    const { timeStr: sTime } = minutesToTime(startM);
    const { timeStr: eTime } = minutesToTime(startM + 30);
    setCustomStart(sTime);
    setCustomEnd(eTime);
    setCustomName('');
    setIsAddingCustom(true);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultLabels: Record<BreakCategory, string> = {
      lunch: 'Lunch Break',
      prayer: 'Prayer Break',
      tea: 'Tea Break',
      other: 'Custom Break',
    };
    onAddBreak({
      name: customName.trim() || defaultLabels[customCategory],
      category: customCategory,
      startTime: customStart,
      endTime: customEnd,
    });
    setIsAddingCustom(false);
  };

  return (
    <div className="card breaks-card">
      <div className="card-header flex-between">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-amber">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="card-title">Breaks & Pauses</h2>
            <p className="card-desc">Lunch, prayers, tea, or personal breaks</p>
          </div>
        </div>

        <div className="total-breaks-chip" title="Total accumulated break time">
          <span>Total:</span>
          <strong className="ml-1 text-highlight">{formatDuration(totalBreakMinutes)}</strong>
        </div>
      </div>

      <div className="card-body">
        {/* Quick Add Presets */}
        <div className="quick-presets-bar">
          <span className="presets-label">Quick Add:</span>
          <div className="presets-buttons">
            <button
              type="button"
              className="btn-preset btn-preset-lunch"
              onClick={() => onQuickAdd('lunch', 45, 'Lunch Break')}
            >
              <Utensils className="w-3.5 h-3.5 mr-1" />
              Lunch (45m)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset-prayer"
              onClick={() => onQuickAdd('prayer', 15, 'Prayer Break')}
            >
              <Sun className="w-3.5 h-3.5 mr-1" />
              Prayer (15m)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset-prayer"
              onClick={() => onQuickAdd('prayer', 20, 'Dhuhr / Asr Prayer')}
            >
              <Sun className="w-3.5 h-3.5 mr-1" />
              Prayer (20m)
            </button>
            <button
              type="button"
              className="btn-preset btn-preset-tea"
              onClick={() => onQuickAdd('tea', 15, 'Tea / Coffee')}
            >
              <Coffee className="w-3.5 h-3.5 mr-1" />
              Tea (15m)
            </button>
          </div>
        </div>

        {/* Break Items List */}
        <div className="breaks-list">
          {breaks.length === 0 ? (
            <div className="empty-breaks-notice">
              <Clock className="w-8 h-8 empty-icon" />
              <p className="empty-title">No breaks added yet</p>
              <p className="empty-subtitle">
                Your workday will be continuous without pauses. Click below or use a preset to add breaks.
              </p>
            </div>
          ) : (
            breaks.map((b) => (
              <BreakItem
                key={b.id}
                breakData={b}
                onUpdate={onUpdateBreak}
                onRemove={onRemoveBreak}
              />
            ))
          )}
        </div>

        {/* Add custom break form or trigger */}
        {isAddingCustom ? (
          <form className="new-break-form" onSubmit={handleSaveCustom}>
            <h3 className="form-subheading">Add Custom Break</h3>
            <div className="form-grid">
              <div className="form-field">
                <label className="input-label">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dhuhr Prayer, Lunch, Gym"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-field">
                <label className="input-label">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as BreakCategory)}
                  className="select-input"
                >
                  <option value="lunch">Lunch</option>
                  <option value="prayer">Prayer</option>
                  <option value="tea">Tea / Coffee</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label className="input-label">Start Time</label>
                <input
                  type="time"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="time-picker-input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="input-label">End Time</label>
                <input
                  type="time"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="time-picker-input"
                  required
                />
              </div>
            </div>

            <div className="form-buttons-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsAddingCustom(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Break
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="btn btn-dashed w-full"
            onClick={handleOpenCustomForm}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Custom Break</span>
          </button>
        )}
      </div>
    </div>
  );
};
