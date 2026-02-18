import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, MapPin, Phone, User as UserIcon, Plus, Minus, Send, Clock, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

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
        // Usiamo il lastName per il campo "Nome sul Citofono"
        setCustomerName(user.lastName || ''); 
        setAddress(user.address || '');
        setPhone(user.phone || '');
        // Se hai altri campi come la città, caricali qui
      }
    };

    // Carica i dati quando il carrello si apre
    if (isCartOpen) {
      loadUserData();
      fetchSlots();
    }

    // Ascolta se i dati cambiano mentre il carrello è aperto (es. in un'altra scheda o via evento custom)
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
      console.error("Errore caricamento slot:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const deliveryFee = DELIVERY_COSTS[selectedCity] || 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = async () => {
    if (!customerName || !address || !phone || !selectedTime) {
      alert("⚠️ Compila tutti i dati, incluso l'orario di consegna!");
      return;
    }

    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      alert("Devi effettuare l'accesso per ordinare!");
      setIsCartOpen(false);
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    let orderDetailsText = `Cliente: ${customerName}\n`;
    orderDetailsText += `Indirizzo: ${address} (${selectedCity})\n`;
    orderDetailsText += `Tel: ${phone}\n`;
    orderDetailsText += `Orario Richiesto: ${selectedTime}\n`;
    orderDetailsText += `----------------------------\n`;

    cart.forEach((item) => {
      const extrasText = item.selectedExtras && item.selectedExtras.length > 0
        ? ` (Extra: ${item.selectedExtras.map((e: any) => e.name).join(', ')})`
        : '';
      orderDetailsText += `${item.quantity}x ${item.name}${extrasText}\n`;
    });
    
    orderDetailsText += `----------------------------\n`;
    orderDetailsText += `Consegna: €${deliveryFee.toFixed(2)}\n`;
    orderDetailsText += `TOTALE: €${grandTotal.toFixed(2)}`;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: { id: user.id },
              // MODIFICA QUI: Tagliamo via i millisecondi e la 'Z' finale per evitare errori di parsing
              orderDate: new Date().toISOString().slice(0, 19), 
              deliveryTime: selectedTime,
              totalAmount: grandTotal,
              orderDetails: orderDetailsText,
              status: 'INVIATO'
            })
          });

      if (response.ok) {
        alert("✅ Ordine inviato con successo! Lo vedrai nella sezione 'I miei ordini'.");
        clearCart();
        setIsCartOpen(false);
        navigate('/orders');
      } else {
        alert("Errore nell'invio dell'ordine. Riprova.");
      }
    } catch (err) {
      console.error("Errore DB:", err);
      alert("Errore di connessione al server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. PULSANTE FLUTTUANTE (Visibile solo se carrello chiuso) */}
      {!isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-rose-600 hover:bg-gray-900 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        >
          <ShoppingBag size={28} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-rose-900 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* 2. SIDEBAR (Visibile solo se carrello aperto) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 bg-rose-600 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <ShoppingBag size={24} />
                <h2 className="text-xl font-black uppercase italic tracking-tight">Il tuo Ordine</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest opacity-30">
                  <ShoppingBag size={64} className="mx-auto mb-4" />
                  <p>Il carrello è vuoto</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-tight">{item.name}</h3>
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.selectedExtras.map((extra: any, i: number) => (
                              <span key={i} className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-black">
                                + {extra.name.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-black text-rose-600 text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-md text-rose-600">
                          {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                        </button>
                        <span className="font-black w-6 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md text-green-600">
                          <Plus size={16} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-rose-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t space-y-3 shadow-inner">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1 mb-1">
                  <MapPin size={12} /> Riepilogo Consegna
                </h3>
                
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="text" placeholder="Nome sul citofono" value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" 
                  />
                </div>

                <div className="flex gap-2">
                  <select 
                    value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-1/3 p-3 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 outline-none text-xs font-bold"
                  >
                    {Object.keys(DELIVERY_COSTS).map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  <div className="relative flex-1">
                    <MapPin size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="text" placeholder="Via e civico" value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" 
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <Phone size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="text" placeholder="Telefono" value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" 
                    />
                  </div>
                  
                  <div className="relative w-1/2">
                    <Clock size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm appearance-none font-bold text-gray-700"
                      disabled={loadingSlots}
                    >
                      <option value="">Orario...</option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div className="p-8 border-t bg-gray-50 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Pizze</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Consegna</span>
                    <span>€{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-black text-gray-900 pt-3 border-t border-gray-200">
                    <span className="italic">TOTALE</span>
                    <span className="text-rose-600">€{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={!selectedTime || isSubmitting}
                  className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group ${
                    !selectedTime || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} /> Invio in corso...</>
                  ) : (
                    <><Send size={20} className={selectedTime ? "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" : ""} /> <span className="text-lg uppercase">Invia Ordine</span></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}