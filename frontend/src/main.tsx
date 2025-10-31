import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import App from './App';
import './styles/global.css';

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
