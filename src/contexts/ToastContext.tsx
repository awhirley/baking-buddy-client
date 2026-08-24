import { Alert, AlertAction, AlertDescription, AlertTitle } from '#components/SharedComponents/ui/alert';
import { Button } from '#components/SharedComponents/ui/button';
import { AlertCircleIcon, Croissant, XCircle } from 'lucide-react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ToastType ='default' | 'destructive';

interface Toast {
  id: number;
  header: string;
  message?: string | null;
  type: ToastType;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  addToast: (header: string, message: string | null, options?: ToastOptions) => number;
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
    (header: string, message: string | null = null, { type = 'default', duration = 4000 }: ToastOptions = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, header, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const getClassName = (type: ToastType): string => type === 'destructive' ? "max-w-md min-w-sm" : "max-w-md min-w-sm bg-green-900";

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[1000] flex flex-col gap-2">
          {toasts.map((toast) => (
            <Alert variant={toast.type} className={getClassName(toast.type)}>
              { toast.type === 'destructive' ? <AlertCircleIcon /> : <Croissant /> }
              <AlertTitle>{toast.header}</AlertTitle>
              {toast.message && <AlertDescription>
                {toast.message}
              </AlertDescription>}
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