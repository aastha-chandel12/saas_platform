import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastCount = 0;
let observers: ((toasts: Toast[]) => void)[] = [];

export const toast = (message: string, type: ToastType = 'info') => {
  const id = ++toastCount;
  const newToast = { id, message, type };
  const currentToasts = [...globalToasts, newToast];
  updateToasts(currentToasts);
  
  setTimeout(() => {
    updateToasts(globalToasts.filter(t => t.id !== id));
  }, 5000);
};

let globalToasts: Toast[] = [];

const updateToasts = (toasts: Toast[]) => {
  globalToasts = toasts;
  observers.forEach(o => o(toasts));
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    const observer = (newToasts: Toast[]) => setToasts(newToasts);
    observers.push(observer);
    return () => {
      observers = observers.filter(o => o !== observer);
    };
  }, []);

  return { toasts };
};
