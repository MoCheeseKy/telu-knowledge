"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseCooldownReturn {
  remaining: number;
  isCooling: boolean;
  start: (seconds?: number) => void;
  reset: () => void;
}

/**
 * Hook untuk menghitung mundur cooldown tombol kirim ulang (misal: verifikasi email atau lupa password).
 * Default durasi: 60 detik. Timer dibersihkan secara aman saat komponen di-unmount.
 */
export function useCooldown(defaultSeconds = 60): UseCooldownReturn {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds = defaultSeconds) => {
      clearTimer();
      setRemaining(seconds);

      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [defaultSeconds, clearTimer]
  );

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(0);
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    remaining,
    isCooling: remaining > 0,
    start,
    reset,
  };
}
