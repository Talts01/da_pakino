import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout'; // Assicurati di avere il Layout creato nel passo precedente

// Pagine
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AuthPage from './pages/AuthPage';
import OrdersPage from './pages/OrdersPage';
import KitchenPage from './pages/KitchenPage';
import ProfilePage from './pages/ProfilePage';
import type { JSX } from 'react';

// Componente per proteggere le rotte Admin
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ROTTE PUBBLICHE CON LAYOUT (Navbar, Footer, ecc.) */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      
      {/* ROTTE AMMINISTRAZIONE (Senza Layout standard) */}
      <Route path="/login" element={<LoginPage />} />
      
      <Route 
        path="/admin" 
        element={
          <PrivateRoute>
            <KitchenPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/admin/products" 
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } 
      />
      
      {/* REDIRECT PER URL SBAGLIATI */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;