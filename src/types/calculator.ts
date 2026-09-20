export type BreakCategory = 'lunch' | 'prayer' | 'tea' | 'other';

export interface BreakItemData {
  id: string;
  name: string;
  category: BreakCategory;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  notes?: string;
}

export interface EodCalculationResult {
  entryTime: string;           // HH:mm
  workDurationMinutes: number; // e.g. 480 for 8 hrs
  totalBreakMinutes: number;
  totalOfficeMinutes: number;
  eodTime: string;             // HH:mm (24-hour)
  eodFormatted12: string;      // e.g. 05:45 PM
  isNextDay: boolean;
  warnings: string[];
}

export type WorkStatus = 'not-started' | 'working' | 'on-break' | 'completed';

export interface LiveStatusInfo {
  status: WorkStatus;
  currentBreak?: BreakItemData;
  progressPercentage: number;
  minutesWorkedSoFar: number;
  remainingMinutes: number;
}
