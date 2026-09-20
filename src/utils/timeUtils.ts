import type { BreakItemData, EodCalculationResult, LiveStatusInfo } from '../types/calculator';

/**
 * Converts "HH:mm" to total minutes from 00:00 (0 to 1439).
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

/**
 * Converts total minutes from 00:00 to "HH:mm" string.
 * Supports cross-day wrapping (e.g. 1500 mins -> 01:00 next day).
 */
export function minutesToTime(totalMinutes: number): { timeStr: string; isNextDay: boolean; daysAdded: number } {
  const normalized = Math.max(0, Math.round(totalMinutes));
  const daysAdded = Math.floor(normalized / 1440);
  const minutesInDay = normalized % 1440;
  const hours = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return {
    timeStr: `${hh}:${mm}`,
    isNextDay: daysAdded > 0,
    daysAdded,
  };
}

/**
 * Formats "HH:mm" string into 12-hour format with AM/PM (e.g. "17:45" -> "5:45 PM").
 */
export function formatTime12(timeStr: string): string {
  if (!timeStr || !timeStr.includes(':')) return '--:--';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '--:--';

  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m.toString().padStart(2, '0');
  return `${displayHour}:${displayMin} ${period}`;
}

/**
 * Formats duration in minutes to human readable "Xh Ym" or "Ym".
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Calculates duration between break start and break end in minutes.
 * If end < start, assumes it wraps past midnight.
 */
export function calculateBreakDuration(startTime: string, endTime: string): number {
  const startM = timeToMinutes(startTime);
  const endM = timeToMinutes(endTime);
  if (endM >= startM) {
    return endM - startM;
  }
  // Cross-midnight break (rare, e.g. 23:45 to 00:30)
  return 1440 - startM + endM;
}

/**
 * Calculates EOD based on entry time, required work duration (hours), and breaks.
 */
export function calculateEod(
  entryTime: string,
  workDurationHours: number,
  breaks: BreakItemData[]
): EodCalculationResult {
  const warnings: string[] = [];
  const entryMinutes = timeToMinutes(entryTime);
  const workDurationMinutes = Math.round(workDurationHours * 60);

  // Calculate total break duration
  let totalBreakMinutes = 0;
  breaks.forEach((b) => {
    const dur = calculateBreakDuration(b.startTime, b.endTime);
    if (dur <= 0) {
      warnings.push(`Break "${b.name || 'Untitled'}" has 0 duration.`);
    }
    totalBreakMinutes += dur;
  });

  const totalOfficeMinutes = workDurationMinutes + totalBreakMinutes;
  const eodMinutesRaw = entryMinutes + totalOfficeMinutes;
  const { timeStr: eodTime, isNextDay } = minutesToTime(eodMinutesRaw);

  return {
    entryTime,
    workDurationMinutes,
    totalBreakMinutes,
    totalOfficeMinutes,
    eodTime,
    eodFormatted12: formatTime12(eodTime),
    isNextDay,
    warnings,
  };
}

/**
 * Returns current local time in "HH:mm" format.
 */
export function getCurrentTimeString(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Computes live workday status against the current time.
 */
export function getLiveWorkStatus(
  entryTime: string,
  eodTime: string,
  breaks: BreakItemData[],
  currentDate: Date = new Date()
): LiveStatusInfo {
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const entryMinutes = timeToMinutes(entryTime);
  let eodMinutes = timeToMinutes(eodTime);

  // If EOD is next day
  if (eodMinutes < entryMinutes) {
    eodMinutes += 1440;
  }

  let adjustedCurrentMinutes = currentMinutes;
  if (eodMinutes > 1440 && adjustedCurrentMinutes < entryMinutes) {
    // We crossed midnight into the early morning of the next day
    adjustedCurrentMinutes += 1440;
  }

  if (adjustedCurrentMinutes < entryMinutes) {
    const remaining = eodMinutes - entryMinutes;
    return {
      status: 'not-started',
      progressPercentage: 0,
      minutesWorkedSoFar: 0,
      remainingMinutes: remaining,
    };
  }

  if (adjustedCurrentMinutes >= eodMinutes) {
    return {
      status: 'completed',
      progressPercentage: 100,
      minutesWorkedSoFar: eodMinutes - entryMinutes,
      remainingMinutes: 0,
    };
  }

  // Check if currently within any break
  let activeBreak: BreakItemData | undefined = undefined;
  for (const b of breaks) {
    const bStart = timeToMinutes(b.startTime);
    let bEnd = timeToMinutes(b.endTime);
    if (bEnd < bStart) bEnd += 1440;

    const evalCurrent = adjustedCurrentMinutes;
    if (evalCurrent >= bStart && evalCurrent < bEnd) {
      activeBreak = b;
      break;
    }
  }

  const totalOfficeSpan = Math.max(1, eodMinutes - entryMinutes);
  const elapsedMinutes = adjustedCurrentMinutes - entryMinutes;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((elapsedMinutes / totalOfficeSpan) * 100)));
  const remainingMinutes = Math.max(0, eodMinutes - adjustedCurrentMinutes);

  return {
    status: activeBreak ? 'on-break' : 'working',
    currentBreak: activeBreak,
    progressPercentage,
    minutesWorkedSoFar: elapsedMinutes,
    remainingMinutes,
  };
}
