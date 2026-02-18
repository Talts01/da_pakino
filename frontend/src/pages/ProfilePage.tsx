import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { History, User, Save, MapPin, Phone, Receipt, RefreshCw, ChevronRight, Package, Calendar } from 'lucide-react';
import type { Order } from '../types/Order';
import type { Product } from '../types/Product';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumButton from '../components/ui/PremiumButton';

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [formData, setFormData] = useState({ 
    ...user,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '', // Usato come "Nome sul Citofono"
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
        alert("Dati aggiornati con successo!");
      } else {
        alert("Errore salvataggio.");
      }
    } catch (err) {
      alert("Errore connessione.");
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-dark">
      <RefreshCw className="animate-spin" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-24 font-sans pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER PROFILO */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center text-brand-cream shadow-xl shadow-brand-red/30">
              <User size={40} strokeWidth={2.5} />
            </div>
            <div className="absolute bottom-0 right-0 bg-brand-gold border-4 border-brand-cream w-8 h-8 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-brand-dark rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-black text-brand-dark mb-1">
            Ciao, {user?.firstName || 'Ospite'}!
          </h1>
          <p className="text-brand-dark/50 font-medium">Gestisci il tuo account e i tuoi ordini</p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-brand-dark/5 mb-8 max-w-md mx-auto relative">
          {/* Sfondo animato del tab attivo */}
          <motion.div 
            className="absolute top-1 bottom-1 bg-brand-dark rounded-xl z-0"
            initial={false}
            animate={{ 
              left: activeTab === 'profile' ? '4px' : '50%', 
              width: 'calc(50% - 4px)' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider relative z-10 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-brand-dark/60 hover:text-brand-dark'}`}
          >
            I Miei Dati
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider relative z-10 transition-colors ${activeTab === 'orders' ? 'text-white' : 'text-brand-dark/60 hover:text-brand-dark'}`}
          >
            Storico Ordini
          </button>
        </div>

        {/* CONTENUTO TAB */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-brand-dark/5 border border-brand-dark/5 max-w-2xl mx-auto"
            >
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Nome" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} icon={<User size={18}/>} />
                  <InputGroup label="Nome sul Citofono" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} icon={<User size={18}/>} />
                </div>
                
                <InputGroup label="Indirizzo di Consegna" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} icon={<MapPin size={18}/>} />
                <InputGroup label="Telefono" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={<Phone size={18}/>} />

                <div className="pt-4">
                  <PremiumButton type="submit" disabled={isUpdating} className="w-full">
                    {isUpdating ? <RefreshCw className="animate-spin" /> : <Save size={18} />}
                    {isUpdating ? 'Salvataggio...' : 'Salva Modifiche'}
                  </PremiumButton>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              {historyOrders.length === 0 ? (
                <div className="text-center py-12 opacity-50">
                  <Package size={64} className="mx-auto mb-4 text-brand-dark/30" />
                  <p className="font-heading font-bold text-xl">Nessun ordine passato</p>
                </div>
              ) : (
                historyOrders.map((order, i) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-brand-dark/5 hover:shadow-lg transition-shadow group"
                  >
                    {/* Header Ordine */}
                    <div className="bg-brand-dark/5 p-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl text-brand-dark shadow-sm">
                          <Receipt size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/50">Ordine #{order.id}</p>
                          <p className="font-heading font-bold text-brand-dark flex items-center gap-2">
                            <Calendar size={14} className="text-brand-red" />
                            {new Date(order.orderDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-heading font-black text-brand-red">€{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Dettagli "Scontrino" */}
                    <div className="p-6 relative">
                      <div className="space-y-3 mb-6">
                        {order.orderDetails.split('\n').map((line, idx) => {
                          if (line.includes('---') || line.includes('Cliente:') || line.includes('Indirizzo:') || line.includes('Tel:') || line.includes('Orario')) return null;
                          if (!line.trim()) return null;
                          
                          const isTotal = line.includes('TOTALE:');
                          return (
                            <div key={idx} className={`flex justify-between items-center text-sm ${isTotal ? 'pt-3 border-t border-dashed border-brand-dark/20 font-bold mt-2' : 'text-brand-dark/70'}`}>
                              <span className="flex items-center gap-2">
                                {!isTotal && <ChevronRight size={12} className="text-brand-red" />}
                                {line.split('€')[0]}
                              </span>
                              {line.includes('€') && <span>€{line.split('€')[1]}</span>}
                            </div>
                          );
                        })}
                      </div>

                      <PremiumButton 
                        variant="secondary" 
                        onClick={() => handleReorder(order.orderDetails)}
                        className="w-full text-xs py-3"
                      >
                        <RefreshCw size={14} /> Ordina di nuovo
                      </PremiumButton>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// Helper per input puliti
function InputGroup({ label, value, onChange, icon }: { label: string, value: string, onChange: (e: any) => void, icon: any }) {
  return (
    <div className="relative group">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-1 ml-1 group-focus-within:text-brand-red transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within:text-brand-red transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          value={value} 
          onChange={onChange}
          className="w-full pl-12 pr-4 py-4 bg-brand-cream/50 border-2 border-transparent rounded-2xl font-bold text-brand-dark outline-none focus:bg-white focus:border-brand-red/20 transition-all shadow-inner focus:shadow-lg"
        />
      </div>
    </div>
  );
}