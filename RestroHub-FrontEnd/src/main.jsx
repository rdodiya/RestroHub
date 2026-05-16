// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> 
  <App /> 
</GoogleOAuthProvider>

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} > 
      <App /> 
      </GoogleOAuthProvider> 
      </React.StrictMode> );