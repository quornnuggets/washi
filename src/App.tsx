import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "washi-finish-time";

type TimerStatus = "idle" | "washing" | "finished";

function getSavedFinishTime(): number | null {
  const savedValue = localStorage.getItem(STORAGE_KEY);

  if (!savedValue) {
    return null;
  }

  const parsedValue = Number(savedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function calculateRemainingSeconds(finishTime: number | null): number {
  if (!finishTime) {
    return 0;
  }

  return Math.max(0, Math.ceil((finishTime - Date.now()) / 1000));
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function App() {
  const [duration, setDuration] = useState(60);

  const [finishTime, setFinishTime] = useState<number | null>(() =>
    getSavedFinishTime(),
  );

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemainingSeconds(getSavedFinishTime()),
  );

  const status: TimerStatus =
    finishTime === null
      ? "idle"
      : remainingSeconds > 0
        ? "washing"
        : "finished";

  useEffect(() => {
    if (!finishTime) {
      return;
    }

    function updateTimer() {
      setRemainingSeconds(calculateRemainingSeconds(finishTime));
    }

    updateTimer();

    const intervalId = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [finishTime]);

  function startCycle() {
    const newFinishTime = Date.now() + duration * 60 * 1000;

    localStorage.setItem(STORAGE_KEY, newFinishTime.toString());

    setFinishTime(newFinishTime);
    setRemainingSeconds(calculateRemainingSeconds(newFinishTime));
  }

  function cancelCycle() {
    localStorage.removeItem(STORAGE_KEY);

    setFinishTime(null);
    setRemainingSeconds(0);
  }

  function completeLaundry() {
    localStorage.removeItem(STORAGE_KEY);

    setFinishTime(null);
    setRemainingSeconds(0);
  }

  return (
    <main className="app">
      <section className={`card card--${status}`}>
        <header>
          <h1>washi ! 🫧</h1>
          <p>your laundry buddy</p>
        </header>

        <div className={`washingMachine washingMachine--${status}`}>
          <div className="controls">
            <span className="display">
              {status === "idle" && "ready"}
              {status === "washing" && formatTime(remainingSeconds)}
              {status === "finished" && "done!"}
            </span>

            <span className="dial" />
          </div>

          <div className="door">
            <div className="clothes">
              {status === "washing" && (
                <>
                  <span>🧦</span>
                  <span>👕</span>
                </>
              )}
            </div>

            <div className="face" aria-label={`Washi is ${status}`}>
              {status === "idle" && <span>• ᴗ •</span>}
              {status === "washing" && <span>• ◡ •</span>}
              {status === "finished" && <span>• ᴖ •</span>}
            </div>
          </div>

          {status === "washing" && (
            <div className="bubbles" aria-hidden="true">
              <span>○</span>
              <span>◦</span>
              <span>○</span>
            </div>
          )}
        </div>

        {status === "idle" && (
          <section className="timerControls">
            <h2>ready for a wash STINKY?</h2>

            <label htmlFor="duration">cycle length</label>

            <select
              id="duration"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            >
              <option value={1}>1 minute — testing</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>2 hours</option>
            </select>

            <button className="primaryButton" onClick={startCycle}>
              start cycle 🫧
            </button>
          </section>
        )}

        {status === "washing" && (
          <section className="timerControls">
            <h2>washing away!</h2>

            <p className="timer">{formatTime(remainingSeconds)}</p>

            <p>washi is doing his very best</p>

            <button className="secondaryButton" onClick={cancelCycle}>
              cancel cycle
            </button>
          </section>
        )}

        {status === "finished" && (
          <section className="timerControls finishedMessage">
            <h2>all clean !</h2>

            <p>pls come and rescue me 🥺</p>

            <button className="primaryButton" onClick={completeLaundry}>
              laundry moved ! ✨
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;