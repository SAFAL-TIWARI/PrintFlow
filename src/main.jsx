import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './index.css';

// Safety net: catch unhandled errors that occur outside React lifecycle
window.addEventListener('error', (event) => {
  console.error('[Global Window Error]:', event.error || event.message);
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="min-height: 100vh; background: #090d16; color: #f8fafc; padding: 40px; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #16181b; border: 1px solid #f43f5e; padding: 24px; border-radius: 12px;">
          <h2 style="color: #f43f5e; margin: 0 0 8px 0;">JavaScript Runtime Error</h2>
          <p style="color: #cbd5e1; font-size: 13px;">${event.message || 'An unexpected error occurred.'}</p>
          <button onclick="localStorage.clear(); sessionStorage.clear(); location.reload();" style="margin-top: 16px; background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Clear Cache &amp; Reload
          </button>
        </div>
      </div>
    `;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
