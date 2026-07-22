import { useState } from "react";
import "./App.css";

function App() {
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  function startCycle() {
    setIsRunning(true);
  }

  return (
    <main className="app">
      <section className="card">
        <header>
          <h1>washi 🫧</h1>
          <p>your laundry buddy</p>
        </header>

        <div className="washingMachine">
          <div className="controls">
            <span className="display">
              {isRunning ? `${duration} min` : "ready"}
            </span>

            <span className="dial" />
          </div>

          <div className="door">
            <div className="face">
              <span>•</span>
              <span>ᴗ</span>
              <span>•</span>
            </div>
          </div>
        </div>

        {isRunning ? (
          <>
            <h2>washing away!</h2>
            <p>{duration} minutes remaining</p>

            <button onClick={() => setIsRunning(false)}>
              cancel cycle
            </button>
          </>
        ) : (
          <>
            <label htmlFor="duration">cycle length</label>

            <select
              id="duration"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>2 hours</option>
            </select>

            <button onClick={startCycle}>start cycle</button>
          </>
        )}
      </section>
    </main>
  );
}

export default App;