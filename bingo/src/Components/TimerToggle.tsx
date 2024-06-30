import React, { useState } from 'react';
import './TimerToggle.css';

const TimeMatchedToggle = () => {
  const [isTimeMatched, setIsTimeMatched] = useState(false);
  const [minutes, setMinutes] = useState('');

  const handleToggle = () => {
    setIsTimeMatched(!isTimeMatched);
    if (!isTimeMatched) setMinutes('');
  };

  const handleMinutesChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setMinutes(e.target.value);
  };

  return (
    <div>
      <label className="toggle">
        <input
          type="checkbox"
          checked={isTimeMatched}
          onChange={handleToggle}
        />
        <span className="slider"></span>
      </label>

      <label className="radio">
        <input
          type="radio"
          checked={isTimeMatched}
          onChange={handleToggle}
        />
        <span className="checkmark"></span>
        Time Matched
      </label>

      {isTimeMatched && (
        <div>
          <label>
            Set Timer (minutes):
            <input
              type="number"
              value={minutes}
              onChange={handleMinutesChange}
              min="1"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default TimeMatchedToggle;
