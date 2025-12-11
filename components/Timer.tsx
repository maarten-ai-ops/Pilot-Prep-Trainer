import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeExpire: () => void;
  isActive: boolean;
  onTick: (seconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeExpire, isActive, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = prev - 1;
        onTick(duration - newVal); // Track elapsed time
        if (newVal <= 0) {
           onTimeExpire();
           return newVal;
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, onTimeExpire, onTick]);

  const percentage = Math.min(100, Math.max(0, (timeLeft / duration) * 100));
  const isOvertime = timeLeft <= 0;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm font-medium mb-1 text-slate-600">
        <span>Resterende Tijd</span>
        <span className={isOvertime ? "text-red-600 font-bold" : "text-slate-700"}>
          {isOvertime ? "Tijd is op!" : `${timeLeft}s`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ${
            isOvertime ? 'bg-red-500 w-full' : 'bg-green-500'
          }`}
          style={{ width: isOvertime ? '100%' : `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};