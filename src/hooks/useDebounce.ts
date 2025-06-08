import { useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SomeFunction = (...args: any[]) => void;

export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay = 300
) {
  const timer = useRef<Timer | null>(null);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      func(...args);
    }, delay);
  }) as Func;

  return debouncedFunction;
}
