import React, { SetStateAction, useState } from 'react';
import './TimerToggle.css';

interface TimerProps {
  time: number;
  setTime: React.Dispatch<SetStateAction<number>>;
}

function TimeMatchedToggle({ time, setTime }: TimerProps) {
  const [isTimeMatched, setIsTimeMatched] = useState(false);

  const handleToggle = () => {
    setIsTimeMatched(!isTimeMatched);
    if (!isTimeMatched) setTime(0);
  };

  const handleTimeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(parseInt(e.target.value));
  };

  return (
    <div className="container">
      <div className="toggle-group">
        <label className="toggle-label">Time Matched</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={isTimeMatched}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      {isTimeMatched && (
        <div className="button-group">
          <label className={`button-option ${time === 180 ? 'selected' : ''}`}>
            <input
              type="radio"
              value="180"
              checked={time === 180}
              onChange={handleTimeSelect}
            />
            3 minutes
          </label>
          <label className={`button-option ${time === 300 ? 'selected' : ''}`}>
            <input
              type="radio"
              value="300"
              checked={time === 300}
              onChange={handleTimeSelect}
            />
            5 minutes
          </label>
          <label className={`button-option ${time === 600 ? 'selected' : ''}`}>
            <input
              type="radio"
              value="600"
              checked={time === 600}
              onChange={handleTimeSelect}
            />
            10 minutes
          </label>
          <label className={`button-option ${time === 900 ? 'selected' : ''}`}>
            <input
              type="radio"
              value="900"
              checked={time === 900}
              onChange={handleTimeSelect}
            />
            15 minutes
          </label>
          <label className={`button-option ${time === 1800 ? 'selected' : ''}`}>
            <input
              type="radio"
              value="1800"
              checked={time === 1800}
              onChange={handleTimeSelect}
            />
            30 minutes
          </label>
        </div>
      )}
    </div>
  );
}

export default TimeMatchedToggle;
