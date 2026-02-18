import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, MapPin, Phone, User as UserIcon, Plus, Minus, Send, Clock, Loader2, UtensilsCrossed, Bike, Receipt } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import PremiumButton from './ui/PremiumButton';

const DELIVERY_COSTS: Record<string, number> = {
  'Vinovo': 2.0,
  'Candiolo': 3.0,
  'La Loggia': 3.0,
  'Piobesi': 3.0,
  'Altro Comune': 3.5
};

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState('Vinovo');
  const [phone, setPhone] = useState('');
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCustomerName(user.lastName || ''); 
        setAddress(user.address || '');
        setPhone(user.phone || '');
      }
    };

    if (isCartOpen) {
      loadUserData();
      fetchSlots();
    }

    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, [isCartOpen]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/slots`);
      if (res.ok) {
        const slots = await res.json();
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Errore slot:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const deliveryFee = DELIVERY_COSTS[selectedCity] || 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = async () => {
    if (!customerName || !address || !phone || !selectedTime) {
      alert("⚠️ Compila tutti i dati per la consegna!");
      return;
    }

    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      setIsCartOpen(false);
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    let orderDetailsText = `Cliente: ${customerName}\nIndirizzo: ${address} (${selectedCity})\nTel: ${phone}\nOrario: ${selectedTime}\n---\n`;
    cart.forEach((item) => {
      const extras = item.selectedExtras?.length ? ` (+${item.selectedExtras.map((e: any) => e.name).join(',')})` : '';
      orderDetailsText += `${item.quantity}x ${item.name}${extras}\n`;
    });
    orderDetailsText += `---\nConsegna: €${deliveryFee.toFixed(2)}\nTOTALE: €${grandTotal.toFixed(2)}`;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: user.id },
          orderDate: new Date().toISOString().slice(0, 19), 
          deliveryTime: selectedTime,
          totalAmount: grandTotal,
          orderDetails: orderDetailsText,
          status: 'INVIATO'
        })
      });

      if (response.ok) {
        clearCart();
        setIsCartOpen(false);
        navigate('/orders');
      }
    } catch (err) {
      alert("Errore invio ordine");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Varianti per l'animazione della sidebar
  const sidebarVariants: Variants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* BACKDROP SFOCATO */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]"
          />

          {/* SIDEBAR */}
          <motion.div 
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col font-sans"
          >
            {/* HEADER */}
            <div className="bg-brand-red text-white p-6 shadow-md flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-10" /> 
              <div className="flex items-center gap-3 relative z-10">
                <ShoppingBag className="text-brand-gold" />
                <h2 className="text-2xl font-heading font-black italic tracking-wide">Il Tuo Ordine</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors relative z-10"
              >
                <X />
              </button>
            </div>

            {/* LISTA PRODOTTI */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-cream/30">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-dark/30 space-y-4">
                  <UtensilsCrossed size={64} />
                  <p className="font-heading text-xl font-bold">Il carrello è vuoto</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-brand-red underline font-bold text-sm">Torna al menu</button>
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-brand-dark/5 flex gap-4"
                    >
                      <div className="flex flex-col items-center justify-between bg-brand-cream rounded-xl p-1 h-full">
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-brand-red transition-colors"><Plus size={14} /></button>
                        <span className="font-bold text-sm text-brand-dark">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-brand-red transition-colors"><Minus size={14} /></button>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-heading font-bold text-brand-dark text-lg leading-tight">{item.name}</h4>
                          <span className="font-bold text-brand-red">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.selectedExtras?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.selectedExtras.map((ex: any, i: number) => (
                              <span key={i} className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">+ {ex.name}</span>
                            ))}
                          </div>
                        )}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-brand-dark/40 hover:text-brand-red flex items-center gap-1 transition-colors mt-2"
                        >
                          <Trash2 size={12} /> Rimuovi
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* FORM DATI & TOTALE */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-brand-dark/5 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                
                {/* Dati Consegna Compact */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative col-span-2">
                    <UserIcon size={16} className="absolute left-3 top-3.5 text-brand-dark/30" />
                    <input 
                      type="text" placeholder="Nome sul citofono" value={customerName} onChange={e => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream border-none focus:ring-2 focus:ring-brand-red/20 outline-none text-sm font-bold text-brand-dark placeholder:font-normal"
                    />
                  </div>
                  
                  <div className="relative col-span-2 flex gap-2">
                     <select 
                        value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                        className="w-1/3 p-3 rounded-xl bg-brand-cream border-none font-bold text-xs outline-none cursor-pointer"
                      >
                        {Object.keys(DELIVERY_COSTS).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="relative flex-1">
                        <MapPin size={16} className="absolute left-3 top-3.5 text-brand-dark/30" />
                        <input 
                          type="text" placeholder="Via e Civico" value={address} onChange={e => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream border-none focus:ring-2 focus:ring-brand-red/20 outline-none text-sm font-bold placeholder:font-normal"
                        />
                      </div>
                  </div>

                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-brand-dark/30" />
                    <input 
                      type="tel" placeholder="Telefono" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream border-none focus:ring-2 focus:ring-brand-red/20 outline-none text-sm font-bold placeholder:font-normal"
                    />
                  </div>

                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3.5 text-brand-dark/30" />
                    <select 
                      value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
                      disabled={loadingSlots}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream border-none focus:ring-2 focus:ring-brand-red/20 outline-none text-sm font-bold text-brand-dark appearance-none"
                    >
                      <option value="">Orario...</option>
                      {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* --- NUOVA SEZIONE: RIEPILOGO COSTI --- */}
                <div className="mt-6 mb-4 space-y-2 border-t border-brand-dark/5 pt-4">
                   <div className="flex justify-between items-center text-sm font-bold text-brand-dark/50">
                      <span className="flex items-center gap-2"><Receipt size={14}/> Subtotale Prodotti</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                   </div>
                   
                   <div className="flex justify-between items-center text-sm font-bold text-brand-dark">
                      <span className="flex items-center gap-2 text-brand-dark">
                        <Bike size={14} className="text-brand-red" /> 
                        Consegna a {selectedCity}
                      </span>
                      <span className="text-brand-red">+ €{deliveryFee.toFixed(2)}</span>
                   </div>
                </div>

                {/* Totale Finale e Bottone */}
                <div className="flex justify-between items-end mb-4 pt-2 border-t border-brand-dark/10 border-dashed">
                  <div className="text-sm text-brand-dark/50 font-bold uppercase tracking-widest">Totale Ordine</div>
                  <div className="text-3xl font-heading font-black text-brand-red">€{grandTotal.toFixed(2)}</div>
                </div>

                <PremiumButton 
                  onClick={handleCheckout} 
                  disabled={isSubmitting}
                  className="w-full py-5 text-lg shadow-xl shadow-brand-red/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> INVIA ORDINE</>}
                </PremiumButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}