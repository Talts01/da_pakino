import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Pizza } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inserisci qui la tua password sicura
    if (password === 'pizza123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header con Icona */}
        <div className="bg-rose-600 p-10 text-center">
          <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg">
            <Pizza size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Accesso Admin
          </h2>
          <p className="text-rose-100 text-sm mt-1">Gestione Menu Da Pakino</p>
        </div>

        {/* Form di Login */}
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Password Segreta
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 outline-none transition-all ${
                  error ? 'border-rose-500 animate-shake' : 'border-transparent focus:border-rose-600'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-rose-600 text-[10px] font-bold uppercase text-center mt-2">
                Password Errata! Riprova 🍕
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-rose-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            ENTRA NEL PANNELLO
          </button>
        </form>

        <div className="p-6 bg-gray-50 text-center border-t">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
          >
            TORNA AL SITO PUBBLICO
          </button>
        </div>
      </div>
    </div>
  );
}