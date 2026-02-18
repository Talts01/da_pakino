import { Link, useNavigate } from 'react-router-dom';
import { Pizza, LogOut, UserCircle, ClipboardList } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Recuperiamo i dati dell'utente dal localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';

  const handleLogout = () => {
    // Rimuoviamo i dati di sessione
    localStorage.removeItem('user');
    localStorage.removeItem('isAdminAuthenticated');
    
    // Torniamo alla home e ricarichiamo per resettare lo stato dell'app
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-[80] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO E NOME */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-rose-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-rose-100">
            <Pizza className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-black uppercase italic text-gray-900 tracking-tighter leading-none text-xl">
              Da Pakino
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Pizzeria & Grill</p>
          </div>
        </Link>

        {/* AZIONI DESTRA */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* SE LOGGATO: Mostra link Ordini, link Profilo e tasto Esci */}
          {user ? (
            <>
              {/* Link ai Miei Ordini */}
              <Link 
                to="/orders" 
                className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 group"
              >
                <ClipboardList size={18} className="text-gray-400 group-hover:text-rose-600" />
                <span className="text-xs font-black uppercase text-gray-900 hidden md:inline">
                  I miei ordini
                </span>
              </Link>

              {/* Link al Profilo/Account */}
              <Link 
                to="/profile" 
                className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 group"
              >
                <UserCircle size={20} className="text-gray-400 group-hover:text-rose-600" />
                <span className="text-xs font-black uppercase text-gray-900">
                  {user.firstName}
                </span>
              </Link>

              {/* Tasto Logout */}
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all group"
                title="Esci"
              >
                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            /* SE NON LOGGATO: Mostra solo Accedi (se non admin) */
            !isAdmin && (
              <Link 
                to="/auth" 
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-rose-600 transition-all shadow-md active:scale-95"
              >
                Accedi
              </Link>
            )
          )}

          {/* Fallback per Admin se necessario uscire senza essere "User" */}
          {isAdmin && !user && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2.5 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all font-black text-xs uppercase"
            >
              <LogOut size={18} />
              Esci Admin
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}