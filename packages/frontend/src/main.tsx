import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CompactModeProvider } from './context/CompactModeContext.tsx';
import { IsMobileProvider } from './context/IsMobileContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CompactModeProvider>
          <IsMobileProvider>
            <App />
          </IsMobileProvider>
        </CompactModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
