// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes';
import { ThemeProvider } from '@context/ThemeContext';
import './index.css';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn(
      'VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will be disabled.\n' +
      'Please set VITE_GOOGLE_CLIENT_ID in your .env file and restart your Vite server.'
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
