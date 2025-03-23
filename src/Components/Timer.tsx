import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './css/Timer.css';

interface CountdownTimerProps {
  initialTime: number;
  onComplete: () => void;
}

export interface CountdownTimerHandle {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime: number) => void;
}

const CountdownTimer = forwardRef<CountdownTimerHandle, CountdownTimerProps>(({ initialTime, onComplete }, ref) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  useEffect(()=>{},[initialTime]);
  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current!);
      onComplete();
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive, time]);

  useImperativeHandle(ref, () => ({
    startTimer() {
      setIsActive(true);
    },
    pauseTimer() {
      setIsActive(false);
    },
    resetTimer(newTime: number) {
      setIsActive(false);
      setTime(newTime);
    }
  }));

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      {time > 0 && (
        <div className="timer-display">
          {formatTime(time)}
        </div>
      )}
    </div>
  );
});

export default CountdownTimer;
