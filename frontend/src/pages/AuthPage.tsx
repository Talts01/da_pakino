import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import PremiumButton from '../components/ui/PremiumButton';
import styles from './AuthPage.module.css';

const logoSrc = "/logo-pakino.webp";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // true = Accedi, false = Registrati
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Stati Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // Gestione Login/Registrazione Classica
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password }
      : { email, password, firstName, lastName }; // Aggiungiamo i nomi per la registrazione

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage')); // Aggiorna Navbar
        navigate('/'); // Vai alla Home
      } else {
        // Se il backend restituisce una stringa semplice o un oggetto errore
        setError(typeof data === 'string' ? data : (data.message || 'Errore durante l\'operazione'));
      }
    } catch (err) {
      setError("Impossibile connettersi al server.");
    } finally {
      setLoading(false);
    }
  };

  // Gestione Google Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } else {
        setError("Autenticazione Google fallita.");
      }
    } catch (err) {
      setError("Errore connessione server Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className={styles.card}
      >
        
        {/* HEADER */}
        <div className={styles.header}>
          <img src={logoSrc} alt="Logo" className={styles.logo} />
          <h2 className={styles.title}>Benvenuto!</h2>
          <p className={styles.subtitle}>Entra nel mondo del gusto autentico.</p>
        </div>

        {/* TOGGLE SWITCH (ACCEDI / REGISTRATI) */}
        <div className={styles.toggleContainer}>
          <motion.div 
            className={styles.toggleIndicator}
            initial={false}
            animate={{ 
              left: isLogin ? '4px' : '50%', 
              width: 'calc(50% - 4px)' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button onClick={() => { setIsLogin(true); setError(''); }} className={`${styles.toggleBtn} ${isLogin ? styles.toggleBtnActive : styles.toggleBtnInactive}`}>
            Accedi
          </button>
          <button onClick={() => { setIsLogin(false); setError(''); }} className={`${styles.toggleBtn} ${!isLogin ? styles.toggleBtnActive : styles.toggleBtnInactive}`}>
            Registrati
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.formBody}>
          
          <AnimatePresence mode='popLayout'>
            {/* CAMPI EXTRA PER REGISTRAZIONE */}
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4 overflow-hidden"
              >
                <div className={`${styles.inputGroup} group`}>
                  <User size={18} className={`${styles.inputIcon} group-focus-within:text-brand-gold`} />
                  <input 
                    type="text" placeholder="Nome" required={!isLogin}
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={`${styles.inputGroup} group`}>
                   {/* Icona nascosta o vuota per allineamento visivo se vuoi, o nessuna icona */}
                   <input 
                    type="text" placeholder="Cognome" required={!isLogin}
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    className={`${styles.input} pl-4`} // Meno padding left perché senza icona
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL */}
          <div className={`${styles.inputGroup} group`}>
            <Mail size={18} className={`${styles.inputIcon} group-focus-within:text-brand-gold`} />
            <input 
              type="email" placeholder="La tua email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* PASSWORD */}
          <div className={`${styles.inputGroup} group`}>
            <Lock size={18} className={`${styles.inputIcon} group-focus-within:text-brand-gold`} />
            <input 
              type="password" placeholder="La tua password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* ERRORE */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={styles.errorMsg}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <PremiumButton type="submit" disabled={loading} className="w-full py-4 text-sm shadow-xl shadow-brand-red/20">
            {loading ? <Loader2 className="animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isLogin ? 'ACCEDI ORA' : 'CREA ACCOUNT'} <ArrowRight size={16} />
              </span>
            )}
          </PremiumButton>

          {/* GOOGLE LOGIN */}
          <div className={styles.separator}>
            <div className={styles.separatorLine}><div className="w-full border-t border-white/10"></div></div>
            <span className={styles.separatorText}>Oppure continua con</span>
          </div>

          <div className={styles.googleBtnContainer}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Login Google fallito')}
              theme="filled_black"
              shape="circle" // O "pill" o "rectangular"
              text={isLogin ? "signin_with" : "signup_with"}
              width="300" // Larghezza fissa per centrarlo bene
            />
          </div>

        </form>

        <div className="pb-8 text-center">
           <button onClick={() => navigate('/')} className={styles.footerText}>
             Torna alla Home senza accedere
           </button>
        </div>

      </motion.div>
    </div>
  );
}