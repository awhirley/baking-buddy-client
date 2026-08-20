import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastProvider } from './contexts/ToastContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default App
