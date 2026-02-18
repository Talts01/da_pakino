import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumButton from '../components/ui/PremiumButton';
import styles from './LoginPage.module.css';

const logoSrc = "/logo-pakino.webp";

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuliamo un minimo di ritardo per l'effetto "elaborazione"
    setTimeout(() => {
      if (password === 'pizza123') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin'); // Reindirizza alla dashboard cucina o admin
      } else {
        setError(true);
        setIsLoading(false);
        setTimeout(() => setError(false), 2000); // Rimuovi errore dopo 2s
      }
    }, 800);
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={styles.card}
      >
        
        {/* Header con Logo */}
        <div className={styles.header}>
          <div className={styles.logoBox}>
            <img src={logoSrc} alt="Da Pakino" className={styles.logoImg} />
          </div>
          <h2 className={styles.title}>
            Area Riservata
          </h2>
          <p className={styles.subtitle}>Accesso Staff & Cucina</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className="space-y-1">
            <label className={styles.label}>
              Password di Sicurezza
            </label>
            <div className={`${styles.inputGroup} group`}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className={styles.errorMessage}
            >
              ⛔ Password non valida. Riprova.
            </motion.div>
          )}

          <PremiumButton 
            type="submit" 
            disabled={isLoading}
            className="w-full shadow-xl shadow-brand-gold/20 hover:shadow-brand-gold/40 mt-4"
          >
            {isLoading ? 'Verifica in corso...' : (
              <span className="flex items-center gap-2">
                <ShieldCheck size={20} /> ACCEDI AL PANNELLO
              </span>
            )}
          </PremiumButton>
        </form>

        <div className={styles.footer}>
          <button onClick={() => navigate('/')} className={styles.backLink}>
            <ArrowLeft size={14} /> Torna al sito pubblico
          </button>
        </div>
      </motion.div>
    </div>
  );
}