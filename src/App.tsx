import { useEffect, useState } from "react";
import "./App.css";

type WashiStatus = "idle" | "washing" | "finished";

const FINISH_TIME_KEY = "washi-finish-time";
const DURATION_KEY = "washi-duration";

function App() {
  const [selectedMinutes, setSelectedMinutes] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [status, setStatus] = useState<WashiStatus>("idle");

  useEffect(() => {
    const savedFinishTime = localStorage.getItem(FINISH_TIME_KEY);
    const savedDuration = localStorage.getItem(DURATION_KEY);

    if (!savedFinishTime || !savedDuration) {
      return;
    }

    const finishTime = Number(savedFinishTime);
    const duration = Number(savedDuration);
    const remaining = Math.max(0, finishTime - Date.now());

    setTotalDuration(duration);

    if (remaining > 0) {
      setTimeLeft(remaining);
      setStatus("washing");
    } else {
      setTimeLeft(0);
      setStatus("finished");
    }
  }, []);

  useEffect(() => {
    if (status !== "washing") {
      return;
    }

    const updateTimer = () => {
      const savedFinishTime = localStorage.getItem(FINISH_TIME_KEY);

      if (!savedFinishTime) {
        return;
      }

      const remaining = Math.max(0, Number(savedFinishTime) - Date.now());

      setTimeLeft(remaining);

      if (remaining <= 0) {
        setStatus("finished");
      }
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const startTimer = () => {
    const duration = selectedMinutes * 60 * 1000;
    const finishTime = Date.now() + duration;

    localStorage.setItem(FINISH_TIME_KEY, finishTime.toString());
    localStorage.setItem(DURATION_KEY, duration.toString());

    setTotalDuration(duration);
    setTimeLeft(duration);
    setStatus("washing");
  };

  const resetTimer = () => {
    localStorage.removeItem(FINISH_TIME_KEY);
    localStorage.removeItem(DURATION_KEY);

    setTimeLeft(0);
    setTotalDuration(0);
    setStatus("idle");
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getMessage = () => {
    switch (status) {
      case "washing":
        return "washing your STINKY things!";
      case "finished":
        return "all clean!!";
      default:
        return "ready when you are!";
    }
  };

  const getFace = () => {
    switch (status) {
      case "washing":
        return "•ᴗ•";
      case "finished":
        return "≧◡≦";
      default:
        return "•‿•";
    }
  };

  const progress =
    status === "finished"
      ? 100
      : totalDuration > 0
        ? ((totalDuration - timeLeft) / totalDuration) * 100
        : 0;

  const progressBackground = `conic-gradient(
    var(--sage-dark) ${progress}%,
    #ded8cc ${progress}% 100%
  )`;

  return (
    <main className="app">
      <section
        className={`card ${
          status === "finished" ? "card--finished" : ""
        }`}
      >
        <header>
          <h1>washi!</h1>
          <p>adam's laundry buddy</p>
        </header>

        <div className="speechBubble">
          <span className="speechBubble__text">{getMessage()}</span>
        </div>

        <div
          className={`washingMachine ${
            status === "washing" ? "washingMachine--washing" : ""
          }`}
        >
          <div className="controls">
            <div className="display">
              {status === "washing"
                ? formatTime(timeLeft)
                : status === "finished"
                  ? "DONE!"
                  : "READY"}
            </div>

            <div className="dial" aria-hidden="true" />
          </div>

          <div
            className="doorProgress"
            style={{ background: progressBackground }}
          >
            <div className="door">
              <div className="clothes" aria-hidden="true">
                <span>👕</span>
                <span>🧦</span>
              </div>

              <div className="face" aria-label={`Washi is ${status}`}>
                {getFace()}
              </div>
            </div>
          </div>

          {status === "washing" && (
            <div className="bubbles" aria-hidden="true">
              <span>○</span>
              <span>○</span>
              <span>○</span>
            </div>
          )}
        </div>

        <div className="timerControls">
          {status === "idle" && (
            <>
              <label htmlFor="wash-duration">
                How long is the wash?
              </label>

              <select
                id="wash-duration"
                value={selectedMinutes}
                onChange={(event) =>
                  setSelectedMinutes(Number(event.target.value))
                }
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1 hour 30 minutes</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>

              <button
                className="primaryButton"
                type="button"
                onClick={startTimer}
              >
                start washing
              </button>
            </>
          )}

          {status === "washing" && (
            <>
              <div className="timer">{formatTime(timeLeft)}</div>

              <button
                className="secondaryButton"
                type="button"
                onClick={resetTimer}
              >
                cancel wash
              </button>
            </>
          )}

          {status === "finished" && (
            <div className="finishedMessage">
              <h2>laundry complete! ✨</h2>
              <p>don't forget to empty me!</p>

              <button
                className="primaryButton"
                type="button"
                onClick={resetTimer}
              >
                all emptied!
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;