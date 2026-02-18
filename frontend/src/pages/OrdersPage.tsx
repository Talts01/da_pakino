import { useState, useEffect } from 'react';
import { Pizza, Clock, Package, Bike, CheckCircle2 } from 'lucide-react';
import type { Order } from '../types/Order';

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
    
    // Refresh automatico ogni 30 secondi per vedere i cambi di stato
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user?.id, API_URL]);

  // FILTRO: Ordini attivi OPPURE fatti oggi (fino a mezzanotte)
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gray-900 text-white p-8 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Stato Ordini</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Monitoriamo la tua pizza</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-6">
          {activeAndTodayOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
              <Pizza size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase text-xs italic">Nessun ordine attivo per oggi</p>
            </div>
          ) : (
            activeAndTodayOrders.map(order => (
              <div key={order.id} className="bg-white overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-lg">
                {/* Banner Stato */}
                <div className={`p-4 flex items-center justify-between ${
                  order.status === 'CONSEGNATO' || order.status === 'COMPLETATO' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-rose-50 text-rose-700'
                }`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span className="font-black text-xs uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-60 uppercase">
                    Consegna: {order.deliveryTime}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Ordine #{order.id}
                    </span>
                    <span className="font-black text-rose-600">€{order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-[11px] font-medium text-gray-600 whitespace-pre-wrap">
                    {order.orderDetails}
                  </div>
                  
                  {['INVIATO', 'IN_PREPARAZIONE'].includes(order.status) && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase italic">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                      Lo chef sta lavorando per te
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}