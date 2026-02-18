import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Phone, ArrowRight, Pizza } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Stati per i campi del form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Vinovo', // Default
    phone: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        // Salviamo i dati dell'utente per l'autocompilazione
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); // Torna al menu
      } else {
        const msg = await response.text();
        setError(msg || 'Errore durante l\'autenticazione');
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 transition-all">
        
        {/* Intestazione Dinamica */}
        <div className="bg-rose-600 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Pizza size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            {isLogin ? 'Bentornato!' : 'Crea Account'}
          </h2>
          <p className="text-rose-100 text-xs mt-1 font-bold uppercase tracking-widest">
            {isLogin ? 'Accedi per ordinare più velocemente' : 'Registrati per salvare il tuo indirizzo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-[10px] font-bold p-3 rounded-xl border border-rose-100 text-center uppercase">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text" placeholder="Nome" required
                  className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="relative">
                <input
                  type="text" placeholder="Cognome" required
                  className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email" placeholder="Email" required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password" placeholder="Password" required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex gap-2">
                <select 
                  className="w-1/3 p-3 rounded-xl bg-gray-50 border border-transparent text-xs font-bold outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="Vinovo">Vinovo</option>
                  <option value="Candiolo">Candiolo</option>
                  <option value="La Loggia">La Loggia</option>
                  <option value="Piobesi">Piobesi</option>
                  <option value="Altro">Altro</option>
                </select>
                <input
                  type="text" placeholder="Via e civico" required
                  className="flex-1 p-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel" placeholder="Cellulare" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-rose-500 outline-none text-sm"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-rose-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>{isLogin ? 'ACCEDI' : 'REGISTRATI ORA'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 text-xs font-bold hover:text-rose-600 transition-colors uppercase tracking-widest"
          >
            {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
          </button>
        </div>
      </div>
    </div>
  );
}