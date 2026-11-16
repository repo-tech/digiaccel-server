import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider } from './components/Toast';
import { TasksProvider } from './store/TasksProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <TasksProvider><App /></TasksProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
