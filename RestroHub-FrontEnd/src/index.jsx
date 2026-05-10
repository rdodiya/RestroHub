import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ============================================
// APPLICATION ENTRY POINT
// ============================================

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
