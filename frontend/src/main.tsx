import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Qui ci sono gli stili di Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)