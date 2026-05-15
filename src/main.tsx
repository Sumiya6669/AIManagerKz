import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/index.css';

const rootElement = document.getElementById('root');

document.body.dataset.reactBoot = 'true';
console.log('MAIN TSX LOADED');
console.log('ROOT:', document.getElementById('root'));

console.info('[Reserva Flow AI] main.tsx boot', {
  rootFound: Boolean(rootElement),
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
});

if (!rootElement) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;background:#f8fafc;color:#0f172a;padding:24px">
      <div style="max-width:520px;background:white;border:1px solid #e2e8f0;border-radius:18px;padding:28px;box-shadow:0 20px 60px rgba(15,23,42,.08)">
        <h1 style="font-size:22px;margin:0 0 12px;font-weight:800">React root not found</h1>
        <p style="margin:0;color:#64748b;line-height:1.6">index.html must contain <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  document.getElementById('static-fallback')?.remove();
}
