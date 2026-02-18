import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AuthPage from './pages/AuthPage';
import OrdersPage from './pages/OrdersPage';
import Navbar from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import type { JSX } from 'react';
import KitchenPage from './pages/KitchenPage';
import ProfilePage from './pages/ProfilePage';

// Componente per proteggere le rotte Admin (Accesso solo con password segreta)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

// Componente Wrapper per gestire la logica della Navbar condizionale
function AppContent() {
  const location = useLocation();

  // Definiamo i percorsi dove la Navbar pubblica NON deve apparire
  const hideNavbarPaths = ['/admin', '/login'];
  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          
          {/* Visualizziamo la Navbar solo se non siamo in area Admin */}
          {!shouldHideNavbar && <Navbar />}
          
          <main className="flex-grow">
            <Routes>
              {/* ROTTE PUBBLICHE E CLIENTI */}
              <Route path="/" element={<MenuPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* ROTTE AMMINISTRAZIONE */}
                <Route path="/login" element={<LoginPage />} />

                {/* La rotta /admin ora apre la CUCINA di default */}
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <KitchenPage />
                    </PrivateRoute>
                  } 
                />

                {/* Nuova rotta specifica per la GESTIONE PRODOTTI */}
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
          </main>

          {/* Il Carrello è sempre disponibile, tranne che nelle pagine Admin se preferisci */}
          {!shouldHideNavbar && <CartSidebar />}

        </div>
      );
}

// Punto di ingresso principale con i Provider
function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;