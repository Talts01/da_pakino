import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, Pizza } from 'lucide-react'; // Rimossi User e MapPin se non usati o riaggiunti se servono
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Vinovo',
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
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); 
      } else {
        const msg = await response.text();
        setError(msg || 'Errore durante l\'autenticazione');
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoBox}>
            <Pizza size={32} />
          </div>
          <h2 className={styles.title}>
            {isLogin ? 'Bentornato!' : 'Crea Account'}
          </h2>
          <p className={styles.subtitle}>
            {isLogin ? 'Accedi per ordinare più velocemente' : 'Registrati per salvare il tuo indirizzo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className={styles.inputGroup}>
                <input
                  type="text" placeholder="Nome" required
                  className={styles.input}
                  style={{ paddingLeft: '1rem' }} // Override padding per input senza icona
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text" placeholder="Cognome" required
                  className={styles.input}
                  style={{ paddingLeft: '1rem' }}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail size={16} className={styles.inputIcon} />
            <input
              type="email" placeholder="Email" required
              className={styles.input}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              type="password" placeholder="Password" required
              className={styles.input}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex gap-2">
                <select 
                  className={styles.select}
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
                  className={`${styles.input} flex-1`}
                  style={{ paddingLeft: '1rem' }}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <Phone size={16} className={styles.inputIcon} />
                <input
                  type="tel" placeholder="Cellulare" required
                  className={styles.input}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            <span>{isLogin ? 'ACCEDI' : 'REGISTRATI ORA'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className={styles.footer}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={styles.switchButton}
          >
            {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
          </button>
        </div>
      </div>
    </div>
  );
}