"use client"

import { SetStateAction } from "react";
import { GridSize } from "../DataTypes";

interface GameSetupProps {
  gridSize: number
  setGridSize: React.Dispatch<SetStateAction<GridSize>>;
  gameKey: string
  setGameKey: (key: string) => void
  timedMatch: boolean
  setTimedMatch: (timed: boolean) => void
  selectedTime: number
  setSelectedTime: React.Dispatch<SetStateAction<number>>; 
  onStartGame: () => void
  onClose: () => void
}

export default function GameSetup({
  gridSize,
  setGridSize,
  gameKey,
  setGameKey,
  timedMatch,
  setTimedMatch,
  selectedTime,
  setSelectedTime,
  onStartGame,
  onClose,
}: GameSetupProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Game Setup</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label>Grid Size</label>
            <select className="select-input" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value) as GridSize)}>
              <option value="5">5×5</option>
              <option value="6">6×6</option>
              <option value="7">7×7</option>
              <option value="8">8×8</option>
              <option value="9">9×9</option>
              <option value="10">10x10</option>
            </select>
          </div>

          <div className="form-group">
            <label>Game Key</label>
            <input
              type="text"
              className="text-input"
              value={gameKey}
              onChange={(e) => setGameKey(e.target.value)}
              placeholder="Enter game key"
            />
          </div>

          <div className="form-group toggle-group">
            <label>Enable Timed Match</label>
            <div className={`toggle ${timedMatch ? "active" : ""}`} onClick={() => setTimedMatch(!timedMatch)}>
              <div className="toggle-slider"></div>
            </div>
          </div>
        {timedMatch && 
          <div className="time-options">
            {[
              { display: "5 min", value: 300 },
              { display: "10 min", value: 600 },
              { display: "15 min", value: 900 },
              { display: "30 min", value: 1800 }
            ].map((timeOption) => (
              <button
          key={timeOption.display}
          className={`time-btn ${selectedTime === timeOption.value ? "active" : ""}`}
          onClick={() => setSelectedTime(timeOption.value)}
              >
          {timeOption.display}
              </button>
            ))}
          </div>}

          <button className="btn primary-btn full-width" onClick={onStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

