import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BreakCategory, BreakItemData, EodCalculationResult, LiveStatusInfo } from '../types/calculator';
import { calculateEod, getCurrentTimeString, getLiveWorkStatus, minutesToTime, timeToMinutes } from '../utils/timeUtils';

const STORAGE_KEY = 'eod_calculator_state_v1';

const DEFAULT_ENTRY_TIME = '09:00';
const DEFAULT_WORK_HOURS = 8;

const DEFAULT_BREAKS: BreakItemData[] = [
  {
    id: 'default-lunch',
    name: 'Lunch Break',
    category: 'lunch',
    startTime: '13:00',
    endTime: '13:45',
  },
  {
    id: 'default-prayer',
    name: 'Prayer / Tea Break',
    category: 'prayer',
    startTime: '16:00',
    endTime: '16:20',
  }
];

export function useEodCalculator() {
  // Load initial state from localStorage or use defaults
  const [entryTime, setEntryTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.entryTime) return parsed.entryTime;
      }
    } catch {
      // Ignore parse error
    }
    return DEFAULT_ENTRY_TIME;
  });

  const [workDurationHours, setWorkDurationHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workDurationHours) return parsed.workDurationHours;
      }
    } catch {
      // Ignore parse error
    }
    return DEFAULT_WORK_HOURS;
  });

  const [breaks, setBreaks] = useState<BreakItemData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.breaks)) return parsed.breaks;
      }
    } catch {
      // Ignore parse error
    }
    return DEFAULT_BREAKS;
  });

  // Keep a live clock ticker
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 15000); // update every 15 seconds
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          entryTime,
          workDurationHours,
          breaks,
        })
      );
    } catch {
      // Ignore storage error
    }
  }, [entryTime, workDurationHours, breaks]);

  // Calculations
  const calculation: EodCalculationResult = useMemo(() => {
    return calculateEod(entryTime, workDurationHours, breaks);
  }, [entryTime, workDurationHours, breaks]);

  // Live status
  const liveStatus: LiveStatusInfo = useMemo(() => {
    return getLiveWorkStatus(entryTime, calculation.eodTime, breaks, currentDate);
  }, [entryTime, calculation.eodTime, breaks, currentDate]);

  // Handlers
  const setEntryToNow = useCallback(() => {
    setEntryTime(getCurrentTimeString());
  }, []);

  const addBreak = useCallback((breakData: Omit<BreakItemData, 'id'>) => {
    const newBreak: BreakItemData = {
      ...breakData,
      id: 'break-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    setBreaks((prev) => [...prev, newBreak]);
  }, []);

  const updateBreak = useCallback((id: string, updated: Partial<BreakItemData>) => {
    setBreaks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
  }, []);

  const removeBreak = useCallback((id: string) => {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const quickAddBreak = useCallback((category: BreakCategory, durationMinutes: number, customName?: string) => {
    const defaultLabels: Record<BreakCategory, string> = {
      lunch: 'Lunch Break',
      prayer: 'Prayer Break',
      tea: 'Tea / Coffee Break',
      other: 'Short Break',
    };

    const name = customName || defaultLabels[category] || 'Break';

    // Pick reasonable start time: if breaks exist, start 1 hour after latest break end, else entryTime + 3 hours
    let startMinutes = timeToMinutes(entryTime) + 240; // 4 hours after entry
    if (breaks.length > 0) {
      const lastBreak = breaks[breaks.length - 1];
      startMinutes = timeToMinutes(lastBreak.endTime) + 60;
    }

    const { timeStr: startTime } = minutesToTime(startMinutes);
    const { timeStr: endTime } = minutesToTime(startMinutes + durationMinutes);

    addBreak({
      name,
      category,
      startTime,
      endTime,
    });
  }, [addBreak, entryTime, breaks]);

  const resetToDefaults = useCallback(() => {
    setEntryTime(DEFAULT_ENTRY_TIME);
    setWorkDurationHours(DEFAULT_WORK_HOURS);
    setBreaks(DEFAULT_BREAKS);
  }, []);

  return {
    entryTime,
    setEntryTime,
    setEntryToNow,
    workDurationHours,
    setWorkDurationHours,
    breaks,
    addBreak,
    updateBreak,
    removeBreak,
    quickAddBreak,
    resetToDefaults,
    calculation,
    liveStatus,
    currentDate,
  };
}
