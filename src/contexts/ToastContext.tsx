import { Alert, AlertAction, AlertDescription, AlertTitle } from '#components/ui/alert';
import { Button } from '#components/ui/button';
import { AlertCircleIcon, Croissant } from 'lucide-react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ToastType ='default' | 'destructive';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  addToast: (message: string, options?: ToastOptions) => number;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, { type = 'default', duration = 4000 }: ToastOptions = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const getClassName = (type: ToastType): string => type === 'destructive' ? "max-w-md" : "max-w-md bg-green-100";

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[1000] flex flex-col gap-2">
          {toasts.map((toast) => (
            <Alert variant={toast.type} className={getClassName(toast.type)}>
              { toast.type === 'destructive' ? <AlertCircleIcon /> : <Croissant /> }
              <AlertTitle>{toast.message}</AlertTitle>
              <AlertDescription>
                Here's an alert description!
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="secondary" onClick={() => removeToast(toast.id)}>
                  Dismiss
                </Button>
              </AlertAction>
            </Alert>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}