import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, CheckCircle, RefreshCw, LogOut, Volume2, Bike, Settings, User, MapPin, Phone } from 'lucide-react';

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
  
  // Stati locali per gestire le modifiche agli orari prima di salvare
  const [tempTimes, setTempTimes] = useState<Record<number, string>>({});
  // Stato per gestire quale ordine si sta rifiutando (ID dell'ordine o null)
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
      // Recuperiamo anche quelli IN_CONSEGNA per poterli chiudere definitivamente
      const res = await fetch(`${API_URL}/api/orders/kitchen`); 
      // Nota: Assicurati che il backend restituisca anche IN_CONSEGNA se vuoi gestirli qui.
      // Se l'endpoint backend filtra solo INVIATO/IN_PREPARAZIONE, dovrai aggiungerlo alla lista nel Repository.
      
      if (res.ok) {
        const data = await res.json();
        // Filtro client-side per sicurezza se il backend ne manda troppi
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
    // Aggiornamento Ottimistico UI
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, deliveryTime: deliveryTime || o.deliveryTime } : o));
    setRejectingId(null); // Chiudi eventuale modal rifiuto

    try {
      await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          deliveryTime // Inviamo anche l'orario se presente
        })
      });
      fetchOrders();
    } catch (err) {
      alert("Errore aggiornamento. Controlla connessione.");
    }
  };

  const handleTimeChange = (id: number, newTime: string) => {
    setTempTimes(prev => ({ ...prev, [id]: newTime }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 p-2 rounded-xl text-white">
            <ChefHat size={28} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-widest">CUCINA LIVE</h1>
        </div>
        <div className="flex gap-2">
          {/* NUOVO TASTO: Va alla gestione prodotti */}
          <button 
            onClick={() => navigate('/admin/products')} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl font-bold text-xs uppercase transition-colors"
          >
            <Settings size={18} /> Menu
          </button>
          
          <button onClick={fetchOrders} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl"><RefreshCw size={20} /></button>
          <button onClick={() => navigate('/login')} className="p-3 bg-rose-600 hover:bg-rose-700 rounded-xl"><LogOut size={20} /></button>
        </div>
      </header>

      {/* GRIGLIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.map((order) => (
          <div key={order.id} className={`rounded-[2rem] p-5 border-2 flex flex-col justify-between h-full relative overflow-hidden transition-all ${
            order.status === 'IN_PREPARAZIONE' ? 'bg-amber-950/30 border-amber-500' :
            order.status === 'IN_CONSEGNA' ? 'bg-blue-950/30 border-blue-500' :
            'bg-gray-800 border-gray-600'
          }`}>
            
            {/* BADGE STATO */}
            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest ${
              order.status === 'IN_PREPARAZIONE' ? 'bg-amber-500 text-gray-900' :
              order.status === 'IN_CONSEGNA' ? 'bg-blue-500 text-white' :
              'bg-gray-600 text-gray-300'
            }`}>
              {order.status.replace('_', ' ')}
            </div>

            <div className="space-y-4">
              {/* ORARIO E ID */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-gray-400" />
                   {/* ... input time o span come prima ... */}
                   <span className="text-2xl font-black">{order.deliveryTime}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">#{order.id}</span>
              </div>

              {/* DETTAGLI CON ICONE (Parsiamo il testo per abbellirlo se necessario, o mostriamo icone statiche sopra) */}
              {/* Dato che orderDetails è una stringa grezza, non possiamo estrarre facilmente nome/via. 
                  Ma possiamo mettere delle icone decorative sopra il testo per ricordare al pizzaiolo di leggerlo. */}
              
              <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                 {/* Qui mettiamo le icone richieste visive generiche */}
                 <div className="flex gap-3 mb-2 border-b border-gray-700 pb-2">
                    <User size={14} className="text-gray-400" />
                    <MapPin size={14} className="text-gray-400" />
                    <Phone size={14} className="text-gray-400" />
                 </div>
                 <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                    {order.orderDetails}
                 </div>
              </div>
            </div>

            {/* PULSANTI AZIONE */}
            <div className="mt-5 pt-4 border-t border-gray-700/50 space-y-2">
              
              {/* CASO 1: NUOVO ORDINE */}
              {order.status === 'INVIATO' && (
                <>
                  {rejectingId === order.id ? (
                    <div className="bg-rose-900/50 p-3 rounded-xl border border-rose-500 animate-in fade-in zoom-in">
                      <p className="text-center text-rose-200 text-xs font-bold mb-2">SEI SICURO DI RIFIUTARE?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setRejectingId(null)} className="flex-1 bg-gray-700 py-2 rounded-lg text-xs font-bold">ANNULLA</button>
                        <button onClick={() => handleUpdateOrder(order.id, 'RIFIUTATO')} className="flex-1 bg-rose-600 py-2 rounded-lg text-xs font-bold">SÌ, RIFIUTA</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setRejectingId(order.id)}
                        className="bg-gray-700 hover:bg-rose-900 hover:text-rose-200 text-gray-400 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                      >
                        RIFIUTA
                      </button>
                      <button 
                        onClick={() => handleUpdateOrder(order.id, 'IN_PREPARAZIONE', tempTimes[order.id])}
                        className="flex-1 bg-green-500 hover:bg-green-400 text-white font-black py-3 rounded-xl uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
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
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-3 rounded-xl uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                  <Bike size={20} /> IN CONSEGNA
                </button>
              )}

              {/* CASO 3: IN CONSEGNA -> COMPLETATO */}
              {order.status === 'IN_CONSEGNA' && (
                <button 
                  onClick={() => handleUpdateOrder(order.id, 'COMPLETATO')}
                  className="w-full bg-gray-700 hover:bg-green-600 text-white font-black py-3 rounded-xl uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
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