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
import { AuthProvider } from './context/AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error('Missing VITE_GOOGLE_CLIENT_ID environment variable');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <CompactModeProvider>
                <IsMobileProvider>
                  <App />
                </IsMobileProvider>
              </CompactModeProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <div>
        <h1>Missing VITE_GOOGLE_CLIENT_ID environment variable</h1>
      </div>
    )}
  </StrictMode>
);
