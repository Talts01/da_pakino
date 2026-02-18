import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { CartSidebar } from './CartSidebar';
// Importa AnimatePresence per gestire le animazioni quando si cambia pagina
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-cream overflow-hidden relative">
      <Navbar />
      <CartSidebar />
      
      {/* AnimatePresence gestisce l'uscita del vecchio componente e l'entrata del nuovo */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname} // La chiave serve a far capire a React che la pagina è cambiata
          initial={{ opacity: 0, y: 20 }} // Parte invisibile e leggermente più in basso
          animate={{ opacity: 1, y: 0 }}  // Arriva alla posizione finale
          exit={{ opacity: 0, y: -20 }}   // Esce verso l'alto svanendo
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Curva di bezier per un movimento elegante
          className="pt-24" // Spazio per la navbar fissa
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Footer Semplice */}
      <footer className="bg-brand-dark text-brand-cream/60 py-8 text-center text-sm font-heading">
        <p>© {new Date().getFullYear()} Pizzeria Da Pakino. L'arte della pizza.</p>
      </footer>
    </div>
  );
}