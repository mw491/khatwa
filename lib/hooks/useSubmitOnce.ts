import { useState, useRef, useCallback } from 'react';

interface UseSubmitOnceOptions {
  debounceMs?: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface UseSubmitOnceReturn<T extends any[]> {
  isSubmitting: boolean;
  handleSubmit: (...args: T) => Promise<void>;
  reset: () => void;
}

export function useSubmitOnce<T extends any[]>(
  submitFunction: (...args: T) => Promise<void>,
  options: UseSubmitOnceOptions = {}
): UseSubmitOnceReturn<T> {
  const { debounceMs = 1000, onSuccess, onError } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmitTime = useRef(0);
  const submitPromise = useRef<Promise<void> | null>(null);

  const handleSubmit = useCallback(
    async (...args: T) => {
      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTime.current;

      // Prevent rapid successive calls
      if (isSubmitting || timeSinceLastSubmit < debounceMs) {
        return;
      }

      // If there's already a submission in progress, return the same promise
      if (submitPromise.current) {
        return submitPromise.current;
      }

      lastSubmitTime.current = now;
      setIsSubmitting(true);

      try {
        submitPromise.current = submitFunction(...args);
        await submitPromise.current;
        onSuccess?.();
      } catch (error) {
        onError?.(error);
        throw error;
      } finally {
        setIsSubmitting(false);
        submitPromise.current = null;
      }
    },
    [submitFunction, isSubmitting, debounceMs, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    lastSubmitTime.current = 0;
    submitPromise.current = null;
  }, []);

  return {
    isSubmitting,
    handleSubmit,
    reset,
  };
}
