import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppRouter } from './routes/AppRouter'
import { NotificationProvider } from './shared/context/NotificationContext'
import { ThemeProvider } from './shared/context/ThemeContext'

const container = document.getElementById("root");
if (!container) throw new Error("No se encontró el elemento root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </NotificationProvider>
    </Provider>
  </React.StrictMode>
);
