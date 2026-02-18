import { useState, useEffect } from 'react';
import { Pizza, Clock, Package, Bike, CheckCircle2 } from 'lucide-react';
import type { Order } from '../types/Order';
import styles from './OrdersPage.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/user/${user?.id}`);
        if (response.ok) {
          const data: Order[] = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Errore recupero ordini:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
    
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user?.id, API_URL]);

  const activeAndTodayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    
    const isToday = orderDate.getDate() === today.getDate() &&
                    orderDate.getMonth() === today.getMonth() &&
                    orderDate.getFullYear() === today.getFullYear();

    const isActive = ['INVIATO', 'IN_PREPARAZIONE', 'IN_CONSEGNA'].includes(order.status);

    return isActive || isToday;
  }).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'INVIATO': return <Clock className="text-amber-500 animate-pulse" />;
      case 'IN_PREPARAZIONE': return <Package className="text-orange-500 animate-bounce" />;
      case 'IN_CONSEGNA': return <Bike className="text-blue-500 animate-bounce" />;
      default: return <CheckCircle2 className="text-green-500" />;
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase italic text-gray-400">Controllo in cucina...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Stato Ordini</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Monitoriamo la tua pizza</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className="space-y-6">
          {activeAndTodayOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <Pizza size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase text-xs italic">Nessun ordine attivo per oggi</p>
            </div>
          ) : (
            activeAndTodayOrders.map(order => {
              const isComplete = order.status === 'CONSEGNATO' || order.status === 'COMPLETATO';
              return (
                <div key={order.id} className={styles.orderCard}>
                  {/* Banner Stato */}
                  <div className={`${styles.statusBanner} ${isComplete ? styles.statusSuccess : styles.statusActive}`}>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <span className="font-black text-xs uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60 uppercase">
                      Consegna: {order.deliveryTime}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Ordine #{order.id}
                      </span>
                      <span className="font-black text-rose-600">€{order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className={styles.orderDetails}>
                      {order.orderDetails}
                    </div>
                    
                    {['INVIATO', 'IN_PREPARAZIONE'].includes(order.status) && (
                      <div className={styles.kitchenAlert}>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                        Lo chef sta lavorando per te
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}