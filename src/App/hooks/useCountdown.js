

import { useCallback, useState, useEffect } from 'react';

function useCountdown(targetDate) {
  const [count, setCount] = useState(calculateTimeRemaining(targetDate));
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  const startCountdown = useCallback(() => {
    setIsCountdownRunning(true);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsCountdownRunning(false);
  }, []);

  const resetCountdown = useCallback(() => {
    stopCountdown();
    setCount(calculateTimeRemaining(targetDate));
  }, [stopCountdown, targetDate]);

  useEffect(() => {
    let intervalId = null;
    
    const updateTimeRemaining = () => {
      setCount(calculateTimeRemaining(targetDate));
    };

    if (isCountdownRunning) {
      intervalId = setInterval(updateTimeRemaining, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCountdownRunning, targetDate]);

  return [
    count.days,
    count.hours,
    count.minutes,
    count.seconds,
    {
      startCountdown,
      stopCountdown,
      resetCountdown,
    },
  ];
}

function calculateTimeRemaining(targetDate) {
  const timeDiff = targetDate - Date.now();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export default useCountdown;


