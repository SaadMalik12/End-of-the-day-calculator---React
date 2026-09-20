import { useEodCalculator } from './hooks/useEodCalculator';
import { Header } from './components/Header';
import { EntryTimeCard } from './components/EntryTimeCard';
import { BreaksCard } from './components/BreaksCard';
import { EodResultCard } from './components/EodResultCard';
import { DayTimeline } from './components/DayTimeline';
import { LiveStatusBadge } from './components/LiveStatusBadge';
import './App.css';

function App() {
  const {
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
  } = useEodCalculator();

  return (
    <div className="app-container">
      <Header currentDate={currentDate} onReset={resetToDefaults} />

      <main className="main-content">
        <LiveStatusBadge liveStatus={liveStatus} />

        <div className="dashboard-grid">
          {/* Left Column: Inputs & Breaks */}
          <div className="dashboard-col left-col">
            <EntryTimeCard
              entryTime={entryTime}
              onEntryTimeChange={setEntryTime}
              onSetToNow={setEntryToNow}
              workDurationHours={workDurationHours}
              onWorkDurationChange={setWorkDurationHours}
            />

            <BreaksCard
              breaks={breaks}
              onAddBreak={addBreak}
              onUpdateBreak={updateBreak}
              onRemoveBreak={removeBreak}
              onQuickAdd={quickAddBreak}
              totalBreakMinutes={calculation.totalBreakMinutes}
              entryTime={entryTime}
            />
          </div>

          {/* Right Column: EOD Target Output & Visual Timeline */}
          <div className="dashboard-col right-col">
            <EodResultCard calculation={calculation} />

            <DayTimeline calculation={calculation} breaks={breaks} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Calculated for <strong>{workDurationHours} hours</strong> of net productive work. Breaks for lunch and prayers automatically extend your departure time.
        </p>
      </footer>
    </div>
  );
}

export default App;
