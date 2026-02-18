import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, CheckCircle, RefreshCw, LogOut, Bike, Settings, User, MapPin, Phone } from 'lucide-react';
import styles from './KitchenPage.module.css';

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  orderDetails: string;
  status: string;
  deliveryTime?: string; 
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempTimes, setTempTimes] = useState<Record<number, string>>({});
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const prevOrdersCount = useRef(0);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const playNotificationSound = () => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Attenzione, nuovo ordine!");
      msg.lang = 'it-IT';
      window.speechSynthesis.speak(msg);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/kitchen`); 
      if (res.ok) {
        const data = await res.json();
        const activeOrders = data.filter((o: Order) => 
          ['INVIATO', 'IN_PREPARAZIONE', 'IN_CONSEGNA'].includes(o.status)
        );

        if (prevOrdersCount.current > 0 && activeOrders.length > prevOrdersCount.current) {
          playNotificationSound();
        }
        prevOrdersCount.current = activeOrders.length;
        setOrders(activeOrders);
      }
    } catch (err) {
      console.error("Errore fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrder = async (id: number, status: string, deliveryTime?: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, deliveryTime: deliveryTime || o.deliveryTime } : o));
    setRejectingId(null); 

    try {
      await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, deliveryTime })
      });
      fetchOrders();
    } catch (err) {
      alert("Errore aggiornamento. Controlla connessione.");
    }
  };

  // Helper per classi dinamiche
  const getCardClass = (status: string) => {
    if (status === 'IN_PREPARAZIONE') return styles.cardPrep;
    if (status === 'IN_CONSEGNA') return styles.cardDelivery;
    return styles.cardDefault;
  };

  const getBadgeClass = (status: string) => {
    if (status === 'IN_PREPARAZIONE') return styles.badgePrep;
    if (status === 'IN_CONSEGNA') return styles.badgeDelivery;
    return styles.badgeDefault;
  };

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.headerIcon}>
            <ChefHat size={28} />
          </div>
          <h1 className={styles.titleText}>CUCINA LIVE</h1>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => navigate('/admin/products')} className={styles.menuButton}>
            <Settings size={18} /> Menu
          </button>
          <button onClick={fetchOrders} className={styles.iconButton}><RefreshCw size={20} /></button>
          <button onClick={() => navigate('/login')} className={styles.logoutButton}><LogOut size={20} /></button>
        </div>
      </header>

      {/* GRIGLIA */}
      <div className={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.id} className={`${styles.card} ${getCardClass(order.status)}`}>
            
            {/* BADGE STATO */}
            <div className={`${styles.statusBadge} ${getBadgeClass(order.status)}`}>
              {order.status.replace('_', ' ')}
            </div>

            <div className="space-y-4">
              <div className={styles.timeRow}>
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-gray-400" />
                   <span className="text-2xl font-black">{order.deliveryTime}</span>
                </div>
                <span className={styles.orderId}>#{order.id}</span>
              </div>

              <div className={styles.detailsBox}>
                 <div className={styles.iconsRow}>
                    <User size={14} className="text-gray-400" />
                    <MapPin size={14} className="text-gray-400" />
                    <Phone size={14} className="text-gray-400" />
                 </div>
                 <div className={styles.detailsText}>
                    {order.orderDetails}
                 </div>
              </div>
            </div>

            {/* PULSANTI AZIONE */}
            <div className={styles.actionsFooter}>
              
              {/* CASO 1: NUOVO ORDINE */}
              {order.status === 'INVIATO' && (
                <>
                  {rejectingId === order.id ? (
                    <div className={styles.rejectConfirm}>
                      <p className={styles.rejectText}>SEI SICURO?</p>
                      <div className={styles.buttonGroup}>
                        <button onClick={() => setRejectingId(null)} className={styles.btnCancel}>NO</button>
                        <button onClick={() => handleUpdateOrder(order.id, 'RIFIUTATO')} className={styles.btnConfirmReject}>SÌ</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.buttonGroup}>
                      <button onClick={() => setRejectingId(order.id)} className={styles.btnReject}>
                        RIFIUTA
                      </button>
                      <button 
                        onClick={() => handleUpdateOrder(order.id, 'IN_PREPARAZIONE', tempTimes[order.id])}
                        className={styles.btnAccept}
                      >
                        <CheckCircle size={18} /> ACCETTA
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* CASO 2: IN PREPARAZIONE -> IN CONSEGNA */}
              {order.status === 'IN_PREPARAZIONE' && (
                <button 
                  onClick={() => handleUpdateOrder(order.id, 'IN_CONSEGNA')}
                  className={styles.btnDeliver}
                >
                  <Bike size={20} /> IN CONSEGNA
                </button>
              )}

              {/* CASO 3: IN CONSEGNA -> COMPLETATO */}
              {order.status === 'IN_CONSEGNA' && (
                <button 
                  onClick={() => handleUpdateOrder(order.id, 'COMPLETATO')}
                  className={styles.btnComplete}
                >
                  <CheckCircle size={18} /> CONSEGNATO
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}