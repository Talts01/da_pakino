import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from './context/CartContext.tsx' // <--- IMPORTA QUESTO

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider> {/* <--- AGGIUNGI QUESTO WRAPPER */}
      <App />
    </CartProvider>
  </React.StrictMode>,
)