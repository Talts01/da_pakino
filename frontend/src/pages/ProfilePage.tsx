import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { History, RefreshCw, UserCircle, Save, Settings2, ReceiptText, ChevronRight } from 'lucide-react';
import type { Order } from '../types/Order';
import type { Product } from '../types/Product';
// IMPORTIAMO IL FILE CSS APPENA CREATO
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [formData, setFormData] = useState({ 
    ...user,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  const { addToCart, setIsCartOpen } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetch(`${API_URL}/api/orders/user/${user?.id}`),
          fetch(`${API_URL}/api/products`)
        ]);
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (menuRes.ok) setMenuProducts(await menuRes.json());
      } catch (error) {
        console.error("Errore caricamento:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user?.id, API_URL]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event('storage'));
        alert("Profilo aggiornato con successo! ✨");
      } else {
        alert("Errore durante il salvataggio. Riprova.");
      }
    } catch (err) {
      alert("Errore di connessione al server.");
    } finally {
      setIsUpdating(false);
    }
  };

  const historyOrders = orders
    .filter(order => ['COMPLETATO', 'CONSEGNATO', 'RIFIUTATO'].includes(order.status))
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const handleReorder = (orderDetails: string) => {
    const lines = orderDetails.split('\n');
    let addedCount = 0;
    lines.forEach(line => {
      const match = line.match(/^\d+x\s+(.*?)(?:\s+\(Extra:|$)/);
      if (match) {
        const productName = match[1].trim();
        const product = menuProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (product && product.available) {
          addToCart(product);
          addedCount++;
        }
      }
    });
    if (addedCount > 0) setIsCartOpen(true);
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-400">Caricamento... 🍕</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatarBox}>
            <UserCircle size={60} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Profilo Personale</h1>
            <p className="text-rose-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Gestisci i tuoi dati e i tuoi gusti 🍕🔥</p>
          </div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        
        {/* MODIFICA ACCOUNT */}
        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><Settings2 size={20} /></div>
              <h2 className="text-sm font-black uppercase text-gray-900 tracking-widest">Dati Consegna ⚙️</h2>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div className="space-y-1">
                <label className={styles.inputLabel}>Nome sul Citofono / Cognome 🏷️</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={styles.inputLabel}>Indirizzo 🏠</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={styles.inputLabel}>Telefono 📞</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={isUpdating}
                className={styles.saveButton}
              >
                {isUpdating ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Salva Nuovi Dati
              </button>
            </form>
          </div>
        </div>

        {/* STORICO ORDINI */}
        <div className={styles.historyColumn}>
          <div className="flex items-center gap-2 mb-8 px-2">
            <History className="text-rose-600" size={24} />
            <h2 className="text-2xl font-black uppercase italic text-gray-900">Le tue serate Pizza 😋</h2>
          </div>

          <div className="space-y-10">
            {historyOrders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className="p-8">
                  <div className={styles.orderHeader}>
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-50 p-4 rounded-2xl text-rose-600">
                        <ReceiptText size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Scontrino Digitale #{order.id}
                        </span>
                        <div className="text-sm font-black text-gray-900">{new Date(order.orderDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-600 italic">€{order.totalAmount.toFixed(2)}</div>
                      <span className={styles.statusBadge}>Successo ✨</span>
                    </div>
                  </div>
                  
                  {/* SCONTRINO */}
                  <div className={styles.receiptContainer}>
                    <div className={styles.receiptTag}>
                      Tagliando Consegna
                    </div>
                    <div className="space-y-4">
                      {order.orderDetails.split('\n').map((line, idx) => {
                        if (line.includes('---') || 
                            line.includes('Cliente:') || 
                            line.includes('Indirizzo:') || 
                            line.includes('Tel:') || 
                            line.includes('Orario Richiesto:')) return null;
                        
                        if (line.trim() === '') return null;
                        
                        const isTotal = line.includes('TOTALE:');
                        return (
                          <div key={idx} className={`${styles.receiptRow} ${isTotal ? 'pt-4 border-t-2 border-gray-200 mt-2' : ''}`}>
                            <span className={`${isTotal ? 'font-black text-gray-900 text-sm' : 'font-bold text-gray-600 text-xs'} uppercase flex items-center gap-3`}>
                              {!isTotal && <ChevronRight size={12} className="text-rose-400" />}
                              {line.split('€')[0].replace(/^\d+x\s+/, (m) => `${m.trim()} x `)}
                            </span>
                            {line.includes('€') && (
                              <span className={`${isTotal ? 'text-lg text-rose-600' : 'text-gray-900'} font-black italic`}>€{line.split('€')[1]}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReorder(order.orderDetails)}
                    className={styles.reorderButton}
                  >
                    <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                    Ordina di nuovo 
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}