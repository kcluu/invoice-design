import { useCallback, useEffect, useRef, useState } from 'react';

// short confirmation messages, read out by the polite live region in the toast
export const useToast = (timeout = 4000) => {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback(
    (text: string) => {
      setMessage(text);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMessage(null), timeout);
    },
    [timeout]
  );

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setMessage(null);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { message, notify, dismiss };
};
