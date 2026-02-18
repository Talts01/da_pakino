import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Package, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const logoSrc = "/logo-pakino.webp";

export default function Navbar() {
  const { cartCount, setIsCartOpen, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/kitchen');

  if (isAdmin) return null;

  const handleLogout = () => {
    // 1. Pulizia Utente
    localStorage.removeItem('user');
    localStorage.removeItem('isAdminAuthenticated');
    
    // 2. Pulizia Carrello (Doppia Sicurezza)
    clearCart(); // Pulisce lo stato del context
    localStorage.removeItem('cart'); // Pulisce forzatamente la memoria del browser
    
    // 3. Evento e Redirect
    window.dispatchEvent(new Event('storage'));
    navigate('/auth');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 bg-brand-cream/90 backdrop-blur-md z-50 py-3 px-4 md:px-6 border-b border-brand-dark/5 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <motion.img 
            whileHover={{ rotate: -5, scale: 1.1 }}
            src={logoSrc} 
            alt="Da Pakino Logo" 
            className="h-10 md:h-14 w-auto object-contain drop-shadow-sm"
          />
          <div className="hidden md:block leading-tight">
            <h1 className="font-heading font-black text-brand-dark text-lg uppercase tracking-tight">Da Pakino</h1>
            <p className="text-[10px] text-brand-dark/60 font-bold uppercase tracking-widest">Pizzeria & Grill</p>
          </div>
        </Link>

        {/* LINK CENTRALI */}
        <div className="hidden md:flex items-center gap-8 font-heading font-bold text-brand-dark/70 uppercase tracking-wider text-xs lg:text-sm">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          {user && <NavLink to="/orders">I Miei Ordini</NavLink>}
        </div>

        {/* AZIONI DESTRA */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {user ? (
            <>

              <Link to="/profile" className="p-2 md:p-3 bg-white rounded-full text-brand-dark shadow-sm hover:text-brand-red transition-colors" title="Profilo">
                <User size={20} />
              </Link>

              <button 
                onClick={handleLogout}
                className="p-2 md:p-3 bg-white rounded-full text-brand-dark/60 shadow-sm hover:bg-brand-red hover:text-white transition-colors"
                title="Esci"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-dark hover:text-brand-red transition-colors mr-2">
              <LogIn size={16} /> <span className="hidden md:inline">Accedi</span>
            </Link>
          )}
          
          <motion.button 
            onClick={() => setIsCartOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="relative p-3 md:p-4 bg-brand-red text-white rounded-full shadow-lg shadow-brand-red/30 hover:bg-brand-redDark transition-colors"
          >
            <motion.div whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}>
              <ShoppingBag size={22} />
            </motion.div>

            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key={cartCount} 
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark text-[10px] font-black h-5 w-5 md:h-6 md:w-6 flex items-center justify-center rounded-full border-2 border-brand-cream"
                >
                  {cartCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="relative group py-2">
      <span className={`transition-colors ${isActive ? 'text-brand-red' : 'group-hover:text-brand-red'}`}>
        {children}
      </span>
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red"
        />
      )}
    </Link>
  )
}