import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// التأكد من وجود عنصر root في الـ DOM
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure there is a <div id="root"></div> in your HTML.');
}

// إنشاء الـ root وتطبيق الـ rendering
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);