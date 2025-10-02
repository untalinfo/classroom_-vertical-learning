
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Load global course styles (via JS to avoid TS declaration issues)
// styles were reverted; no global CSS loader is imported

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
