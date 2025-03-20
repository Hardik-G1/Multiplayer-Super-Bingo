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
            <select className="select-input" value={gridSize} onChange={(e) => setGridSize(e.target.value)}>
              <option value="3-3">3×3</option>
              <option value="4-4">4×4</option>
              <option value="5-5">5×5</option>
              <option value="5-10">5×10</option>
              <option value="10-10">10×10</option>
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

          <div className="time-options">
            {["5 min", "10 min", "15 min", "30 min"].map((time) => (
              <button
                key={time}
                className={`time-btn ${selectedTime === time ? "active" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <button className="btn primary-btn full-width" onClick={onStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

